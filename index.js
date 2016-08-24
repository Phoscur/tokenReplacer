'use strict';
/* global angular */

angular
  .module('tokenReplacer', [])
  .controller('ParserCtrl', function($scope, parseText) {
    var parser = $scope.parser = {
      input: '',
      replacements: [],
      output: '',

      remove: function(token) {
        this.replacements.some(function(touple, i) {
          if (touple.token === token) {
            this.replacements.splice(i, 1);
            return true;
          }
        }, this);
      },

      replaces: function(token, replacement) {
        this.replacements.push({
          token: token,
          text: replacement
        });
        return this;
      },
      // missing update method:
      //  changing replacements is currently done directly on the scope

      /**
        Parse the input with the replacements into the output
       */
      parse: function() {
        var replacements = this.replacements // as hashmap
          .reduce(function(hashmap, replacement) {
            hashmap[replacement.token] = replacement.text;
            return hashmap;
          }, {});
        this.output = parseText(this.input, replacements) || '---';
        return this;
      }
    };

    // init
    parser.input = 'This is a {test} text containing \\{test} tokens, \n linebreaks \n \n \\backslashes\\\\\\\\ and {blubb} maybe {recursive} tokens!';
    parser.replaces('test', 'tasty');
    parser.replaces('blubb', 'more replaced tokens');
    parser.replaces('recursive', '{test}');
    parser.parse();
  })
  .factory('parseText', function() {
    return function(text, replacements) {
      return (text || '')
        .replace(
          /([^\\])\{([a-zA-Z_][a-zA-Z0-9_]*)\}/g,
          function(match, previousChar, token, offset, string) {
            // previous char is matched not to be a backslash
            var replaced = previousChar;
            if (!replacements[token]) {
              // no replacement found, reconstruct previous text
              replaced += '{' + token + '}';
            } else {
              replaced += replacements[token];
            }
            return replaced;
          }
        );
    };
  });
