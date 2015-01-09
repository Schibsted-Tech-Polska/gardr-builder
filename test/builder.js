/*global describe, it, afterEach */

'use strict';

var assert = require('assert'),
    Q = require('q'),
    fs = require('fs'),
    config = require('../config');

var builder = require('../lib/builder');

describe('Builder', function() {

    // cleanup
    afterEach(function(done) {
        var hostDefer = Q.defer(),
            extDefer = Q.defer(),
            copyDefer = Q.defer();

        fs.unlink(config.BUILD_PATH + 'gardr-host.js', function() {
            hostDefer.resolve();
        });

        fs.unlink(config.BUILD_PATH + 'gardr-ext.js', function() {
            extDefer.resolve();
        });

        fs.unlink('test/assets/build/copied.js', function() {
            copyDefer.resolve();
        });

        Q.all([hostDefer, extDefer]).then(function() {
            done();
        });
    });

    it('should expose public method', function() {
        assert.equal(typeof builder.build, 'function', 'build function exists');
        assert.equal(typeof builder.copy, 'function', 'copy function exists');
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

    it('should be able to copy a file', function(done) {
        builder.copy({
            source: 'test/assets/build/to-copy.js',
            dest: 'test/assets/build/copied.js'
        }).then(function(result) {
            var sourceFileDefer = Q.defer(),
                destFileDefer = Q.defer();

            fs.readFile(result.sourceFilePath, function(err, data) {
                if(err) {
                    done(err);
                }
                else {
                    sourceFileDefer.resolve(data);
                }
            });

            fs.readFile(result.destFilePath, function(err, data) {
                if(err) {
                    done(err);
                }
                else {
                    destFileDefer.resolve(data);
                }
            });

            Q.all([sourceFileDefer.promise, destFileDefer.promise]).then(function(results) {
                assert.equal(results[0].toString(), results[1].toString(), 'file has been copied');
                done();
            })
            .catch(function(reason) {
                done(reason);
            });

        })
        .fail(function(reason) {
            done(reason);
        });
    });

});
