/**
	Head JS		The only script in your <HEAD>
	Copyright	Tero Piirainen (tipiirai)
	License		MIT / http://bit.ly/mit-license
	Version		0.8
	
	http://headjs.com
*/
(function(doc) {
	
	var html = doc.documentElement,
		 conf = {
			screens: [320, 480, 640, 768, 1024, 1280, 1440, 1680, 1920],
			section: "-section",
			page: "-page",
			head: "head"
		 },
		 klass = [];
		
		
	if (window.head_conf) {
		for (var key in head_conf) {
			if (head_conf[key]) {
				conf[key] = head_conf[key];
			}
		}
	} 
		
	function pushClass(name) {
		klass.push(name); 
	} 
	
	function removeClass(name) {
		var re = new RegExp("\\b" + name + "\\b");
		html.className = html.className.replace(re, '');
	}

	function each(arr, fn) {	
		for (var i = 0; i < arr.length; i++) {
			fn.call(arr, arr[i], i);
		}
	}
	
	// API	 
	var api = window[conf.head] = function() {
		api.ready.apply(null, arguments);
	}; 

	api.feature = function(key, enabled, queue) {
		
		// internal: apply all classes
		if (!key) { 
			html.className += ' ' + klass.join( ' ' );
			klass = [];
			return;
		}
		
		if (Object.prototype.toString.call(enabled) == '[object Function]') {
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
	
	// browser type & version
	var ua = navigator.userAgent.toLowerCase();
	
	ua = /(webkit)[ \/]([\w.]+)/.exec( ua ) ||
		/(opera)(?:.*version)?[ \/]([\w.]+)/.exec( ua ) ||
		/(msie) ([\w.]+)/.exec( ua ) ||
		!/compatible/.test( ua ) && /(mozilla)(?:.*? rv:([\w.]+))?/.exec( ua ) || [];
		
	if (ua[1] == 'msie') { ua[1] = 'ie'; }
	pushClass(ua[1]);
	
	api.browser = { version: ua[2] };
	api.browser[ua[1]] = true; 
	
	// IE specific
	if (api.browser.ie) {
		
		// IE versions
		for (var ver = 3; ver < 11; ver++) {
			if (parseFloat(ua[2]) < ver) { pushClass("lt-ie" + ver); }			
		}
	} 
	
	// HTML5 support
	each("abbr|article|aside|audio|canvas|details|figcaption|figure|footer|header|hgroup|mark|meter|nav|output|progress|section|summary|time|video".split("|"), function(el) {		
		doc.createElement(el);
	});
		
	// CSS "router" 
	each(location.pathname.split("/"), function(el, i) {
			
		if (this.length > 2 && this[i + 1] !== undefined) {
			if (i) { pushClass(this.slice(1, i+1).join("-") + conf.section); }
		
		} else {
			
			// pageId
			var id = el || "index", index = id.indexOf(".");
			if (index > 0) { id = id.substring(0, index); }				 
			html.id = id + conf.page;
			
			// on root?
			if (!i) { pushClass("root" + conf.section); }
	  } 
	});	
	
	
	// screen resolution: w-100, lt-480, lt-1024 ...
	function screenSize() {
		var w = window.outerWidth || html.clientWidth;
		
		// remove earlier widths
		html.className = html.className.replace(/ (w|lt)-\d+/g, "");
		
		// add new ones
		pushClass("w-" + Math.round(w / 100) * 100);
		
		each(conf.screens, function(width) {
			if (w <= width) { pushClass("lt-" + width); } 
		});
		
		api.feature();
	}
	
	screenSize();		
	window.onresize = screenSize;
	
	api.feature("js", true).feature();
		
})(document);


/**
	Head JS		The only script in your <HEAD>
	Copyright	Tero Piirainen (tipiirai)
	License		MIT / http://bit.ly/mit-license
	Version		0.8
	
	http://headjs.com
*/
(function() {
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
	var el = document.createElement("i"),
		 style = el.style,
		 prefs = ' -o- -moz- -ms- -webkit- -khtml- '.split(' '),
		 domPrefs = 'Webkit Moz O ms Khtml'.split(' '),
		 
		 head_var = window.head_conf && head_conf.head || "head",
		 api = window[head_var];
	
		 
	// Paul Irish (http://paulirish.com): Million Thanks!	 
	function testProps(props) {
		for (var i in props) {
			if (style[props[i]] !== undefined) {
				return true;
			}
		}
	}
	
	
	function testAll(prop) {	
		var camel = prop.charAt(0).toUpperCase() + prop.substr(1),
			 props   = (prop + ' ' + domPrefs.join(camel + ' ') + camel).split(' ');
	
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
	
		reflections: function() {
			return testAll("boxReflect");
		},
      
		transforms: function() {
			return testAll("transform");
		},
		
		transitions: function() {
			return testAll("transition");
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
	
	
})();	


/**
	Head JS		The only script in your <HEAD>
	Copyright	Tero Piirainen (tipiirai)
	License		MIT / http://bit.ly/mit-license
	Version		0.8
	
	http://headjs.com
*/
(function(doc) { 
		
	var head = doc.documentElement,
		 ie = navigator.userAgent.toLowerCase().indexOf("msie") != -1, 
		 ready = false,	// is HEAD "ready"
		 queue = [],		// if not -> defer execution
		 handlers = {},	// user functions waiting for events
		 scripts = {},		// loadable scripts in different states
 
		 isAsync = doc.createElement("script").async === true ||
					"MozAppearance" in doc.documentElement.style ||
					window.opera;		 
					
	/*** public API ***/
	var head_var = window.head_conf && head_conf.head || "head",
		 api = window[head_var] = (window[head_var] || function() { api.ready.apply(null, arguments); }); 
		 

	// states
	var PRELOADED = 0,
		 PRELOADING = 1,		 
		 LOADING	= 2,
		 LOADED = 3;
		
	
	// Method 1: simply load and let browser take care of ordering	
	if (isAsync) {			
		
		api.js = function() {
						
			var args = arguments,
				 fn = args[args.length -1],
				 els = [];

			if (!isFunc(fn)) { fn = null; }	 
			
			each(args, function(el, i) {
					
				if (el != fn) {					
					el = getScript(el);
					els.push(el);
										
					load(el, fn && i == args.length -2 ? function() {
						if (allLoaded(els)) { fn(); }
							
					} : null);
				}							
			});
			
			return api;		 
		};
		
		
	// Method 2: preload	with text/cache hack
	} else {
		
		api.js = function() {
				
			var args = arguments,
				 rest = [].slice.call(args, 1),
				 next = rest[0];
				
			if (!ready) {
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
	
	
	api.ready = function(key, fn) {		
		
		// shift arguments	
		if (isFunc(key)) {
			fn = key; 
			key = "ALL";
		}				
		
		var script = scripts[key];		
		
		if (script && script.state == LOADED || key == 'ALL' && allLoaded()) {
			fn();
			return api;
		}
						
		var arr = handlers[key];
		if (!arr) { arr = handlers[key] = [fn]; }
		else { arr.push(fn); }
		return api;		
	};

	
	/*** private functions ***/
	function toLabel(url) {		
		var els = url.split("/"),
			 name = els[els.length -1],
			 i = name.indexOf("?");
			 
		return i != -1 ? name.substring(0, i) : name;				 
	}
	
	
	function getScript(url) {
		
		var script;
		
		if (typeof url == 'object') {
			for (var key in url) {
				if (url[key]) {
					script = { name: key, url: url[key] };
				}
			}
		} else { 
			script = { name: toLabel(url),  url: url }; 
		}

		var existing = scripts[script.name];
		if (existing) { return existing; }
		
		// same URL?
		for (var name in scripts) {
			if (scripts[name].url == script.url) { return scripts[name]; }	
		}
		
		scripts[script.name] = script;
		return script;
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
		
		for (var name in els) {
			if (els[name].state != LOADED) { return false; }	
		}
		return true;			
	}
	
	
	function onPreload(script) {
		script.state = PRELOADED;

		each(script.onpreload, function(el) {
			el.call();
		});					
	}
	
	function preload(script, callback) {
		
		if (!script.state) {
						
			script.state = PRELOADING;
			script.onpreload = [];

			scriptTag({ src: script.url, type: 'cache'}, function()  {
				onPreload(script);		
			});			
		}
	} 
	
	function load(script, callback) {
		
		if (script.state == LOADED && callback) { 
			return callback(); 
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

		scriptTag(script.url, function() {
			
			script.state = LOADED;
			
			if (callback) { callback(); }			
			
			
			// handlers for this script
			each(handlers[script.name], function(fn) {				
				fn();		
			});
		
			if (allLoaded()) {
				each(handlers.ALL, function(fn) {
					if (!fn.done) { fn(); }
					fn.done = true;
				});
			}
		});		 
	}


	function scriptTag(src, callback)  {
		
		var s = doc.createElement('script');		
		s.type = 'text/' + (src.type || 'javascript');
		s.src = src.src || src;
		s.async = false;
		
		s.onreadystatechange = s.onload = function() {
			
			var state = s.readyState;
			
			if (!callback.done && (!state || /loaded|complete/.test(state))) {
				callback();
				callback.done = true;
			}
		}; 
		
		head.appendChild(s); 
	}
	
	
	/*
		Start after HEAD tag is closed
	*/	
	setTimeout(function() {
		ready = true;
		each(queue, function(fn) {
			fn();			
		});		
	}, 300);	
	
	
	// enable document.readyState for Firefox <= 3.5 
	if (!doc.readyState && doc.addEventListener) {
	    doc.readyState = "loading";
	    doc.addEventListener("DOMContentLoaded", handler = function () {
	        doc.removeEventListener("DOMContentLoaded", handler, false);
	        doc.readyState = "complete";
	    }, false);
	}
			
})(document);

