/*global describe, it, afterEach */

'use strict';

var assert = require('assert'),
    fs = require('fs'),
    path = require('path');

var config = Object.freeze({
    BROWSERIFY_BIN: 'node_modules/.bin/browserify',
    BUILD_PATH: 'test/output/',
    BUNDLE_PATH: 'test/output/',
    MINIFIED_PATH: 'test/output/',
    HTML_MINIFIER_OPTIONS: {
        removeComments: true,
        removeCommentsFromCDATA: true,
        collapseWhitespace: true,
        minifyJS: true,
        minifyCSS: true
    },
    TEMPLATE_PATH: 'templates/',
    PACKAGE_PREFIX: 'gardr-',
    DEFAULT_PLUGINS_PATH: {
        HOST: 'config/host-plugins-default.txt',
        EXT: 'config/ext-plugins-default.txt'
    },
    VERSIONS: {
        HOST: '^1.0.0-alpha.1',
        EXT: '^1.0.0-alpha.3'
    },
    DEFAULT_ALLOWED_DOMAINS_PATH: 'config/ext-allowed-domains-default.txt',
    IFRAME_ORIGINAL_PATH: 'node_modules/gardr-ext/iframe.html',
    IFRAME_DESTINATION_PATH: 'test/output/iframe.html'
});

var main = require('../index')(config);

describe('End to end', function() {

    it('should expose public methods', function() {
        assert.equal(typeof main.host, 'function', 'host function exists');
        assert.equal(typeof main.ext, 'function', 'ext function exists');
        assert.equal(typeof main.iframe, 'function', 'iframe function exists');
    });

    it('should create a host file', function(done) {
        this.timeout(10000);
        main.host().then(function(result) {
            fs.readFile(path.resolve(result.filePath), function(err, data) {
                if(err) {
                    done(err);
                }
                else {
                    assert.ok(data.toString().indexOf('gardr-host') > -1, 'host file was created');
                    done();
                }
            });
        }).catch(done);
    });

    it('should create a ext file', function(done) {
        this.timeout(10000);
        main.ext().then(function(result) {
            fs.readFile(path.resolve(result.filePath), function(err, data) {
                if(err) {
                    done(err);
                }
                else {
                    assert.ok(data.toString().indexOf('gardr-ext') > -1, 'ext file was created');
                    done();
                }
            });
        }).catch(done);
    });

    it('should create a iframe file', function(done) {
        this.timeout(10000);
        main.iframe().then(function(result) {
            fs.readFile(path.resolve(result.filePath), function(err, data) {
                if(err) {
                    done(err);
                }
                else {
                    assert.ok(data.toString().indexOf('<html>') > -1, 'iframe file was created');
                    done();
                }
            });
        }).catch(done);
    });

    it('should create a minified host file', function(done) {
        this.timeout(10000);
        main.host({minify: true}).then(function(result) {
            fs.readFile(path.resolve(result.filePath), function(err, data) {
                if(err) {
                    done(err);
                }
                else {
                    assert.ok(data.toString().indexOf('gardr-host') > -1, 'host file was created');
                    done();
                }
            });
        }).catch(done);
    });

    it('should create a minified ext file', function(done) {
        this.timeout(10000);
        main.ext({minify: true}).then(function(result) {
            fs.readFile(path.resolve(result.filePath), function(err, data) {
                if(err) {
                    done(err);
                }
                else {
                    assert.ok(data.toString().indexOf('gardr-ext') > -1, 'ext file was created');
                    done();
                }
            });
        }).catch(done);
    });

    it('should create a minified iframe file', function(done) {
        this.timeout(10000);
        main.iframe({minify: true}).then(function(result) {
            fs.readFile(path.resolve(result.filePath), function(err, data) {
                if(err) {
                    done(err);
                }
                else {
                    assert.ok(data.toString().indexOf('<html>') > -1, 'iframe file was created');
                    done();
                }
            });
        }).catch(done);
    });
});