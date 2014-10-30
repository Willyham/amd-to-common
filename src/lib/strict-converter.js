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

  // If use strict is the first node, leave it be.
  var firstNode = defineFunction.body[0];
  if(isUseStrict(firstNode)){
    return content;
  }

  // Otherwise, let's rip it out and make it the first node.
  var strictRegex = /["']use strict['"];?\n/;
  var lenientContent = content.replace(strictRegex, '');

  // Let's save some trouble and assume this is a valid common style node for now.
  // The correct approach is to search the tree for this node.

  var toStrict = lenientContent.substring(0, firstNode.range[0]);
  var afterStrict = lenientContent.substring(firstNode.range[0], content.length);

  return toStrict + '\'use strict\';\n  ' + afterStrict;
};

function isUseStrict(node){
  return node.type === 'ExpressionStatement' && node.expression.value === 'use strict';
}