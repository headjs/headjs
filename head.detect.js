// https://github.com/Modernizr/Modernizr/blob/master/modernizr.js
(function(doc) {
		
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
		
		reflections: function() {
			return testAll("box-reflect:right 0");
		},
      
		transforms: function() {
			return testAll("transform:rotate(1deg)");
		},
		
		transitions: function() {
			return testAll("transition:all .5s linear");
		}
      
	};

	var api = window[head_conf.head];
		
	for (var key in tests) {		
		api.feature(key, tests[key].call());
	}
	
})(document);	