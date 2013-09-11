
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

asyncTest('load(resource).then(loadedCallback, failedCallback) unreachable script', 1, function () {
    head.load('aksjhedkajws').then(function () {
        ok(true, 'Invoked the success callback - fine for older browsers.');
        start();
    }, function () {
        ok(true, 'Invoked the failure callback - fine for newer browsers.');
        start();
   });
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

asyncTest('load(resource).then(callback) unreachable script', 1, function () {
    head.load({ failedJQuery: 'askhd.js' }).then(function () {
        ok(true, 'Invoked the success callback - fine for older browsers.');
        start();
    }, function () {
        ok(true, 'Invoked the failure callback - fine for newer browsers.');
        start();
    });
});

asyncTest('load(resource).then(loadedCallback, failedCallback) unreachable script with test', 1, function () {
    head.load({ failedddd: ['askhddd.js', function () { return false; }] }).then(start, function () {
        ok(true, 'Invoked the failure callback.');
        start();
    });
});

module('Load Groups of Resources');

asyncTest('load(resource, resource, resource, callback) successfully', 4, function () {
    head.load({ Script4: [getScriptPath('Script4'), function () { ok(true, 'Ran Script 4 load test.'); return !!window.Script4; }] }, { Script5: [getScriptPath('Script5'), function () { ok(true, 'Ran Script 5 load test.'); return !!window.Script5 && !!window.Script4; }] }, { Script6: [getScriptPath('Script6'), function () { ok(true, 'Ran Script 6 load test.'); return !!window.Script6 && !!window.Script5 && !!window.Script4; }] }, function () {
        ok(true, 'Loaded successfully.');
        start();
    });
});

asyncTest('load(resource, resource, resource).then(callback) successfully', 4, function () {
    head.load({ Script7: [getScriptPath('Script7'), function () { ok(true, 'Ran Script 7 load test.'); return !!window.Script7; }] }, { Script8: [getScriptPath('Script8'), function () { ok(true, 'Ran Script 8 load test.'); return !!window.Script8 && !!window.Script7; }] }, { Script9: [getScriptPath('Script9'), function () { ok(true, 'Ran Script 9 load test.'); return !!window.Script9 && !!window.Script8 && !!window.Script7; }] }).then(function () {
        ok(true, 'Loaded successfully.');
        start();
    }, start);
});

asyncTest('load(resource, resource, resource).then(callback) with 2 existing resources successfully', 1, function () {
    head.load('Script7', 'Script8').then(function () {
        ok(true, 'Loaded 2 existing resources successfully.');
        start();
    }, start);
});

asyncTest('load(resource, resource, resource).then(callback) with 3 existing resources successfully', 1, function () {
    head.load('Script7', 'Script8', 'Script9').then(function () {
        ok(true, 'Loaded 3 existing resources successfully.');
        start();
    }, start);
});

asyncTest('load(resource, resource, resource).then(callback) failure', 3, function () {
    head.load({ Script10: [getScriptPath('Script10'), function () { ok(true, 'Ran Script 10 load test.'); return !!window.Script10; }] }, { Script11: [getScriptPath('Script11'), function () { ok(true, 'Ran Script 11 load test.'); return !!window.Script10 && !!window.Script11; }] }, { ScriptGroupFail: ['asdh.js', function () { return false; }] }).then(start, function () {
        ok(true, 'Failure correctly detected.');
        start();
    });
});

asyncTest('load(resource, resource, resource).then(callback) short-circuit failure', 2, function () {
    head.load({ Script19: [getScriptPath('Script19'), function () { ok(true, 'Ran Script 19 load test.'); return !!window.Script19; }] }, { ScriptGroupFail19: ['asdh19.js', function () { return false; }] }, { Script20: [getScriptPath('Script20'), function () { return !!window.Script19 && !!window.Script20; }] }).then(start, function () {
        ok(true, 'Failure correctly detected.');
        start();
    });
});

asyncTest('load(resource, resource, resource).then(callback) existing resource failure', 1, function () {
    head.load('Script10', 'ScriptGroupFail').then(start, function () {
        ok(true, 'Failure correctly detected.');
        start();
    });
});

module('Load Sequencing');

asyncTest('Basic dependency', 4, function () {
    var base = head.load({ Script12: [getScriptPath('Script12'), function () { ok(true, 'Ran Script 12 load test.'); return !!window.Script12; }] }),
        dependency = base.then(function () {
            ok(!!window.Script12, 'Base resource loaded.');
            return head.load({ Script13: [getScriptPath('Script13'), function () { ok(true, 'Ran Script 13 load test.'); return !!window.Script13; }] }); // Sneakily, we return the inner promise.
        });

    dependency.then(function () {
        ok(!!window.Script13, 'Dependent resource loaded.');
        start();
    });
});

asyncTest('Base with multiple dependencies', 10, function () {
    var base = head.load({ Script30: [getScriptPath('Script30'), function () { ok(true, 'Ran Script 30 load test.'); return !!window.Script30; }] });
    base.then(function () {

        ok(!!window.Script30, 'Base resource loaded.');

        // Load dependencies in parallel.
        head.load({ Script31: [getScriptPath('Script31'), function () { ok(true, 'Ran Script 31 load test.'); return !!window.Script31; }] });
        head.load({ Script32: [getScriptPath('Script32'), function () { ok(true, 'Ran Script 32 load test.'); return !!window.Script32; }] });
        head.load({ Script33: [getScriptPath('Script33'), function () { ok(true, 'Ran Script 33 load test.'); return !!window.Script33; }] });
        head.load({ Script34: [getScriptPath('Script34'), function () { ok(true, 'Ran Script 34 load test.'); return !!window.Script34; }] });
    });

    // Wait for the dependencies.
    // We have to define them with empty sources since they're defined by name later.
    head.load({ Script31: [] }, { Script32: [] }, { Script33: [] }, { Script34: [] }).then(function () {
        ok(!!window.Script31, 'Dependent resource loaded.');
        ok(!!window.Script32, 'Dependent resource loaded.');
        ok(!!window.Script33, 'Dependent resource loaded.');
        ok(!!window.Script34, 'Dependent resource loaded.');

        start();
    }, start);

});

asyncTest('Complex dependency', 7, function () {
    var base = head.load({ Script14: [getScriptPath('Script14'), function () { ok(true, 'Ran Script 14 load test.'); return !!window.Script14; }] }),
        dependency = base.then(function () {
            ok(!!window.Script14, 'Base resource loaded.');
            return head.load({ Script15: [getScriptPath('Script15'), function () { ok(true, 'Ran Script 15 load test.'); return !!window.Script15; }] }, { Script16: [getScriptPath('Script16'), function () { ok(true, 'Ran Script 16 load test.'); return !!window.Script16; }] }); // Sneakily, we return the inner promise.
        });

    dependency.then(function () {
        ok(!!window.Script15 && !!window.Script16, 'Dependent resources loaded.');
        return head.load({ Script17: [getScriptPath('Script17'), function () { ok(true, 'Ran Script 17 load test.'); return !!window.Script17; }] }, { Script1: [getScriptPath('Script1'), function () { return !!window.Script1; }] });
    }).then(function(){
        ok(!!window.Script17 && !!window.Script1, 'More dependent resources loaded.');
        start();
    });
});

module('Failover sources');

asyncTest('Simple failover', 1, function () {
    head.load({ Script18: ['junk.js', 'nothing.js', getScriptPath('Script18'), 'still nothing', function () { return !!window.Script18; }] }).then(function () {
        ok(!!window.Script18, 'Resource loaded from fallback location.');
        start();
    }, start);
});

asyncTest('Match successful failover via failed source', 1, function () {
    head.load('nothing.js').then(function () {
        ok(!!window.Script18, 'Resource loaded from fallback location.');
        start();
    }, start);
});

asyncTest('Match successful failover via unused source', 1, function () {
    head.load('still nothing').then(function () {
        ok(!!window.Script18, 'Resource loaded from fallback location.');
        start();
    }, start);
});

asyncTest('Complete failure', 1, function () {
    head.load({ FailedFailover: ['a.js', 'b.js', 'c nothing', function () { return false; }] }).then(null, function () {
        ok(true, 'Failover complete failure detected.');
        start();
    }, start);
});

asyncTest('Match complete failure', 1, function () {
    head.load('FailedFailover').then(null, function () {
        ok(true, 'Existing failover identified.');
        start();
    }, start);
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
