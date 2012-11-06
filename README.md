![Head JS](http://headjs.com/media/img/headjs.gif)

This project was never announced. `git push` and it was all viral.

* __WebSite__
  * [http://headjs.com](http://headjs.com)
* __Bugs/Support__
  * [https://github.com/headjs/headjs/issues](https://github.com/headjs/headjs/issues)
* __Get Community Help__
  * [http://stackoverflow.com](http://stackoverflow.com/questions/tagged/head.js)
  * _Remember to tag your questions with_: head.js
* __Vote for Features/Suggestions__
  * [http://headjs.uservoice.com](http://headjs.uservoice.com/forums/182905-headjs-feature-suggestions)

###RoadMap (v1.0 / v2.0) 2012-11-06

	- Conditional Loader
	  - head.test(bool, success, failure, callback)
	- Resource Loading
	  - head.load(somefile.js , callback)
	  - head.load(somefile.css, callback)
	- Advanced Responsive Design
	  - Take into account browsers min/max versions & height/width pseudo media queries (lt, lte, eq, gt, gte)
	  - .ie-lt6, .ff-gte17, .w-lt1024, .h-gte800
	- Inverse naming conventions for readability & to be able to programatically inject values more easily
	  - .no-box-shadow -> .box-shadow-true/false
		- jQuery(selector).addClass("box-shadow-" + head.features.boxShadow)
		- class="localStorage-<%= bool.toString().toLower() %>"
	  - .no-ie -> .ie-true/false
	  - .index-page -> .page-index
	- Advanced Configuration  
	  - Expose a maximum of functionalty through head_conf, so you only get the functionality you actually require
	    - Enable/Disable lt/gt class generation
	    - Enable/Disable height/width support
   	    - Configure custom height/width/browser breakpoints 
	    - ..etc
	- Remove tests from css3.js and let users "roll their own"
      - 80% of css related tests are probably irrevelant anyways
        - For things like border-radius & the likes everyone uses gracefull degradation with their css anyways ..right ? :)
	- Renaming files
	  - head.responsive.js (can be used standalone)
	    - old core.js with a few additions from css3.js so we can externalise the test suite
	  - head.load.js (can be used standalone)
	    - old load.js
	  - head.features.js (MUST be used with head.responsive.js)
	    - old css3.js, but now only integrates actual tests	  
	- Revamped website with Twitter Bootstrap
	  - Make the site a tad more ergonomic to navigate
	  - Expose unit tests & advanced documentation directly in site
	  - Custom "roll-your-own" builder
	  - Integrate website with gh-pages for quicker deploy
	  
*How much of this roadmap will end up in the current version of head.js, i don't know yet.*

* Most likely when v1.0 comes out, it will have a good part of the above functioanlity included while at the same time preserving the existing api syntax.
  * Like this, those that already depend on HeadJS get no breaking changes.
* At the same time there will probably be a v2.0 release that uses the above syntax, and be the defacto version for future development.
	  
__P.S. 70% of the preliminary work mentioned above is already done :)__

###v0.97a / 2012-10-20

	- Updated QUnit &amp; got unit tests running again
	- Swictched to "use strict"
	- Fixed up some variable usages
	- Added browser detections other than just for ie-lt
	- updated browser regexes (firefox, safari, opera, ios, android, webkit)
	- detect if browser is: desktop, mobile, touch enabled
	- detect portrait/landscape mode
	- html5 shim now only triggers on ie-lt9
	- added a throttle to onResize, since some browsers fire tons of events/sec
	- added corrected height/width measurements, but only exposed via new object: head.screen
	  - contains height/width, innerHeight/innerWidth, outerHeight/outerWidth
	- forced all css router names to lowercase just in case ppl type in url's with wierd casings