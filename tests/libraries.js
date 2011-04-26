
module('Libraries');


asyncTest("no conflict", 2, function() {
    
    head.js(
        "http://ajax.googleapis.com/ajax/libs/prototype/1.7.0.0/prototype.js",
        "http://ajax.googleapis.com/ajax/libs/jquery/1.5.2/jquery.min.js",
        
        function() {
            var $j = jQuery.noConflict();
            start();
            ok(!!$j("#qunit-header").addClass, "jQuery in use");
            ok(!!$("qunit-header").addClassName, "Prototype in use");
        }
    );
});


asyncTest("jquery", 1, function() {
    
    head.ready("jquery.min.js", function() {
        start();
        ok(!!jQuery, "jQuery ready");
    });
    
    head.js("http://ajax.googleapis.com/ajax/libs/jquery/1.5.2/jquery.min.js");
    
});



asyncTest('raphael, jquery, jslint', 3, function () {
    
    head.js(
        { raphael: "https://github.com/DmitryBaranovskiy/raphael/raw/master/raphael.js"},
        { jquery: "http://ajax.googleapis.com/ajax/libs/jquery/1.5.2/jquery.min.js"},
        { jslint: "https://github.com/kosmas58/compass-jquery-plugin/raw/master/lib/jslint.js"}
    );

    head.ready("raphael", function() {
        ok(!!Raphael, "Raphael ready");
    });
    
    head.ready("jquery", function() {
        ok(!!jQuery, "jQuery ready");
    });
    
    head.ready("jslint", function() {
        start();
        ok(!!JSLINT, "JSLINT ready");
    });
    
});