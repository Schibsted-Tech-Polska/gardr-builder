'use strict';

var path = require('path'),
    changeCase = require('change-case'),
    fs = require('fs'),
    swig = require('swig'),
    utils = require('./utils');

module.exports = bundler;

function bundler(config) {
    return {
        _types: ['host', 'ext'],

        _templates: {
            host: swig.compileFile(config.TEMPLATE_PATH + 'host.swig'),
            ext: swig.compileFile(config.TEMPLATE_PATH + 'ext.swig')
        },

        bundle: function(options) {
            options = options || {};

            var self = this,
                templateData = {
                    plugins: []
                },
                filePath;

            return new Promise(function(resolve, reject) {
                if (self._types.indexOf(options.type) > -1) {
                    filePath = config.BUNDLE_PATH + options.type + '-bundle.js';

                    if (Array.isArray(options.plugins)) {
                        templateData.plugins = options.plugins.map(function(plugin) {
                            var pluginName = plugin.split('@')[0] || plugin;
                            return {
                                camelCaseName: changeCase.camelCase(pluginName),
                                dashName: pluginName
                            };
                        });
                    }
                }
                else {
                    reject({
                        msg: 'unknown library type ' + options.type
                    });
                }
                templateData.allowedDomains = options.allowedDomains || [];
                fs.writeFile(filePath, self._templates[options.type](templateData), function(err) {
                    if (err) {
                        reject(err);
                    }
                    else {
                        resolve({
                            filePath: filePath
                        });
                    }
                });
            });
        }
    };
}

