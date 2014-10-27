define([
  'underscore'
], function(_){
  'use strict';

  return {

    /**
     * A little utility to invoke a function, if it exists
     * Saves having to do if(function){function()} everywhere.
     * @param {Function} func The function to invoke
     * @param {Array} args The arguments to call a function with
     * @param {Object} [scope] The scope to invoke the function with
     */
    invoke: function(func, args, scope){
      scope = scope || this;
      args = _.isArray(args) ? args : [args];
      if(func){
        return func.apply(scope, args);
      }
    }
  };

});
