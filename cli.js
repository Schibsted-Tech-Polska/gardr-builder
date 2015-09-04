'use strict';

var config = require('./config'),
    main = require('./index')(config),
    utils = require('./lib/utils'),
    path = require('path'),

    args = utils.argvToObj(process.argv),
    target = args.host ? 'host' : args.ext ? 'ext' : args.iframe ? 'iframe' : null;

if(target === 'host') {
    utils.fileToArrayPromise(path.resolve(args.plugins || config.DEFAULT_PLUGINS_PATH.HOST))
        .then(function(plugins) {
            return main.host({
                minify: args.minify,
                plugins: plugins
            });
        })
        .catch(function(err) {
            console.error(err.toString());
        });
}
else if(target === 'ext') {
    Promise.all([
        utils.fileToArrayPromise(path.resolve(args.plugins || config.DEFAULT_PLUGINS_PATH.HOST)),
        utils.fileToArrayPromise(path.resolve(args.domains || config.DEFAULT_ALLOWED_DOMAINS_PATH))
    ])
        .then(function(files) {
            return main.ext({
                minify: args.minify,
                plugins: files[0],
                allowedDomains: files[1]
            });
        })
        .catch(function(err) {
            console.error(err.toString());
        });
}
else if(target === 'iframe') {
    main.iframe({minify: args.minify})
        .catch(function(err) {
            console.error(err.toString());
        });
}
else {
    console.error('Please specify build target (host/ext/iframe)');
}