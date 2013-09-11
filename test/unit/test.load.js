
function getScriptPath(name) {
    return 'assets/Scripts/' + name + '.js';
}

module('Load Interface');

test('"load" method exists', 1, function () {
    ok(!!head.load, '"head.load" method exists.');
});

test('"js" method exists', 1, function () {
    ok(!!head.js, '"head.js" method exists.');
});

test('"ready" method exists', 1, function () {
    ok(!!head.ready, '"head.ready" method exists.');
});

module('Load a Single, Unnamed Resource');
asyncTest('load(resource, callback)', 1, function () {
    head.load(getScriptPath('Script0'), function () {
        ok(window.Script0 !== undefined, 'Script loaded successfully.');
        start();
    });
});

asyncTest('load(resource).then(callback)', 1, function () {
    head.load(getScriptPath('Script1')).then(function () {
        ok(window.Script1 !== undefined, 'Script loaded successfully.');
        start();
    }, start);
});

asyncTest('load(resource).then(loadedCallback, failedCallback)', 1, function () {
    head.load('aksjhedkajws').then(null, function () {
        ok(true, 'Invoked the failure callback successfully.');
   });

    setTimeout(start, 1000);
});


module('Load a Single, Named Resource');

asyncTest('load(resource, callback)', 1, function () {
    head.load({ Script2: getScriptPath('Script2') }, function () {
        ok(window.Script2 !== undefined, 'Script loaded successfully.');
        start();
    });
});

asyncTest('load(resource).then(callback)', 1, function () {
    head.load({ Script3: getScriptPath('Script3') }).then(function () {
        ok(window.Script3 !== undefined, 'Script loaded successfully.');
        start();
    }, start);
});

asyncTest('load(resource).then(callback)', 1, function () {
    head.load({ failedJQuery: 'alskje.js' }).then(start, function () {
        ok(true, 'Invoked the failure callback successfully.');
        start();
    });
});

//asyncTest("load(jsFilePath, jsFilePath, callback)", function () {
//    expect(2);

//    head.js(
//        libs.mootools(),
//        libs.jquery(),


//        function () {
//            $j = jQuery.noConflict();

//            ok(!!$j("#qunit-header").addClass, "Loaded: jQuery");
//            ok(!!$$("#qunit-header").addClass, "Loaded: Mootools");

//            start();
//        }
//    );
//});

//asyncTest("load(jsFilePath, jsFilePath).then(callback)", 2, function () {

//    head.js(libs.mootools(), libs.knockout())
//        .then(function () {

//            ok(!!window.$, "Loaded: jQuery");
//            ok(!!window.ko, "Loaded: Knockout");

//            start();
//        }, start);
//});

//asyncTest("ready(jsFileName).load(jsFilePath)", function () {
//    expect(1);

//    // Define a label before any sources.
//    head.ready("jQueryT1", function () {
//        ok(!!window.jQuery, "Ready: jquery.min.js");

//        start();
//    })

//    // Load a different jQuery version - the new loader is too smart to be fooled by the prior test that erases the jQuery window reference after it's already loaded if we don't specify a new source.
//    .load({ jQueryT1: [libs.jquery(), function () { return !!window.jQuery; }] });
//});


//asyncTest("load({ label: jsFilePath }, { label: jsFilePath }, callback).ready(label, callback)", function (assert) {
//    expect(6);

//    head.load(
//        { jshint: libs.jshint() },
//        { jquery: libs.jquery() },
//        { knockout: libs.knockout() }
//    )

//    .ready("jshint", function () {
//        ok(!!JSHINT, "Ready: jshint");
//        assert.step(1, "Step 1: jshint");
//    })

//    .ready("jquery", function () {
//        ok(!!jQuery, "Ready: jquery");
//        assert.step(2, "Step 2: jquery");
//    })

//    .ready("knockout", function () {
//        ok(!!ko, "Ready: knockout");
//        assert.step(3, "Step 3: knockout");

//        start();
//    });
//});
