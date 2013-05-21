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

    window.blog =  {
      loadComments: loadComments          
    };
})(head, jQuery, window, document, navigator);