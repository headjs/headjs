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
	
		 
	 // Thanks Paul Irish!	 
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


