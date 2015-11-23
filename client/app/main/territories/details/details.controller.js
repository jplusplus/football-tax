'use strict';

angular.module('footballTaxApp')
  .controller('MainTerritoriesDetailsCtrl', function($scope, territory) {
    $scope.territory = territory;
  });
