/*global describe, it */

'use strict';

var assert = require('assert');

var utils = require('../lib/utils');

describe('General Purpose Utils', function() {

    it('should expose public methods', function() {
        assert.equal(typeof utils.argvToObj, 'function', 'argvToObj function exists');
        assert.equal(typeof utils.trim, 'function', 'trim function exists');
        assert.equal(typeof utils.isTruthy, 'function', 'isTruthy function exists');
    });

    it('argvToObj should convert arguments to object', function() {
        var argvToObj = utils.argvToObj;

        assert.deepEqual(argvToObj(['hi', 'there']), {hi: true, there: true}, 'simple conversion');
        assert.deepEqual(argvToObj(['hi=1', 'there=2']), {hi: '1', there: '2'}, 'value conversion');
    });

    it('trim should functionally duplicate String.trim', function() {
        assert.equal(utils.trim('   a   '), '   a   '.trim());
    });

    it('isTruthy should functionally check thruthiness of a value', function() {
        assert.equal(utils.isTruthy('a'), true, 'value is truthy');
        assert.equal(utils.isTruthy(null), false, 'value is falsy');
    });

    it('fileToArrayPromise should return promise for reading a file', function(done) {
        console.log(__dirname + '/assets/utils/file');
        utils.fileToArrayPromise(__dirname + '/assets/utils/file').then(function(result) {
            assert.deepEqual(result, ['line one', 'line three', 'line four']);
            done();
        });
    });

});
