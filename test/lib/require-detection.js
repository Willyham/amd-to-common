var test = require('tape');
var _ = require('underscore');
var esprima = require('esprima');
var fs = require('fs');

var requireDetection = require('../../src/lib/require-detection');

var _parse = _.partial(esprima.parse, _, {
  loc: true,
  range: true,
  comment: true
});
var amdContent = fs.readFileSync('examples/amd.js', 'utf-8');
var commonContent = fs.readFileSync('examples/common.js', 'utf-8');
var amdAST = _parse(amdContent).body[0];
var commonAST = _parse(commonContent).body[0];

test('Should detect whether a node is a define call', function(t){
  t.plan(2);
  t.ok(requireDetection.isDefine(amdAST));
  t.ok(requireDetection.isDefine(commonAST));
});

test('Should detect whether a define call is AMD style', function(t){
  t.plan(2);
  t.ok(requireDetection.isAMDStyle(amdAST));
  t.notOk(requireDetection.isAMDStyle(commonAST));
});

test('Should build the dependency map', function(t){
  t.plan(1);
  t.looseEqual(requireDetection.getDependencyMap(amdAST), {
    underscore: '_'
  });
});