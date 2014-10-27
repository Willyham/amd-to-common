var _ = require('underscore');

var isDefine = function(node){
  if(!node || !node.type || node.type !== 'ExpressionStatement'){
    return false;
  }
  if(node.expression.type !== 'CallExpression'){
    return false;
  }
  return Boolean(node.expression.callee.name === 'define');
};

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

var getDependencyMap = function(node){
  var arrayDependencies = getArrayDependencies(node);
  var dependencyIdentifiers = getDependencyIdentifiers(node);
  return _.object(_.zip(arrayDependencies, dependencyIdentifiers));
};

var getArrayDependencies = function(node){
  return _.map(node.expression.arguments[0].elements, function(element){
    return element.raw;
  });
};

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