/**
	Head JS		The only script in your <HEAD>
	Copyright	Tero Piirainen (tipiirai)
	License		MIT / http://bit.ly/mit-license
	
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
						var allLoaded = true;
						
						each(els, function(s) {
								
							if (s.state != 'loaded') { allLoaded = false; }
						});
							
						if (allLoaded) { fn(); }
							
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
		
		var script = scripts[key];
		
		if (script && script.state == 'loaded') {
			fn.call();
			return api;
		}
		
		// shift arguments	
		if (isFunc(key)) {
			fn = key; 
			key = "ALL";
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
	
	
	function onPreload(script) {
		script.state = "preloaded";

		each(script.onpreload, function(el) {
			el.call();
		});					
	}
	
	function preload(script, callback) {
		
		if (!script.state) {
						
			script.state = 'preloading';
			script.onpreload = [];

			scriptTag({ src: script.url, type: 'cache'}, function()  {
				onPreload(script);		
			});			
		}
	} 
	
	function load(script, callback) {
		
		if (script.state == 'loaded' && callback) { 
			return callback(); 
		}
			
		if (script.state == 'preloading') {			
			return script.onpreload.push(function()  {
				load(script, callback);	
			});
		}  
		
		script.state = 'loading'; 

		scriptTag(script.url, function() {
			
			script.state = 'loaded';
			
			if (callback) { callback(); }			
			
			
			// handlers for this script
			each(handlers[script.name], function(fn) {				
				fn.call();		
			});

			var allLoaded = true;
		
			for (var name in scripts) {
				if (scripts[name].state != 'loaded') { allLoaded = false; }	
			}
		
			if (allLoaded) {
				each(handlers.ALL, function(fn) {
					if (!fn.done) { fn.call(); }
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
			fn.call();			
		});		
	}, 200);	
	
	
	// enable document.readyState for Firefox <= 3.5 
	if (!doc.readyState && doc.addEventListener) {
	    doc.readyState = "loading";
	    doc.addEventListener("DOMContentLoaded", handler = function () {
	        doc.removeEventListener("DOMContentLoaded", handler, false);
	        doc.readyState = "complete";
	    }, false);
	}
			
})(document);

