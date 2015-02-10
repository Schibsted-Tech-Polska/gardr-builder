/*global exec */
'use strict';

require('shelljs/make');

var fs = require('fs'),
    path = require('path'),
    config = require('../config');

var builder = {

    _types: ['host', 'ext'],

    _platformPath: function(p) {
        return p.split('/').join(path.sep);
    },

    _libName: function(type) {
        return 'gardr' + type[0].toUpperCase() + type.slice(1);
    },

    _fileName: function(type) {
        return 'gardr-' + type + '.js';
    },
    
    build: function(options) {
        options = options || {};

        return new Promise(function(resolve, reject) {

            var command;

            if(this._types.indexOf(options.type) > -1) {
                command = [this._platformPath(config.BROWSERIFY_BIN), '-s', this._libName(options.type), options.bundlePath, '-o', config.BUILD_PATH + this._fileName(options.type)];
                exec(command.join(' '));
                resolve({
                    filePath: config.BUILD_PATH + this._fileName(options.type)
                });
            }

        }.bind(this));
    },
    
    copy: function(options) {
        options = options || {};

        return new Promise(function(resolve, reject) {

            var read = fs.createReadStream(options.source),
                write = fs.createWriteStream(options.dest);

            read.on('error', function(err) {
                reject(err);
            });

            write.on('error', function(err) {
                reject(err);
            });

            write.on('close', function() {
                resolve({
                    sourceFilePath: options.source,
                    destFilePath: options.dest
                });
            });

            read.pipe(write);
        });
    }

};

module.exports = builder;
