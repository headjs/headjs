/**
	Head JS		The only script in your <HEAD>
	Copyright	Tero Piirainen (tipiirai)
	License		MIT / http://bit.ly/mit-license
	Version		0.8
	
	http://headjs.com
*/
(function(doc) { 
		
	var head = doc.documentElement,		 
		 smallwait,
		 isDomReady, 
		 domWaiters = [],
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
						if (allLoaded(els)) { one(fn); }
							
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
				
			// wait for a while. immediate execution causes some browsers to ignore caching	 
			if (!smallwait) {
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
		
		if (key == 'dom') {
			if (isDomReady) { one(fn);  } 
			else { domWaiters.push(fn); }
			return api;
		}
		
		// shift arguments	
		if (isFunc(key)) {
			fn = key; 
			key = "ALL";
		}				
		
		var script = scripts[key];		
		
		if (script && script.state == LOADED || key == 'ALL' && allLoaded() && isDomReady) {
			one(fn);			
			return api;
		}  
						
		var arr = handlers[key];
		if (!arr) { arr = handlers[key] = [fn]; }
		else { arr.push(fn); }
		return api;		
	};


	// perform this when DOM is ready
	api.ready("dom", function() {		
		
		if (smallwait && allLoaded()) {
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
		if (existing && existing.url === script.url) { return existing; }
		
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
		var loaded = false,
			 count = 0;
		
		for (var name in els) {
			if (els[name].state != LOADED) { return false; }
			loaded = true;
			count++;
		}
		return loaded || count === 0;			
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
				one(fn);
			});
		
			
			if (isDomReady && allLoaded()) {
				each(handlers.ALL, function(fn) {
					one(fn);
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
	
	
	setTimeout(function() {
		smallwait = true;
		each(queue, function(fn) { fn(); });		
	}, 0);	  
	
	
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
		window.addEventListener("onload", fireReady, false);
		
	// IE	
	} else if (window.attachEvent) {
		
		// for iframes
		doc.attachEvent("onreadystatechange", function()  {
			if (doc.readyState === "complete" ) {
				fireReady();
			}
		});
		
		// http://javascript.nwbox.com/IEContentLoaded/
		if (window.frameElement == null && head.doScroll) {
			
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
	
})(document);

