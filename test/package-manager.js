/*global describe, it, afterEach */

'use strict';

var assert = require('assert'),
    npm = require('npm'),
    path = require('path');

var EXAMPLE_PLUGIN_1 = 'gardr-plugin-host-resize';
var EXAMPLE_PLUGIN_2 = 'gardr-plugin-host-postscribe';

var packageManager = require('../lib/package-manager');

var loadNpm = function(done, callback) {
    npm.load({
        loglevel: 'silent',
        depth: 0
    }, function(err) {
        if(err) {
            done(err);
        }
        callback();
    });
};

describe('Package Manager', function() {

    afterEach(function(done) {
        loadNpm(done, function() {
            npm.commands.uninstall([EXAMPLE_PLUGIN_1, EXAMPLE_PLUGIN_2], function() {
                done();
            });
        });
    });

    it('should expose public method', function() {
        assert.equal(typeof packageManager.install, 'function', 'install function exists');
    });

    it('should return a promise', function() {
        var installProcess = packageManager.install();
        assert.equal(typeof installProcess, 'object', 'minify returns an object');
        assert.equal(typeof installProcess.then, 'function', 'minify returns an object with then method');
    });

    it('should install plugin', function(done) {
        this.timeout(5000);
        packageManager.install(EXAMPLE_PLUGIN_1)
            .then(function(data) {
                assert.ok(data, 'plugin was installed');
                done();
            });
    });

    it('should install list of plugins', function(done) {
        this.timeout(10000);
        packageManager.install([EXAMPLE_PLUGIN_1, EXAMPLE_PLUGIN_2])
            .then(function(data) {
                assert.ok(data, 'plugins were installed');
                done();
            });
    });

    it('should install plugins from list specified by file', function(done) {
        this.timeout(10000);
        packageManager.installFromFile(path.resolve('./test/assets/package-manager/host-plugins-test.txt'))
            .then(function(data) {
                assert.ok(data, 'plugins were installed from file list');
                done();
            });
    });

    it('should list installed plugins', function(done) {
        this.timeout(5000);
        loadNpm(done, function() {
            npm.commands.install([EXAMPLE_PLUGIN_1], function(err) {
                if(err) {
                    done(err);
                }
                packageManager.ls()
                    .then(function(plugins) {
                        var found;
                        try {
                            assert.ok(Array.isArray(plugins), 'plugins are returned as an array');
                            found = plugins.filter(function(plugin) {
                                return plugin.name === EXAMPLE_PLUGIN_1;
                            });
                            assert.equal(found[0].name, EXAMPLE_PLUGIN_1, 'right plugin is installed');
                            done();
                        }
                        catch(err) {
                            done(err);
                        }
                    })
                    .catch(function(err) {
                        done(err);
                    });
            });
        });
    });

    it('should uninstall a plugin', function(done) {
        this.timeout(5000);
        loadNpm(done, function() {
            npm.commands.install([EXAMPLE_PLUGIN_1], function(err) {
                if(err) {
                    done(err);
                }
                packageManager.uninstall(EXAMPLE_PLUGIN_1)
                    .then(function() {
                        try {
                            assert.ok(true, 'plugin was uninstalled');
                            done();
                        }
                        catch(err) {
                            done(err);
                        }
                    })
                    .catch(function(err) {
                        done(err);
                    });
            });
        });
    });

});
