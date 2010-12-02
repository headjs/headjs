/**
	Head JS: The only script in your <HEAD>.
	
	Copyright: "tipiirai" / Tero Piirainen
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


