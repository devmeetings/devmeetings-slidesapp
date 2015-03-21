
var expect = require('chai').expect;

describe('Runner', function() {

  var run;

  beforeEach(function(){

    run = require('../run');

  });

  describe("Runninng simple code", function(){

    it("should run simple code", function(done) {

      // given
      var x, obj = {
        code: "console.log('hello');"
      };

      // when
      run(obj, {}, {
        log: function(arg) {
          x = arg;
        }
      }, function(err) {

        // then
        expect(err).to.equal(null);
        expect(x).to.equal('hello');
        done();

      });

    });

    it('should run code and load core module', function(done){

      // given
      var x, obj = {
        code: "var x = require('path'); console.log(x.join('hello'));"
      };

      // when
      run(obj, {}, {
        log: function(arg) {
          x = arg;
        }
      }, function(err) {

        // then
        expect(err).to.equal(null);
        expect(x).to.equal('hello');
        done();

      });

    });

    it('should display filename & dirname', function(done){

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
      }, function(err) {

        // then
        expect(err).to.equal(null);
        expect(f).to.equal('index.js');
        // TODO [ToDr] In perfect chroot it should be just /
        //expect(d).to.equal('/');
        done();

      });

    });

  });

  describe('Running code with files', function() {

    it('should run index.js file', function(done) {

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
      }, function(err) {

        // then
        expect(err).to.equal(null);
        expect(x).to.equal('hello');
        done();

      });

    });


    it('should allow to include other file', function(done) {

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
      }, function(err) {

        // then
        expect(err).to.equal(null);
        expect(x).to.equal('hello');
        done();

      });

    });


    it('should allow to include other file when in subfolder', function(done) {

      // given
      var x, obj = {
        files: {
          '/test/main.js': 'module.exports = function() { console.log(require("./myfile")); };',
          '/test/myfile.js': 'module.exports = "hello";',
          '/index.js': 'require("./test/main")();'
        }
      };

      // when
      run(obj, {}, {
        log: function(arg) {
          x = arg;
        }
      }, function(err) {

        // then
        expect(err).to.equal(null);
        expect(x).to.equal('hello');
        done();

      });

    });

    it('should allow to include other file with nested require to inner module', function(done) {

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
      }, function(err) {

        // then
        expect(err).to.equal(null);
        expect(x).to.equal('hello');
        done();

      });

    });

  });

  it('should allow to include big library', function(done) {

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
    }, function(err) {

      // then
      expect(err).to.equal(null);
      expect(x).to.equal('hello');
      done();

    });
  });

  it('should start express server', function(done) {
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
    }, function(err) {
      
      // then
      expect(err).to.equal(null);

      setTimeout(function(){
        expect(x).to.equal('hello');
        done();
      }, 1000);

    });
  });

});

