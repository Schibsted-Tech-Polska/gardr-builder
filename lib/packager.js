'use strict';

var Q = require('q'),
    uglify = require('uglify-js'),
    fs = require('fs'),
    path = require('path');

var MINIFIED_PATH = 'minified/';

var packager = {

    minify: function(options) {
        options = options || {};

        var deferred = Q.defer(),
            minified;

        if(options.filePath && options.outputFileName) {
            minified = uglify.minify(path.resolve(options.filePath));
            fs.writeFile(path.resolve(MINIFIED_PATH + options.outputFileName), minified.code, function(err) {
                if(err) {
                    deferred.reject(err);
                }
                else {
                    deferred.resolve({
                        filePath: MINIFIED_PATH + options.outputFileName
                    });
                }
            });
        }

        return deferred.promise;
    }

};

module.exports = packager;
