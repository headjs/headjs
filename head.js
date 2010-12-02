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
		},
		klass = [];
		
	if (typeof window.head_conf == 'object') {
		for (var key in head_conf) {
			if (head_conf[key]) {
				conf[key] = head_conf[key];
			}
		}
	} 
	
	window.head_conf = conf;
		
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
		
		/*% internal %*/
		  if (!key) { 
				html.className += ' ' + klass.join( ' ' );
				klass = [];		  
		  } else if (!queue) { 
				removeClass('no-' + key); removeClass(key); 
		  }
		/*% endinternal %*/
		
		pushClass((enabled ? '' : 'no-') + key);
		api[key] = !!enabled;
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
	// pushClass(ua[1] + ua[2].replace(/\./g, "").substring(0, 3));
	
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
		
	// page class && id
	var path = location.pathname,
		 els = path.split("/"),
		 section = els.slice(0, els.length -1).join("-") || "root",
		 pageId = els.slice(-1)[0] || "index",
		 index = pageId.indexOf(".");
	
	if (index >= 0) { pageId = pageId.substring(0, index); }
	
	
	api.section = section;	
	api.pageId = pageId; 

	pushClass(section + conf.section);
	html.id = pageId + conf.page;
	
	
	// screen resolution: w-100, lt-480, lt-1024 ...
	function screenSize() {
		var w = document.width || window.outerWidth || document.documentElement.clientWidth;
		
		// remove earlier widths
		html.className = html.className.replace(/ (w|lt)-\d+/g, "");
		
		// add new ones
		pushClass("w-" + Math.round(w / 100) * 100);
		
		each(conf.screens, function(width) {
			if (w <= width) { pushClass("lt-" + width); } 
		});
	}
	
	screenSize();		
	window.onresize = screenSize;
	
	api.feature("script", true).feature();
		
})(document);


(function(api) {
		
	/* CSS modernizer */
	var el = document.createElement("i"),
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
	
	// queue features	
	for (var key in tests) {		
		if (tests[key]) {
			api.feature(key, tests[key].call(), true);
		}
	}
	
	// enable features at once
	api.feature();
	
	
})(window[head_conf.head]);	


(function(doc) { 
		
	var head = doc.documentElement,
		 ready = false,
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
			queue.push(function()  {
				api.js.apply(null, args);				
			});
			return api;
		}
		
		// multiple arguments	 
		if (next) {				
			
			// preload all immediately
			if (!isFunc(next)) { preloadAll.apply(null, rest); }
		
			// load all recursively in order
			load(getScript(args[0]), isFunc(next) ? next : function() {	
				api.js.apply(null, rest);
			});				
			
		// single script	
		} else {
			load(getScript(args[0]));
		}
		
		return api;		 
	};
		
	api.ready = function(key, fn) {

		// single function	
		if (isFunc(key)) { return thelast.push(key); }					
						
		var arr = waiters[key];
		if (!arr) { arr = waiters[key] = [fn]; }
		else { arr.push(fn); }
		return api;
	};
	
	/*** private functions ***/
	function getScript(url) {
		
		var script = scripts[url.url || url];
		if (script) { return script; }
		
		if (typeof url == 'object')  {
			for (var key in url) {
				if (url[key]) {
					script = { name: key, url: url[key] };
				}
			}
		} else {
			script = { name: url.substring(url.indexOf("/", 10) + 1, url.indexOf("?")), url: url }; 
		}
		
		scripts[script.url] = script;
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
	
	function preloadAll() {
		each(arguments, function(el) {
			if (!isFunc(el)) {
				preload(getScript(el));
			} 
		});		
	}
	
	function onPreload(script) {
		script.state = "preloaded";

		each(script.onpreload, function(el) {
			el.call();
		});					
	}
	
	function preload(script, callback) {
		
		if (!script.state) {
			
			script.state = "preloading";
			script.onpreload = [];
			
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
					onPreload(script);
					
					// avoid spinning progress indicator with setTimeout
					setTimeout(function() { head.removeChild(obj); }, 1);
				};
				
				head.appendChild(obj);
				
			} else {
				scriptTag({ src: script.url, type: 'cache'}, function()  {
					onPreload(script);		
				});
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
		
		script.state = 'loading'; 

		scriptTag(script.url, function() {
			
			script.state = 'loaded';
			
			if (callback) { callback.call(); }			
			
			// waiters for this script
			each(waiters[script.name], function(fn) {
				fn.call();		
			});

			// TODO: do not run until DOM is loaded			
			var allLoaded = true;
		
			for (var key in scripts) {
				if (scripts[key].state != 'loaded') { allLoaded = false; }	
			}
		
			if (allLoaded) {
				each(thelast, function(fn) {
					if (!fn.done) { fn.call(); }
					fn.done = true;
				});
			}
		});
				
	}   
	
	// if callback == true --> preload
	function scriptTag(src, callback)  {
		
		var elem = doc.createElement('script');		
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
	
	/*
		This timer delays the start a little. All just become more robust. 
		Still a bit of a mystery. Will investigate report when all clear.		
		Not related to DomContentLoaded.	 
	*/	
	setTimeout(function() {
		ready = true;
		each(queue, function(fn) {
			fn.call();			
		});		
	}, 200);	
		
})(document);
