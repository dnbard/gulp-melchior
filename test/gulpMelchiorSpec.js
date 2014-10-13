var assert = require('assert'),
    gulpMelchior = require('../gulp-melchior'),
    gulp = require('gulp');

describe('Gulp Melchior', function(){
    describe('module', function(){
        it('should return a function', function(){
            assert.equal(typeof gulpMelchior, 'function');
        });
    });
});
