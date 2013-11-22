module("Load");

// INFO: Never link to raw.github.com since that returns text/plain instead of application-x/javascript headers ..which breaks IE
// INFO: Do not link 2 same libraries twice, or it will already be in cache
// So now for a big ass helper so we can load some libs more than once ..anyways !
var libs = (function(window, undefined) {
    var counter = {};

    function count(item) {
        if (counter[item] === undefined) {
          counter[item] = 0;
        }

        return counter[item]++;
    }

    function mootools() {
        window.$$ = undefined;
        return "http://ajax.googleapis.com/ajax/libs/mootools/1.4.5/mootools-yui-compressed.js?" + count("mootools");
    }
    function jquery() {
        window.$      = undefined;
        window.jQuery = undefined;
        return "http://ajax.googleapis.com/ajax/libs/jquery/1.9.1/jquery.min.js?" + count("jquery");
    }
    function jshint() {
        window.JSHINT = undefined;
        return "http://ajax.aspnetcdn.com/ajax/jshint/r07/jshint.js?" + count("jshint");
    }
    function knockout() {
        window.ko = undefined;
        return "http://ajax.aspnetcdn.com/ajax/knockout/knockout-2.2.1.js?" + count("knockout");
    }
    function spin() {
        window.Spinner = undefined;
        return "http://fgnass.github.io/spin.js/dist/spin.min.js?" + count("spin");
    }
    function stapes() {
        window.Stapes = undefined;
        return "http://hay.github.io/stapes/stapes.min.js?" + count("stapes");
    }
    function notificon() {
        window.Notificon = undefined;
        return "http://makeable.github.io/Notificon/notificon.js?" + count("notificon");
    }
    function sly() {
        // depends on jQuery
        window.Sly = undefined;
        return "http://darsa.in/sly/js/sly.min.js?" + count("sly");
    }
    function underscore() {
        window._ = undefined;
        return "http://underscorejs.org/underscore-min.js?" + count("underscore");
    }
    function headjs() {
        window.head = undefined;
        return "http://cdnjs.cloudflare.com/ajax/libs/headjs/1.0.3/head.min.js?" + count("head");
    }

    // Exports
    return {
        mootools  : mootools,
        jquery    : jquery,
        jshint    : jshint,
        knockout  : knockout,
        spin      : spin,
        stapes    : stapes,
        notificon : notificon,
        sly       : sly,
        underscore: underscore,
        head      : headjs
    };
})(window);

// only sync tests use expect()
// http://qunitjs.com/cookbook/#synchronous-callbacks

asyncTest("load(jsFilePath, jsFilePath, callback)", 2, function() {
    head.load(
        libs.mootools(),
        libs.jquery(),

        function() {
            $j = jQuery.noConflict();

            ok(!!$j("#qunit-header").addClass, "Loaded: jQuery");
            ok(!!$$("#qunit-header").addClass, "Loaded: Mootools");

            start();
        }
    );
});

asyncTest("ready(jsFileName).load(jsFilePath)", 1, function () {
    head.ready("jquery.min.js", function() {
        ok(!!jQuery, "Ready: jquery.min.js");

        start();
    })

    .load(libs.jquery());
});

asyncTest("load([ jsFilePath, jsFilePath ], callback).ready(jsFileName, callback)", 4, function (assert) {
    head
        .load([libs.jshint(), libs.knockout()], function () {
            //  we could run a CallBack() here
        })

        .ready("jshint.js", function () {
            ok(!!JSHINT, "Ready: jshint.js");
            assert.step(1, "Step 1: jshint");
        })

        .ready("knockout-2.2.1.js", function () {
            ok(!!ko, "Ready: knockout-2.2.1.js");
            assert.step(2, "Step 2: knockout");
        })
        .ready(function () {
            // If start() is moved to above CallBack(), Travis-CI fails ...why ? Locally it works..
            start();
        });
});


asyncTest("load({ label: jsFilePath }, { label: jsFilePath }, callback).ready(label, callback)", 6, function (assert) {
    head
        .load(
            { jshint  : libs.jshint() },
            { jquery  : libs.jquery() },
            { knockout: libs.knockout() },
            function () {
                // we could run a CallBack() here
            }
        )

        .ready("jshint", function () {
            ok(!!JSHINT, "Ready: jshint");
            assert.step(1, "Step 1: jshint");
        })

        .ready("jquery", function () {
            ok(!!jQuery, "Ready: jquery");
            assert.step(2, "Step 2: jquery");
        })

        .ready("knockout", function () {
            ok(!!ko, "Ready: knockout");
            assert.step(3, "Step 3: knockout");
        })
        .ready(function () {
            // If start() is moved to above CallBack(), Travis-CI fails ...why ? Locally it works..
            start();
        });
});

asyncTest("load([ { label: jsFilePath }, { label: jsFilePath } ], callback).ready(label, callback)", 6, function (assert) {
    head
        .load([
            { jshint: libs.jshint() },
            { jquery: libs.jquery() },
            { knockout: libs.knockout() }],
            function () {
                // we could run a CallBack() here
            }
        )

        .ready("jshint", function () {
            ok(!!JSHINT, "Ready: jshint");
            assert.step(1, "Step 1: jshint");
        })

        .ready("jquery", function () {
            ok(!!jQuery, "Ready: jquery");
            assert.step(2, "Step 2: jquery");
        })

        .ready("knockout", function () {
            ok(!!ko, "Ready: knockout");
            assert.step(3, "Step 3: knockout");
        })
        .ready(function () {
            // If start() is moved to above CallBack(), Travis-CI fails ...why ? Locally it works..
            start();
        });
});


asyncTest("test(bool, [ { label: jsFilePath }, { label: jsFilePath } ], [ { label: jsFilePath }, { label: jsFilePath } ], callback).ready(callback)", 1, function (assert) {
    head
        .test(head.browser.ie,
            [
                { jshint: libs.jshint() },
                { jquery: libs.jquery() }
            ],
            [
                { jshint: libs.jshint() },
                { knockout: libs.knockout() }
            ],
            function () {
                // we could run a CallBack() here
            }
        )

        .ready(function () {
            ok(((!!JSHINT && !!jQuery) || (!!JSHINT && !!ko)), "Ready: jshint & (jquery || knockout)");

            // If start() is moved to above CallBack(), Travis-CI fails ...why ? Locally it works..
            start();
    });
});