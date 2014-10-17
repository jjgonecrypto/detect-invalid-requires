[![Build Status](https://travis-ci.org/justinjmoses/detect-invalid-requires.png)](https://travis-ci.org/justinjmoses/detect-invalid-requires)

Simple utility to detect invalid relative require paths that do not exist.
It is case-sensitive, so in particular it is useful when developers are all on
case insensitive dev machines (OSX and Windows), yet CI server is Linux.

Usage
===

    npm install -g detect-invalid-requires

    detect-invalid-requires [options] (files)

Options
=====

`-i, --ignore list` Comma delimited list of path strings to ignore
