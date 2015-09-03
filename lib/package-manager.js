'use strict';

var npm = require('npm'),
    fs = require('fs'),
    utils = require('./utils');

module.exports = packageManager;

function packageManager(config) {
    return {
        _loadNpm: function(reject, callback) {
            npm.load({
                loglevel: 'silent',
                depth: 0
            }, function(err) {
                if(err) {
                    reject(err);
                }
                else {
                    callback.call(this);
                }
            });
        },

        install: function(name) {
            var plugins = (Array.isArray(name)) ? name : [name],
                self = this;

            return new Promise(function(resolve, reject) {

                if(plugins[0]) {
                    self._loadNpm(reject, function() {
                        npm.commands.install(plugins, function(err, data) {
                            if(err) {
                                reject(err);
                            }
                            else {
                                resolve(data);
                            }
                        });
                    });
                }
                else {
                    resolve();
                }
            });

        },

        ls: function() {

            var plugins = [],
                self = this;

            return new Promise(function(resolve, reject) {
                self._loadNpm(reject, function() {
                    npm.commands.ls([], true, function(err, data, lite) {
                        if(err) {
                            reject(err);
                        }
                        else {
                            Object.keys(lite.dependencies).forEach(function(dependency) {
                                if(dependency.indexOf(config.PACKAGE_PREFIX) === 0) {
                                    plugins.push({
                                        name: dependency,
                                        version: lite.dependencies[dependency].version
                                    });
                                }
                            });
                            resolve(plugins);
                        }
                    });
                });
            });

        },

        uninstall: function(name) {

            var self = this;

            return new Promise(function(resolve, reject) {
                if(name) {
                    self._loadNpm(reject, function() {
                        npm.commands.uninstall([name], function(err, data) {
                            if(err) {
                                reject(err);
                            }
                            else {
                                resolve(data);
                            }
                        });
                    });
                }
            });

        }
    };
}

