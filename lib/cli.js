#!/usr/bin/env node

'use strict';

var detector = require('./index');

function outputInvalid(source) {
    if (typeof source.path !== 'undefined')
        console.log('Invalid require: '.red + source.path.yellow + ' in ' + source.file.yellow);
    else
        console.log('Cannot find file: '.red + source.file.yellow);
}

detector(process.argv[2], function (invalid) {
    invalid.forEach(outputInvalid);
});
