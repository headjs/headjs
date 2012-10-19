/**
 * Unittests: javascript loader
 */

// or "localhost"
var s = "http://localhost:62875";

module('Load');

asyncTest('1 file', 3, function () {    
    head.ready("echo.js", function () {
       ok(true, "head.ready");
    });
    
    head.js("echo.js", function () {
        start();
        equal(window.test1, 1); 
    });
    
    head.ready("echo.js", function () {
       ok(true, "head.ready");
    });
});

asyncTest('1 file labeled', 2, function () {
    head.ready("echo", function () {
        start();
        ok(true, "head.ready");
    });
    
    head.js({ echo: "echo.js" }, function () {
        start();
        ok(true, "head.ready");
    });
});

asyncTest("document ready", function() {
    head.ready(document, function() {
        start();
        ok(!!document.getElementById("qunit-header"));
    });
});



