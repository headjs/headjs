
var console = {
	info: function(a, b, c)  {
		info.innerHTML += "<p>" + [].join.call(arguments) + "</p>";  		
	},
	
	log: function() {
		console.info.apply(null, arguments);
	}
	
};

var info = document.createElement("info");
document.body.appendChild(info);
