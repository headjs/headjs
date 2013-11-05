function xhr(path, async, callback) {
    async = async || true;
    var xhr;
    try {
        xhr = new window.ActiveXObject("Microsoft.XMLHTTP");
    } catch (e) {
        xhr = new window.XMLHttpRequest();
    }

    xhr.open("GET", path, async);
    xhr.onreadystatechange = function () {
        if (xhr.readyState == 4) {
            alert(xhr.responseText);
        }
    };
    xhr.send(null);
}

function GetFeatures() {
    $.getJSON("/src/features/inventory.json", function (data) {
        $(data).each(function (index, item) {
            var html = "";

            html += "<li><label title='" + item.description + "'>";
            html += "<input type='checkbox' id='" + item.id + "' name='" + item.id + "' data-package='" + item.package + "' /> " + item.title;
            if (item.url) {
                html += " <small style='float:right'>(<a href='" + item.url + "' target='_blank'><em>more info</em></a>)</small>";
            }
            html += "</label></li>";

            $("#" + item.category).append(html);
        });
    });
}

function generate() {
    var result = [];
    document.getElementById("out").value = "";
    $("[data-package]:checked").each(function () {
        $.ajax({
            type: "GET",
            url: "/src/" + $(this).data("package"),
            dataType: "text",
            async: false
        })
            .done(function (data) {
                result.push(data);
            });
    });

    var content = new Packer().pack("var tests = [" + result + "];", $("#pack").is(":checked"), $("#minify").is(":checked"));
    document.getElementById("out").value = content;
    $("#size").html((content.length / 1024).toFixed(2) + "K");
}

function getDownload() {
    var contents = document.getElementById("out").value;
    var filename = "head.custom.js";

    if (head.browser.ie) {
        SaveIE(contents, filename);
    } else if (head.browser.chrome || head.browser.ff) {
        Download.save(contents, filename);
    }
}

/* IE Magic
 * http://stackoverflow.com/questions/4458119/display-save-as-dialog-and-save-contents-of-a-selected-text-inside-textarea-to
 ****************************************************************************************************************************/
function SaveIE(content, filename) {
    if (document.execCommand) {
        var oWin = window.open("about:blank", "_blank");

        oWin.document.write(content);
        oWin.document.close();

        var success = oWin.document.execCommand('SaveAs', true, filename);
        oWin.close();
    }
}

/* Chrome & Firefox Magic
 * http://stackoverflow.com/questions/12718210/how-to-save-file-from-textarea-in-javascript-with-a-name
 ******************************************************************************************************/
var Download = {
    click: function (node) {
        var ev = document.createEvent("MouseEvents");

        ev.initMouseEvent("click", true, false, self, 0, 0, 0, 0, 0, false, false, false, false, 0, null);
        return node.dispatchEvent(ev);
    },
    encode: function (data) {
        return 'data:application/octet-stream;base64,' + btoa(data);
    },
    link: function (data, name) {
        var a = document.createElement('a');

        a.download = name || self.location.pathname.slice(self.location.pathname.lastIndexOf('/') + 1);
        a.href = data || self.location.href;

        return a;
    }
};
Download.save = function (data, name) {
    this.click(
        this.link(
            this.encode(data),
            name
        )
    );
};