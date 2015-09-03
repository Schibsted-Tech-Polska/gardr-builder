'use strict';

var baseConfig  = require('./config'),
    bundlerMaker = require('./lib/bundler'),
    builderMaker = require('./lib/builder'),
    packagerMaker = require('./lib/packager'),
    packageManagerMaker = require('./lib/package-manager'),
    utils = require('./lib/utils'),
    path = require('path'),

    extend = require('extend'),
    write = process.stdout.write.bind(process.stdout); // not using console.log because i want control over new lines

module.exports = function(config) {
    config = Object.freeze(extend({}, baseConfig, config));
    var bundler = bundlerMaker(config),
        builder = builderMaker(config),
        packager = packagerMaker(config),
        packageManager = packageManagerMaker(config);

    return {
        host: function(options) {
            return createJSLib('host', options);
        },
        ext: function(options) {
            return createJSLib('ext', options);
        },
        iframe: function(options) {
            return createIframe(options);
        }
    };

    function createJSLib(target, options) {
        options = options || {};
        var plugins = options.plugins || [];
        var allowedDomains = options.allowedDomains || [];
        var minify = !!options.minify;

        // 1. install target library
        write('Installing Gardr ' + target + ' at version ' + config.VERSIONS[target.toUpperCase()] + ' ...');
        return packageManager.install('gardr-' + target + '@' + config.VERSIONS[target.toUpperCase()])
        // lib not found?
        .catch(utils.thrower)

        // 2. install plugins
        .then(function () {
            write('done\n');
            write('Installing plugins... ');
            return packageManager.install(plugins);
        })

        // plugins file not found?
        .catch(utils.thrower)

        // 3. create bundle file
        .then(function (installedPlugins) {
            write('done\n');
            write('Creating bundle... ');
            return bundler.bundle({
                type: target,
                plugins: installedPlugins,
                allowedDomains: allowedDomains
            });
        })

        // domains file not found?
        .catch(utils.thrower)

        // 4. build gardr file
        .then(function (bundle) {
            write('done\n');
            write('Building file... ');
            return builder.build({
                type: target,
                bundlePath: bundle.filePath
            });
        })

        // 5. minify and package
        .then(function (built) {
            write('done\n');
            write('File ready at ' + path.resolve(built.filePath) + '\n');
            if (minify) {
                write('Minifying file... ');
                return packager.minifyJS({
                    filePath: built.filePath,
                    outputFileName: target + '-min.js'
                });
            }
            else {
                return {
                    filePath: built.filePath
                };
            }
        })

        // 6. expose file path
        .then(function (minified) {
            if (minify) {
                write('done\n');
                write('Minified file ready at ' + path.resolve(minified.filePath) + '\n');
            }
        });
    }

    function createIframe(options) {
        options = options || {};
        var minify = !!options.minify;

        // 1. install ext library
        write('Installing Gardr ext at version ' + config.VERSIONS.EXT + ' ...');
        return packageManager.install('gardr-ext@' + config.VERSIONS.EXT)
        // lib not found?
        .catch(utils.thrower)

        // 2. copy iframe from module
        .then(function() {
            write('done\n');
            write('Copying iframe... ');
            return builder.copy({
                source: config.IFRAME_ORIGINAL_PATH,
                dest: config.IFRAME_DESTINATION_PATH
            });
        })

        // error while copying file?
        .catch(utils.thrower)

        // 3. minify
        .then(function(copied) {
            write('done\n');
            write('File ready at ' + path.resolve(copied.destFilePath) + '\n');
            if(minify) {
                write('Minifying iframe... ');
                return packager.minifyHTML({
                    filePath: copied.destFilePath,
                    outputFileName: 'iframe-min.html'
                });
            }
            else {
                return {
                    filePath: copied.destFilePath
                };
            }
        })

        // error while minifying file?
        .catch(utils.thrower)

        // 4. expose file path
        .then(function(minified) {
            if(minify) {
                write('done\n');
                write('Minified file ready at ' + path.resolve(minified.filePath) + '\n');
            }
        });

    }

};