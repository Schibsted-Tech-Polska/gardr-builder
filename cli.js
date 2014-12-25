'use strict';

var bundler = require('./lib/bundler'),
    builder = require('./lib/builder'),
    packager = require('./lib/packager'),
    packageManager = require('./lib/package-manager'),
    utils = require('./lib/utils'),
    path = require('path'),

    DEFAULT_PLUGINS_PATH = {
        host: './config/host-plugins-default.txt',
        ext: './config/ext-plugins-default.txt'
    },
    DEFAULT_ALLOWED_DOMAINS_PATH = './config/ext-allowed-domains-default.txt',

    args = utils.argvToObj(process.argv),
    write = process.stdout.write.bind(process.stdout),
    target = args.host ? 'host' : args.ext ? 'ext' : null,
    pluginsFilePath = target ? path.resolve(args.plugins || DEFAULT_PLUGINS_PATH[target]) : '',
    allowedDomainsFilePath = path.resolve(args.domains || DEFAULT_ALLOWED_DOMAINS_PATH);


if(target) {
    
    // 1. install plugins
    write('Installing plugins from ' + pluginsFilePath + '... ');
    packageManager.installFromFile(pluginsFilePath)

        // plugins file not found?
        .fail(utils.thrower)

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
        .fail(utils.thrower)

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
            return packager.minify({
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
else {
    console.log('Please specify build target (host/ext)');
}
