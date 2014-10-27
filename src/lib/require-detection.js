var _ = require('underscore');

/**
 * Determine whether a node represents a requireJS 'define' call.
 * @param {Object} node AST node
 * @returns {Boolean} true if define call, false otherwise
 */
var isDefine = function(node){
  if(!node || !node.type || node.type !== 'ExpressionStatement'){
    return false;
  }
  if(node.expression.type !== 'CallExpression'){
    return false;
  }
  return Boolean(node.expression.callee.name === 'define');
};

/**
 * Determine whether a node is an AMD style define call
 * This detects code in the format:
 *    define(['req1', 'req2'], function(Req1, Req1) {})
 * But not:
 *    define(function(require, exports, module){})
 * @param {Object} node AST Node
 * @returns {boolean} true if AMD style, false otherwise
 */
var isAMDStyle = function(node){
  if(!isDefine(node)){
    return false;
  }
  var defineArguments = node.expression.arguments;
  if(defineArguments[0].type !== 'ArrayExpression'){
    return false;
  }
  return Boolean(defineArguments[1].type === 'FunctionExpression');
};

/**
 * Given an AMD style define, get a map of dependencies
 * For example,
 *    define(['req1', 'req2'], function(Req1, Req1) {})
 * Produces:
 *    {'req1': Req1, 'req2': Req2}
 * @param {Object} node AST Node
 * @returns {Object} An object map of dependencies
 */
var getDependencyMap = function(node){
  var arrayDependencies = getArrayDependencies(node);
  var dependencyIdentifiers = getDependencyIdentifiers(node);
  return _.object(_.zip(arrayDependencies, dependencyIdentifiers));
};

/**
 * Get the dependencies from the array
 * @param {Object} node AST Node
 * @returns {String[]} A list of dependency strings
 */
var getArrayDependencies = function(node){
  return _.map(node.expression.arguments[0].elements, function(element){
    return element.raw;
  });
};

/**
 * Get the dependencies identifiers from the array
 * @param {Object} node AST Node
 * @returns {String[]} A list of dependency strings
 */
var getDependencyIdentifiers = function(node){
  return _.map(node.expression.arguments[1].params, function(param){
    return param.name;
  });
};

module.exports = {
  isDefine: isDefine,
  isAMDStyle: isAMDStyle,
  getDependencyMap: getDependencyMap
};