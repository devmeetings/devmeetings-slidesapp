/**
 * https://github.com/mochajs/mocha/wiki/Using-mocha-programmatically
 */

var Mocha = require('mocha');
var fs = require('fs');
var path = require('path');

// First, you need to instantiate a Mocha instance.
var mocha = new Mocha;

// Then, you need to use the method "addFile" on the mocha
// object for each file.

// Here is an example:
fs.readdirSync('test').filter(function(file){
  // Only keep the .js files
  return file.substr(-3) === '.js';

}).forEach(function(file){
  // Use the method "addFile" to add the file to mocha
  mocha.addFile(
    path.join('test', file)
  );
});
var passed = [];
var failed = [];
// Now, you can run the tests.
mocha.run(function(){
    console.log(passed.length + ' tests passed, ' + failed.length + ' tests failed');
    
    passed.forEach(function(testName){
        console.log('Passed: ' + testName);
    });
    failed.forEach(function(testName){
        console.log('Failed: ' + testName);
    });

}).on('fail', function(test){
    failed.push(test.title);
}).on('pass', function(test){
    passed.push(test.title);
});
