/*! head.responsive - v2.0.0-alpha */
/*
 * HeadJS     The only script in your <HEAD>
 * Author     Tero Piirainen  (tipiirai)
 * Maintainer Robert Hoffmann (itechnology)
 * License    MIT / http://bit.ly/mit-license
 * WebSite    http://headjs.com
 */
/* Feature List
 *
 * HashChange handling
 * lt/gt handling for browser versions, viewport width, and viewport height
 * Event handling: head.on(), based on MinPubSub
 * Make as many variables as possible availiable in css AND js
 * Detect phone, tablet, mobile, desktop
 * We could detect phone/tablet by measuring the aspect ratio of the screen resolution (not viewport) and making sure it's .mobile-true
 * Move all features to api.features[]
 * Make groups: api.viewport, api.screen, api.browser, api.features, api.page, api.section[], api.hash[]
 * Maybe move api.features.landscape/portrait to api.viewport ..it is more related to that than an actual feature
 * Maybe move api.features.mobile/desktop/touch to api.browser ..it is more related to that than an actual feature
 * We no longer declare min/max versions of browsers (too many out there), instead each version we wish to generate lt/gt for
 * Someone proposed to add operating system detection: window, linux, ios, mac, etc ..i'm doubtful to being able to detect that consistently with a minimal amount of regexp
 */
