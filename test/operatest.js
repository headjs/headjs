(function () {
	try {
		if (/Opera/i.test(navigator.userAgent)) {
			var elem = document.getElementById("opera");
			elem.innerHTML = elem.innerHTML.replace(/does not/, "now works");
		} else {
			alert("this test is meant to be run in Opera");
		}
	} catch (e) {
		alert (e);
	}
})();
