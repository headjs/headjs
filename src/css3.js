/**
 	Head JS		The only script in your <HEAD>
	Copyright	Tero Piirainen (tipiirai)
	License 		MIT / http://bit.ly/mit-license
	
	http://headjs.com
*/
(function(api) {
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
		 prefs = ' -o- -moz- -ms- -webkit- -khtml- '.split(' ');
		 
	/* 
		runs a vendor property test (-moz, ...)  
		
		testAll("box-shadow: 0 0 0 red;");
	*/
	function testAll(definition)  {
		style.cssText = prefs.join(definition + ";");
		var val = style.cssText;
		if (val.indexOf("-o") != -1 && val.indexOf("-ms") != -1) { return false; }
		return !!val;
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
			return el.style.opacity === "";
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


