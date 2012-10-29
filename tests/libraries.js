
module('Libraries');


asyncTest("no conflict", 2, function() {
    
    head.js(
        "http://ajax.googleapis.com/ajax/libs/mootools/1.4.5/mootools-yui-compressed.js",
        "http://ajax.googleapis.com/ajax/libs/jquery/1.8.2/jquery.min.js",
        

        function() {                        
            $j = jQuery.noConflict();
            
            start();
            ok(!!$j("#qunit-header").addClass, "jQuery is working");
            ok(!!$$("#qunit-header").addClass, "Mootools is working");           
        }
    );
});


asyncTest("jquery", 1, function() {
    
    head.ready("jquery.min.js", function() {
        start();
        ok(!!jQuery, "jQuery ready");
    });
    
    head.js("http://ajax.googleapis.com/ajax/libs/jquery/1.8.2/jquery.min.js");
    
});


asyncTest('jshint, jquery, knockout', 3, function () {

    head.js(
        { jshint: "http://ajax.aspnetcdn.com/ajax/jshint/r07/jshint.js" },
        { jquery: "http://ajax.googleapis.com/ajax/libs/jquery/1.8.2/jquery.min.js" },
        { knockout: "http://ajax.aspnetcdn.com/ajax/knockout/knockout-2.1.0.js" }
    );

    head.ready("jshint", function () {
        start();
        ok(!!JSHINT, "JSHint ready");
    });
    
    head.ready("jquery", function () {
        start();
        ok(!!jQuery, "jQuery ready");
    });
    
    head.ready("knockout", function () {
        start();
        ok(!!ko, "KnockOut ready");
    });
    
});