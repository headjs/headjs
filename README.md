[![Head JS](http://headjs.com/site/assets/img/logo-big.png)](http://headjs.com)

This project was never announced. `git push` and it was all viral.


<div>
	<a href="https://saucelabs.com/u/itechnology"><img src="https://saucelabs.com/browser-matrix/itechnology.svg" alt="Selenium Status" /></a>	
	<a style="vertical-align:top" href="https://travis-ci.org/headjs/headjs"><img src="https://travis-ci.org/headjs/headjs.png?branch=master" alt="Build Status" /></a>		
</div>


##About
  * _Load scripts and css on demand_
  * _Achieve responsive design with CSS that targets different screen resolutions, paths, states and browsers_
  * _Detect various browsers and their features_
  * _Target HTML5 and CSS3 safely_
  * __Make it the only script in your HEAD__
  * __A concise solution to universal problems__


##Where
* __WebSite__
  * [http://headjs.com](http://headjs.com)
* __Blog/Dev Updates__
  * [http://www.i-technology.net](http://www.i-technology.net/search/label/headjs)
* __Bugs/Support__
  * [https://github.com/headjs/headjs/issues](https://github.com/headjs/headjs/issues)
* __Get Community Help__
  * [http://stackoverflow.com](http://stackoverflow.com/questions/tagged/head.js)
  * _Remember to tag your questions with_: head.js
* __Vote for Features/Suggestions__
  * [http://headjs.uservoice.com](http://headjs.uservoice.com/forums/182905-headjs-feature-suggestions)

##Updates

###1.0.2 (2013-11-13)
	 - Fix: no-js class not being removed
	   - https://github.com/headjs/headjs/issues/270

###1.0.1 (2013-11-05)
	 - Fix: Old IE's can trigger ready too soon
	   - https://github.com/headjs/headjs/issues/203

###1.0.0 (2013-11-04)

	 - New: Detect Windows 8 Mobile (Surface RT/Pro), IE11, Kindle, and other Android devices
	 - New: Add Browser & Version CSS no matter what browser breakpoints are configured
	   - Example: .ff .ff20
	   - There is no need to cycle through all browser versions in 90% of cases
	   - Makes it possible to work without any breakpoints at all
	 - New: Improved CSS Router
	   - https://github.com/headjs/headjs/issues/227
	 - New: Added "main" HTML5 element to shim
	   - https://github.com/headjs/headjs/pull/230
	 - New: Enable/Disable HTML5 Shim in head_conf
	 - New: Possibility to load via array of items
	   - head.load(["file1", "file2"], callBack);
	   - https://github.com/headjs/headjs/issues/139
	 - New: Possibility to wait for multiple labels
	   - head.ready(["label1", "label2"], callBack);
	   - https://github.com/headjs/headjs/pull/212
	 - New: Load file via data attribute on HeadJS script tag
	   - data-headjs-load="configuration.js"
	   - https://github.com/headjs/headjs/pull/213
	 - New: Source map files have been added for all minified JS files
	 - Fix: Prevent loading empty strings
	   - https://github.com/headjs/headjs/pull/184
	 - Fix: CSS classes getting bigger on successive resizes under Chrome
	   - https://github.com/headjs/headjs/issues/226 
	 - Fix: Invalid regular expression for CSS detection
	   - https://github.com/headjs/headjs/issues/255
	 - Fix: callback firing too early when a resource was previously loaded
	   - https://github.com/headjs/headjs/issues/262
	 - Divers: Changed window.frameElement detection
	   - https://github.com/headjs/headjs/pull/257
	 - Divers: Cleaned up a bunch of syntaxt to conform to JSHint
	   - Now using a very strict .jshintrc
	 - Divers: Added missing .gitattributes
