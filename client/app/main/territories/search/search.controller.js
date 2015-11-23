'use strict';

angular.module('footballTaxApp')
  .controller('MainTerritoriesSearchCtrl', function ($scope, $stateParams, territories, stadiums) {
    $scope.territories = territories;
    $scope.stadiums = stadiums;
    $scope.q = $stateParams.q;
  });
