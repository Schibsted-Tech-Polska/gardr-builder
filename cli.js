'use strict';

var config  = require('./config'),
    bundler = require('./lib/bundler')(config),
    builder = require('./lib/builder')(config),
    packager = require('./lib/packager')(config),
    packageManager = require('./lib/package-manager')(config),
    utils = require('./lib/utils'),
    path = require('path'),

    args = utils.argvToObj(process.argv),
    write = process.stdout.write.bind(process.stdout),
    target = args.host ? 'host' : args.ext ? 'ext' : args.iframe ? 'iframe' : null,
    pluginsFilePath,
    allowedDomainsFilePath;


if(target === 'host' || target === 'ext') {

    pluginsFilePath = path.resolve(args.plugins || config.DEFAULT_PLUGINS_PATH[target]);
    allowedDomainsFilePath = path.resolve(args.domains || config.DEFAULT_ALLOWED_DOMAINS_PATH);
    
    // 1. install plugins
    write('Installing plugins from ' + pluginsFilePath + '... ');
    packageManager.installFromFile(pluginsFilePath)

        // plugins file not found?
        .catch(utils.thrower)

    // 2. create bundle file
    .then(function(plugins) {
        write('done\n');
        write('Creating bundle... ');
        return bundler.bundle({
            type: target,
            plugins: plugins,
            allowedDomainsFilePath: allowedDomainsFilePath
        });
    })

        // domains file not found?
        .catch(utils.thrower)

    // 3. build gardr file
    .then(function(bundle) {
        write('done\n');
        write('Building file... ');
        return builder.build({
            type: target,
            bundlePath: bundle.filePath
        });
    })

    // 4. minify and package
    .then(function(built) {
        write('done\n');
        write('File ready at ' + path.resolve(built.filePath) + '\n');
        if(args.minify) {
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

    // 5. expose file path
    .then(function(minified) {
        if(args.minify) {
            write('done\n');
            write('Minified file ready at ' + path.resolve(minified.filePath) + '\n');
        }
    })

    // handle thrown errors
    .catch(function(err) {
        console.error(err.toString());
    });

}
else if(target === 'iframe') {

    // 1. copy iframe from module
    write('Copying iframe... ');
    builder.copy({
        source: config.IFRAME_ORIGINAL_PATH,
        dest: config.IFRAME_DESTINATION_PATH
    })

        // error while copying file?
        .catch(utils.thrower)

    // 2. minify
    .then(function(copied) {
        write('done\n');
        write('File ready at ' + path.resolve(copied.destFilePath) + '\n');
        if(args.minify) {
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

    // 3. expose file path
    .then(function(minified) {
        if(args.minify) {
            write('done\n');
            write('Minified file ready at ' + path.resolve(minified.filePath) + '\n');
        }
    })

    // handle thrown errors
    .catch(function(err) {
        console.error(err.toString());
    });

}
else {
    console.log('Please specify build target (host/ext/iframe)');
}
