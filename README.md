amd-to-common
=============

[![Travis branch](https://img.shields.io/travis/Willyham/amd-to-common.svg)]() [![Coverage Status](https://coveralls.io/repos/Willyham/amd-to-common/badge.svg)](https://coveralls.io/r/Willyham/amd-to-common)

Convert requireJS AMD style defines to requireJS commonJS style defines.

Install

    npm install -g amd-to-common

Usage:

    amd-to-common [file/directory/glob] [--exclude=]
    
Important: This /will/ rewrite your files. Please make sure they are checked in to some kind of source control before running amd-to-common.

# What does it do?

RequireJS has a secondary, little known import style. When writing a module, most people use something like this:

```javascript
define([
  'underscore',
], function(_){
  'use strict';

  return {
    invoke: _.noop
  };

});
```

However, there is a much simpler and more beautiful syntax which is resembles commonJS:

```javascript
define(function(require, exports, module){
  'use strict';
  
  var _ = require('underscore');

  module.exports = {
    invoke: _.noop
  };

});
```

There are a few advantages to using this syntax. It removes the unweildy array and huge dependecy list construct and also gives you a much simpler task if you're planning on converting to something commonJS compliant like Browserify.

## Why not use browserify-ftw?

[browserify-ftw](https://github.com/thlorenz/browserify-ftw) is an awesome project which aims to convert your project to browserify in basically one shot. Sometimes, especially for large webapps, this isn't ideal. On a large project, we wanted a half-way house so that we could write in CommonJS style whilst still preparing to move to browserify.

## How does it work?

amd-to-common uses [esprima](http://esprima.org/) to parse your JS files into an AST. It then analyses the content of the file, and does some really gnarly string replacements in order to rewrite to CommonJS style. Ideally, it would modify the AST and use something like `escodegen` to rewrite the source, but as most projects have very different spacing styles, this would probably anger a lot of people.

### Is it safe?

Most likely, but I'm sure there are some edge cases. If it makes you feel better, I've used this to convert a pretty complex (~200 module) web app with ~~very few~~ no problems.
