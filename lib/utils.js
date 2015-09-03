'use strict';

var fs = require('fs');

var utils = {};

utils.argvToObj = function(argv) {

    var result = {};

    if(Array.isArray(argv)) {
        argv.forEach(function(arg) {
            var splitArg = arg.split('=');
            result[(splitArg.length === 1) ? arg : splitArg[0]] = (splitArg.length === 1) ? true : splitArg[1];
        });
    }

    return result;
};

utils.fileToArrayPromise = function(path) {
    return new Promise(function(resolve, reject) {
        fs.readFile(path, function(err, result) {
            if(err) return reject(err);

            resolve(result.toString().split('\n').map(utils.trim).filter(utils.isTruthy));
        })
    });
};

utils.trim = function(str) {
    return str.trim();
};

utils.isTruthy = function(thing) {
    return !!thing;
};

utils.thrower = function(err) {
    throw err;
};

module.exports = utils;
