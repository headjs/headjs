/*! head.responsive - v2.0.0 */
/*
 * HeadJS     The only script in your <HEAD>
 * Author     Tero Piirainen  (tipiirai)
 * Maintainer Robert Hoffmann (itechnology)
 * License    MIT / http://bit.ly/mit-license
 * WebSite    http://headjs.com
 */
/* TODO
 * HashChange handling
 * Decide between lt/lte & gt/gte
 * Event handling: head.on()
 * Make as many variables as possible availiable in css AND js
 */
(function(win, undefined) {
    "use strict";

    //#region Variables
    // gt, gte, lt, lte, eq breakpoints would have been more simple to write as ['gt','gte','lt','lte','eq']
    // but then we would have had to loop over the collection on each resize() event,
    // a simple object with a direct access to true/false is therefore much more efficient
    var doc   = win.document,
        nav   = win.navigator,
        loc   = win.location,
        html  = doc.documentElement,
        klass = [],
        conf  = {
            widths    : [240, 320, 480, 640, 768, 800, 1024, 1280, 1366, 1440, 1680, 1920],
            heights   : [480, 600, 768, 800, 900, 1050],
            widthCss  : { "gte": true, "lte": true },
            heightCss : { "gte": true, "lte": true },
            browsers  : [
                          { ie     : [7,11] }
                         //,{ chrome : [23,24] }
                         ,{ ff     : [4,26] }
                         //,{ ios    : [4,7] }
                         //,{ android: [2,4] }
                         //,{ webkit : [10,12] }
                         //,{ opera  : [10,12] }
                        ],
            browserCss: { "gte": true, "lte": true },
            html5     : false,
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

    /*** public API ***/
    var head = conf.head || "head";
    var api  = win[head] = (win[head] || {});

    //var headVar = conf.head || "head",
    //    api = win[headVar] = (win[headVar] || function () {
    //        // so wtf does this do ?
    //        console.log("setup empty");
    //        api.ready.apply(null, arguments);
    //    });
    //#endregion

    //#region Internal Functions
    // INFO: not sure if this is needed
    function makeNameSpace() {
        var a = arguments, o = api, j, d, arg;
        // Array caching performance: http://bonsaiden.github.com/JavaScript-Garden/#array.general
        for (var i = 0, l = a.length; i < l; i++) {
            o = api; //Reset base object per argument or it will get reused from the last
            arg = a[i];
            if (arg.indexOf(".") > -1) { //Skip this if no "." is present
                d = arg.split(".");
                for (j = (d[0] === headVar) ? 1 : 0; j < d.length; j++) {
                    o[d[j]] = o[d[j]] || { };
                    o = o[d[j]];
                }
            } else {
                o[arg] = o[arg] || { };
                o = o[arg]; //Reset base object to the new object so it's returned
            }
        }
        return o;
    }

    function each(arr, fn) {
        // Array caching performance: http://bonsaiden.github.com/JavaScript-Garden/#array.general
        for (var i = 0, l = arr.length; i < l; i++) {
            fn.call(arr, arr[i], i);
        }
    }

    function pushClass(name) {
        klass[klass.length] = name;
    }

    var removeCounter = 1;
    function removeClass(name) {
        var re = new RegExp(" \\b" + name + "\\b");
        html.className = html.className.replace(re, "");

        console.log("removeClass", name, removeCounter++);
    }

    //#endregion

    api.namespace = makeNameSpace;

    // INFO: NEEDED ?
    api.push = function (name, value, isCss) {
        // INFO: the idea is to be able to push a value to a specific namespace

        // viewport.height = ih;
        // .h-600
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

    function remove(name, value) {
        //
        //
        klass[klass.length] = name;
    }

    var addCounter = 1;
    api.features = {};
    api.setFeature = function (key, enabled, queue) {
        // internal: apply all classes
        if (!key) {
            html.className += " " + klass.join(" ");
            console.log("feature", key, addCounter++);
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
            removeClass(key + "-true");
            removeClass(key + "-false");
            removeClass(key);
            api.setFeature();
        }

        return api;
    };

    // INFO: NEEDED ?
    api.removeFeature = function () {
        // is this usefull ?
    };

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

    // Array caching performance: http://bonsaiden.github.com/JavaScript-Garden/#array.general
    for (var i = 0, l = conf.browsers.length; i < l; i++) {
        for (var key in conf.browsers[i]) {
            if (browser === key) {
                // this usefull ?
                pushClass(key + "-true");
                // api.browser.ie = version;
                // .ie

                // Array caching performance: http://bonsaiden.github.com/JavaScript-Garden/#array.general
                for (var ii = 0, ll = conf.browsers[i][key].length; ii < ll; ii++) {
                    var supported = conf.browsers[i][key][ii];
                    if (version > supported) {
                        if (conf.browserCss.gte) {
                            pushClass(key + "-gte" + supported);
                        }
                    }

                    else if (version < supported) {
                        if (conf.browserCss.lte) {
                            pushClass(key + "-lte" + supported);
                        }
                    }

                    // INFO: can be removed if we only use lt/gt
                    else if (version === supported) {
                        if (conf.browserCss.lte) {
                            pushClass(key + "-lte" + supported);
                        }

                        if (conf.browserCss.gte) {
                            pushClass(key + "-gte" + supported);
                        }
                    }
                }
            }
            else {
                // this usefull ?
                pushClass(key + "-false");
            }
        }
    }

    pushClass(browser);
    pushClass(browser + parseInt(version, 10));
    //#endregion

    //#region HTML5 Shim
    if (conf.html5 && browser === "ie" && version < 9) {
        // HTML5 support : you still need to add html5 css initialization styles to your site
        // See: assets/html5.css
        each("abbr|article|aside|audio|canvas|details|figcaption|figure|footer|header|hgroup|main|mark|meter|nav|output|progress|section|summary|time|video".split("|"), function (el) {
            doc.createElement(el);
        });
    }
    //#endregion

    //#region CSS Router
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


    function onhashChange() {
        var items = loc.hash.replace(/(!|#)/g, "").split("/");

        each(items, function (el, i) {
            console.log(el, i, this.length, this[i + 1]);

            if (this.length > 2 && this[i + 1] !== undefined) {
                if (i) {
                    console.log("pushing !! ", el);
                    pushClass(conf.hash + "-" + this.slice(i, i + 1).join("-").toLowerCase().replace(/\./g, "-"));
                }
            }
        });

        api.setFeature("hash");
    }
    //#endregion

    // basic screen info
    api.screen = {
        height: win.screen.height,
        width : win.screen.width
    };

    api.viewport = {
        height: win.innerHeight || html.clientHeight,
        width : win.innerWidth  || html.clientWidth
    };

    // viewport resolutions: w-100, lt-480, lt-1024 ...
    var screenCounter = 1;
    function screenSize() {
        // remove earlier sizes
        html.className = html.className.replace(/ (w-|w-gte|w-lte|h-|h-gte|h-lte)\d+/g, "");
        console.log("screenSize", screenCounter++);

        // Viewport width
        var iw = win.innerWidth || html.clientWidth,
            ow = win.outerWidth || win.screen.width;

        api.viewport.width = iw;
        api.browser.width  = ow;

        // for debugging purposes, not really useful for anything else
        // INFO: Maybe we can round to closest breakpoint ?
        pushClass("w-" + iw);

        each(conf.widths, function (width) {
            if (iw > width) {
                if (conf.widthCss.gte) {
                    pushClass("w-gte" + width);
                }
            }

            else if (iw < width) {
                if (conf.widthCss.lte) {
                    pushClass("w-lte" + width);
                }
            }

            // INFO: can be removed if we only use lt/gt
            else if (iw === width) {
                if (conf.widthCss.lte) {
                    pushClass("w-lte" + width);
                }

                if (conf.widthCss.gte) {
                    pushClass("w-gte" + width);
                }
            }
        });

        // Viewport height
        var ih = win.innerHeight || html.clientHeight,
            oh = win.outerHeight || win.screen.height;

        api.viewport.height = ih;
        api.browser.height  = oh;

        // for debugging purposes, not really useful for anything else
        // INFO: Maybe we can round to closest breakpoint ?
        pushClass("h-" + ih);

        // viewport.height = ih;
        // .h-600
        // pushCss("h", ih);
        // pushJs(viewport, "height", ih);

        each(conf.heights, function (height) {
            if (ih > height) {
                if (conf.heightCss.gte) {
                    pushClass("h-gte" + height);
                }
            }

            else if (ih < height) {
                if (conf.heightCss.lte) {
                    pushClass("h-lte" + height);
                }
            }

            // INFO: can be removed if we only use lt/gt
            else if (ih === height) {
                if (conf.heightCss.lte) {
                    pushClass("h-lte" + height);
                }

                if (conf.heightCss.gte) {
                    pushClass("h-gte" + height);
                }
            }
        });

        // no need for onChange event to detect this
        api.setFeature("portrait" , (ih > iw));
        api.setFeature("landscape", (ih < iw));
    }

    screenSize();
    //api.feature();

    // Throttle navigators from triggering too many resize events
    var resizeId = 0;

    function onResize() {
        win.clearTimeout(resizeId);
        resizeId = win.setTimeout(screenSize, 50);
    }

    // Manually attach, as to not overwrite existing handler
    if (win.addEventListener) {
        if (conf.hashtags && api.features.hashchange) {
            win.addEventListener("hashchange", onhashChange, false);
        }

        win.addEventListener("resize", onResize, false);

    } else {
        // IE8 and less
        if (conf.hashtags && api.features.hashchange) {
            win.attachEvent("onhashchange", onhashChange);
        }

        win.attachEvent("onresize", onResize);
    }

    //#region Public Exports

    //#endregion
}(window));