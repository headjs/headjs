﻿/*!
 * HeadJS     The only script in your <HEAD>    
 * Author     Tero Piirainen  (tipiirai)
 * Maintainer Robert Hoffmann (itechnology)
 * License    MIT / http://bit.ly/mit-license
 *
 * Version 0.99
 * http://headjs.com
 */
; (function (win, undefined) {
    "use strict";

    // gt, gte, lt, lte, eq breakpoints would have been more simple to write as ['gt','gte','lt','lte','eq']
    // but then we would have had to loop over the collection on each resize() event,
    // a simple object with a direct access to true/false is therefore much more efficient
    var doc   = win.document,
        nav   = win.navigator,
        loc   = win.location,
        html  = doc.documentElement,
        klass = [],
        conf  = {
            screens   : [240, 320, 480, 640, 768, 800, 1024, 1280, 1440, 1680, 1920],            
            screensCss: { "gt": true, "gte": false, "lt": true, "lte": false, "eq": false },
            browsers  : [
                          { ie     : { min: 6, max: 10 } }
                       //,{ chrome : { min: 8, max: 24 } }
                       //,{ ff     : { min: 3, max: 19 } }
                       //,{ ios    : { min: 3, max:  6 } }
                       //,{ android: { min: 2, max:  4 } }
                       //,{ webkit : { min: 9, max: 12 } }
                       //,{ opera  : { min: 9, max: 12 } }
                        ],
            browserCss: { "gt": true, "gte": false, "lt": true, "lte": false, "eq": true },
            section   : "-section",
            page      : "-page",
            head      : "head"
        };

    if (win.head_conf) {
        for (var item in win.head_conf) {
            if (win.head_conf[item] !== undefined) {
                conf[item] = win.head_conf[item];
            }
        }
    }

    function pushClass(name) {
        klass[klass.length] = name;
    }

    function removeClass(name) {
        var re = new RegExp("\\b" + name + "\\b");
        html.className = html.className.replace(re, '');
    }

    function each(arr, fn) {
        for (var i = 0, l = arr.length; i < l; i++) {
            fn.call(arr, arr[i], i);
        }
    }

    // API
    var api = win[conf.head] = function () {
        api.ready.apply(null, arguments);
    };

    api.feature = function (key, enabled, queue) {

        // internal: apply all classes
        if (!key) {
            html.className += ' ' + klass.join(' ');
            klass = [];
            return api;
        }

        if (Object.prototype.toString.call(enabled) === '[object Function]') {
            enabled = enabled.call();
        }

        pushClass((enabled ? '' : 'no-') + key);
        api[key] = !!enabled;

        // apply class to HTML element
        if (!queue) {
            removeClass('no-' + key);
            removeClass(key);
            api.feature();
        }

        return api;
    };

    // no queue here, so we can remove any eventual pre-existing no-js class
    api.feature("js", true);

    // browser type & version
    var ua     = nav.userAgent.toLowerCase(),
        mobile = /mobile|midp|(windows nt 6\.2.+arm|touch)/.test(ua);

    // useful for enabling/disabling feature (we can consider a desktop navigator to have more cpu/gpu power)        
    api.feature("mobile" , mobile , true);
    api.feature("desktop", !mobile, true);

    // http://www.zytrax.com/tech/web/browser_ids.htm
    // http://www.zytrax.com/tech/web/mobile_ids.html
    ua = /(chrome|firefox)[ \/]([\w.]+)/.exec(ua) || // Chrome & Firefox
         /(iphone|ipad|ipod)(?:.*version)?[ \/]([\w.]+)/.exec(ua) || // Mobile IOS
         /(android)(?:.*version)?[ \/]([\w.]+)/.exec(ua) || // Mobile Webkit
         /(webkit|opera)(?:.*version)?[ \/]([\w.]+)/.exec(ua) || // Safari & Opera
         /(msie) ([\w.]+)/.exec(ua) || [];


    var browser = ua[1],
        version = parseFloat(ua[2]);    
    
    switch (browser) {
        case 'msie':
            browser = 'ie';
            version = doc.documentMode || version;
            break;

        case 'firefox':
            browser = 'ff';
            break;

        case 'ipod':
        case 'ipad':
        case 'iphone':
            browser = 'ios';
            break;

        case 'webkit':
            browser = 'safari';
            break;
    }


    // Browser vendor and version
    api.browser = {
        name   : browser,
        version: version
    };
    api.browser[browser] = true;

    for (var i = 0, l = conf.browsers.length; i < l; i++) {
        for (var key in conf.browsers[i]) {            
            if (browser === key) {
                pushClass(key);

                var min = conf.browsers[i][key].min;
                var max = conf.browsers[i][key].max;

                for (var v = min; v <= max; v++) {
                    if (version > v) {
                        if (conf.browserCss.gt) {
                            pushClass("gt-" + key + v);
                        }

                        if (conf.browserCss.gte) {
                            pushClass("gte-" + key + v);
                        }
                    }
                    
                    else if (version < v) {
                        if (conf.browserCss.lt) {
                            pushClass("lt-" + key + v);
                        }

                        if (conf.browserCss.lte) {
                            pushClass("lte-" + key + v);
                        }
                    }

                    else if (version === v) {
                        if (conf.browserCss.lte) {
                            pushClass("lte-" + key + v);
                        }

                        if (conf.browserCss.eq) {
                            pushClass("eq-" + key + v);
                        }

                        if (conf.browserCss.gte) {
                            pushClass("gte-" + key + v);
                        }
                    }
                }
            }
            else {
                pushClass('no-' + key);
            }
        }
    }
    
    pushClass(browser);
    pushClass(browser + parseInt(version, 10));



    // IE lt9 specific
    if (browser === "ie" && version < 9) {
        // HTML5 support : you still need to add html5 css initialization styles to your site
        // See: assets/html5.css
        each("abbr|article|aside|audio|canvas|details|figcaption|figure|footer|header|hgroup|main|mark|meter|nav|output|progress|section|summary|time|video".split("|"), function (el) {
            doc.createElement(el);
        });
    }


    // CSS "router"
    each(loc.pathname.split("/"), function (el, i) {
        if (this.length > 2 && this[i + 1] !== undefined) {
            if (i) {
                pushClass(this.slice(1, i + 1).join("-").toLowerCase() + conf.section);
            }
        } else {
            // pageId
            var id = el || "index", index = id.indexOf(".");
            if (index > 0) {
                id = id.substring(0, index);
            }

            html.id = id.toLowerCase() + conf.page;

            // on root?
            if (!i) {
                pushClass("root" + conf.section);
            }
        }
    });


    // basic screen info
    api.screen = {
        height: win.screen.height,
        width : win.screen.width
    };

    // viewport resolutions: w-100, lt-480, lt-1024 ...
    function screenSize() {
        // remove earlier sizes
        html.className = html.className.replace(/ (w-|eq-|gt-|gte-|lt-|lte-|portrait|no-portrait|landscape|no-landscape)\d+/g, "");

        // Viewport width
        var iw = win.innerWidth || html.clientWidth,
            ow = win.outerWidth || win.screen.width;
        
        api.screen.innerWidth = iw;
        api.screen.outerWidth = ow;
        
        // for debugging purposes, not really useful for anything else
        pushClass("w-" + iw);

        each(conf.screens, function (width) {
            if (iw > width) {
                if (conf.screensCss.gt) {
                    pushClass("gt-" + width);
                }

                if (conf.screensCss.gte) {
                    pushClass("gte-" + width);
                }
            }

            else if (iw < width) {
                if (conf.screensCss.lt) {
                    pushClass("lt-" + width);
                }

                if (conf.screensCss.lte) {
                    pushClass("lte-" + width);
                }
            }

            else if (iw === width) {
                if (conf.screensCss.lte) {
                    pushClass("lte-" + width);
                }

                if (conf.screensCss.eq) {
                    pushClass("e-q" + width);
                }

                if (conf.screensCss.gte) {
                    pushClass("gte-" + width);
                }
            }
        });
        

        // Viewport height
        var ih = win.innerHeight || html.clientHeight,
            oh = win.outerHeight || win.screen.height;

        api.screen.innerHeight = ih;
        api.screen.outerHeight = oh;
             
        // no need for onChange event to detect this
        api.feature("portrait" , (ih > iw));
        api.feature("landscape", (ih < iw));
    }

    screenSize();

    // Throttle navigators from triggering too many resize events
    var resizeId = 0;
    function onResize() {
        win.clearTimeout(resizeId);
        resizeId = win.setTimeout(screenSize, 100);
    }

    // Manually attach, as to not overwrite existing handler
    if (win.addEventListener) {
        win.addEventListener("resize", onResize, false);

    } else {
        win.attachEvent("onresize", onResize);
    }
})(window);

