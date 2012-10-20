![Head JS](http://headjs.com/media/img/headjs.gif)

This project was never announced. `git push` and it was all viral.

The website: [http://headjs.com](http://headjs.com)

v0.97a / 2012-10-20

[Report a Bug](https://github.com/headjs/headjs/issues).


0.97a

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


Future

- In the immediate future i would like to patch up things that have been sitting on hold, and make sure that people already using **HeadJS**, can continue to use it without any breaking changes.
- After that however things will likely change a bit
 - Have a peek here [HeadJS@I-Technology](https://github.com/itechnology/headjs)
 - For example :
     - Programatically it's very hard to use the current syntax of prefixig things with **no-**. Instead they should be suffixed with **-true/-false**. Like this it is very easy to generate variable on the fly and have them match your HeadJS rules.
     - Currently screen detection is based on the **outerWidth** of the navigator window, so once you add tabs, scrollbars, sidebars, & toolbars ..you are probably in for a big surprise with your design! Therefore generated classes should instead reflect the actual screen estate availiable: **innerWidth/innerHeight**
     - Right now you only get classes based on **width lt**, but what about **lte, gt, and gte** ? Not to mention **height** ! :)


_**Rebooting HeadJS,**_

This project was sitting idle for the last year or so, but me [Robert Hoffmann](https://github.com/itechnology) and [Paul Irish](https://github.com/paulirish) have just gotten the green light from [Tipiirai](https://github.com/tipiirai) to try and keep the project alive a bit more :)


There will be a few questions to work out, but i think that **HeadJS** still solves the basic problems that many users are experiencing. Especially in the Enterprise, where we must support obsolete browsers while moving forward with our time.

1. Feature detection
  * This area seems well covered by [Modernizr](http://modernizr.com)
2. Script loading
	* This area also seems well covered by libraries like [YepNope.JS](http://yepnopejs.com) or [Require.JS](http://requirejs.org)
	* [YepNope.JS](http://yepnopejs.com) can by the way be bundled into [Modernizr](http://modernizr.com)
3. Responsive design
	* **HeadJS** handles this very well through css classes
	* But there are other solutions like [Respond.JS](https://github.com/scottjehl/Respond) that work well too.
4. Browser detection
5. Plug browser quirks


Since points 1 & 2 seem pretty well covered, going forward we will need to decide if these functionalities should be removed or not from **HeadJS**, so we can concentrate on the points that **HeadJS** excels in: 3, 4, &amp; 5

If you're like me, and need to support browsers like IE6+, FF2+, and think head.js does a great job emulating responsive design, while letting you plug the odd bugs and quirks of your least favorite browsers...

_**then stay tuned :)**_