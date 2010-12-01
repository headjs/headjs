
var console = {
	info: function(a, b, c)  {
		var info = document.getElementById("info");
		info.innerHTML += "<p>" + [].join.call(arguments) + "</p>";  		
	},
	
	log: function() {
		console.info.apply(null, arguments);
	}
	
};


