;(function(head, $, window, document, navigator, undefined) {
    "use strict";
  
    function loadComments(ele, path, label) {
        head.load("https://cdn.moot.it/latest/moot.css");

        $("#moot")
            .detach()
            .appendTo($(ele).parent())
            .moot({
                url  : "https://api.moot.it/i/headjs/".concat(path),
                title: label
            });
    }

    function loadFiddle(ele, id, options) {
        options = options || "result,js,html,css";

        $("#examples")
            .detach()
            .html("<iframe width='100%' src='http://jsfiddle.net/" + id + "/embedded/" + options + "' frameborder='0'></iframe>")
            .appendTo($(ele).parent());        
    }

    window.blog =  {
        loadComments: loadComments,
        loadFiddle: loadFiddle
    };
})(head, jQuery, window, document, navigator);