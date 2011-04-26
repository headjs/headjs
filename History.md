
n.n.n / 2011-04-26 
==================

  * qUnit based test framework
  * Merge branch 'master' into dev
  * removed jQuery dependency on tests
  * corrected paths in random.html
  * moved manual test files into the tests/manual-tests/ folder
  * Added QUnit unittests
  * Some overall robustness. More code commenting
  * switch of version number
  * Issue 96. Fixed a small looping mistake
  * head.ready('dom') changed to head.ready(document). better sanity check for head.ready() arguments
  * Issue 94: fixed window.addEventListener 'onload' --> 'load'
  * In IE the version number is checked from document.documentMode and not from UserAgent string
  * added a specific IE version to the CSS classes
  * Issue 91. Avoid of duplicate preload with text/cache JavaScript
  * Issue 88. IE no longer throw an error together with frames on different domains
  * Polishing the version
  * A forgotten console.info() staement
  * Version 0.9
  * Looks like v0.9
  * @font-face detection & class naming identical to modernizr.
  * Exposed head.ready("dom") to public API. Fixed issue 82.
  * domloaded css-property added for CSS developers
  * head(fn) and head.ready(fn) now also wait for DOM to be ready
  * DOM ready implementation to be integrated into load.js
  * Allow empty string values on configuration
  * minified versions
  * Issue 69. head(function()) fix for Chrome.
  * new combined & minified versions
  * Issue 62: In head.ready(callback) the callback will be called immediately if all scripts are loaded.
  * Updated combined & minified files
  * Final twists for 0.8
  * Issue 51: Cannot load a same URL twice - however the callback is executed if given in head.js() call.
  * Update of the combined and minified versions
  * Fixed CSS3 tests for Opera 11. Thanks Paul Irish. Made loader pass JS Lint.
  * Initial version of async=false loading for Firefox and Opera
  * Detect DOMContentLoaded in FF3.5 and before
  * minified versions for 0.5
  * v0.5. Bugs gathered & fixed for production use. Shifting my emotion on 1.0.
  * Issue 45. Avoid possible null pointer exception
  * Fixed issue 31: Proper script preloading for Firefox 3.6. Also fix for Issue 37. Script tags are no longer removed because they caused DOM errors in IE and Opera.
  * Issue 35: fixed to watch "no-js" substring instead of "no-script" as documented.
  * Small bug fix for CSS routing.
  * Subpath support for CSS router: /foo/bar/ adds "foo-section" and "foo-bar-section" classes to HTML element
  * typo in comment: s/dealy/delay/
  * Tested with: firefox, chrome, safari, opera and IE 6-8.
  * Polishing. Trunk should be rather good now.
  * Calling head.ready("my-script", function) will execute the function and exit if "my-script" is already loaded.
  * Issue 26: removed global head_conf variable if it's not explicitly defined
  * removed head.error(): this is unfortunate but there is no way to know in IE whether a request succeeded or not
  * Made head.error() work on Opera.
  * head.error() function for detecting loading errors.
  * Makefile for building minified versions. Uses uglifyjs. Directory structure changes.
  * Cleaned up the test directory in favor to having tests on the public website. A more solid test framework (qunit or similar) will be introduced on this repository.
  * Issue 22: CSS detection now works correctly.