/*!
 * HeadJS     The only script in your <HEAD>    
 * Author     Tero Piirainen  (tipiirai)
 * Maintainer Robert Hoffmann (itechnology)
 * License    MIT / http://bit.ly/mit-license
 *
 * Version 0.99
 * http://headjs.com
 */
;(function(win, undefined) {
    "use strict";

    var doc = win.document,
        /*
            To add a new test:

            head.feature("video", function() {
                var tag = document.createElement('video');
                return !!tag.canPlayType;
            });

            Good place to grab more tests

            https://github.com/Modernizr/Modernizr/blob/master/modernizr.js
        */

        /* CSS modernizer */
         el       = doc.createElement("i"),
         style    = el.style,
         prefs    = ' -o- -moz- -ms- -webkit- -khtml- '.split(' '),
         domPrefs = 'Webkit Moz O ms Khtml'.split(' '),

         headVar = win.head_conf && win.head_conf.head || "head",
         api     = win[headVar];

     // Thanks Paul Irish!
    function testProps(props) {
        for (var i in props) {
            if (style[props[i]] !== undefined) {
                return true;
            }
        }

        return false;
    }


    function testAll(prop) {
        var camel = prop.charAt(0).toUpperCase() + prop.substr(1),
            props = (prop + ' ' + domPrefs.join(camel + ' ') + camel).split(' ');

        return !!testProps(props);
    }

    var tests = {
        gradient: function() {
            var s1 = 'background-image:',
                s2 = 'gradient(linear,left top,right bottom,from(#9f9),to(#fff));',
                s3 = 'linear-gradient(left top,#eee,#fff);';

            style.cssText = (s1 + prefs.join(s2 + s1) + prefs.join(s3 + s1)).slice(0,-s1.length);
            return !!style.backgroundImage;
        },

        rgba: function() {
            style.cssText = "background-color:rgba(0,0,0,0.5)";
            return !!style.backgroundColor;
        },

        opacity: function() {
            return el.style.opacity === "";
        },

        textshadow: function() {
            return style.textShadow === '';
        },

        multiplebgs: function() {
            style.cssText = "background:url(//:),url(//:),red url(//:)";
            return new RegExp("(url\\s*\\(.*?){3}").test(style.background);
        },

        boxshadow: function() {
            return testAll("boxShadow");
        },

        borderimage: function() {
            return testAll("borderImage");
        },

        borderradius: function() {
            return testAll("borderRadius");
        },

        cssreflections: function() {
            return testAll("boxReflect");
        },

        csstransforms: function() {
            return testAll("transform");
        },

        csstransitions: function() {
            return testAll("transition");
        },
        touch: function () {
            return 'ontouchstart' in win;
        },
        retina: function () {
            return (win.devicePixelRatio > 1);
        },        

        /*
            font-face support. Uses browser sniffing but is synchronous.
            http://paulirish.com/2009/font-face-feature-detection/
        */
        fontface: function() {
            var browser = api.browser.name, version = api.browser.version;

            switch (browser) {
                case "ie":
                    return version >= 9;

                case "chrome":
                    return version >= 13;

                case "ff":
                    return version >= 6;

                case "ios":
                    return version >= 5;

                case "android":
                    return false;

                case "webkit":
                    return version >= 5.1;

                case "opera":
                    return version >= 10;

                default:
                    return false;
            }
        }
    };

    // queue features
    for (var key in tests) {
        if (tests[key]) {
            api.feature(key, tests[key].call(), true);
        }
    }

    // enable features at once
    api.feature();

})(window);
/*!
 * HeadJS     The only script in your <HEAD>    
 * Author     Tero Piirainen  (tipiirai)
 * Maintainer Robert Hoffmann (itechnology)
 * License    MIT / http://bit.ly/mit-license
 *
 * Version 0.99
 * http://headjs.com
 */
