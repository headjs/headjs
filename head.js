
// http://marijnhaverbeke.nl/uglifyjs
// https://github.com/Modernizr/Modernizr/blob/master/modernizr.js
(function(doc) {
	
	var html = doc.documentElement, 
		 screens = [480, 640, 800, 982, 1024, 1280, 1680, 1960];
	
		
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
	var api = window.head = {

		feature: function(key, enabled) {
			removeClass('no-' + key);
			removeClass(key);
			addClass((enabled ? '' : 'no-') + key);
			api[key] = !!enabled;
			return api;
		},
		
		cookie: function(name, val, expires) {
			
			if (val === undefined) {
				var cook = document.cookie;
				
				if (cook) {
				  var i = cook.indexOf(name + "=");
				  if (i > -1) {
					 var end = cook.indexOf(";", i);
					 return cook.substring(i + name.length + 1, end > -1 ? end : cook.length);
				  }
				}
			} else {
				document.cookie = name +"="+ escape(val) + (
					expires ? ";expires=" +(new Date((new Date()).getTime() + 100000000)).toUTCString() : ""
				);
			}
			return api;
		}, 
		
		screens: function(val) {
			screens = val;
			return api;
		}
		
	}; 			
		
	
	// browser type & version
	var ua = navigator.userAgent.toLowerCase();
	
	ua = /(webkit)[ \/]([\w.]+)/.exec( ua ) ||
		/(opera)(?:.*version)?[ \/]([\w.]+)/.exec( ua ) ||
		/(msie) ([\w.]+)/.exec( ua ) ||
		!/compatible/.test( ua ) && /(mozilla)(?:.*? rv:([\w.]+))?/.exec( ua ) || [];
		
	addClass(ua[1])
	addClass(ua[1] + ua[2].replace(".", "").substring(0, 2));
	
	head.browser = { version: parseFloat(ua[2]) };
	head.browser[ua[1]] = true;	
	
	// enable HTML5 for IE
	if (head.browser.msie && head.browser.version < 9) {
		each("article|aside|footer|header|nav|section".split("|"), function(elem) {		
			doc.createElement(elem);
		});
	} 
	
	// page class && id
	var root = location.host,
		 path = location.href.substring(location.href.indexOf(root) + root.length + 1),
		 els = path.split("/"),
		 section = els.slice(0, els.length -1).join("-") || "root";
		 pageId = els.slice(-1)[0] || "index",
		 index = pageId.indexOf(".");
	
	if (index >= 0) { pageId = pageId.substring(0, index); }
	
	
	head.section = section;	
	head.pageId = pageId;	

	addClass(section + "-section");
	html.id = pageId + "-page";
	
	
	// window width: w100, lt480, lt1024 ...
	function screenSize() {
		var w = document.width || window.outerWidth || document.documentElement.clientWidth;
		
		// remove earlier screens
		html.className = html.className.replace(/ (w|gt|lt)\d+/g, "");
		addClass("size" + Math.round(w / 100) * 100);
		
		each(screens, function(width) {
			if (w <= width) { addClass("lt" + width); } 
		})
	}
	
	screenSize();	 	
	window.onresize = screenSize;	
	
	head.feature("script", true);
	
	
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
		return len > 0 && len < 150;
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
		
		reflection: function() {
      	return testAll("box-reflect:right 0");
      },
      
		transform: function() {
      	return testAll("transform:rotate(1deg)");
      }      
      
	};

		
	for (var key in tests) {		
		head.feature(key, tests[key].call());
	}	
	
	
})(document);



(function(doc) { 
		
	var ready = false,
		 queue = [],
		 thelast = [],		// functions to be executed last
		 waiters = {},		// functions waiting for scripts
		 scripts = {};		// the scripts in different states

		 
	/*** public API ***/
	var api = window.head = window.head || {};


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
			if (!isFunc(next)) api.preload.apply(null, rest);
		
			// load all recursively in order
			load(getScript(args[0]), isFunc(next) ? next : function() {	
				api.js.apply(null, rest);
			});				
			
		// single function	
		} else if (isFunc(args[0])) {			
			thelast.push(args[0]);
			
		// single script	
		} else {
			load(getScript(args[0])); 	
		}
		
		return api.js;		 
	};
		
	api.wait = function(src, fn) {
		var arr = waiters[src];
		if (!arr) arr = waiters[src] = [fn];
		else arr.push[fn];
		return api.js;
	};
		
	api.preload = function() {	
		each(arguments, function(el) {
			if (!isFunc(el))
				preload(getScript(el));
		});
		
		return api.js;				
	};
		
	api.dump = function() {
		console.info(scripts);
	};
	
	
	/*** private functions ***/
	function getScript(url) {
		
		var script = scripts[url.url || url];
		if (script) return script;
		
		if (typeof url == 'object')  {
			for (key in url) {
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
		return typeof el == 'function';	
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
			
			if (head.mozilla) {
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
			each(waiters[script.url], function(fn) {
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
			if (!api.msie) {			
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
