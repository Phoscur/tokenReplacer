'use strict'

angular
  .module('tokenResolver', [])
  .controller('ParserCtrl', function($scope) {
    $scope.input = 'This is a {test} text';
    $scope.output = '---';
  })
