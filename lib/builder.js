/*global exec */
'use strict';

require('shelljs/make');

var Q = require('q'),
    fs = require('fs'),
    path = require('path'),
    config = require('../config');

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
            command = [this._platformPath(config.BROWSERIFY_BIN), '-s', options.type, options.bundlePath, '-o', config.BUILD_PATH + options.type + '.js'];
            exec(command.join(' '));
            deferred.resolve({
                filePath: config.BUILD_PATH + options.type + '.js'
            });
        }

        return deferred.promise;
    },
    
    copy: function(options) {
        var deferred = Q.defer(),
            read = fs.createReadStream(options.source),
            write = fs.createWriteStream(options.dest);

        read.on('error', function(err) {
            deferred.reject(err);
        });

        write.on('error', function(err) {
            deferred.reject(err);
        });

        write.on('close', function() {
            deferred.resolve({
                sourceFilePath: options.source,
                destFilePath: options.dest
            });
        });

        read.pipe(write);

        return deferred.promise;
    }

};

module.exports = builder;
