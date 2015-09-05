'use strict';

var fs = require('fs'),
    browserify = require('browserify');

module.exports = builder;

function builder(config) {
    return {
        _types: ['host', 'ext'],

        _fileName: function(type) {
            return 'gardr-' + type + '.js';
        },

        build: function(options) {
            options = options || {};

            return new Promise(function(resolve, reject) {

                var b = browserify({
                        standalone: 'gardr' + options.type[0].toUpperCase() + options.type.slice(1)
                    }),
                    browserifyStream,
                    writeStream = fs.createWriteStream(config.BUILD_PATH + this._fileName(options.type));


                if(this._types.indexOf(options.type) > -1) {
                    b.add(__dirname + '/../' + options.bundlePath);

                    browserifyStream = b.bundle();
                    writeStream.on('close', function() {
                        resolve({
                            filePath: config.BUILD_PATH + this._fileName(options.type)
                        });
                    }.bind(this));
                    browserifyStream.on('error', reject);
                    writeStream.on('error', reject);
                    browserifyStream.pipe(writeStream);
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
}
