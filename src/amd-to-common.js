'use strict';

var fs = require('fs');
var _ = require('underscore');
var esprima = require('esprima');
var traverse = require('traverse');
var requireDetection = require('./lib/require-detection');

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
    var code = esprima.parse(content, {
      loc: true,
      range: true,
      comment: true
    });
    traverse(code).forEach(function(node){
      if(!requireDetection.isAMDStyle(node)){
        return;
      }
      console.log('Found AMD style module definition');
      var dependencyMap = requireDetection.getDependencyMap(node);
    });
  };

  return _convert;
})();

module.exports = AMDToCommon;