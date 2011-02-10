
var isDomReady, domWaiters = [];

function each(arr, fn) {
	if (!arr) { return; }
	
	// arguments special type
	if (typeof arr == 'object') { arr = [].slice.call(arr); }
	
	// do the job
	for (var i = 0; i < arr.length; i++) {
		fn.call(arr, arr[i], i);
	}
}


function domReady(fn) {		
	if (isDomReady) {
		fn();
		
	} else { 
		domWaiters.push(fn); 
	}	
}

function fireReady() { 
	isDomReady = true;
	each(domWaiters, function(fn) {
		if (!fn._done) {
			fn._done = 1;
			fn();		
		}
	});
}

(function() {
	
	// W3C
	if (window.addEventListener) {
		document.addEventListener("DOMContentLoaded", fireReady, false);
		window.addEventListener("onload", fireReady);
		
	// IE	
	} else if (window.attachEvent) {
		
		// for iframes
		document.attachEvent("onreadystatechange", function()  {
			if (document.readyState === "complete" ) {
				fireReady();
			}
		});
		
		// http://javascript.nwbox.com/IEContentLoaded/
		var toplevel = false,
			 head = document.documentElement;
	
		try { toplevel = window.frameElement == null; } catch(e) {}
	
		if (head.doScroll && toplevel) {
			
			(function() { 
				try {
					head.doScroll("left");
					fireReady(); 
			
				} catch(e) {
					setTimeout(arguments.callee, 1);
					return;
				}		
			})();			
		} 
				
		// fallback
		window.attachEvent("onload", fireReady);		
	}
	
})();

