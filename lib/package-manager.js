'use strict';

var Q = require('q'),
    npm = require('npm'),
    fs = require('fs'),
    utils = require('./utils');

var PACKAGE_PREFIX = 'gardr-';

var packageManager = {

    _loadNpm: function(deferred, callback) {
        npm.load({
            loglevel: 'silent',
            depth: 0
        }, function(err) {
            if(err) {
                deferred.reject(err);
            }
            else {
                callback.call(this);
            }
        });
    },

    install: function(name) {

        var deferred = Q.defer(),
            plugins = (Array.isArray(name)) ? name : [name];

        if(plugins[0]) {
            this._loadNpm(deferred, function() {
                npm.commands.install(plugins, function(err, data) {
                    if(err) {
                        deferred.reject(err);
                    }
                    else {
                        deferred.resolve(data);
                    }
                });
            });
        }
        else {
            deferred.resolve();
        }

        return deferred.promise;
    },

    installFromFile: function(filePath) {
        
        var deferred = Q.defer(),
            plugins = [];

        fs.readFile(filePath, function(err, data) {
            if(err) {
                deferred.reject(err);
            }
            else {
                plugins = data.toString().split('\n').map(utils.trim).filter(utils.isTruthy);
                Q.when(this.install(plugins)).then(function(result) {
                    deferred.resolve(plugins, result);
                });
            }
        }.bind(this));

        return deferred.promise;
    },

    ls: function() {

        var deferred = Q.defer(),
            plugins = [];

        this._loadNpm(deferred, function() {
            npm.commands.ls([], true, function(err, data, lite) {
                if(err) {
                    deferred.reject(err);
                }
                else {
                    Object.keys(lite.dependencies).forEach(function(dependency) {
                        if(dependency.indexOf(PACKAGE_PREFIX) === 0) {
                            plugins.push({
                                name: dependency,
                                version: lite.dependencies[dependency].version
                            });
                        }
                    });
                    deferred.resolve(plugins);
                }
            });
        });

        return deferred.promise;
    },

    uninstall: function(name) {
        var deferred = Q.defer();

        if(name) {
            this._loadNpm(deferred, function() {
                npm.commands.uninstall([name], function(err, data) {
                    if(err) {
                        deferred.reject(err);
                    }
                    else {
                        deferred.resolve(data);
                    }
                });
            });
        }

        return deferred.promise;
    }

};

module.exports = packageManager;
