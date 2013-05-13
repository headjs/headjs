module('Load');

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
        return 'http://ajax.googleapis.com/ajax/libs/mootools/1.4.5/mootools-yui-compressed.js?' + count("mootools");
    }
    function jquery() {
        window.$      = undefined;
        window.jQuery = undefined;
        return 'http://ajax.googleapis.com/ajax/libs/jquery/1.9.1/jquery.min.js?' + count("jquery");
    }
    function jshint() {
        window.JSHINT = undefined;
        return 'http://ajax.aspnetcdn.com/ajax/jshint/r07/jshint.js?' + count("jshint");
    }
    function knockout() {
        window.ko = undefined;
        return 'http://ajax.aspnetcdn.com/ajax/knockout/knockout-2.2.1.js?' + count("knockout");
    }
    function spin() {
        window.Spinner = undefined;
        return 'http://fgnass.github.io/spin.js/dist/spin.min.js?' + count("spin");
    }
    function stapes() {
        window.Stapes = undefined;
        return 'http://hay.github.io/stapes/stapes.min.js?' + count("stapes");
    }
    function notificon() {
        window.Notificon = undefined;
        return 'http://makeable.github.io/Notificon/notificon.js?' + count("notificon");
    }
    function sly() {
        // depends on jQuery
        window.Sly = undefined;
        return 'http://darsa.in/sly/js/sly.min.js?' + count("sly");
    }    
    function underscore() {
        window._ = undefined;
        return 'http://underscorejs.org/underscore-min.js?' + count("underscore");
    }      
    function headjs() {
        return 'http://cdnjs.cloudflare.com/ajax/libs/headjs/0.97a/head.min.js?' + count("head");
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

asyncTest("js(jsFilePath, jsFilePath, callback)", function() {
    expect(2);
    
    head.js(
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

asyncTest("ready(jsFileName).js(jsFilePath)", function () {
    expect(1);
    
    head.ready("jquery.min.js", function() {        
        ok(!!jQuery, "Ready: jquery.min.js");
        
        start();
    })
    
    .js(libs.jquery());    
});


asyncTest("js({ label: jsFilePath }, { label: jsFilePath }, callback).ready(label, callback)", function (assert) {
    expect(6);
       
     head.js(
        { jshint  : libs.jshint() },
        { jquery  : libs.jquery() },
        { knockout: libs.knockout() },
        function() {
            start();
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
    });
});

// INFO: Must be last test since it is loading HeadJS while running tests, which in turn already relies on HeadJS
// If run as last test in suite it should be ok, since it shouldn't be a problem if we overwrite HeadJS stuff at the end
asyncTest("head_conf", function() {
    expect(1);

    head_conf = { head: "headJS" };
    head.js( { head: libs.head() }, function() {
        ok(!!headJS, "Callback: headJS");
        
        // reset
        head_conf = undefined;

        start();
    });
});