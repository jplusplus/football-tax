'use strict';

angular.module('footballTaxApp')
  .controller('MainTerritoriesCtrl', function ($scope, $stateParams, territories, stadiums) {
    $scope.territories = territories;
    $scope.stadiums = stadiums;
    $scope.q = $stateParams.q;
  });
