'use strict';
/* globals angular */

angular
  .module('tokenResolver', [])
  .controller('ParserCtrl', function($scope, parseText) {
    var parser = $scope.parser = {
      input: '',
      replacements: {},
      output: '',
      replaces: function(token, replacement, oldToken) {
        if (oldToken || oldToken === '') {
          delete this.replacements[oldToken];
        }
        this.replacements[token] = replacement;
        return this;
      },
      parse: function() {
        this.output = parseText(this.input, this.replacements) || '---';
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
      return text
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
