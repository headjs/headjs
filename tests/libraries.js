
module('Libraries');


asyncTest("no conflict", function() {
    expect(2);
    
    head.js(
        "http://ajax.googleapis.com/ajax/libs/mootools/1.4.5/mootools-yui-compressed.js",
        "http://ajax.googleapis.com/ajax/libs/jquery/1.8.2/jquery.min.js",
        

        function() {                        
            $j = jQuery.noConflict();
                        
            ok(!!$j("#qunit-header").addClass, "jQuery is working");
            ok(!!$$("#qunit-header").addClass, "Mootools is working");
            
            start();
        }
    );
});


asyncTest("jquery", function() {
    expect(1);
    
    head.ready("jquery.min.js", function() {
        ok(!!jQuery, "jQuery ready");
        
        start();
    });
    
    head.js("http://ajax.googleapis.com/ajax/libs/jquery/1.8.2/jquery.min.js");
    
});


asyncTest('jshint, jquery, knockout', function () {
    expect(3);
    
    head.js(
        { jshint: "http://ajax.aspnetcdn.com/ajax/jshint/r07/jshint.js" },
        { jquery: "http://ajax.googleapis.com/ajax/libs/jquery/1.8.2/jquery.min.js" },
        { knockout: "http://ajax.aspnetcdn.com/ajax/knockout/knockout-2.1.0.js" }
    );

    head.ready("jshint", function () {        
        ok(!!JSHINT, "JSHint ready");
        
        start();
    });
    
    head.ready("jquery", function () {        
        ok(!!jQuery, "jQuery ready");
        
        start();
    });
    
    head.ready("knockout", function () {        
        ok(!!ko, "KnockOut ready");
        
        start();
    });
    
});