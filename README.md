[![Build Status](https://travis-ci.org/justinjmoses/detect-invalid-requires.png)](https://travis-ci.org/justinjmoses/detect-invalid-requires)

Simple utility to detect invalid relative require paths that do not exist.
It is case-sensitive, so in particular it is useful when developers are all on
case insensitive dev machines (OSX and Windows), yet CI server is Linux.

Usage
===

CLI
---

install globally via

    npm install -g detect-invalid-requires

run via

    detect-invalid-requires [options] (files)

###Options

`-i, --ignore list` Comma delimited list of path strings to ignore

###Example

    detect-invalid-requires -i thirdparty,3rd .

API
----

```javascript
detector(path: String, options: Object, callback: Function(files:Array[{file, path}]))
```

###Example

```javascript
var detector = require('detect-invalid-requires')

detector('./some/path', options, function (invalids) {
    invalids.forEach(function (invalid) {
        console.error('File ', invalid.file, ' contains required module that cannot be found ', invalid.path);
    })
})
```
