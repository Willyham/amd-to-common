'use strict';

var _ = require('underscore');
var args = require('minimist')(process.argv.slice(2));
var glob = require('glob-all');
var path = require('path');
var fs = require('fs');
var AMDToCommon = require('./amd-to-common');

function getFileGlobString(arg){
  var stat = fs.lstatSync(arg);
  if(stat.isDirectory()){
    return path.join(arg, '**/*.js');
  }
  return arg;
}

var directory = _.first(args._) || './';
var allJSFiles = getFileGlobString(directory);
var excludedPattern = '!' + args.exclude;

glob([allJSFiles, excludedPattern], {}, function(error, files){
  var converter = new AMDToCommon({
    files: files
  });
  converter.analyse();
});
