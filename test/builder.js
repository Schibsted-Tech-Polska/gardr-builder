/*global describe, it, afterEach */

'use strict';

var assert = require('assert'),
    Q = require('q'),
    fs = require('fs');

var builder = require('../lib/builder');

describe('Builder', function() {

    // cleanup
    afterEach(function(done) {
        var hostDefer = Q.defer(),
            extDefer = Q.defer();

        fs.unlink('build/host.js', function() {
            hostDefer.resolve();
        });

        fs.unlink('build/ext.js', function() {
            extDefer.resolve();
        });

        Q.all([hostDefer, extDefer]).then(function() {
            done();
        });
    });

    it('should expose public method', function() {
        assert.equal(typeof builder.build, 'function', 'build function exists');
    });

    it('should return a promise', function() {
        var buildProcess = builder.build();
        assert.equal(typeof buildProcess, 'object', 'build returns an object');
        assert.equal(typeof buildProcess.then, 'function', 'build returns an object with then method');
    });

    it('should create a host file', function(done) {
        this.timeout(5000);
        builder.build({
            type: 'host',
            bundlePath: 'test/assets/bundle/host-simple.js'
        }).then(function(result) {
            assert.equal(typeof result.filePath, 'string', 'builder returned path to compiled file');
            fs.readFile(result.filePath, function(err, data) {
                if(err) {
                    done(err);
                }
                else {
                    assert.ok(data.toString().indexOf('gardr-host') > -1, 'host build file was created');
                    done();
                }
            });
        });
    });

    it('should create a ext file', function(done) {
        this.timeout(5000);
        builder.build({
            type: 'ext',
            bundlePath: 'test/assets/bundle/ext-simple.js'
        }).then(function(result) {
            assert.equal(typeof result.filePath, 'string', 'builder returned path to compiled file');
            fs.readFile(result.filePath, function(err, data) {
                if(err) {
                    done(err);
                }
                else {
                    assert.ok(data.toString().indexOf('gardr-ext') > -1, 'host build file was created');
                    done();
                }
            });
        });
    });

});
