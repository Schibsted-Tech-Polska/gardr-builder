/*global describe, it, afterEach */

'use strict';

var assert = require('assert'),
    fs = require('fs'),
    config = require('../config');

var packager = require('../lib/packager')(config);

describe('Packager', function() {

    // cleanup
    afterEach(function(done) {
        var jsPromise,
            htmlPromise;


        jsPromise = new Promise(function(resolve) {
            fs.unlink(config.MINIFIED_PATH + 'code-min.js', resolve);
        });

        htmlPromise = new Promise(function(resolve) {
            fs.unlink(config.MINIFIED_PATH + 'code-min.html', resolve);
        });

        Promise.all([htmlPromise, jsPromise]).then(function() {
            done();
        });
    });

    it('should expose public method', function() {
        assert.equal(typeof packager.minifyJS, 'function', 'minifyJS function exists');
        assert.equal(typeof packager.minifyHTML, 'function', 'minifyHTML function exists');
    });

    it('should return a promise', function() {
        var minifyJSProcess = packager.minifyJS();
        var minifyHTMLProcess = packager.minifyHTML();

        assert.equal(typeof minifyJSProcess, 'object', 'minifyJS returns an object');
        assert.equal(typeof minifyJSProcess.then, 'function', 'minifyJS returns an object with then method');
        assert.equal(typeof minifyHTMLProcess, 'object', 'minifyJS returns an object');
        assert.equal(typeof minifyHTMLProcess.then, 'function', 'minifyJS returns an object with then method');
    });

    it('should create minified JS file from specified path', function(done) {
        packager.minifyJS({
            filePath: 'test/assets/minify/code.js',
            outputFileName: 'code-min.js'
        }).then(function(minified) {
            assert.equal(typeof minified.filePath, 'string', 'builder returned path to compiled file');
            fs.readFile(minified.filePath, function(err, data) {
                if(err) {
                    done(err);
                }
                else {
                    assert.ok(data.toString() === 'var four=two+2;', 'minified file was created');
                    done();
                }
            });
        });
    });

    it('should create minified HTML file from specified path', function(done) {
        packager.minifyHTML({
            filePath: 'test/assets/minify/code.html',
            outputFileName: 'code-min.html'
        }).then(function(minified) {
            assert.equal(typeof minified.filePath, 'string', 'builder returned path to compiled file');
            fs.readFile(minified.filePath, function(err, data) {
                if(err) {
                    done(err);
                }
                else {
                    assert.ok(data.toString() === '<html><head></head><body></body></html>', 'minified file was created');
                    done();
                }
            });
        });
    });

});