(function(win, undefined) {
    "use strict";

    //#region Variables
    var doc   = win.document,
        nav   = win.navigator,
        loc   = win.location,
        html  = doc.documentElement,
        klass = [],
        conf  = {
            widths    : [240, 320, 480, 640, 768, 800, 1024, 1280, 1366, 1440, 1680, 1920],
            heights   : [320, 480, 600, 768, 800, 900, 1050],
            widthCss  : { "gt": true, "lt": true },
            heightCss : { "gt": true, "lt": true },
            browsers  : {
                          "ie"     : [7, 11]
                         ,"ff"     : [4, 26]
                         //,"chrome" : [23, 33]                         
                         //,"ios"    : [4, 7]
                         //,"android": [2, 4]
                         //,"webkit" : [10, 12]
                         //,"opera"  : [10, 12]
                        },
            browserCss: { "gt": true, "lt": true },
            html5     : true,
            hashtags  : true,
            page      : "page",
            section   : "section",
            hash      : "hash",
            head      : "head"
        };

    if (win.head_conf) {
        for (var item in win.head_conf) {
            if (win.head_conf[item] !== undefined) {
                conf[item] = win.head_conf[item];
            }
        }
    }

    var head = conf.head || "head";
    var api  = win[head] = (win[head] || {});
    //#endregion

    //#region Experimental
    // INFO: not sure if this is needed
    // In anycase it allows you to create namespaces on the fly without declaring a bunch of multiple objects
    // makeNameSpace("head.viewport.height");
    function makeNameSpace() {
        var a = arguments, o = api, j, d, arg;
        // Array caching performance: http://bonsaiden.github.com/JavaScript-Garden/#array.general
        for (var i = 0, l = a.length; i < l; i++) {
            o = api; //Reset base object per argument or it will get reused from the last
            arg = a[i];
            if (arg.indexOf(".") > -1) { //Skip this if no "." is present
                d = arg.split(".");
                for (j = (d[0] === head) ? 1 : 0; j < d.length; j++) {
                    o[d[j]] = o[d[j]] || {};
                    o = o[d[j]];
                }
            } else {
                o[arg] = o[arg] || {};
                o = o[arg]; //Reset base object to the new object so it's returned
            }
        }
        return o;
    }

    // get the value closest to num from an array of numbers
    // this can be used for determining a height/width breakpoint
    // still, is it usefull to determine exact/closest breakpoint when we already have lt/gt
    function closest(num, arrNum) {
        var c = null;

        for (var i = 0, l = arrNum.length; i < l; i++) {
            if (c == null || Math.abs(arrNum[i] - num) < Math.abs(c - num)) {
                c = arrNum[i];
            }
        }

        return c;
    }

    // NEEDED ?
    function push(name, value, isCss) {
        // INFO: the idea is to be able to push a value to a specific namespace (api.browser, api.viewport, ..)
        // we need a clean way to push values to CSS as well as to JS
        // we also need to be able to add, update, and remove those values
        // ...still figuring this out

        // push("h", ih, css);
        // push(api.viewport.height, ih, js);
        // push("viewport", "height", value);

        api[name][key] = value;

        if (isCss) {
            klass[klass.length] = name.concat("-", value);
        } else {
            name = value;
        }

        api.setFeature();
    };
    //#endregion

    //#region Internal Functions
    function each(arr, fn) {
        // Array caching performance: http://bonsaiden.github.com/JavaScript-Garden/#array.general
        for (var i = 0, l = arr.length; i < l; i++) {
            fn.call(arr, arr[i], i);
        }
    }

    function pushClass(name) {
        klass[klass.length] = name;
    }

    function removeClass(name) {
        // need to test for both space and no space
        // https://github.com/headjs/headjs/issues/270
        // https://github.com/headjs/headjs/issues/226
        var re = new RegExp(" ?\\b" + name + "\\b");
        html.className = html.className.replace(re, "");
    }
    //#endregion

    api.features = {};
    api.setFeature = function (key, enabled, queue) {
        // internal: apply all classes
        if (!key) {
            html.className += " " + klass.join(" ");
            klass = [];

            return api;
        }

        if (Object.prototype.toString.call(enabled) === "[object Function]") {
            enabled = enabled.call();
        }

        pushClass(key + "-" + enabled);
        api.features[key] = !!enabled;

        // apply class to HTML element
        if (!queue) {
            // don't really like the idea of doing 3 operations in a row here
            removeClass(key + "-true");
            removeClass(key + "-false");
            removeClass(key);

            api.setFeature();
        }

        return api;
    };

    //#region Quick Features
    // we support js, we got here !
    api.setFeature("js", true, true);

    // browser type & version
    var ua     = nav.userAgent.toLowerCase(),
        mobile = /mobile|android|kindle|silk|midp|phone|(windows .+arm|touch)/.test(ua);

    // useful for enabling/disabling feature (we can consider a desktop navigator to have more cpu/gpu power)
    api.setFeature("mobile" , mobile , true);
    api.setFeature("desktop", !mobile, true);

    // are we on a touch device ?
    api.setFeature("touch", "ontouchstart" in win, true);

    // used by css router
    api.setFeature("hashchange", "onhashchange" in win, true);
    //#endregion

    //#region Browser Detection
    // http://www.zytrax.com/tech/web/browser_ids.htm
    // http://www.zytrax.com/tech/web/mobile_ids.html
    ua = /(chrome|firefox)[ \/]([\w.]+)/.exec(ua) || // Chrome & Firefox
         /(iphone|ipad|ipod)(?:.*version)?[ \/]([\w.]+)/.exec(ua) || // Mobile IOS
         /(android)(?:.*version)?[ \/]([\w.]+)/.exec(ua) || // Mobile Webkit
         /(webkit|opera)(?:.*version)?[ \/]([\w.]+)/.exec(ua) || // Safari & Opera
         /(msie) ([\w.]+)/.exec(ua) ||
         /(trident).+rv:(\w.)+/.exec(ua) || [];

    var browser = ua[1],
        version = parseFloat(ua[2]);

    switch (browser) {
    case "msie":
    case "trident":
        browser = "ie";
            version = doc.documentMode || version;
            break;

    case "firefox":
        browser = "ff";
            break;

    case "ipod":
    case "ipad":
    case "iphone":
        browser = "ios";
            break;

    case "webkit":
        browser = "safari";
            break;
    }

    // Browser vendor and version
    api.browser = {
        name   : browser,
        version: version
    };
    api.browser[browser] = true;

    for (var key in conf.browsers) {
        if (browser === key) {
            // is this usefull ?
            // we have the exact browser version below
            // but this also applies to other browsers, so we could have .ff and .ie-false
            pushClass(key + "-true");

            // Array caching performance: http://bonsaiden.github.com/JavaScript-Garden/#array.general
            for (var i = 0, l = conf.browsers[key].length; i < l; i++) {
                var supported = conf.browsers[key][i];
                if (conf.browserCss.gt && (version > supported)) {
                    pushClass(key + "-gt" + supported);
                }

                else if (conf.browserCss.lt && (version < supported)) {
                    pushClass(key + "-lt" + supported);
                }
            }
        }

        else {
            // is this usefull ?
            // we have the exact browser version below
            // but this also applies to other browsers, so we could have .ie and .ff-false
            pushClass(key + "-false");
        }
    }

    pushClass(browser);
    pushClass(browser + parseInt(version, 10));
    //#endregion

    //#region HTML5 Shim
    if (conf.html5 && browser === "ie" && version < 9) {
        // HTML5 support : you still need to add html5 css initialization styles to your site
        // See: /site/assets/css/html5.min.css
        each("abbr|article|aside|audio|canvas|details|figcaption|figure|footer|header|hgroup|main|mark|meter|nav|output|progress|section|summary|time|video".split("|"), function (el) {
            doc.createElement(el);
        });
    }
    //#endregion

    //#region CSS Router: Page/Section
    function buildRoute(path) {
        /// <summary>can be used to emulate hashchange event by subscribing to win/doc onclick and testing if url has changed</summary>
        var items = loc.pathname.split("/");

        each(items, function (el, i) {
            if (this.length > 2 && this[i + 1] !== undefined) {
                if (i) {
                    pushClass(conf.section + "-" + this.slice(i, i + 1).join("-").toLowerCase().replace(/\./g, "-"));
                }
            } else {
                // pageId
                var id = el || "index", index = id.indexOf(".");
                if (index > 0) {
                    id = id.substring(0, index);
                }

                html.id = conf.page + "-" + id.toLowerCase();

                // on root?
                if (!i) {
                    pushClass(conf.section + "-root");
                }
            }
        });
    }

    buildRoute(loc.pathname);
    //#endregion

    //#region CSS Router: HasChange
    // contains current hashes, so we can remove them when a change occurs
    var hashCache = [];
    function onhashChange() {
        // remove old values
        each(hashCache, function (el) {
            removeClass(el);
        });

        // get current hash
        var items = loc.hash.replace(/(!|#)/g, "").split("/");

        // add new values
        each(items, function (el) {
            if (!!el) {
                var name = conf.hash + "-" + el.toLowerCase().replace(/\./g, "-");
                hashCache.push(name);
                pushClass(name);
            }
        });

        // commit changes
        api.setFeature();
    }
    //#endregion

    //#region Screen Detection
    // screen information placeholder
    api.screen = {};

    // viewport information placeholder
    api.viewport = {};

    // viewport resolutions: w-100, lt-480, lt-1024 ...
    function screenSize() {
        // remove earlier sizes
        html.className = html.className.replace(/ (w-|w-gt|w-lt|h-|h-gt|h-lt)\d+/g, "");

        // Viewport width
        var iw = win.innerWidth || html.clientWidth,
            ow = win.outerWidth || win.screen.width;

        api.viewport.width = iw;
        api.browser.width  = ow;

        // INFO: See comment on function closest()
        //pushClass("w-" + iw);
        pushClass("w-" + closest(iw, conf.widths));

        each(conf.widths, function (width) {
            if (conf.widthCss.gt && (iw > width)) {
                pushClass("w-gt" + width);
            }

            else if (conf.widthCss.lt && (iw < width)) {
                pushClass("w-lt" + width);
            }
        });

        // Viewport height
        var ih = win.innerHeight || html.clientHeight,
            oh = win.outerHeight || win.screen.height;

        api.viewport.height = ih;
        api.browser.height  = oh;

        // INFO: See comment on function closest()
        //pushClass("h-" + ih);
        pushClass("h-" + closest(ih, conf.heights));
        
        each(conf.heights, function (height) {
            if (conf.heightCss.gt && (ih > height)) {
                pushClass("h-gt" + height);
            }

            else if (conf.heightCss.lt && (ih < height)) {
                pushClass("h-lt" + height);
            }
        });

        // INFO: maybe we should detect and take the aspect ratio into account too ?
        // A desktop browser whose window can be resized, might give weird results (on a responsive site) if it reports portrait mode, when in reality it's just a few pixels less than landscape
        // For example:
        // Detect based on Ratio. 0.8-0.9 seem like a good threshhold compromise, even if in reality 0.99 can be considered as portrait too.
        // Common mobile ratios are: 0.56: 720x1280, 0.6: 480x800, 0.66: 320x480 640x960, 0.75: 600x800 768x1024
        // Galaxy S 1/2 480x800 3 720x1280, IPhone 4/4S 640×960, IPhone 5 640×1136 ..seems like 480 is a good target
        // var portrait  = ((iw / ih) <= 0.85);
        // var landscape = !portrait;
        api.setFeature("portrait" , (ih > iw));
        api.setFeature("landscape", (ih < iw));
    }

    screenSize();
    //api.setFeature();

    // Throttle navigators from triggering too many resize events
    var resizeId = 0;
    function onResize() {
        win.clearTimeout(resizeId);
        resizeId = win.setTimeout(screenSize, 50);
    }
    //#endregion


    //#region EventHandlers
    // Manually attach, as to not overwrite existing handler
    if (win.addEventListener) {
        if (conf.hashtags && api.features.hashchange) {            
            win.addEventListener("hashchange", onhashChange, false);

            // first load
            onhashChange();
        }

        win.addEventListener("resize", onResize, false);

    } else {
        // IE8 and less
        if (conf.hashtags && api.features.hashchange) {
            win.attachEvent("onhashchange", onhashChange);

            // first load
            onhashChange();
        }

        win.attachEvent("onresize", onResize);
    }
    //#endregion

    //#region Public Exports
    // we should probably stop declaring public stuff above and make a "exports" section here
    //#endregion
}(window));