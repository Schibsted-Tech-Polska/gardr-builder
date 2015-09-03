/*global describe, it, afterEach */

'use strict';

var config = require('../config'),
    fs = require('fs'),
    path = require('path'),
    assert = require('assert'),
    bundler = require('../lib/bundler')(config);

describe('Bundler', function() {

    var getAbsolutePath = function(relativePath) {
        return path.resolve(relativePath);
    };

    // cleanup
    afterEach(function(done) {
        var hostPromise,
            extPromise;

        hostPromise = new Promise(function(resolve) {
            fs.unlink(config.BUNDLE_PATH + 'host-bundle.js', resolve);
        });

        extPromise = new Promise(function(resolve) {
            fs.unlink(config.BUNDLE_PATH + 'ext-bundle.js', resolve);
        });

        Promise.all([hostPromise, extPromise]).then(function() {
            done();
        });
    });

    it('should expose public method', function() {
        assert.equal(typeof bundler.bundle, 'function', 'bundle function exists');
    });

    it('should return a promise', function() {
        var bundleProcess = bundler.bundle();
        assert.ok(bundleProcess instanceof Promise, 'bundle returns a Promise instance');
    });

    it('should create host bundle file', function(done) {

        bundler.bundle({
            type: 'host'
        }).then(function(result) {
            assert.equal(typeof result.filePath, 'string', 'bundle returned path to module');
            fs.readFile(getAbsolutePath(result.filePath), function(err, data) {
                if(err) {
                    done(err);
                }
                else {
                    assert.deepEqual(data.toString().split('\n').join(''), 'var gardrHost = require(\'gardr-host\');module.exports = gardrHost;', 'host bundle file was created');
                    done();
                }
            });
        })
        .catch(function(reason) {
            done(reason);
        });

    });

    it('should create host bundle file with plugins', function(done) {

        bundler.bundle({
            type: 'host',
            plugins: ['gardr-plugin-host-lorem', 'gardr-plugin-host-ipsum']
        }).then(function(result) {
            assert.equal(typeof result.filePath, 'string', 'bundle returned path to module');
            fs.readFile(getAbsolutePath(result.filePath), function(err, data) {
                if(err) {
                    done(err);
                }
                else {
                    assert.deepEqual(data.toString().split('\n').join(''),
                        'var gardrHost = require(\'gardr-host\');' +
                        'var gardrPluginHostLorem = require(\'gardr-plugin-host-lorem\');' +
                        'var gardrPluginHostIpsum = require(\'gardr-plugin-host-ipsum\');' +
                        'gardrHost.plugin(gardrPluginHostLorem);' +
                        'gardrHost.plugin(gardrPluginHostIpsum);' +
                        'module.exports = gardrHost;',
                    'host bundle file with plugins was created');
                    done();
                }
            });
        })
        .catch(function(reason) {
            done(reason);
        });

    });

    it('should create ext bundle file', function(done) {

        bundler.bundle({
            type: 'ext'
        }).then(function(result) {
            assert.equal(typeof result.filePath, 'string', 'bundle returned path to module');
            fs.readFile(getAbsolutePath(result.filePath), function(err, data) {
                if(err) {
                    done(err);
                }
                else {
                    assert.deepEqual(data.toString().split('\n').join(''),
                        'var gardrExt = require(\'gardr-ext\');' +
                        'gardrExt({    allowedDomains: []});' +
                        'module.exports = gardrExt;',
                    'ext bundle file was created');
                    done();
                }
            });
        })
        .catch(function(reason) {
            done(reason);
        });

    });

    it('should create ext bundle file with plugins', function(done) {

        bundler.bundle({
            type: 'ext',
            plugins: ['gardr-plugin-ext-lorem', 'gardr-plugin-ext-ipsum']
        }).then(function(result) {
            assert.equal(typeof result.filePath, 'string', 'bundle returned path to module');
            fs.readFile(getAbsolutePath(result.filePath), function(err, data) {
                if(err) {
                    done(err);
                }
                else {
                    assert.deepEqual(data.toString().split('\n').join(''),
                        'var gardrExt = require(\'gardr-ext\');' +
                        'var gardrPluginExtLorem = require(\'gardr-plugin-ext-lorem\');' +
                        'var gardrPluginExtIpsum = require(\'gardr-plugin-ext-ipsum\');' +
                        'gardrExt.plugin(gardrPluginExtLorem);' +
                        'gardrExt.plugin(gardrPluginExtIpsum);' +
                        'gardrExt({    allowedDomains: []});'+
                        'module.exports = gardrExt;',
                    'ext bundle file with plugins was created');
                    done();
                }
            });
        })
        .catch(function(reason) {
            done(reason);
        });

    });

    it('should create ext bundle file with allowed domains list', function(done) {

        bundler.bundle({
            type: 'ext',
            allowedDomains: ['localhost', 'aftenposten.no']
        }).then(function(result) {
            assert.equal(typeof result.filePath, 'string', 'bundle returned path to module');
            fs.readFile(getAbsolutePath(result.filePath), function(err, data) {
                if(err) {
                    throw err;
                }
                else {
                    assert.deepEqual(data.toString().split('\n').join(''),
                        'var gardrExt = require(\'gardr-ext\');' +
                        'gardrExt({    allowedDomains: [\'localhost\', \'aftenposten.no\']});'+
                        'module.exports = gardrExt;',
                    'ext bundle file was created');
                    done();
                }
            });
        })
        .catch(function(reason) {
            done(reason);
        });

    });

});
