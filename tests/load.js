/**
 * Unittests: javascript loader
 */

// or "localhost"
var s = "http://localhost:3000";

module('Load');

asyncTest('1 file', 3, function () {
    
    head.ready("test1", function() {
       ok(true, "head.ready");
    });
    
    head.js(s + "/test1?value=1", function() {
        start();
        equals(test1, 1); 
    });
    
    head.ready("test1", function() {
       ok(true, "head.ready");
    });
 
});

asyncTest('2 files', 2, function () {
        
    head.js(s + "/test1?value=2", s + "/test2?value=2", function() {
        start();
        equals(test1, 2);
        equals(test2, 2); 
    });

});

asyncTest('2 files in order', 1, function () {
        
    head.js(s + "/dep1?value=1&time=100", s + "/test3?value=1&require=dep1", function() {
        start();
        equals(test3, 1); 
    });

});


asyncTest('5 files in order', 3, function () {

    head.ready("dep4", function() {
        ok(true, "dep4 ready");
    });

    head.js(
        s + "/dep2?value=1&time=400", 
        s + "/dep3?value=1&time=300&require=dep2", 
        s + "/dep4?value=1&time=200&require=dep3", 
        s + "/dep5?value=1&time=100&require=dep4", 
        s + "/test3?value=2&require=dep5", 
        
        function() {
            start();
            equals(test3, 2); 
        }
    );

    head.ready("test3", function() {
        ok(dep2 && dep3 && dep4 && dep5 && test3, "all ready");
    });
    
});


asyncTest('nested load', function () {
        
    head.js(s + "/dep6?value=1", function() {
        
        head.js(s + "/test4?value=1&require=dep6", function() {
            start();
            equals(test4, 1); 
        });
        
    });

});


asyncTest("document ready", function() {
    head.ready(document, function() {
        start();
        ok(!!document.getElementById("qunit-header"));
    });
});



