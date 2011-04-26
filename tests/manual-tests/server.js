#!/usr/bin/env node

// node.js server for testing
var http = require("http");

http.createServer(function (req, res) {

   var url = require('url').parse(req.url, true),
         params = url.query || {};

    res.writeHead(200, {
        'Content-Type': 'text/javascript'
        ,'Expires': 'Thu, 31 Dec 2037 23:55:55 GMT'
        ,'Cache-Control':   'max-age=315360000'
    });

    setTimeout(function() {
        res.end("console.info('    GOT', '" + req.url + "')");

    }, params.time ? 1 * params.time : 1000);

    console.log(url);

}).listen(2000);