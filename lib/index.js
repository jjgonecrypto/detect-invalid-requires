'use strict';

var esprima = require('esprima');
var esquery = require('esquery');
var fs = require('fs');
var path = require('path');
require('colors');
var walker = require('walker');

function getDirOf(file) {
    return path.join(process.cwd(), file);
}

function chompShebang(script) {
    return script.replace(/^\#\![^\n]+/, '');
}

module.exports = function (inputPath, callback) {
    var invalid = [];

    inputPath = path.resolve(process.cwd(), inputPath || '.');

    walker(inputPath).on('file', function (file) {
        if (!file.match(/\.js$/)) return;

        var script = fs.readFileSync(file, { encoding: 'utf-8' });
        var content = esprima.parse(chompShebang(script), { tolerant: true });

        var requires = esquery(content, 'CallExpression[callee.name="require"]');

        requires.forEach(function (node) {
            var requireStr = node.arguments[0].value;

            //remove non-relative paths
            if (typeof requireStr === 'string' && ['.', '\\', '/'].indexOf(requireStr.slice(0, 1)) === -1) return;
            var targetDir = path.resolve(path.dirname(file), path.dirname(requireStr));

            //error out invalid path
            if (!fs.existsSync(targetDir)) {
                invalid.push({file: file, path: requireStr });
                return;
            }

            var dirFiles = fs.readdirSync(targetDir);
            if (dirFiles.indexOf(path.basename(requireStr)) !== -1 || dirFiles.indexOf(path.basename(requireStr) + '.js') !== -1) return;
            invalid.push({file: file, path: requireStr });
        });
    }).on('end', function() {
        callback(invalid);
    });
};
