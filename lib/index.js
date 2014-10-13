'use strict';

var esprima = require('esprima');
var fs = require('fs');
var path = require('path');
require('colors');

function getDirOf(file) {
    return path.join(process.cwd(), file);
}

// Stolen from https://github.com/ariya/esprima/blob/master/examples/findbooleantrap.js
// Executes visitor on the object and its children (recursively).
function traverse(object, visitor) {
    var key, child;

    if (visitor.call(null, object) === false) {
        return;
    }
    for (key in object) {
        if (object.hasOwnProperty(key)) {
            child = object[key];
            if (typeof child === 'object' && child !== null) {
                traverse(child, visitor);
            }
        }
    }
}

function chompShebang(script) {
    return script.replace(/^\#\![^\n]+/, '');
}

module.exports = function (files) {
    if (!Array.isArray(files)) files = [files];
    var invalid = [];
    files.filter(function (file) {
        if (!fs.existsSync(getDirOf(file))) {
            invalid.push({ file: file });
            return false;
        }
        return true;
    }).forEach(function (file) {
        var script = fs.readFileSync(getDirOf(file), 'utf-8');
        var content = esprima.parse(chompShebang(script), { tolerant: true });

        traverse(content, function (node) {
            if (node.type === 'CallExpression' && node.callee.name === 'require') {
                if (!node.arguments.length || !node.arguments[0].value) return;
                var requireStr = node.arguments[0].value;
                //remove non-relative paths
                if (['.', '\\', '/'].indexOf(requireStr.slice(0, 1)) === -1) return;
                var targetDir = path.join(path.dirname(file), path.dirname(requireStr));

                //error out invalid path
                if (!fs.existsSync(targetDir)) return invalid.push({file: file, path: requireStr });

                var dirFiles = fs.readdirSync(targetDir);
                if (dirFiles.indexOf(path.basename(requireStr)) !== -1 || dirFiles.indexOf(path.basename(requireStr) + '.js') !== -1) return;
                invalid.push({file: file, path: requireStr });
            }
        });
    });

    return invalid;
};
