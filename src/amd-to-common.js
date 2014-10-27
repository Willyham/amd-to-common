'use strict';

var fs = require('fs');
var _ = require('underscore');
var esprima = require('esprima');
var escodegen = require('escodegen');
var traverse = require('traverse');
var requireNodes = require('./lib/require-nodes');

var AMDToCommon = (function(){

  /**
   * Constructor function for the Human library
   * @param {Object} [options]
   * @private
   */
  var _convert = function(options){
    options = options || {};
    this.files = options.files;
  };

  /**
   * Read each file and analyse the content
   */
  _convert.prototype.analyse = function(){
    _.each(this.files, _.bind(function(filename){
      var content = fs.readFileSync(filename, 'utf-8');
      console.log('Analysing file ' + filename);
      this.analyseContent(content);
    }, this));
  };

  /**
   * Given the contents of a JS source file, parse the source
   * with esprima, then traverse the AST
   * @param {String} content The source content
   */
  _convert.prototype.analyseContent = function(content){
    var code = esprima.parse(content, {loc: true});
    traverse(code).forEach(function(node){
      debugger;
      if(!requireNodes.isAMDStyle(node)){
        return;
      }
      console.log('Found AMD style module definition');
      var dependencyMap = requireNodes.getDependencyMap(node);
      console.log(dependencyMap);
    });
  };

  return _convert;
})();

module.exports = AMDToCommon;