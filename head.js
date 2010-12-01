/**
	Head JS: The only script in your <HEAD>

	copyright: "tipiirai" / Tero Piirainen
	license: MIT
*/
(function(doc) {
	
	var html = doc.documentElement,
	 	conf = {
			screens: [320, 480, 640, 768, 1024, 1280, 1440, 1680, 1920],
			section: "-section",
			page: "-page",
			head: "head"
		};
		
	if (typeof window.head_conf == 'object') {
		for (var key in head_conf) {
			conf[key] = head_conf[key];
		}
	} 
	
	window.head_conf = conf;
		
	function addClass(name) { 
		html.className += ' ' + name; 
	} 
	
	function removeClass(name) {
		var re = new RegExp("\\b" + name + "\\b");
		html.className = html.className.replace(re, ''); 
	}

	function each(arr, fn) {	
		for (var i = 0; i < arr.length; i++)
			fn.call(arr, arr[i], i);
	}
	
	// API	 
	var api = window[conf.head] = function() {
		api.ready.apply(null, arguments);
	};	

	api.feature = function(key, enabled) {
		removeClass('no-' + key);
		removeClass(key);
		addClass((enabled ? '' : 'no-') + key);
		api[key] = !!enabled;
		return api;
	};	
	
	// browser type & version
	var ua = navigator.userAgent.toLowerCase();
	
	ua = /(webkit)[ \/]([\w.]+)/.exec( ua ) ||
		/(opera)(?:.*version)?[ \/]([\w.]+)/.exec( ua ) ||
		/(msie) ([\w.]+)/.exec( ua ) ||
		!/compatible/.test( ua ) && /(mozilla)(?:.*? rv:([\w.]+))?/.exec( ua ) || [];
		
	if (ua[1] == 'msie') ua[1] = 'ie';
	addClass(ua[1]);
	// addClass(ua[1] + ua[2].replace(/\./g, "").substring(0, 3));
	
	api.browser = { version: ua[2] };
	api.browser[ua[1]] = true;	
	
	// IE specific
	if (api.browser.ie) {
		
		// IE versions
		for (var ver = 3; ver < 11; ver++) {
			if (parseFloat(ua[2]) < ver) { addClass("lt-ie" + ver); } 			
		}
	} 
	
	// HTML5 support
	each("abbr|article|aside|audio|canvas|details|figcaption|figure|footer|header|hgroup|mark|meter|nav|output|progress|section|summary|time|video".split("|"), function(el) {		
		doc.createElement(el);
	});
		
	// page class && id
	var path = location.pathname,
		 els = path.split("/"),
		 section = els.slice(0, els.length -1).join("-") || "root",
		 pageId = els.slice(-1)[0] || "index",
		 index = pageId.indexOf(".");
	
	if (index >= 0) { pageId = pageId.substring(0, index); }
	
	
	api.section = section;	
	api.pageId = pageId;	

	addClass(section + conf.section);
	html.id = pageId + conf.page;
	
	
	// screen resolution: w-100, lt-480, lt-1024 ...
	function screenSize() {
		var w = document.width || window.outerWidth || document.documentElement.clientWidth;
		
		// remove earlier screens
		html.className = html.className.replace(/ (w|lt)-\d+/g, "");
		addClass("w-" + Math.round(w / 100) * 100);
		
		each(conf.screens, function(width) {
			if (w <= width) { addClass("lt-" + width); } 
		})
	}
	
	screenSize();	 	
	window.onresize = screenSize;	
	
	head.feature("script", true);

	
})(document);


