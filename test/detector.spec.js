'use strict';

var expect = require('chai').expect;
var detector = require('../lib/index');

describe('detector', function () {
    it('finds invalid paths that are case sensitive', function (done) {
        detector('./test/harness', {}, function (invalid) {
            expect(invalid.length).to.equal(1);
            expect(invalid[0].path).to.equal('./fileb');
            done();
        });
    });
    it('ignores patterns', function (done) {
        detector('./test/harness', { ignore: ['folderA'] }, function (invalid) {
            expect(invalid.length).to.equal(0);
            done();
        });
    });
});
