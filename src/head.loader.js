/**
	Head Loader: The ultimate JavaScript loader. Can be used as a standalone tool. 
	
	copyright: "tipiirai" / Tero Piirainen
	license: MIT
*/ 
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
