/*global describe, it, afterEach */

'use strict';

var assert = require('assert'),
    fs = require('fs'),
    config = require('../config');

var builder = require('../lib/builder')(config);

describe('Builder', function() {

    // cleanup
    afterEach(function(done) {
        var hostPromise,
            extPromise,
            copyPromise;

        hostPromise = new Promise(function(resolve) {
            fs.unlink(config.BUILD_PATH + 'gardr-host.js', resolve);
        });

        extPromise = new Promise(function(resolve) {
            fs.unlink(config.BUILD_PATH + 'gardr-ext.js', resolve); 
        });

        copyPromise = new Promise(function(resolve) {
            fs.unlink('test/assets/build/copied.js', resolve);
        });

        Promise.all([hostPromise, extPromise, copyPromise]).then(function() {
            done();
        });
    });

    it('should expose public method', function() {
        assert.equal(typeof builder.build, 'function', 'build function exists');
        assert.equal(typeof builder.copy, 'function', 'copy function exists');
    });

    it('should return a promise', function() {
        var buildProcess = builder.build();
        assert.ok(buildProcess instanceof Promise, 'build returns a Promise instance');
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
        }).catch(done);
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
        }).catch(done);
    });

    it('should be able to copy a file', function(done) {
        builder.copy({
            source: 'test/assets/build/to-copy.js',
            dest: 'test/assets/build/copied.js'
        }).then(function(result) {
            var sourceFilePromise,
                destFilePromise;

            sourceFilePromise = new Promise(function(resolve, reject) {
                fs.readFile(result.sourceFilePath, function(err, data) {
                    if(err) {
                        reject(err);
                    }
                    else {
                        resolve(data);
                    }
                });
            });

            destFilePromise = new Promise(function(resolve, reject) {
                fs.readFile(result.destFilePath, function(err, data) {
                    if(err) {
                        reject(err);
                    }
                    else {
                        resolve(data);
                    }
                });
            });

            Promise.all([sourceFilePromise, destFilePromise]).then(function(results) {
                assert.equal(results[0].toString(), results[1].toString(), 'file has been copied');
                done();
            })
            .catch(function(reason) {
                done(reason);
            });

        })
        .catch(function(reason) {
            done(reason);
        });
    });

});
