![Head JS](http://headjs.com/media/img/headjs.gif)

## Forked from original

[http://headjs.com](http://headjs.com)<br/>
v0.96 Wednesday, May 18 2011.

## Changes

*  Added new **_load progress_** &nbsp;feature that supports notification of load progress for each item in the head.js() queue:
*  Added new **css( )** feature that supports silently loading of 1 or more stylesheets with optional notification callbacks.

    /**
	* Load files in parallel but execute them in sequence
	* Note: developer is required to manually specify each script size!
	*/
	head
	    .css (
	    	[
	    		"css/stylesheet1.css",
	    		"http://www.gridlinked.info/cdn/css/jsFiddle.css"
	    	],
	    	function( styleSheet ) {
	    		console.log( styleSheet + " loaded.");
	    	}
	    )
		.js(
			{ jquery     :	"js/jquery/jquery.min.js", 	size : "93876"		},
			{ uuid       :	"js/uuid.js", 				size : "7362"		},
			{ underscore :  "js/underscore-min.js", 	size : "12140"		},
			{ namespace  :	"js/namespace.min.js", 		size : "392"	 	}
		)
		.notify( function (scriptName,scriptSize, loaded, total) {
			
			/**
			* As each library loads update a loading indicator;
			* with subjective progress values
			*/
			
		})
		.ready( "ALL", function() {

 		});

This feature allows head.js() notifications to used to update a loading progress bar in a splash screen, update a log file, etc.