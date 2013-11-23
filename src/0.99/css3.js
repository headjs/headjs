/*! head.css3 v0.99 */
/*
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
            style.cssText = 'background:url(https://),url(https://),red url(https://)';

            // If the UA supports multiple backgrounds, there should be three occurrences
            // of the string "url(" in the return value for elemStyle.background
            var result = (style.background || "").match(/url/g);

            return Object.prototype.toString.call(result) === '[object Array]' && result.length === 3;
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