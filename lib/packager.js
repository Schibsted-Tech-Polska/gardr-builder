'use strict';

var Q = require('q'),
    uglify = require('uglify-js'),
    minifyHTML = require('html-minifier').minify,
    fs = require('fs'),
    path = require('path'),
    config = require('../config');

var packager = {

    minifyJS: function(options) {
        options = options || {};

        var deferred = Q.defer(),
            minified;

        if(options.filePath && options.outputFileName) {
            minified = uglify.minify(path.resolve(options.filePath));
            fs.writeFile(path.resolve(config.MINIFIED_PATH + options.outputFileName), minified.code, function(err) {
                if(err) {
                    deferred.reject(err);
                }
                else {
                    deferred.resolve({
                        filePath: config.MINIFIED_PATH + options.outputFileName
                    });
                }
            });
        }

        return deferred.promise;
    },

    minifyHTML: function(options) {
        options = options || {};

        var deferred = Q.defer();

        if(options.filePath && options.outputFileName) {
            fs.readFile(path.resolve(options.filePath), function(err, data) {
                var minified;
                if(err) {
                    deferred.reject(err);
                }
                else {
                    minified = minifyHTML(data.toString(), config.HTML_MINIFIER_OPTIONS);
                    fs.writeFile(path.resolve(config.MINIFIED_PATH + options.outputFileName), minified, function(err) {
                        if(err) {
                            deferred.reject(err);
                        }
                        else {
                            deferred.resolve({
                                filePath: config.MINIFIED_PATH + options.outputFileName
                            });
                        }
                    });
                }
            });
        }

        return deferred.promise;
    }

};

module.exports = packager;