; (function (win, undefined) {
    "use strict";

    var doc = win.document,
        domWaiters = [],
        queue      = [], // waiters for the "head ready" event
        handlers   = {}, // user functions waiting for events
        assets     = {}, // loadable items in various states
        isAsync    = "async" in doc.createElement("script") || "MozAppearance" in doc.documentElement.style || win.opera,
        isHeadReady,
        isDomReady,

        /*** public API ***/
        headVar = win.head_conf && win.head_conf.head || "head",
        api     = win[headVar] = (win[headVar] || function () { api.ready.apply(null, arguments); }),

        // states
        PRELOADING = 1,
        PRELOADED  = 2,
        LOADING    = 3,
        LOADED     = 4;

    // Method 1: simply load and let browser take care of ordering
    if (isAsync) {
        api.load = function () {
            ///<summary>
            /// INFO: use cases
            ///    head.load("http://domain.com/file.js","http://domain.com/file.js", callBack)
            ///    head.load({ label1: "http://domain.com/file.js" }, { label2: "http://domain.com/file.js" }, callBack)
            ///</summary> 
            var args      = arguments,
                 callback = args[args.length - 1],
                 items    = {};

            if (!isFunction(callback)) {
                callback = null;
            }
            
            if (isArray(args[0])) {
                args[0].push(callback);
                api.load.apply(null, args[0]);
                
                return api;
            }

            each(args, function (item, i) {
                if (item !== callback) {
                    item             = getAsset(item);
                    items[item.name] = item;

                    load(item, callback && (item.async || i === args.length - 2) ? function () {
                        if (allLoaded(items)) {
                            one(callback);
                        }

                    } : null);
                }
            });

            return api;
        };


    // Method 2: preload with text/cache hack
    } else {
        api.load = function () {
            var args = arguments,
                rest = [].slice.call(args, 1),
                next = rest[0];

            // wait for a while. immediate execution causes some browsers to ignore caching
            if (!isHeadReady) {
                queue.push(function () {
                    api.load.apply(null, args);
                });

                return api;
            }
            
            // multiple arguments
            if (!!next) {
                /* Preload with text/cache hack (not good!)
                 * http://blog.getify.com/on-script-loaders/
                 * http://www.nczonline.net/blog/2010/12/21/thoughts-on-script-loaders/
                 * If caching is not configured correctly on the server, then items could load twice !
                 *************************************************************************************/
                each(rest, function (item) {
                    if (!isFunction(item) && !!item) {
                        preLoad(getAsset(item));
                    }
                });
                
                // execute
                load(getAsset(args[0]), isFunction(next) ? next : function () {
                    api.load.apply(null, rest);
                });                
            }
            else {
                // single item
                load(getAsset(args[0]));
            }

            return api;
        };
    }

    // INFO: for retro compatibility
    api.js = api.load;
    
    api.test = function (test, success, failure, callback) {
        ///<summary>
        /// INFO: use cases:
        ///    head.test(condition, null       , "file.NOk" , callback);
        ///    head.test(condition, "fileOk.js", null       , callback);        
        ///    head.test(condition, "fileOk.js", "file.NOk" , callback);
        ///    head.test(condition, "fileOk.js", ["file.NOk", "file.NOk"], callback);
        ///    head.test({
        ///               test    : condition,
        ///               success : [{ label1: "file1Ok.js"  }, { label2: "file2Ok.js" }],
        ///               failure : [{ label1: "file1NOk.js" }, { label2: "file2NOk.js" }],
        ///               callback: callback
        ///    );  
        ///    head.test({
        ///               test    : condition,
        ///               success : ["file1Ok.js" , "file2Ok.js"],
        ///               failure : ["file1NOk.js", "file2NOk.js"],
        ///               callback: callback
        ///    );         
        ///</summary>    
        var obj = (typeof test === 'object') ? test : {
            test: test,
            success: !!success ? isArray(success) ? success : [success] : false,
            failure: !!failure ? isArray(failure) ? failure : [failure] : false,
            callback: callback || noop
        };

        // Test Passed ?
        var passed = !!obj.test;

        // Do we have a success case
        if (passed && !!obj.success) {
            obj.success.push(obj.callback);
            api.load.apply(null, obj.success);
        }
            // Do we have a fail case
        else if (!passed && !!obj.failure) {
            obj.failure.push(obj.callback);
            api.load.apply(null, obj.failure);
        }
        else {
            callback();
        }

        return api;
    };

    api.ready = function (key, callback) {
        ///<summary>
        /// INFO: use cases:
        ///    head.ready(callBack)
        ///    head.ready(document , callBack)
        ///    head.ready("file.js", callBack);
        ///    head.ready("label"  , callBack);
        ///    head.ready(["label1", "label2"], callback);
        ///</summary>

        // DOM ready check: head.ready(document, function() { });
        if (key === doc) {
            if (isDomReady) {
                one(callback);
            }
            else {
                domWaiters.push(callback);
            }

            return api;
        }

        // shift arguments
        if (isFunction(key)) {
            callback = key;
            key      = "ALL";
        }

        // queue all items from key and return. The callback will be executed if all items from key are already loaded.
        if (isArray(key)) {
            var items = {};

            each(key, function (item) {

                items[item] = assets[item];
                api.ready(item, function() {
                    allLoaded(items) && one(callback);
                });

            });

            return api;
        }

        // make sure arguments are sane
        if (typeof key !== 'string' || !isFunction(callback)) {
            return api;
        }

        // This can also be called when we trigger events based on filenames & labels
        var asset = assets[key];

        // item already loaded --> execute and return
        if (asset && asset.state === LOADED || key === 'ALL' && allLoaded() && isDomReady) {
            one(callback);
            return api;
        }

        var arr = handlers[key];
        if (!arr) {
            arr = handlers[key] = [callback];
        }
        else {
            arr.push(callback);
        }

        return api;
    };


    // perform this when DOM is ready
    api.ready(doc, function () {

        if (allLoaded()) {
            each(handlers.ALL, function (callback) {
                one(callback);
            });
        }

        if (api.feature) {
            api.feature("domloaded", true);
        }
    });


    /* private functions
    *********************/
    function noop() {
        // does nothing
    }

    function each(arr, callback) {
        if (!arr) {
            return;
        }

        // arguments special type
        if (typeof arr === 'object') {
            arr = [].slice.call(arr);
        }

        // do the job
        for (var i = 0, l = arr.length; i < l; i++) {
            callback.call(arr, arr[i], i);
        }
    }

    /* A must read: http://bonsaiden.github.com/JavaScript-Garden
     ************************************************************/
    function is(type, obj) {
        var clas = Object.prototype.toString.call(obj).slice(8, -1);
        return obj !== undefined && obj !== null && clas === type;
    }

    function isFunction(item) {
        return is("Function", item);
    }

    function isArray(item) {
        return is("Array", item);
    }

    function toLabel(url) {
        ///<summary>Converts a url to a file label</summary>
        var items = url.split("/"),
             name = items[items.length - 1],
             i    = name.indexOf("?");

        return i !== -1 ? name.substring(0, i) : name;
    }

    // INFO: this look like a "im triggering callbacks all over the place, but only wanna run it one time function" ..should try to make everything work without it if possible
    // INFO: Even better. Look into promises/defered's like jQuery is doing
    function one(callback) {
        ///<summary>Execute a callback only once</summary>
        callback = callback || noop;

        if (callback._done) {
            return;
        }

        callback();
        callback._done = 1;
    }

    function getAsset(item) {
        ///<summary>
        /// Assets are in the form of
        /// { 
        ///     name : label,
        ///     url  : url,
        ///     state: state
        ///     async: boolean
        /// }
        ///</summary>
        var asset = {};

        if (typeof item === 'object') {
            var options = item['options'] || { };
            
            for (var label in item) {
                if (!!item[label] && label !== 'options') {
                    asset = {
                        name : label,
                        url  : item[label],
                        async: !!options['async']
                    };
                    
                    // Inline IF, if callback is present
                    isFunction(options['callback']) && api.ready(label, options['callback']);
                }
            }
        }
        else {
            asset = {
                name: toLabel(item),
                url : item
            };
        }

        // is the item already existant
        var existing = assets[asset.name];
        if (existing && existing.url === asset.url) {
            return existing;
        }

        assets[asset.name] = asset;
        return asset;
    }

    function allLoaded(items) {
        items = items || assets;

        for (var name in items) {
            if (items.hasOwnProperty(name) && items[name].state !== LOADED) {
                return false;
            }
        }
        
        return true;
    }


    function onPreload(asset) {
        asset.state = PRELOADED;

        each(asset.onpreload, function (afterPreload) {
            afterPreload.call();
        });
    }

    function preLoad(asset, callback) {
        if (asset.state === undefined) {

            asset.state     = PRELOADING;
            asset.onpreload = isFunction(callback) ? [callback] : [];

            loadAsset({ url: asset.url, type: 'cache' }, function () {
                onPreload(asset);
            });
        }
    }

    function load(asset, callback) {
        ///<summary>Used with normal loading logic</summary>
        callback = callback || noop;
        
        if (asset.state === LOADED) {
            callback();
            return;
        }

        // INFO: why would we trigger a ready event when its not really loaded yet ?
        if (asset.state === LOADING) {
            api.ready(asset.name, callback);
            return;
        }

        if (asset.state === PRELOADING) {
            asset.onpreload.push(function () {
                load(asset, callback);
            });
            return;
        }

        asset.state = LOADING;
        
        loadAsset(asset, function () {
            asset.state = LOADED;
            callback();

            // handlers for this asset
            each(handlers[asset.name], function (fn) {
                one(fn);
            });

            // dom is ready & no assets are queued for loading
            // INFO: shouldn't we be doing the same test above ?
            if (isDomReady && allLoaded()) {
                each(handlers.ALL, function (fn) {
                    one(fn);
                });
            }
        });
    }

    /* Parts inspired from: https://github.com/cujojs/curl
    ******************************************************/
    function loadAsset(asset, callback) {
        callback = callback || noop;

        var ele;
        if (/\.css[^\.]*$/.test(asset.url)) {
            ele      = doc.createElement('link');
            ele.type = 'text/' + (asset.type || 'css');
            ele.rel  = 'stylesheet';
            ele.href = asset.url;
        }
        else {
            ele      = doc.createElement('script');
            ele.type = 'text/' + (asset.type || 'javascript');
            ele.src  = asset.url;
        }

        ele.onload  = ele.onreadystatechange = process;
        ele.onerror = error;

        /* Good read, but doesn't give much hope !
         * http://blog.getify.com/on-script-loaders/
         * http://www.nczonline.net/blog/2010/12/21/thoughts-on-script-loaders/
         * https://hacks.mozilla.org/2009/06/defer/
         */

        // ASYNC: load in parellel and execute as soon as possible
        ele.async = !!asset.async;
        // DEFER: load in parallel but maintain execution order
        ele.defer = false;

        function error(event) {
            event = event || win.event;
            
            // need some more detailed error handling here

            // release event listeners
            ele.onload = ele.onreadystatechange = ele.onerror = null;
                        
            // do callback
            callback();
        }

        function process(event) {
            event = event || win.event;

            // IE 7/8 (2 events on 1st load)
            // 1) event.type = readystatechange, s.readyState = loading
            // 2) event.type = readystatechange, s.readyState = loaded

            // IE 7/8 (1 event on reload)
            // 1) event.type = readystatechange, s.readyState = complete 

            // event.type === 'readystatechange' && /loaded|complete/.test(s.readyState)

            // IE 9 (3 events on 1st load)
            // 1) event.type = readystatechange, s.readyState = loading
            // 2) event.type = readystatechange, s.readyState = loaded
            // 3) event.type = load            , s.readyState = loaded

            // IE 9 (2 events on reload)
            // 1) event.type = readystatechange, s.readyState = complete 
            // 2) event.type = load            , s.readyState = complete 

            // event.type === 'load'             && /loaded|complete/.test(s.readyState)
            // event.type === 'readystatechange' && /loaded|complete/.test(s.readyState)

            // IE 10 (3 events on 1st load)
            // 1) event.type = readystatechange, s.readyState = loading
            // 2) event.type = load            , s.readyState = complete
            // 3) event.type = readystatechange, s.readyState = loaded

            // IE 10 (3 events on reload)
            // 1) event.type = readystatechange, s.readyState = loaded
            // 2) event.type = load            , s.readyState = complete
            // 3) event.type = readystatechange, s.readyState = complete 

            // event.type === 'load'             && /loaded|complete/.test(s.readyState)
            // event.type === 'readystatechange' && /complete/.test(s.readyState)

            // Other Browsers (1 event on 1st load)
            // 1) event.type = load, s.readyState = undefined

            // Other Browsers (1 event on reload)
            // 1) event.type = load, s.readyState = undefined            

            // event.type == 'load' && s.readyState = undefined


            // !doc.documentMode is for IE6/7, IE8+ have documentMode
            if (event.type === 'load' || (/loaded|complete/.test(ele.readyState) && (!doc.documentMode || doc.documentMode < 9))) {
                // release event listeners               
                ele.onload = ele.onreadystatechange = ele.onerror = null;

                // do callback
                callback();
            }

            // emulates error on browsers that don't create an exception
            // INFO: timeout not clearing ..why ?
            //asset.timeout = win.setTimeout(function () {
            //    error({ type: "timeout" });
            //}, 3000);
        }

        // use insertBefore to keep IE from throwing Operation Aborted (thx Bryan Forbes!)
        var head = doc.head || doc.getElementsByTagName('head')[0];
        // but insert at end of head, because otherwise if it is a stylesheet, it will not ovverride values
        head.insertBefore(ele, head.lastChild);
    }
    

    /* Parts inspired from: https://github.com/jrburke/requirejs
    ************************************************************/
    function init() {
        var items =  doc.getElementsByTagName('script');
        
        //Look for a script with a data-head-init attribute
        for (var i = 0, l = items.length; i < l; i++) {
            var dataMain = items[0].getAttribute('data-head-init');
            if (!!dataMain) {
                api.load(dataMain);
                return;
            } 
        }
    }

    /* Mix of stuff from jQuery & IEContentLoaded
     * http://dev.w3.org/html5/spec/the-end.html#the-end
     ***************************************************/
    function domReady() {
        // Make sure body exists, at least, in case IE gets a little overzealous (jQuery ticket #5443).
        if (!doc.body) {
            // let's not get nasty by setting a timeout too small.. (loop mania guaranteed if assets are queued)
            win.clearTimeout(api.readyTimeout);
            api.readyTimeout = win.setTimeout(domReady, 50);
            return;
        }

        if (!isDomReady) {
            isDomReady = true;
            
            init();
            each(domWaiters, function (fn) {
                one(fn);
            });                        
        }
    }

    function domContentLoaded() {
        // W3C
        if (doc.addEventListener) {
            doc.removeEventListener("DOMContentLoaded", domContentLoaded, false);
            domReady();
        }

        // IE
        else if (doc.readyState === "complete") {
            // we're here because readyState === "complete" in oldIE
            // which is good enough for us to call the dom ready!            
            doc.detachEvent("onreadystatechange", domContentLoaded);
            domReady();
        }
    }

    // Catch cases where ready() is called after the browser event has already occurred.
    // we once tried to use readyState "interactive" here, but it caused issues like the one
    // discovered by ChrisS here: http://bugs.jquery.com/ticket/12282#comment:15    
    if (doc.readyState === "complete") {
        domReady();
    }

    // W3C
    else if (doc.addEventListener) {
        doc.addEventListener("DOMContentLoaded", domContentLoaded, false);

        // A fallback to window.onload, that will always work
        win.addEventListener("load", domReady, false);
    }

    // IE
    else {
        // Ensure firing before onload, maybe late but safe also for iframes
        doc.attachEvent("onreadystatechange", domContentLoaded);

        // A fallback to window.onload, that will always work
        win.attachEvent("onload", domReady);

        // If IE and not a frame
        // continually check to see if the document is ready
        var top = false;

        try {
            top = win.frameElement === null && doc.documentElement;
        } catch (e) { }

        if (top && top.doScroll) {
            (function doScrollCheck() {
                if (!isDomReady) {
                    try {
                        // Use the trick by Diego Perini
                        // http://javascript.nwbox.com/IEContentLoaded/
                        top.doScroll("left");
                    } catch (error) {
                        // let's not get nasty by setting a timeout too small.. (loop mania guaranteed if assets are queued)
                        win.clearTimeout(api.readyTimeout);
                        api.readyTimeout = win.setTimeout(doScrollCheck, 50);
                        return;
                    }

                    // and execute any waiting functions
                    domReady();
                }
            })();
        }
    }

    /*
        We wait for 300 ms before asset loading starts. for some reason this is needed
        to make sure assets are cached. Not sure why this happens yet. A case study:

        https://github.com/headjs/headjs/issues/closed#issue/83
    */
    setTimeout(function () {
        isHeadReady = true;
        each(queue, function (fn) {
            fn();
        });

    }, 300);

})(window);
