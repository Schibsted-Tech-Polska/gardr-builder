/*global describe, it, afterEach */

'use strict';

var assert = require('assert'),
    fs = require('fs');

var packager = require('../lib/packager');

describe('Packager', function() {

    // cleanup
    afterEach(function(done) {
        fs.unlink('minified/code-min.js', function() {
            done();
        });
    });

    it('should expose public method', function() {
        assert.equal(typeof packager.minify, 'function', 'minify function exists');
    });

    it('should return a promise', function() {
        var minifyProcess = packager.minify();
        assert.equal(typeof minifyProcess, 'object', 'minify returns an object');
        assert.equal(typeof minifyProcess.then, 'function', 'minify returns an object with then method');
    });

    it('should create minified file from specified path', function(done) {
        packager.minify({
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



});
