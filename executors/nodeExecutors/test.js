
var run = require('./run');

run({
  files: {
    '/test.html': 'console.log("Hi!");',
    '/index.js': 'var app = require("express")(); app.get("/", function(req, res){ var x = require("fs").readFileSync("/test.html");console.log(typeof x); res.status(200).send("Hello World"); }); app.listen(3001);'
  }
}, {}, console);

