var _ = require('underscore');

/**
 * Make the require statements.
 * TOOD: Add support for different tab spacing/quote styles
 * @param {String} name The package name
 * @param {String} identifier Identifier name
 * @returns {string} A require statement
 */
var makeRequireStatement = function(name, identifier){
  if(name){
    return '  var ' + name + ' = require(\'' + identifier + '\');\n';
  }
  return 'require(\'' + identifier + '\');\n';
};

/**
 * Add the import statements to the code, right after the initial function block
 * @param content
 * @param amdNode
 * @returns {string}
 */
var addImportStatements = function(content, amdNode){
  var defineEnd = amdNode.node.range[1];
  var functionNode = amdNode.getFunctionNode();
  var functionBlockStart = functionNode.body.range[0] + 1;
  var requireStatements = _.reduce(amdNode.getDependencyMap(), function(memo, name, identifier){
    memo = memo + makeRequireStatement(name, identifier);
    return memo;
  }, '\n');

  var defineStatement = content.substring(0, functionBlockStart);
  var block = content.substring(functionBlockStart, defineEnd);
  return defineStatement + requireStatements + block;
};

/**
 * Converts the node to the CommonJS style by getting a bunch of locations
 * from the node and doing some nasty string replacements.
 * Ideally this would use something like escodegen, but we don't want to rewrite other
 * stylistic differences in the project.
 * @param {String} content The original source as a string
 * @param {AMDNode} amdNode The AMD node
 * @returns {string} The converted source.
 */
var addRequireStatement = function(content, amdNode){
  var argumentsStart = amdNode.getArrayNode().range[0];
  var functionNode = amdNode.getFunctionNode();
  var functionBlockStart = functionNode.body.range[0];
  var defineStart = amdNode.node.range[0];

  var defineString = content.substring(defineStart, argumentsStart);
  var newDefine = 'function(require, exports, module)';

  var blockContent = content.substring(functionBlockStart, content.length);
  return defineString + newDefine + blockContent;
};

/**
 * Convert to commonJS style imports
 * Add the import statements first so that we don't mess up the ranges.
 * This works because changing the function definition all happens on
 * the code before the imports.
 * @param content
 * @param amdNode
 * @returns {string}
 */
module.exports = function convert(content, amdNode){
  var withImports = addImportStatements(content, amdNode);
  return addRequireStatement(withImports, amdNode);
};
