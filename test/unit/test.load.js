module('head.load.js');

asyncTest("jquery, mootools (trigger via callback)", function() {
    expect(2);
    
    head.js(
        "http://ajax.googleapis.com/ajax/libs/mootools/1.4.5/mootools-yui-compressed.js",
        "http://ajax.googleapis.com/ajax/libs/jquery/1.8.2/jquery.min.js",
        

        function() {                        
            $j = jQuery.noConflict();
                        
            ok(!!$j("#qunit-header").addClass, "Callback: jQuery");
            ok(!!$$("#qunit-header").addClass, "Callback: Mootools");
            
            start();
        }
    );
});

asyncTest("jquery (trigger via filename)", function () {
    expect(1);
    
    head.ready("jquery.min.js", function() {        
        ok(!!jQuery, "Filename: ready('jquery.min.js')");
        
        start();
    });
    
    
    head.js("http://ajax.googleapis.com/ajax/libs/jquery/1.8.2/jquery.min.js");    
});


asyncTest('jshint, jquery, knockout (trigger via label)', function (assert) {
    expect(6);

    head.js(
        { jshint  : "http://ajax.aspnetcdn.com/ajax/jshint/r07/jshint.js" },
        { jquery  : "http://ajax.googleapis.com/ajax/libs/jquery/1.8.2/jquery.min.js" },
        { knockout: "http://ajax.aspnetcdn.com/ajax/knockout/knockout-2.1.0.js" }
    );

    head.ready("jshint", function () {               
        ok(!!JSHINT, "Label: ready('jshint')");
        assert.step(1, "step1 jshint");
    });
    
    head.ready("jquery", function () {
        ok(!!jQuery, "Label: ready('jquery')");
        assert.step(2, "step2 jquery");
    });
    
    head.ready("knockout", function () {
        ok(!!ko, "Label: ready('knockout')");
        assert.step(3, "step3 knockout");
        
        start();
    });       
});
