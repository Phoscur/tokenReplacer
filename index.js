'use strict'

angular
  .module('tokenResolver', [])
  .controller('ParserCtrl', function($scope, parseText) {
    $scope.input = 'This is a {test} text \\{test}';
    $scope.output = parseText($scope.input, {test: 'tasty'}) || '---';
  })
  .factory('parseText', function() {
    return function(text, replacements) {
      return text
        .replace(
          /([^\\])\{([a-zA-Z_][a-zA-Z0-9_]*)\}/g,
          function(match, previousChar, token, offset, string) {
            // previous char is matched not to be a backslash
            return previousChar + (replacements[token] || token);
          }
        );
    };
  })
