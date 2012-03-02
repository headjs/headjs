/**
    Head JS     The only script in your <HEAD>
    Copyright   Tero Piirainen (tipiirai)
    License     MIT / http://bit.ly/mit-license
    Version     0.96

    http://headjs.com
*/
(function(doc) {

    var head = doc.documentElement,
        isHeadReady,
        isDomReady,
        domWaiters = [],
        queue = [],        // waiters for the "head ready" event
        handlers = {},     // user functions waiting for events
        scripts = {},      // loadable scripts in different states
        progress= { loaded:0, total:0 },
        notifys = [],      // callbacks to notify progress on queue loading
        isAsync = doc.createElement("script").async === true || "MozAppearance" in doc.documentElement.style || window.opera;


    /*** public API ***/
    var head_var = window.head_conf && head_conf.head || "head",
         api = window[head_var] = (window[head_var] || function() { api.ready.apply(null, arguments); });

    // states
    var PRELOADED = 1,
        PRELOADING = 2,
        LOADING = 3,
        LOADED = 4;


    // Method 1: simply load and let browser take care of ordering
    if (isAsync) {

        api.js = function() {

            var args = arguments,
                 fn = args[args.length -1],
                 els = {};

            if (!isFunc(fn)) { fn = null; }

            each(args, function(el, i) {

                if (el != fn) {
                    el = getScript(el);
                    els[el.name] = el;

                    load(el, fn && i == args.length -2 ? function() {
                        if (allLoaded(els)) { one(fn); }

                    } : null);
                }
            });

            return api;
        };


    // Method 2: preload with text/cache hack
    } else {

        api.js = function() {

            var args = arguments,
                rest = [].slice.call(args, 1),
                next = rest[0];

            // wait for a while. immediate execution causes some browsers to ignore caching
            if (!isHeadReady) {
                queue.push(function()  {
                    api.js.apply(null, args);
                });
                return api;
            }

            // multiple arguments
            if (next) {

                // load
                each(rest, function(el) {
                    if (!isFunc(el)) {
                        preload(getScript(el));
                    }
                });

                // execute
                load(getScript(args[0]), isFunc(next) ? next : function() {
                    api.js.apply(null, rest);
                });


            // single script
            } else {
                load(getScript(args[0]));
            }

            return api;
        };
    }

    /**
     *  Sample usage: 
     *
     *  head.css(
     *      // Load SyntaxHighlighter themed CSS
     *      [
     *          "http://alexgorbatchev.com/pub/sh/current/styles/shCoreDefault.css",
     *          "http://alexgorbatchev.com/pub/sh/current/styles/shThemeRDark.css",
     *          "http://alexgorbatchev.com/pub/sh/current/styles/shThemeRDark.css"
     *      ]
     *  );
     */
    api.css = function ( paths, fn ) {
        var scope = null;
                
                function loadStyleSheet( path ) {
                    var interval, timeout,
                        style,    head;
                    
                        // Checking whether the style sheet has successfully loaded
                        function onCheckLoad()  {
                            try {
                                 // SUCCESS! our style sheet has loaded
                                 // clear the counters
                                 if ( style.sheet && style.sheet.cssRules ) {

                                    clearInterval( interval );                      
                                    clearTimeout( timeout );

                                    interval = timeout = undefined;

                                    // fire the callback with success == true
                                    fn && fn.call( scope || window, true, style );           
                                 }
                              } 
                              catch( e ) { } 
                        }

                        // If timeout occurs, then load FAILed!
                        function onLoadFail()  {
                            if (!interval && !timeout) return;

                            // clear the counters
                            clearInterval( interval );             
                            clearTimeout( timeout );

                            // since the style sheet didn't load, remove the link node from the DOM
                            // and fire the callback with success == false            
                            head.removeChild( style );                
                            fn && fn.call( scope || window, false, style ); 
                        }
                    
                    // create the style @import node
                    
                    style = document.createElement( 'style' );           
                    style.textContent = '@import url("' + path + '");'; 

                    // reference to document.head for appending/ removing link nodes
                    // insert the style into the DOM and start loading the style sheet

                    head = document.getElementsByTagName( 'head' )[0], 
                    head.appendChild( style );  

                    interval = setInterval( onCheckLoad, 10 );                                                                     
                    timeout  = setTimeout( onLoadFail, 15000 );
                }
        

        // For each CSS entry, load it and notify via `fn` callback
        each(paths, function(url){
            loadStyleSheet( url );
        });

        return api;
     };


    api.ready = function(key, fn) {

        // DOM ready check: head.ready(document, function() { });
        if (key == doc) {
            if (isDomReady) { one(fn);  }
            else { domWaiters.push(fn); }
            return api;
        }

        // shift arguments
        if (isFunc(key)) {
            fn = key;
            key = "ALL";
        }

        // make sure arguments are sane
        if (typeof key != 'string' || !isFunc(fn)) { return api; }

        var script = scripts[key];
        
        // script already loaded --> execute and return
        if (script && script.state == LOADED || key == 'ALL' && allLoaded() && isDomReady) {
            one(fn);
            return api;
        }

        var arr = handlers[key];
        if (!arr) { arr = handlers[key] = [fn]; }
        else { arr.push(fn); }
 
        return api;
    };

    /**
     * Submit callback for progress of queue loading
     * Requires head.js() configuration:
     *
     *   head.js(
     *       { jquery     : "js/lib/jquery/jquery.min.js",   size : "93876"     },
     *       { uuid       :  "js/lib/uuid.js",               size : "7362"      },
     *       { underscore :  "js/lib/underscore-min.js",     size : "12140"     }
     *   );
     *
     *   head.notify( function( name, size, loaded, total){
     *      // indicate progress of libraries loading
     *   });
     *
     * @param  {Function} fn(scriptName,scriptSize,loadedSize,totalSize)
     * @return `api` public methods
     *
     */
    api.notify = function( fn ) {
        if ( isFunc(fn) ) {
            notifys.push(fn);
        }
        return api;
    };


    // perform this when DOM is ready
    api.ready(doc, function() {

        if (allLoaded()) {
            each(handlers.ALL, function(fn) {
                one(fn);
            });
        }

        if (api.feature) {
            api.feature("domloaded", true);
        }
    });


    /*** private functions ***/
    
    
    // call function once
    function one(fn) {
        if (fn._done) { return; }
        fn();
        fn._done = 1;
    }


    function toLabel(url) {
        var els = url.split("/"),
             name = els[els.length -1],
             i = name.indexOf("?");

        return i != -1 ? name.substring(0, i) : name;
    }


    function updateTotalSize(script) {
        script.size     = script["size"] ? parseInt( script.size ) : 0;
        progress.total += script.size;

        return script;
    }

    function getScript( config ) {
        var script = {
                name : undefined,
                url  : undefined,
                size : undefined
            };

        if (typeof config == 'object')
        {
            for (var key in config)
            {
                if ( config[key] )
                {
                    switch( key )
                    {
                        case "size" : script.size = config[key];
                                      break;

                        default     : script.name = key;
                                      script.url = config[key];
                                      break;
                    }
                }
            }
        } else {
            script.name = toLabel(config);
            script.url  = config;
        }

        var existing = scripts[script.name];
        if (existing && existing.url === script.url) { return existing; }

        scripts[script.name] = script;

        return updateTotalSize( script );
    }


    function each(arr, fn) {
        if (!arr) { return; }

        // arguments special type
        if (typeof arr == 'object') { arr = [].slice.call(arr); }

        // do the job
        for (var i = 0; i < arr.length; i++) {
            fn.call(arr, arr[i], i);
        }
    }

    function isFunc(el) {
        return Object.prototype.toString.call(el) == '[object Function]';
    }

    function allLoaded(els) {

        els = els || scripts;

        var loaded;
        
        for (var name in els) {
            if (els.hasOwnProperty(name) && els[name].state != LOADED) { return false; }
            loaded = true;
        }
        
        return loaded;
    }


    function onPreload(script) {
        script.state = PRELOADED;

        each(script.onpreload, function(el) {
            el.call();
        });
    }

    function preload(script, callback) {

        if (script.state === undefined) {

            script.state = PRELOADING;
            script.onpreload = [];

            scriptTag({ src: script.url, type: 'cache'}, function()  {
                onPreload(script);
            });
        }
    }

     function load(script, callback) {

        if (script.state == LOADED) {
            return callback && callback();
        }

        if (script.state == LOADING) {
            return api.ready(script.name, callback);
        }

        if (script.state == PRELOADING) {
            return script.onpreload.push(function() {
                load(script, callback);
            });
        }

        script.state = LOADING;

        // Load this script synchronously...
        scriptTag(script.url, function() {

            script.state        = LOADED;
            progress.loaded    += script.size;

            if (callback) { callback(); }

            // handlers for this script
            each(handlers[script.name], function(fn) {
                one(fn);
            });

            // Notify observers of progress
            each( notifys, function(fn){
                var args = [
                        script.name,     script.size,
                        progress.loaded, progress.total
                    ];
                fn.apply(null,args);
            });

            // everything ready
            if (allLoaded() && isDomReady) {
                each(handlers.ALL, function(fn) {
                    one(fn);
                });

                
                progress.loaded = undefined;
                progress.total  = undefined;
            }
        });
    }


    function scriptTag(src, callback) {

        var s = doc.createElement('script');
        s.type = 'text/' + (src.type || 'javascript');
        s.src = src.src || src;
        s.async = false;

        s.onreadystatechange = s.onload = function() {

            var state = s.readyState;

            if (!callback.done && (!state || /loaded|complete/.test(state))) {
                callback.done = true;
                callback();
            }
        };

        // use body if available. more safe in IE
        (doc.body || head).appendChild(s);
    }

    /*
        The much desired DOM ready check
        Thanks to jQuery and http://javascript.nwbox.com/IEContentLoaded/
    */

    function fireReady() {
        if (!isDomReady) {
            isDomReady = true;
            each(domWaiters, function(fn) {
                one(fn);
            });
        }
    }

    // W3C
    if (window.addEventListener) {
        doc.addEventListener("DOMContentLoaded", fireReady, false);

        // fallback. this is always called
        window.addEventListener("load", fireReady, false);

    // IE
    } else if (window.attachEvent) {

        // for iframes
        doc.attachEvent("onreadystatechange", function()  {
            if (doc.readyState === "complete" ) {
                fireReady();
            }
        });


        // avoid frames with different domains issue
        var frameElement = 1;

        try {
            frameElement = window.frameElement;

        } catch(e) {}


        if (!frameElement && head.doScroll) {

            (function() {
                try {
                    head.doScroll("left");
                    fireReady();

                } catch(e) {
                    setTimeout(arguments.callee, 1);
                    return;
                }
            })();
        }

        // fallback
        window.attachEvent("onload", fireReady);
    }


    // enable document.readyState for Firefox <= 3.5
    if (!doc.readyState && doc.addEventListener) {
        doc.readyState = "loading";
        doc.addEventListener("DOMContentLoaded", handler = function () {
            doc.removeEventListener("DOMContentLoaded", handler, false);
            doc.readyState = "complete";
        }, false);
    }

    /*
        We wait for 300 ms before script loading starts. for some reason this is needed
        to make sure scripts are cached. Not sure why this happens yet. A case study:

        https://github.com/headjs/headjs/issues/closed#issue/83
    */
    setTimeout(function() {
        isHeadReady = true;
        each(queue, function(fn) { fn(); });

    }, 300);

})(document);

