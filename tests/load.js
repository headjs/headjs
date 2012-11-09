/**
 * Unittests: javascript loader
 */

// or "localhost"
var s = "http://localhost:62875";

module('Load');

asyncTest('1 file, 3 tests', function () {
    expect(3);
    
    head.ready("echo.js", function () {
        ok(true, "head.ready");
        
        start();
    });
    
    head.js("echo.js", function () {        
        equal(window.test1, 1);
        
        start();
    });
    
    head.ready("echo.js", function () {
        ok(true, "head.ready");
        
        start();
    });
});

asyncTest('1 file labeled, 2 tests', function () {
    expect(2);
    
    head.ready("echo", function () {        
        ok(true, "head.ready");
        
        start();
    });
    
    head.js({ echo: "echo.js" }, function () {        
        ok(true, "head.ready");
        
        start();
    });
});

asyncTest("document ready, 1 test", function () {
    expect(1);
    
    head.ready(document, function() {        
        ok(!!document.getElementById("qunit-header"));
        
        start();
    });
});



