
var expect = require('chai').expect;

describe('Runner', function() {

  var run;

  beforeEach(function(){

    run = require('../run');

  });

  describe("Runninng simple code", function(){

    it("should run simple code", function() {

      // given
      var x, obj = {
        code: "console.log('hello');"
      };

      // when
      run(obj, {}, {
        log: function(arg) {
          x = arg;
        }
      });

      // then
      expect(x).to.equal('hello');

    });

    it('should run code and load core module', function(){

      // given
      var x, obj = {
        code: "var x = require('path'); console.log(x.join('hello'));"
      };

      // when
      run(obj, {}, {
        log: function(arg) {
          x = arg;
        }
      });

      // then
      expect(x).to.equal('hello');

    });

    it('should display filename & dirname', function(){

      // given
      var f, d, obj = {
        code: "console.log(__filename, __dirname);"
      };

      // when
      run(obj, {}, {
        log: function(arg, arg2) {
          f = arg;
          d = arg2;
        }
      });

      // then
      expect(f).to.equal('index.js');
      expect(d).to.equal('/');

    });

  });

  describe('Running code with files', function() {

    it('should run index.js file', function() {

      // given
      var x, obj = {
        files: {
          '/index.js': "console.log('hello');"
        }
      };

      // when
      run(obj, {}, {
        log: function(arg) {
          x = arg;
        }
      });

      // then
      expect(x).to.equal('hello');

    });


    it('should allow to include other file', function() {

      // given
      var x, obj = {
        files: {
          '/main.js': 'module.exports = function() { console.log("hello"); };',
          '/index.js': 'require("./main")();'
        }
      };

      // when
      run(obj, {}, {
        log: function(arg) {
          x = arg;
        }
      });

      // then
      expect(x).to.equal('hello');

    });

    it('should allow to include other file with nested require to inner module', function() {

      // given
      var x, obj = {
        files: {
          '/path.js': 'module.exports = require("path");',
          '/main.js': 'module.exports = function() { console.log(require("./path").join("hello")); };',
          '/index.js': 'require("./main")();'
        }
      };

      // when
      run(obj, {}, {
        log: function(arg) {
          x = arg;
        }
      });

      // then
      expect(x).to.equal('hello');

    });

  });

  it('should allow to include big library', function() {

    // given
    var x, obj = {
      files: {
        '/index.js': 'require("express");console.log("hello");'
      }
    };

    // when
    run(obj, {}, {
      log: function(arg) {
        x = arg;
      }
    });

    // then
    expect(x).to.equal('hello');

  });

  it('should start express server', function(){
    // given
    var x, obj = {
      files: {
        '/index.js': 'var app = require("express")(); app.get("/", function(req, res){ res.send("Hi"); }); app.listen(3001);'
      }
    };

    // when
    run(obj, {}, {
      log: function(arg) {
        x = arg;
      }
    });

    // then
    expect(x).to.equal('hello');
  });

});

