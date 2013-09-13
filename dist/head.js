///#source 1 1 /headjs/dist/head.core.js
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
                       //,{ chrome : { min: 8, max: 26 } }
                       //,{ ff     : { min: 3, max: 21 } }
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
        var re = new RegExp(" \\b" + name + "\\b");
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
        mobile = /mobile|android|kindle|silk|midp|(windows nt 6\.2.+arm|touch)/.test(ua);

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
                        if (conf.browserCss.gt)
                            pushClass("gt-" + key + v);

                        if (conf.browserCss.gte)
                            pushClass("gte-" + key + v);
                    }
                    
                    else if (version < v) {
                        if (conf.browserCss.lt)
                            pushClass("lt-" + key + v);
                        
                        if (conf.browserCss.lte)
                            pushClass("lte-" + key + v);
                    }

                    else if (version === v) {
                        if (conf.browserCss.lte)
                            pushClass("lte-" + key + v);
                        
                        if (conf.browserCss.eq)
                            pushClass("eq-" + key + v);

                        if (conf.browserCss.gte)
                            pushClass("gte-" + key + v);
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
                pushClass(this.slice(i, i + 1).join("-").toLowerCase() + conf.section);
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
                if (conf.screensCss.gt)
                    pushClass("gt-" + width);
                
                if (conf.screensCss.gte)
                    pushClass("gte-" + width);
            }

            else if (iw < width) {
                if (conf.screensCss.lt)
                    pushClass("lt-" + width);
                
                if (conf.screensCss.lte)
                    pushClass("lte-" + width);
            }

            else if (iw === width) {
                if (conf.screensCss.lte)
                    pushClass("lte-" + width);

                if (conf.screensCss.eq)
                    pushClass("e-q" + width);

                if (conf.screensCss.gte)
                    pushClass("gte-" + width);
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


///#source 1 1 /headjs/dist/head.css3.js
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
                       //,{ chrome : { min: 8, max: 26 } }
                       //,{ ff     : { min: 3, max: 21 } }
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
        var re = new RegExp(" \\b" + name + "\\b");
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
        mobile = /mobile|android|kindle|silk|midp|(windows nt 6\.2.+arm|touch)/.test(ua);

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
                        if (conf.browserCss.gt)
                            pushClass("gt-" + key + v);

                        if (conf.browserCss.gte)
                            pushClass("gte-" + key + v);
                    }
                    
                    else if (version < v) {
                        if (conf.browserCss.lt)
                            pushClass("lt-" + key + v);
                        
                        if (conf.browserCss.lte)
                            pushClass("lte-" + key + v);
                    }

                    else if (version === v) {
                        if (conf.browserCss.lte)
                            pushClass("lte-" + key + v);
                        
                        if (conf.browserCss.eq)
                            pushClass("eq-" + key + v);

                        if (conf.browserCss.gte)
                            pushClass("gte-" + key + v);
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
                pushClass(this.slice(i, i + 1).join("-").toLowerCase() + conf.section);
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
                if (conf.screensCss.gt)
                    pushClass("gt-" + width);
                
                if (conf.screensCss.gte)
                    pushClass("gte-" + width);
            }

            else if (iw < width) {
                if (conf.screensCss.lt)
                    pushClass("lt-" + width);
                
                if (conf.screensCss.lte)
                    pushClass("lte-" + width);
            }

            else if (iw === width) {
                if (conf.screensCss.lte)
                    pushClass("lte-" + width);

                if (conf.screensCss.eq)
                    pushClass("e-q" + width);

                if (conf.screensCss.gte)
                    pushClass("gte-" + width);
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
; (function (win, undefined) {
    "use strict";

    //#region Asynchronous Scheduling

    // Define the setImmediate method for our asynchronous scheduler (this is a copy from the "Promises, Promises..." library).
    // Ideally, we'd use a native implementation of setImmediate (https://dvcs.w3.org/hg/webperf/raw-file/tip/specs/setImmediate/Overview.html).
    // We prefer setImmediate if it's defined on the container (explicit), then the window (ambient), falling-back to a setTimeout wrapper.
    // This allows other, bundled or ambiently-present implementations of setImmediate to be leveraged (e.g. https://github.com/NobleJS/setImmediate).
    // The end result is that the callbacks here are executed as quickly (yet efficiently) as possible.
    ///<var name="setImmediate" type="Function">Schedules a method for execution at the next possible moment.</var>
    var setImmediate = win.setImmediate || function (c) { setTimeout(c, 0); };

    //#endregion

    //#region The Deferred and Promise implementation

    // Define the Promise and Deferred instances within the local asynchrony namespace.
    // We'll use these to represent and coordinate the script loading and fallback.
    var asynchrony = {};

    /*
        Promises, Promises...
        A light-weight implementation of the Promise/A+ specification (http://promises-aplus.github.io/promises-spec/) and an underlying deferred-execution (i.e. future) provider.
        This library is meant to provide core functionality required to leverage Promises / futures within larger libraries via bundling or otherwise inclusion within larger files.
    
        Author:     Mike McMahon
        Created:    September 5, 2013
    
        Version:    1.2
        Updated:    September 13, 2013
    
        Project homepage: http://promises.codeplex.com
    */

    /* License and copyright information (Ms-PL): http://promises.codeplex.com */
    (function (container, undefined) {
        /// <summary>
        ///     Initializes the types and functionality of the library within a container.
        ///     After execution, the container will contain two new types:
        ///         Promise
        ///         Deferred
        /// </summary>
        /// <param name="container" type="Object">The object to which the types of this library are attached.</param>
        /// <param name="undefined" type="Object">An instance of the browser 'undefined' object.</param>

        "use strict";

        //#region Utility Methods

        function isFunction(functionToCheck) {
            /// <summary>Determines whether a parameter represents a function.</summary>
            /// <param name="functionToCheck" type="Object">An object to examine.</param>
            /// <returns type="Boolean">Whether the object is a function.</returns>

            var getType = {};
            return functionToCheck && getType.toString.call(functionToCheck) === '[object Function]';
        }

        //#endregion

        //#region setImmediate

        // Define the setImmediate method for our asynchronous scheduler.
        // Ideally, we'd use a native implementation of setImmediate (https://dvcs.w3.org/hg/webperf/raw-file/tip/specs/setImmediate/Overview.html).
        // We prefer setImmediate if it's defined on the container (explicit), then the window (ambient), falling-back to a setTimeout wrapper.
        // This allows other, bundled or ambiently-present implementations of setImmediate to be leveraged (e.g. https://github.com/NobleJS/setImmediate).
        // The end result is that the callbacks here are executed as quickly (yet efficiently) as possible.
        ///<var name="setImmediate" type="Function">Schedules a method for execution at the next possible moment.</var>
        var setImmediate = container.setImmediate || window.setImmediate || function (c) { setTimeout(c, 0); };

        //#endregion

        //#region The Promise type

        function Promise(thenMethod) {
            /// <summary>
            /// A Promise or future - as defined by the Promise/A+ specification (http://promises-aplus.github.io/promises-spec/) - which represents a value that may not yet be available.
            /// Each new instance wraps an existing Deferred object to expose only the Promise/A functionality, preventing modification of the underlying Deferred.
            /// </summary>
            /// <param name="thenMethod" type="Function([onFulfilled], [onRejected])">A method that fulfills the requirements of the Promise/A+ "then" method.</param>

            /// <field name="then" type="Function([success], [failure])">Registers a continuation for this promise using the specified functions, both of which are optional.</field>
            this.then = thenMethod;
        }

        //#endregion

        //#region The private InnerDeferred type

        // Define an inner Deferred object that we use to represent the internal functionality, hiding internal implementation details.
        function InnerDeferred() {
            /// <summary>
            /// Represents a future - an operation that will complete in the future, optionally producing a result.
            /// The creator of a Deferred may resolve it if it successfully completes, or reject it if an error occurs.
            /// A Deferred implements the Promise class, supporting the attachment of an arbitrary number of fulfilled and / or rejected callbacks via the "then" method.
            /// These callbacks are invoked (as appropriate) when the Deferred is either fulfilled or rejected - no order is guaranteed.
            /// This internal representation stores its necessary internal data, allowing the methods to be defined on the prototype.
            /// </summary>

            // Initialize the state of the Deferred.
            /// <field name="state" type="Number">The state of the deferred object.</field>
            this.state = Deferred.States.Pending;

            /// <field name="resultData" type="Object">Any result data associated with this instance, whether for fulfillment or rejection.</field>
            this.resultData;

            /// <field name="fulfilledContinuations" type="Array" elementType="Function">The list of continuation methods to be executed when this instance is fulfilled.</field>
            this.fulfilledContinuations = [];

            /// <field name="rejectedContinuations" type="Array" elementType="Function">The list of continuation methods to be executed when this instance is rejected.</field>
            this.rejectedContinuations = [];
        }

        InnerDeferred.prototype.reject = function (data) {
            /// <summary>Resolves this Deferred as having been rejected, passing an optional result value.</summary>
            /// <param name="result" type="Object">Any data to be passed as the result of this Deferred to its rejection handlers.</param>

            if (this.state === Deferred.States.Pending) {
                this.state = Deferred.States.Rejected;
                this.resultData = data;

                // Execute the failure callbacks.
                while (this.rejectedContinuations.length > 0) {
                    this.rejectedContinuations.shift()(this.resultData);
                }

                // Clear the fulfillment continuations.
                this.fulfilledContinuations = null;
            }
        };

        InnerDeferred.prototype.fulfill = function (result) {
            /// <summary>Resolves this Deferred as having been fulfilled, passing an optional result value.</summary>
            /// <param name="result" type="Object">Any data to be passed as the result of this Deferred to its fulfillment handlers.</param>

            if (this.state === Deferred.States.Pending) {
                this.state = Deferred.States.Fulfilled;
                this.resultData = result;

                // Execute the fulfillment callbacks.
                while (this.fulfilledContinuations.length > 0) {
                    this.fulfilledContinuations.shift()(this.resultData);
                }

                // Clear out the rejection continuations.
                this.rejectedContinuations = null;
            }
        };

        InnerDeferred.prototype.then = function (onFulfilled, onRejected) {
            /// <summary>Registers a continuation for this promise using the specified handlers, both of which are optional, following the Promises/A+ specification.</summary>
            /// <param name="onFulfilled" type="function">A method that is executed if this promise is resolved successfully, accepting the result of the promise (if any) as a parameter.</param>
            /// <param name="onRejected" type="function">A method that is executed if this promise is resolved unsuccessfully (i.e. rejected), accepting the result of the promise (if any) as a parameter.</param>
            /// <returns type="Promise">A Promise with the characteristics defined by the Promises/A+ specification. If neither onFulfilled nor onRejected are valid functions, this method returns the current Promise; otherwise, a new Promise is returned.</returns>

            // If we aren't passed any valid callbacks, just return the current Promise to save on allocations.
            if (!isFunction(onFulfilled) && !isFunction(onRejected)) {
                return this;
            }

            // Per the Promise/A specification:
            //  This function should return a new promise that is fulfilled when the given success or failure callback is finished.
            //  This allows promise operations to be chained together.
            //  The value returned from the callback handler is the fulfillment value for the returned promise. If the callback throws an error, the returned promise will be moved to failed state. 
            var continuation = new Deferred();

            // If we have no valid onFulfilled method, use the fulfill method of the Deferred to allow chaining.
            if (!isFunction(onFulfilled)) {
                onFulfilled = continuation.fulfill;
            }

            // If we have no valid onRejected method, use the reject method of the Deferred to allow chaining.
            if (!isFunction(onRejected)) {
                onRejected = continuation.reject;
            }

            // Define the action to take upon successful resolution, wrapping the success handler within the continuation appropriately.
            var successHandler = function (successData) {

                // Queue the execution.
                setImmediate(function () {
                    var continuationResult;

                    // Try to get the result to pass to the continuation from the handler.
                    try {
                        // Resolve the continuation, passing the return value from the success handler.
                        var fulfilledData = onFulfilled(successData);

                        // If the return value is a Promise, we have to assume its value.
                        // Otherwise, we just fulfill the continuation.
                        if (!!fulfilledData && isFunction(fulfilledData.then)) {

                            // The return value is a Promsie, so, per the specification, we require the returned Promise to assume its value.
                            fulfilledData.then(continuation.fulfill, continuation.reject);
                        }
                        else {

                            // Fulfill the continaution.
                            continuation.fulfill(fulfilledData);
                        }
                    }
                    catch (failureHandlerError) {
                        // The failure handler threw an error, so we fail the continuation and pass it the exception as data.
                        continuation.reject(failureHandlerError);
                    }
                });
            };

            // Take appropriate action based upon whether this operation has already been resolved.
            if (this.state === Deferred.States.Fulfilled) {
                // Invoke the handler, sending in the completion data.
                successHandler(this.resultData);
            }
            else if (this.state === Deferred.States.Pending) {
                // The operation hasn't been resolved, so we queue it up.
                this.fulfilledContinuations.push(successHandler);
            }


            // Define the action to take when the Deferred fails, wrapping the success handler appropriately.
            var failureHandler = function (failureData) {

                // Queue the execution.
                setImmediate(function () {
                    var continuationResult;

                    // Try to get the result to pass to the continuation from the handler.
                    try {
                        // Resolve the continuation, passing the return value from the success handler.
                        var rejectionResult = onRejected(failureData);

                        // If the return value is a Promise, we have to assume its value.
                        // Otherwise, we just fulfill the continuation.
                        if (!!rejectionResult && isFunction(rejectionResult.then)) {

                            // The return value is a Promise, so, per the specification, we require the returned Promise to assume its value.
                            rejectionResult.then(continuation.fulfill, continuation.reject);
                        }
                        else {

                            // Reject the continuation.
                            continuation.reject(rejectionResult);
                        }
                    }
                    catch (failureHandlerError) {
                        // The failure handler threw an error, so we reject the continuation and pass it the exception as data.
                        continuation.reject(failureHandlerError);
                    }
                });
            };

            // Take appropriate action based upon whether this operation has already been resolved.
            if (this.state === Deferred.States.Rejected) {
                // Invoke the handler, sending in the completion data.
                failureHandler(this.resultData);
            }
            else if (this.state === Deferred.States.Pending) {
                // The operation hasn't been resolved, so we queue it up.
                this.rejectedContinuations.push(failureHandler);
            }

            // Return the promise object for the continuation.
            return continuation.promise();
        };

        //#endregion

        //#region The Deferred type

        //#region Deferred

        // Define the constructor for the exposed object.
        function Deferred() {
            /// <summary>
            /// Represents a future - an operation that will complete in the future, optionally producing a result.
            /// The creator of a Deferred may resolve it if it successfully completes, or reject it if an error occurs.
            /// A Deferred implements the Promise class, supporting the attachment of an arbitrary number of success and / or error callbacks via the "then" method.
            /// These callbacks are invoked (as appropriate) when the Deferred is either resolved or rejected.
            /// </summary>

            // Initialize the Deferred using an InnerDeferred, which defines all the operations and contains all the state.
            // This wrapper simply exposes selective pieces of it.
            var inner = new InnerDeferred();

            this.getState = function () {
                /// <summary>
                /// Gets the state of this Deferred.
                /// </summary>
                /// <returns type="Number">A value from the Deferred.States enumeration.</returns>

                return inner.state;
            };

            this.promise = function () {
                /// <summary>
                /// Returns a Promise that wraps this instance, exposing only the "then" method.
                /// </summary>
                /// <returns type="Promise">A Promise that represents this deferred.</returns>

                return new Promise(this.then);
            };

            this.reject = function (data) {
                /// <summary>Resolves this Deferred as having failed, passing an optional result.</summary>
                /// <param name="result" type="Object">Any data to be passed as the result of this Deferred to its failure handlers.</param>

                inner.reject(data);
            }

            this.fulfill = function (result) {
                /// <summary>Resolves this Deferred as having completed successfully, passing an optional result.</summary>
                /// <param name="result" type="Object">Any data to be passed as the result of this Deferred to its success handlers.</param>

                inner.fulfill(result);
            }

            this.then = function (onFulfilled, onRejected) {
                /// <summary>Registers a continuation for this promise using the specified handlers, both of which are optional.</summary>
                /// <param name="onFulfilled" type="function">A method that is executed if this promise is fulfilled (i.e. completes successfully), accepting the result of the promise (if any) as a parameter.</param>
                /// <param name="onRejected" type="function">A method that is executed if this promise is rejected (i.e. completes with an error), accepting the result of the promise (if any) as a parameter.</param>
                /// <returns type="Promise">A continuation of this Promise that is resolved when either the success or failure handler is done executing.</returns>

                return inner.then(onFulfilled, onRejected);
            }
        }

        //#endregion

        //#region Enumerations

        /// <var type="Object">Possible states of a Deferred.</var>
        Deferred.States = {

            /// <field name="Pending" static="true">Awaiting completion (i.e. neither resolved nor rejected).</field>
            Pending: 0,

            /// <field name="Fulfilled" static="true">Completed successfully (i.e. success).</field>
            Fulfilled: 1,

            /// <field name="Rejected" static="true">Completed erroneously (i.e. failure).</field>
            Rejected: 2
        };

        //#endregion

        //#endregion

        //#region Promise enhancements

        // Enhance the Promise type with (effectively) extension methods that leverage the Deferred.

        //#region Static Members

        Promise.rejected = (function () {
            /// <summary>Creates a single instance of a Promise that has been rejected (i.e. completed with an error).</summary>
            /// <returns type="Promise">A Promise that has been rejected (i.e. completed with an error).</returns>

            // Resolve a Deferred to represent a failed one, returning it.
            var completed = new Deferred();
            completed.reject();
            return completed.promise();
        }());

        /// <field name="never" type="Promise">A Promise that will never be completed.</field>
        Promise.never = new Promise(function () {

            // We ignore any parameters since they'll never be executed and we don't need memory consumption to grow unnecessarily.
            // To ensure we return a proper PRomise, we return this Promise.never instance.
            return Promise.never;
        });

        Promise.fulfilled = (function () {
            /// <summary>Creates a single instance of a fulfilled (i.e. successfully-resolved) Promise.</summary>
            /// <returns type="Promise">A Promise that has been fulfilled.</returns>

            // Resolve a Deferred to represent a completed one, returning it.
            var completed = new Deferred();
            completed.fulfill();
            return completed.promise();
        }());

        //#endregion

        //#region Static Methods

        Promise.whenAll = function (promises) {
            /// <summary>
            /// Creates a Promise that is fulfilled when all the specified Promises are fulfilled, or rejected when one of the Promises is rejected.
            /// </summary>
            /// <param name="promises" type="Array" elementType="Promise">A set of promises to represent.</param>
            /// <returns type="Promise">A Promise that is fulfilled when all the specified Promises are fulfilled, or rejected when one of the Promises is rejected.</returns>

            // Take action depending upon the number of Promises passed.
            if (promises.length == 0) {

                // There are no arguments, so we return a completed Promise.
                return Promise.fulfilled;
            }
            else if (promises.length == 1) {

                // There's only one Promise, so return it.
                return promises[0];
            }
            else {

                // Create a new Deferred to represent the entire process.
                var whenAll = new Deferred();

                // Wire into each Promise, counting them as they complete.
                // We count manually to filter out any odd, null entries.
                var pendingPromises = 0;

                for (var i = 0; i < promises.length; i++) {
                    var promise = promises[i];

                    // Increment the total count and store the promise, then wire-up the promise.
                    pendingPromises++;

                    promise.then(function () {

                        // Completed successfully, so decrement the count.
                        pendingPromises--;

                        // If this is the last promise, resolve it, passing the promises.
                        // If a failure occurred already, this will have no effect.
                        if (pendingPromises == 0) {
                            whenAll.fulfill();
                        }
                    },
                    function (data) {

                        // A failure occurred, so decrement the count and reject the Deferred, passing the error / data that caused the rejection.
                        // A single failure will cause the whole set to fail.
                        pendingPromises--;
                        whenAll.reject(data);
                    });
                }

                // Return the promise.
                return whenAll.promise();
            }
        };

        //#endregion

        //#endregion

        // Assign the Promise and Deferred objects to the namespace.
        container.Deferred = Deferred;
        container.Promise = Promise;

    }(asynchrony));

    // Expose the asynchrony classes to the rest of this instance.
    var Deferred = asynchrony.Deferred,
        Promise = asynchrony.Promise;

    //#endregion

    //#region The Asset type

    var Asset = (function () {

        // Define the Asset type and constructor.
        function Asset(name, sources) {
            /// <summary>
            /// A named asset to be loaded.
            /// </summary>
            /// <param name="name" type="String">The name of the Asset.</param>
            /// <param name="sources" type="Array" elementType="String">The orderrd list of sources for the asset.</param>
            /// <field name="name" type="String">The name of the asset.</field>
            /// <field name="location" type="String">The location from which the asset was loaded.</field>
            /// <field name="sources" type="Array" elementType="String">The ordered list of locations from which the asset can be loaded.</field>
            /// <field name="loadTest" type="Function">A predicate that verifies whether the asset has been loaded (for older browsers).</field>

            // Store the values.
            this.name = name;
            this.sources = [];

            // Iterate through the sources provided, splitting out any test predicate from any source addresses.
            var filteredSources = [],
                extractedLoadTest;
            each(sources, function (s) {
                if (isFunction(s)) {
                    extractedLoadTest = s;
                }
                else {
                    filteredSources.push(s);
                }
            });

            this.loadTest = extractedLoadTest || resourceLoaded;
            this.sources = filteredSources;

            // Initialize the location and state.
            this.location = null;
            this.state = 0;

            // Initialize the Promise functionality of the asset.
            // We add the "then" method to allow the Asset to act like a Promise.
            this.deferred = new Deferred();
            this.then = this.deferred.then;

            // Initialize the cache elements we may create.
            this.cacheElements = [];
        }

        // Define a resource-loaded test that always returns a loaded status.
        // This provides a good default implementation.
        function resourceLoaded() {
            return true;
        }

        // Define the states.
        Asset.States = {
            UNLOADED: 0,
            LOADING: 1,
            LOADED: 2,
            FAILED: 3
        };

        //#region Utilities

        function appendElementToHead(element) {

            // use insertBefore to keep IE from throwing Operation Aborted (thx Bryan Forbes!)
            var head = doc.head || doc.getElementsByTagName('head')[0];
            // but insert at end of head, because otherwise if it is a stylesheet, it will not ovverride values
            head.insertBefore(element, head.lastChild);
        }

        function determineResourceMimeType(resource) {
            /// <summary>
            /// Determines the MIME type of a resource via its extension.
            /// </summary>
            /// <param name="resource" type="String">The URI of a resource.</param>
            /// <returns type="String">The MIME type of the resource.</returns>

            // If it is CSS, return that MIME type; otherwise, default to JavaScript.
            if (/\.css[^\.]*$/.test(resource)) {
                return 'text/css';
            }
            else {
                return 'text/javascript';
            }
        }

        function createResourceElement(location, onLoadHandler, onReadyStateChangeHandler, errorHandler) {

            // Create an element appropriate to the location.
            var ele = null,
                type = determineResourceMimeType(location);
            if (type === 'text/css') {
                ele = doc.createElement('link');
                ele.type = type;
                ele.rel = 'stylesheet';
                ele.onload = onLoadHandler;
                ele.onreadystatechange = onReadyStateChangeHandler;
                ele.onerror = errorHandler;
                ele.href = location;
            }
            else {
                ele = doc.createElement('script');
                ele.type = type;
                ele.onload = onLoadHandler;
                ele.onreadystatechange = onReadyStateChangeHandler;
                ele.onerror = errorHandler;
                ele.src = location;
            }

            // If the element supports asynchronous operation, enable it explicitly (for older browsers).
            if (ele.async !== undefined) {
                ele.async = true;
            }

            // Return the element.
            return ele;
        }

        function loadAssetAsync(location, test) {
            /// <summary>Loads an asset into the DOM asynchronously.</summary>
            /// <param name="asset" type="String">The location of the asset to load.</param>
            /// <param name="test" type="Function">An optional predicate function used to test whether the asset has been loaded on older browsers.</param>
            /// <returns type="Promise">A Promise that represents the operation.</returns>

            // Represent the process as a Deferred.
            var assetDeferred = new Deferred();

            // Queue-up the addition of the element to the DOM.
            // Not only is this consistent with the normal use of deferred objects, but queuing the change helps to ensure the DOM isn't modified too terribly much all at once, causing browser confusion and missed events.
            setImmediate(function () {

                var ele;

                // Define the methods we use to handle changes in the DOM element state, translating them into Deferred state changes.
                function error(event) {
                    event = event || win.event;

                    // release event listeners
                    ele.onload = ele.onreadystatechange = ele.onerror = null;

                    // Remove the element from the DOM since it failed.
                    // This is optional, but it keeps the DOM tidy.
                    ele.parentElement.removeChild(ele);

                    // Reject the Deferred, passing the event.
                    assetDeferred.reject(event);
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

                        // The browser says that the asset is loaded, but if the browser was too old, it wouldn't report an error.
                        // Therefore, if the browser doesn't support proper errors, run any load test for the asset.
                        // If it fails, run the error handler.
                        // Otherwise, assume everything went to plan.
                        if (!test()) {

                            // Fail the Deferred since the test failed.
                            error(event);
                        }
                        else {

                            // Resolve the Deferred.
                            assetDeferred.fulfill();
                        }
                    }

                    // emulates error on browsers that don't create an exception
                    // INFO: timeout not clearing ..why ?
                    //asset.timeout = win.setTimeout(function () {
                    //    error({ type: "timeout" });
                    //}, 3000);
                }

                // Now configure the element with a source and event handlers.
                ele = createResourceElement(location, process, process, error);

                // ASYNC: load in parallel and execute as soon as possible
                //ele.async = true;
                // DEFER: load in parallel but maintain execution order
                //ele.defer = false;

                // Add the element to the page.
                appendElementToHead(ele);

            });

            // Return the promise of the Deferred.
            return assetDeferred.promise();
        }

        //#endregion

        Asset.prototype.loadAsync = function () {
            /// <summary>
            /// Loads an asset asynchronously.
            /// This initiates the single loading attempt that can be made on an asset.
            /// </summary>
            /// <returns type="Promise">The Promise that represents the act of loading the asset.</returns>

            // If the asset is already loading, just return the promise (which is the asset).
            // If we have no sources, we also do nothing and just return the promise.
            if ((this.state !== Asset.States.UNLOADED) || (this.sources.length == 0)) {
                return this;
            }

            // Define our actions and track our index.
            var currentSourceIndex = -1,    // Start at -1 so that we can use the failure handler.
                self = this,    // Keep a reference to this instance.
                assetLoaded,
                assetFailed;

            // Define handlers.
            assetLoaded = function () {
                // We succeeded, so set the final properties and resolve the Deferred of the instance.
                self.state = Asset.States.LOADED;
                self.location = self.sources[currentSourceIndex];
                self.deferred.fulfill();
            };

            // We define the failure handler recursively so that we can self terminate and start with a call to it.
            assetFailed = function () {

                // Increment the index.
                currentSourceIndex++;

                // If we have another asset to try, do so.
                // Otherwise, reject the Deferred.
                if (currentSourceIndex < self.sources.length) {

                    // Try the next source, wiring-up the continuation.
                    loadAssetAsync(self.sources[currentSourceIndex], self.loadTest).then(assetLoaded, assetFailed);
                }
                else {

                    // There's nothing else to try, so reject the deferred.
                    self.state = Asset.States.FAILED;
                    self.deferred.reject();
                }
            };


            // Indicate that we've entered the loading state, then start loading with a call to the failed handler.
            self.state = Asset.States.LOADING;
            assetFailed();

            // Return this instance as the Promise.
            return this;
        };

        Asset.prototype.cacheAsync = function () {
            /// <summary>
            /// Attempts to asynchronously cache the asset locally by loading all available sources into the browser cache.
            /// This is not guaranteed to complete or raise normal events, which is why no return value is provided.
            /// Caching resources is a best-effort browser hack that shouldn't be used, but this may help older browsers, so it's included.
            /// </summary>

            // Queue-up the addition of these elements to the DOM asynchronously.
            // We have no interest in the outcome.
            var myself = this;
            setImmediate(function () {

                // If an element has already been created or we have no sources, do nothing.
                if ((myself.cacheElements.length > 0) || (myself.state !== Asset.States.UNLOADED)) {
                    return;
                }

                // Create an element, overriding its type to cause caching.
                // This is a silly hack, but it works on lots of older browsers (I'm morally opposed to its existence, not its efficacy).
                // The goal isn't to provide knowledge when a cached item has been loaded, but to try to pre-load it by using an invalid type, which we can switch to a valid type later.
                // When we switch to the valid type, we should get normal events, but the content will have been cached.
                // We perform this caching for all potential sources.

                for (var i = 0; i < myself.sources.length; i++) {

                    // Create a new element.
                    var e = createResourceElement(myself.sources[i], null, null, null);

                    // Override its MIME type.
                    e.type = 'text/cache';

                    // Add it to the DOM and our array.
                    appendElementToHead(e);
                    myself.cacheElements.push(e);
                }

                // Wire-up a continuation that cleans up cached elements from the DOM.
                var cleanup = function (elements) {

                    // Iterate through each element, removing them from the DOM.
                    while (myself.cacheElements.length > 0) {
                        var ele = myself.cacheElements.shift();
                        ele.parentElement.removeChild(ele);
                    }
                }

                myself.then(cleanup, cleanup);
            });
        };

        // Return the Asset itself, which is also a Promise.
        return Asset;
    }());

    //#endregion

    //#region Initialization

    function initializeDOMReadiness(win, doc) {
        /// <summary>Initializes DOM readiness tracking.</summary>
        /// <param name="win" type="Window">The containing window.</param>
        /// <param name="doc" type="Document">The document contained within the window.</param>
        /// <returns type="Promise">A Promise that represents when the DOM is ready.</returns>


        // Create a Deferred to represent the process.
        var domReadiness = new Deferred(),
            domReadyTimeout;

        /* Mix of stuff from jQuery & IEContentLoaded
         * http://dev.w3.org/html5/spec/the-end.html#the-end
         ***************************************************/
        function domReady() {
            // Make sure body exists, at least, in case IE gets a little overzealous (jQuery ticket #5443).
            if (!doc.body) {
                // let's not get nasty by setting a timeout too small.. (loop mania guaranteed if assets are queued)
                win.clearTimeout(domReadyTimeout);
                domReadyTimeout = win.setTimeout(domReady, 50);
                return;
            }

            // The DOM is ready, so resolve the deferred.
            domReadiness.fulfill();
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
                top = win.frameElement == null && doc.documentElement;
            } catch (e) { }

            if (top && top.doScroll) {
                (function doScrollCheck() {
                    if (domReadiness.getState() === Deferred.States.Pending) {
                        try {
                            // Use the trick by Diego Perini
                            // http://javascript.nwbox.com/IEContentLoaded/
                            top.doScroll("left");
                        } catch (error) {
                            // let's not get nasty by setting a timeout too small.. (loop mania guaranteed if assets are queued)
                            win.clearTimeout(domReadyTimeout);
                            domReadyTimeout = win.setTimeout(doScrollCheck, 50);
                            return;
                        }

                        // and execute any waiting functions
                        domReady();
                    }
                })();
            }
        }

        // Return the Promise of the Deferred.
        return domReadiness.promise();
    }

    function initializeHeadReadiness(domReady) {
        /// <summary>Initializes document head readiness tracking.</summary>
        /// <param name="domReady" type="Promise">The Promise that represents DOM readiness.</param>
        /// <returns type="Promise">A Promise that represents when the document head is ready.</returns>

        // Create a Deferred to represent the process.
        var headReady = new Deferred();

        /*
            We wait for 300 ms before asset loading starts. for some reason this is needed
            to make sure assets are cached. Not sure why this happens yet. A case study:
    
            https://github.com/headjs/headjs/issues/closed#issue/83
        */
        setTimeout(headReady.fulfill, 300);

        // We also resolve the head readiness early if the DOM reports as loaded.
        domReady.then(headReady.fulfill, headReady.reject);

        // Return the Promise.
        return headReady.promise();
    }

    //#endregion

    //#region Load Methods

    function loadAssets(items) {

        // Track the assets that we start loading.
        var loadingAssets = [];

        each(items, function (item, i) {
            if (!isFunction(item)) {

                // Get / parse the asset, adding it to our list.
                item = getAsset(item);
                loadingAssets.push(item);

                // Load the item.
                item.loadAsync();
            }
        });

        // Return the list of assets we're loading.
        return loadingAssets;
    }

    function preLoadAssets(items) {

        // Track the assets that we load.
        var loadingAssets = [];

        /* Preload with text/cache hack (not good!)
         * http://blog.getify.com/on-script-loaders/
         * http://www.nczonline.net/blog/2010/12/21/thoughts-on-script-loaders/
         * If caching is not configured correctly on the server, then items could load twice !
         *************************************************************************************/

        // Iterate through the arguments, pre-loading, then loading each one.
        each(items, function (userItem, i) {
            if (!isFunction(userItem)) {

                // Get / parse the asset, which adds it to the global list.
                var item = getAsset(userItem);

                // Initiate pre-loading of the asset, which is a best-effort feature.
                item.cacheAsync();

                // The dependencies for this item / asset are all prior scripts that have been queued.
                // When the predecessors complete, we try to load the actual item.
                // The test for the item will determine the final state since the preLoadAsset method will have actually loaded the asset.
                var dependencies = loadingAssets.slice();
                Promise.whenAll(dependencies).then(function () { item.loadAsync(); });

                // Add the actual (i.e. final) asset to the list.
                loadingAssets.push(item);
            }
        });

        // Return the list of assets we're loading.
        return loadingAssets;
    }

    //#endregion

    var doc = win.document,
        assets = {}, // loadable items in various states
        isAsync = "async" in doc.createElement("script") || "MozAppearance" in doc.documentElement.style || win.opera,

        // Promises about the document, used for synchronization and sequencing.
        domReady = initializeDOMReadiness(win, doc),
        headReady = initializeHeadReadiness(domReady),

        /*** public API ***/
        headVar = win.head_conf && win.head_conf.head || "head",
        api = win[headVar] = (win[headVar] || function () { api.ready.apply(null, arguments); });

    //#region Exposed API methods and types

    // Expose the Promise mechanisms for reuse.
    api.Deferred = Deferred;
    api.Promise = Promise;

    api.load = function () {
        ///<summary>
        /// INFO: use cases
        ///    head.load("http://domain.com/file.js","http://domain.com/file.js", callBack)
        ///    head.load({ label1: "http://domain.com/file.js" }, { label2: "http://domain.com/file.js" }, callBack)
        ///    
        ///    Multiple sources (i.e. automatic fallback locations)
        ///    head.load({ label1: ["http://source1.com/file.js", "http://source2.com/file.js", "http://source3.com/file.js"] }, { label2:  ["http://source1.com/file.js", "http://source2.com/file.js", "http://source3.com/file.js"] }, callBack)
        ///    
        ///    Multiple sources (i.e. automatic fallback locations), including a load test that supports load detection on older browsers.
        ///    head.load({ label1: ["http://source1.com/file.js", "http://source2.com/file.js", "http://source3.com/file.js", function(){return <something that indicates the file was loaded>;}] }, { label2:  ["http://source1.com/jQuery.js", "http://source2.com/jQuery.js", "http://source3.com/jQuery.js", function(){ return !!window.jQuery;}] }, callBack)
        ///</summary> 
        var args = arguments,
             callback = args[args.length - 1],
            allDone;

        if (!isFunction(callback)) {
            callback = null;
        }

        // Take action depending upon whether the browser supports asynchronous script loading.
        if (isAsync) {
            // Method 1: simply load and let browser take care of ordering
            var loadedItems = loadAssets(args);

            // When all the items are loaded, run the callback, if there is one.
            allDone = Promise.whenAll(loadedItems);
            if (callback) {
                allDone.then(callback);
            }
        }
        else {
            // Method 2: preload with text/cache hack.
            // This has to wait until the head is ready (supposedly).
            var queuedArgs = args;
            allDone = headReady.then(function () {
                var loadedItems = preLoadAssets(queuedArgs);

                // When all the items are loaded, run the callback, if there is one.
                var done = Promise.whenAll(loadedItems);
                if (callback) {
                    done.then(callback);
                }
                return done;
            });
        }

        return createApiPromise(allDone);
    };

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
        ///</summary>

        // DOM ready check: head.ready(document, function() { });
        if (key === doc) {
            // Add the callback as a continuation of DOM readiness.
            domReady.then(callback);

            return createApiPromise(domReady);
        }

        // shift arguments
        if (isFunction(key)) {
            callback = key;
            key = "ALL";
        }

        // make sure arguments are sane
        if (typeof key !== 'string' || !isFunction(callback)) {
            return api;
        }

        // This can also be called when we trigger events based on filenames & labels
        var asset = assets[key];

        // If the key is "All", run the callback when everything is loaded.
        if (key === 'ALL') {

            // When the DOM is ready, look for any pending assets.
            var r = domReady.then(function () {

                // Build the array of pending assets.
                var pending = [];
                for (var asset in assets) {
                    if (asset.state < Asset.States.LOADED) {
                        pending.push(asset);
                    }
                }

                // When they're all complete, run the callback.
                var allReady = Promise.whenAll(pending);
                allReady.then(callback);
                return allReady;
            });

            return createApiPromise(r);
        }
        else if (asset) {

            // This referenced a specific asset, so run th callback when it's loaded.
            asset.then(callback);
            return createApiPromise(asset);
        }

        // This is a name for an asset we haven't yet defined, so we create an asset with this name, associating the callback.
        // The idea is that the sources will be defined later.
        var placeholder = new Asset(key, []);
        placeholder.then(callback);

        // Add the placeholder to the assets list.
        assets[placeholder.name] = placeholder;

        return createApiPromise(placeholder);
    };
    api.when = function (keys) {

        if (isArray(keys)) {

            // Iterate through all the keys, obtaining the Promise for each and storing it in a list.
            var assets = [];
            each(keys, function (k) {
                var a = api.ready(k);
                if (!!a.then) {
                    assets.push(a);
                }
            });

            // Return the Promise that's fulfilled when all the assets have loaded.
            return Promise.whenAll(assets);
        }
        else {

            // It's not an array, so we assume it's a single value
            return api.ready(keys);
        }
    };

    // perform this when DOM is ready
    api.ready(doc, function () {

        if (api.feature) {
            api.feature("domloaded", true);
        }
    });

    //#endregion

    //#region General Utilities

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

    function arrayContains(arr, item) {

        // If the browser supports indexOf, use that.
        // Otherwise, use a loop (for IE < 9).
        if (!!Array.indexOf) {
            return arr.indexOf(item) > -1;
        }
        else {
            for (var i = 0; i < arr.length; i++) {
                if (arr[i] === item) {

                    // We found the item, so return true.
                    return true;
                }

            }
            // It wasn't found, so return false.
            return false;
        }
    }

    //#endregion

    //#region Asset Utilities

    function toLabel(url) {
        ///<summary>Converts a url to a file label</summary>
        var items = url.split("/"),
             name = items[items.length - 1],
             i = name.indexOf("?");

        return i !== -1 ? name.substring(0, i) : name;
    }

    function getAsset(item) {
        ///<summary>
        /// Parses a generic item into an Asset, adding it to the global collection if it is new or returning an existing item if a match exists.
        ///</summary>
        /// <returns type="Object">The asset represented by the item.</returns>
        var asset;

        if (typeof item === 'object') {
            for (var label in item) {
                if (!!item[label]) {
                    asset = new Asset(label, isArray(item[label]) ? item[label] : [item[label]]);
                }
            }
        }
        else {
            var sources = isArray(item) ? item : [item];
            asset = new Asset(toLabel(sources[0]), sources);
        }

        // Check for an existing asset, starting by name.
        /// <var typr="Asset">An existing asset, if any.</var>
        var existing = assets[asset.name];
        if (existing) {

            // There's a name match.
            // If the existing entry has no sources, use the new asset sources.
            // The theory is that the existing entry is a placeholder and this new asset fills-in the sources.
            if (existing.sources.length === 0) {
                existing.sources = asset.sources;
                existing.loadTest = asset.loadTest;
            }

            // Return the existing Asset.
            return existing;
        }

        // Check for a match by comparing sources.
        for (var existingAsset in assets) {
            each(asset.sources, function (source) {
                existing = assets[existingAsset];
                if (arrayContains(existing.sources, source)) {

                    // We found an existing asset for the same resource, but the name is different.
                    // Add this new asset to the collection, but leverage the existing entry such that this asset resolves when the existing one does.
                    // Share the deferred of the 
                    asset.deferred = existing.deferred;
                    asset.state = existing.state;
                    asset.then = existing.then;

                    // Create a method to synchronize the final state of this asset when the other completes, applying it.
                    var syncState = function () {
                        asset.state = existing.state;
                    };
                    asset.then(syncState, syncState);

                    // Store and return the new asset.
                    assets[asset.name] = asset;
                    return asset;
                }
            });
        }

        // This is a new asset, so add it and return it.
        assets[asset.name] = asset;
        return asset;
    }

    //#endregion

    //#region API Utilities

    function createApiPromise(promise) {
        /// <summary>
        /// Creates a new instance of an object that represents the current API and a specified Promise.
        /// This allows the API to support chaining and to act as a Promise.
        /// </summary>
        /// <param name="promise" type="Promise">A Promise to merge with the API object.</param>
        /// <returns type="Object">a new instance of an object that represents the current API and a specified Promise.</returns>
        return {
            load: api.load,
            js: api.js,
            test: api.js,
            ready: api.ready,
            when: api.when,
            then: promise.then
        };
    }

    //#endregion

})(window);
