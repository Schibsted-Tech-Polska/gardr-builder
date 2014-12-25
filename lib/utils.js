'use strict';

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
