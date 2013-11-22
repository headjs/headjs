module("Load");

// only sync tests use expect()
// http://qunitjs.com/cookbook/#synchronous-callbacks

function getStyle(ele, styleProp) {
    var y = "";

    if (ele.currentStyle) {
        y = ele.currentStyle[styleProp];
    }
    else if (window.getComputedStyle) {
        y = document.defaultView.getComputedStyle(ele, null).getPropertyValue(styleProp);
    }
    
    return y;
}

// INFO: will make had fail (and nothing else continues!) if file not exists
asyncTest("ready(cssFileName).load(cssFilePath)", 1, function () {
    head.ready("test.css", function () {
        var result = getStyle(document.getElementById("browserscope"), "display");
        ok(result === "block", "Ready: test.css");

        start();
    })

    .load("assets/test.css");
});
