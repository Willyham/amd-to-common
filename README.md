amd-to-common
=============

Convert requireJS AMD style defines to requireJS commonJS style defines.

Install

    npm install -g amd-to-common

Usage:

    amd-to-common [file/directory/glob] [--exclude=]

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

