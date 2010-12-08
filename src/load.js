/**
 	Head JS		The only script in your <HEAD>
	Copyright	Tero Piirainen (tipiirai)
	License 		MIT / http://bit.ly/mit-license
	
	http://headjs.com
*/
(function(doc) { 
		
	var head = doc.documentElement,
		 ie = navigator.userAgent.toLowerCase().indexOf("msie") != -1, 
		 ready = false, 	// is HEAD "ready"
		 queue = [],		// if not -> defer execution
		 handlers = {},	// user functions waiting for events
		 scripts = {};		// loadable scripts in different states

		 
	/*** public API ***/
	var head_var = window.head_conf && head_conf.head || "head",
		 api = window[head_var] = (window[head_var] || function() { api.ready.apply(null, arguments); }); 
	
		
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
			
			// preload the rest
			if (!isFunc(next)) { 
				each(rest, function(el) {
					if (!isFunc(el)) {
						preload(getScript(el));
					} 
				});			
			}
		
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
	
	/*
	api.dump = function() {
		console.dir(scripts);	
	};
	*/

	
	/*** private functions ***/
	function getScript(url) {
		
		var script = scripts[url.name || url];
		if (script) { return script; }
		
		if (typeof url == 'object') {
			for (var key in url) {
				if (url[key]) {
					script = { name: key, url: url[key] };
				}
			}
		} else {


			var els = url.split("/"),
				 name = els[els.length -1],
				 i = name.indexOf("?");
				 
			script = {
				name: i != -1 ? name.substring(0, i) : name, 
				url: url 
			}; 
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
			
			// handlers for this script
			each(handlers[script.name], function(fn) {
				fn.call();		
			});

			// TODO: do not run until DOM is loaded			
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
	
	// if callback == true --> preload
	function scriptTag(src, callback)  {
		
		var elem = doc.createElement('script');		
		elem.type = 'text/' + (src.type || 'javascript');
		elem.src = src.src || src;  
			
		elem.onreadystatechange = elem.onload = function() {
			var state = elem.readyState;

			if (!callback.done && (!state || /loaded|complete/.test(state))) {
				callback.call();
				callback.done = true;
			}
			
			// cleanup. IE runs into trouble
			if (!ie) {			
				head.removeChild(elem);
			}
		}; 
		
		head.appendChild(elem); 
	} 
	
	/*
		Start after a small delay: guessing that the the head tag needs to be closed
	*/	
	setTimeout(function() {
		ready = true;
		each(queue, function(fn) {
			fn.call();			
		});		
	}, 200);	
		
})(document);
