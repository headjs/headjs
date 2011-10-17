
/* 
    node.js server for testing 
    
    http://localhost:3000/foo?value=1&time=200
    
    --> (after 200ms) : var foo = 1;
*/

var http = require("http");

http.createServer(function (req, res) {

    var url = require('url').parse(req.url, true),
        params = url.query || {},
        head = { 'Content-Type': 'text/javascript' },
        value = params.value ? url.pathname.slice(1) + " = " + params.value + ";" : "";
    
    
    if (!params.nocache) {
        head.Expires = 'Thu, 31 Dec 2037 23:55:55 GMT';
        head['Cache-Control'] = 'max-age=315360000';
    }
    
    res.writeHead(200, head);
    
    
    if (params.require) {
        value = "if (typeof " + params.require + " != 'undefined' ) { " + value + "}";
    }
    
    setTimeout(function() {
        res.end(value);

    }, params.time ? 1 * params.time : 0);


}).listen(3000);