var _ = require('underscore');

/**
 * Given the content and an AST node, convert the return statement
 * to be a module.export
 * @param {String} content The code
 * @param {Object} node The AST node
 * @returns {String} The converted content
 */
module.exports = function convert(content, node){
  var defineFunction = node.body[0].expression.arguments[0].body;
  var functionBody = defineFunction.body;
  var returnStatement = _.find(functionBody, function(node){
    return node.type === 'ReturnStatement';
  });
  if(!returnStatement){
    return content;
  }

  var returnStart = returnStatement.range[0];
  var definitionStart = returnStatement.argument.range[0];
  var upToReturn = content.substring(0, returnStart);
  var afterReturn = content.substring(definitionStart, content.length);

  return upToReturn + 'module.exports = ' + afterReturn;
};
