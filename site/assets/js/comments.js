;(function(head, $, window, document, navigator, undefined) {
    "use strict";

    function loadComments(ele) {
        head.load("https://cdn.moot.it/latest/moot.css");
        
        var item  = $(ele).parent().find(".comments");
        var forum = item.data('forum');
        item.moot({
            url: "https://api.moot.it/i/headjs/".concat(forum)
        });
    }

    window.blog =  {
      loadComments: loadComments          
    };
})(head, jQuery, window, document, navigator);