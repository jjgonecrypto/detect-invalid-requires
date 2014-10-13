'use strict';

var expect = require('chai').expect;
var path = require('path');
var detector = require('../lib/index');

function makePath() {
    return path.join.apply(null, arguments);
}

describe('detector', function () {
    it('finds invalid paths that are case sensitive', function () {
        var invalid = detector([
            makePath('test', 'harness', 'folderA', 'fileA.js'),
            makePath('test', 'harness', 'folderA', 'fileB.js'),
            makePath('test', 'harness', 'folderA', 'fileC.js'),
        ]);
        expect(invalid.length).to.equal(1);
        expect(invalid[0].path).to.equal('./fileb');
    });
});
