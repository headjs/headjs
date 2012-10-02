_**Hello everyone,**_

This project may have been sitting idle for the last year or so, but i [Robert](https://github.com/itechnology) have just gotten the green light from [Tipiirai](https://github.com/tipiirai) to try and keep the project alive together with [Paul](https://github.com/paulirish).


There will be a few questions to work out, but i think that [Head.JS](http://headjs.com) still solves some basic problems that many users are experiencing. Especially in the Enterprise, where we must support obsolete browsers while at the same time moving forward with our time.

1. Feature detection
  * This area seems well covered by [Modernizr](http://modernizr.com)
2. Script loading
	* This area also seems well covered by libraries like [YepNope.JS](http://yepnopejs.com) or [Require.JS](http://requirejs.org)
	* [YepNope.JS](http://yepnopejs.com) can by the way be bundled into [Modernizr](http://modernizr.com)
3. Responsive design
	* [Head.JS](http://headjs.com) handles this very well through css classes
	* But there are other solutions like [Respond.JS](https://github.com/scottjehl/Respond) that work well too.
4. Browser detection
5. Plug browser quirks


Since points 1 & 2 seem pretty well covered, going forward we will need to decide if those functionalities should be removed or not from [Head.JS](http://headjs.com), to be able to concentrate on the points that [Head.JS](http://headjs.com) handles well: 3-5

If you're like me, and need to support browsers like IE6+, FF2+, and think head.js does a great job emulating responsive design, while letting you plug the odd bugs and quirks of your least favorite browsers...

_**then stay tuned :)**_