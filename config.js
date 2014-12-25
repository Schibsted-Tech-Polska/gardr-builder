'use strict';

var config = Object.freeze({
    BROWSERIFY_BIN: 'node_modules/.bin/browserify',
    BUILD_PATH: 'output/',
    BUNDLE_PATH: 'output/',
    MINIFIED_PATH: 'output/',
    HTML_MINIFIER_OPTIONS: {
        removeComments: true,
        removeCommentsFromCDATA: true,
        collapseWhitespace: true,
        minifyJS: true,
        minifyCSS: true
    },
    TEMPLATE_PATH: 'templates/',
    PACKAGE_PREFIX: 'gardr-',
    DEFAULT_PLUGINS_PATH: {
        host: 'config/host-plugins-default.txt',
        ext: 'config/ext-plugins-default.txt'
    },
    DEFAULT_ALLOWED_DOMAINS_PATH: 'config/ext-allowed-domains-default.txt',
    IFRAME_ORIGINAL_PATH: 'node_modules/gardr-ext/iframe.html',
    IFRAME_DESTINATION_PATH: 'output/iframe.html'
});

module.exports = config;
