'use strict';

var uglify = require('uglify-js'),
    minifyHTML = require('html-minifier').minify,
    fs = require('fs'),
    path = require('path'),
    config = require('../config');

var packager = {

    minifyJS: function(options) {
        options = options || {};
        var minified;

        return new Promise(function(resolve, reject) {

            if(options.filePath && options.outputFileName) {
                minified = uglify.minify(path.resolve(options.filePath));
                fs.writeFile(path.resolve(config.MINIFIED_PATH + options.outputFileName), minified.code, function(err) {
                    if(err) {
                        reject(err);
                    }
                    else {
                        resolve({
                            filePath: config.MINIFIED_PATH + options.outputFileName
                        });
                    }
                });
            }
            else {
                reject(new Error('Missing file path or output file name'));
            }

        });

    },

    minifyHTML: function(options) {
        options = options || {};

        return new Promise(function(resolve, reject) {

            if(options.filePath && options.outputFileName) {
                fs.readFile(path.resolve(options.filePath), function(err, data) {
                    var minified;
                    if(err) {
                        reject(err);
                    }
                    else {
                        minified = minifyHTML(data.toString(), config.HTML_MINIFIER_OPTIONS);
                        fs.writeFile(path.resolve(config.MINIFIED_PATH + options.outputFileName), minified, function(err) {
                            if(err) {
                                reject(err);
                            }
                            else {
                                resolve({
                                    filePath: config.MINIFIED_PATH + options.outputFileName
                                });
                            }
                        });
                    }
                });
            }
            else {
                reject(new Error('Missing file path or output file name'));
            }

        });
    }

};

module.exports = packager;