(function(doc) {
		
	/* CSS modernizer */
	var el = doc.createElement("i"),
		 style = el.style,
		 prefs = ' -o- -moz- -ms- -webkit- -khtml- '.split(' ');
		 
	/* 
		runs a vendor property test (-moz, ...)  
		
		testAll("box-shadow: 0 0 0 red;");
	*/
	function testAll(definition)  {
		style.cssText = prefs.join(definition + ";");
		var len = style.cssText ? style.cssText.length : 0;
		return len > 0 && !style.cssText.split(";")[1];
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
		
		boxshadow: function() {
			return testAll("box-shadow: 0 0 0 red");	
		},
		
		textshadow: function() {			
			return style.textShadow === '';	
		},
		
		multiplebgs: function() {
			style.cssText = "background:url(//:),url(//:),red url(//:)";
			return new RegExp("(url\\s*\\(.*?){3}").test(style.background);
		},
		
		borderimage: function() {
			return testAll("border-image: url(m.png) 1 1 stretch");
		},
		
		borderradius: function() {
			return testAll('border-radius:0');	
		},
		
		opacity: function() {
			return testAll("opacity:.1");
		},
		
		reflections: function() {
			return testAll("box-reflect:right 0");
		},
      
		transforms: function() {
			return testAll("transform:rotate(1deg)");
		},
		
		transitions: function() {
			return testAll("transition:all .1s linear");
		}
      
	};

	var api = window[head_conf.head];
		
	for (var key in tests) {		
		api.feature(key, tests[key].call());
	}
	
})(document);	
(function(doc) { 
		
	var ready = false,
		 queue = [],
		 thelast = [],		// functions to be executed last
		 waiters = {},		// functions waiting for scripts
		 scripts = {};		// the scripts in different states

		 
	/*** public API ***/
	var head_var = window.head_conf && head_conf.head || "head",
		 api = window[head_var] = (window[head_var] || {}); 
	
	api.js = function() {
			
		var args = arguments,
			rest = [].slice.call(args, 1),
			next = rest[0];				 
			 
		if (!ready) {
			return queue.push(function()  {
				api.js.apply(null, args);				
			});
		}
		
		// multiple arguments	 
		if (next) {				
			
			// preload all immediately
			if (!isFunc(next)) preloadAll.apply(null, rest);
		
			// load all recursively in order
			load(getScript(args[0]), isFunc(next) ? next : function() {	
				api.js.apply(null, rest);
			});				
			
		// single script	
		} else {
			load(getScript(args[0])); 	
		}
		
		return api.js;		 
	};
		
	api.ready = function(key, fn) {

		// single function	
		if (isFunc(key)) { return thelast.push(key); }					
						
		var arr = waiters[key];
		if (!arr) { arr = waiters[key] = [fn]; }
		else arr.push[fn];
		return api.js;
	};

	/*
	api.dump = function() {
		console.info(scripts);
	};
	*/
	
	/*** private functions ***/
	function getScript(url) {
		
		var script = scripts[url.url || url];
		if (script) return script;
		
		if (typeof url == 'object')  {
			for (var key in url) {
				script = { name: key, url: url[key] };	
			}
		} else {
			script = { name: url.substring(url.indexOf("/", 10) + 1, url.indexOf("?")), url: url }; 
		}
		
		scripts[script.url] = script;
		return script;
	}
	
	function each(arr, fn) {
		if (!arr) return;
		
		// arguments special type
		if (typeof arr == 'object') { arr = [].slice.call(arr); }
		
		// do the job
		for (var i = 0; i < arr.length; i++)
			fn.call(arr, arr[i], i);
	}
	
	function isFunc(el) {
		return Object.prototype.toString.call(el) == '[object Function]';
	} 
	
	function preloadAll() {
		each(arguments, function(el) {
			if (!isFunc(el)) {
				preload(getScript(el));
			} 
		});		
	}
	
	function preload(script, callback) {
		
		if (!script.state) {
			
			//* console.info("PRELOAD", script.name)
			
			script.state = "preloading";
			script.onpreload = [];

			function onload() {
				script.state = "preloaded";
				
				//* console.info("    PRE", script.name);
				each(script.onpreload, function(el) {
					el.call();
				});					
			}
			
			/*
				Browser detection required. Firefox does not support script.type = text/cache
				http://www.phpied.com/preload-cssjavascript-without-execution/				
			*/	
			if (/Firefox/.test(navigator.userAgent)) {
				var obj = doc.createElement('object');
				obj.data = script.url;
				obj.width  = 0;
				obj.height = 0;		
				
				obj.onload = function() {
					onload();
					
					// avoid spinning progress indicator with setTimeout
					setTimeout(function() { doc.body.removeChild(obj); }, 1);
				};
				
				doc.body.appendChild(obj);
				
			} else {
				scriptTag({ src: script.url, type: 'cache'}, onload);	
			}
			
		}
	}
	
	
	function load(script, callback) {		


		if (script.state == 'loaded') { return callback(); }
			
		if (script.state == 'preloading') {
			return script.onpreload.push(function()  {
				load(script, callback);	
			});
		}

		//* console.info("LOAD", script.name, ":", script.state)
		
		script.state = 'loading'; 

		scriptTag(script.url, function() {
			
			script.state = 'loaded';
			
			if (callback) callback.call();			
			
			//* console.info("    LOADED", script.name);
			
			// waiters for this script
			each(waiters[script.name], function(fn) {
				fn.call();		
			});

			// TODO: do not run until DOM is loaded			
			var allLoaded = true;
		
			for (var key in scripts) {
				if (scripts[key].state != 'loaded') allLoaded = false;	
			}
		
			if (allLoaded) {
				each(thelast, function(fn) {
					if (!fn.done) fn.call();
					fn.done = true;
				});
			}
		});
				
	}   
	
	// if callback == true --> preload
	function scriptTag(src, callback)  {
		
		var head = doc.getElementsByTagName('head')[0],
			elem = doc.createElement('script');
		
		elem.type = 'text/' + (src.type || 'javascript');
		elem.src = src.src || src;
		
		elem.onreadystatechange = elem.onload = function() {
			if (!callback.done) {
				callback.call();
				callback.done = true;
			}
			
			// cleanup. IE runs into trouble
			if (!document.all) {			
				head.removeChild(elem);
			}
		}; 
		
		head.appendChild(elem); 
	} 
	
	// DomContentLoaded no better	 
	setTimeout(function() {
		ready = true;
		each(queue, function(fn) {
			fn.call();			
		});		
	}, 50);
	
		
})(document);
