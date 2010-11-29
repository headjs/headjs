
// http://marijnhaverbeke.nl/uglifyjs
// https://github.com/Modernizr/Modernizr/blob/master/modernizr.js
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
	
	api.cookie = function(name, val, expires) {
		
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
	}; 			
		
	
	// browser type & version
	var ua = navigator.userAgent.toLowerCase();
	
	ua = /(webkit)[ \/]([\w.]+)/.exec( ua ) ||
		/(opera)(?:.*version)?[ \/]([\w.]+)/.exec( ua ) ||
		/(msie) ([\w.]+)/.exec( ua ) ||
		!/compatible/.test( ua ) && /(mozilla)(?:.*? rv:([\w.]+))?/.exec( ua ) || [];
		
	if (ua[1] == 'msie') ua[1] == 'ie';		
	addClass(ua[1]);
	addClass(ua[1] + ua[2].replace(".", "").substring(0, 2));
	
	head.browser = { version: parseFloat(ua[2]) };
	head.browser[ua[1]] = true;	
	
	// IE specific
	if (head.browser.ie) {
		
		// IE versions
		for (var ver = 3; ver < 11; ver++) {
			if (ua[2] <= ver) { addClass("lt-ie" + ver); } 			
		}
	} 
	
	// HTML5 support
	each("article|aside|footer|header|nav|section".split("|"), function(el) {		
		doc.createElement(el);
	});
		
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


