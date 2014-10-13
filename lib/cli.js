#!/usr/bin/env node

'use strict';

var detector = require('./Index');
var invalid = detector(process.argv.slice(2));

function outputInvalid(source) {
    if ('path' in source)
        console.log('Invalid require: '.red + source.path.yellow + ' in ' + source.file.yellow);
    else
        console.log('Cannot find file: '.red + source.file.yellow);
}

invalid.forEach(outputInvalid);
