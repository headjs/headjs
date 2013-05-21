#Collection of Feature Detections

##You can easily write tests for just about anything

* Clone the repository
* Add a description of your test to *inventory.json*

        [
            {
	            "id"         : "flash",
	            "title"      : "Flash",
	            "category"   : "browser",
	            "description": "Detect if browser supports a version of Adobe Flash runtime",
	            "package"    : "features/browser/flash.json"
            },
            {
	            "id"         : "geolocation",
	            "title"      : "GeoLocation",
	            "category"   : "browser",
	            "description": "Test for browser geolocation support",
	            "package"    : "features/browser/geolocation.json",
	            "url":       "http://caniuse.com/#feat=geolocation"
            }
        ]

- Write your test and add it to *features/{type}/mytest.json*

        // Test for browser geolocation support
        {
            "name"  : "geolocation",
            "result": function () { 
                return "geolocation" in navigator;
            }
        }

- Issue a Pull request !


#### Be sure to also check out the awesome resources from [Modernizr](https://github.com/Modernizr/Modernizr/tree/master/feature-detects)!