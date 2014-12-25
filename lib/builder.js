/*global exec */
'use strict';

require('shelljs/make');

var Q = require('q'),
    path = require('path');

var BROWSERIFY_BIN = './node_modules/.bin/browserify',
    BUILD_PATH = 'build/';

var builder = {

    _types: ['host', 'ext'],

    _platformPath: function(p) {
        return p.split('/').join(path.sep);
    },
    
    build: function(options) {
        options = options || {};

        var deferred = Q.defer(),
            command;

        if(this._types.indexOf(options.type) > -1) {
            command = [this._platformPath(BROWSERIFY_BIN), '-s', options.type, options.bundlePath, '-o', BUILD_PATH + options.type + '.js'];
            exec(command.join(' '));
            deferred.resolve({
                filePath: BUILD_PATH + options.type + '.js'
            });
        }

        return deferred.promise;
    }

};

module.exports = builder;
