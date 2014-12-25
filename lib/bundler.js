'use strict';

var Q = require('q'),
    path = require('path'),
    changeCase = require('change-case'),
    fs = require('fs'),
    swig = require('swig'),
    utils = require('./utils');

var BUNDLE_PATH = 'bundle/';
var TEMPLATE_PATH = 'templates/';

var bundler = {

    _types: ['host', 'ext'],

    _templates: {
        host: swig.compileFile(TEMPLATE_PATH + 'host.swig'),
        ext: swig.compileFile(TEMPLATE_PATH + 'ext.swig')
    },

    bundle: function(options) {
        options = options || {};

        var deferred = Q.defer(),
            domainsDeferred = Q.defer(),
            templateData = {
                plugins: []
            },
            filePath,
            filePathAbsolute;

        if(this._types.indexOf(options.type) > -1) {
            filePath = BUNDLE_PATH + options.type + '.js';
            filePathAbsolute = path.resolve(__dirname, '../', BUNDLE_PATH, options.type + '.js');

            if(Array.isArray(options.plugins)) {
                options.plugins.forEach(function(plugin) {
                    var pluginName = plugin.split('@')[0] || plugin;
                    templateData.plugins.push({
                        camelCaseName: changeCase.camelCase(pluginName),
                        dashName: pluginName
                    });
                });
            }

            if(Array.isArray(options.allowedDomains)) {
                domainsDeferred.resolve(options.allowedDomains);
            }
            else if(options.allowedDomainsFilePath) {
                fs.readFile(options.allowedDomainsFilePath, function(err, data) {
                    if(err) {
                        deferred.reject(err);
                    }
                    else {
                        domainsDeferred.resolve(data.toString().split('\n').map(utils.trim).filter(utils.isTruthy));
                    }
                });
            }
            else {
                domainsDeferred.resolve([]);
            }

            Q.when(domainsDeferred.promise).then(function(domains) {
                templateData.allowedDomains = domains;
                fs.writeFile(filePathAbsolute, this._templates[options.type](templateData), function(err) {
                    if(err) {
                        deferred.reject(err);
                    }
                    else {
                        deferred.resolve({
                            filePath: filePath
                        });
                    }
                });
            }.bind(this));
        }
        else {
            deferred.reject({
                msg: 'unknown library type ' + options.type
            });
        }

        return deferred.promise;
    }

};

module.exports = bundler;
