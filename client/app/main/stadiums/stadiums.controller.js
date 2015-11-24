'use strict';

angular.module('footballTaxApp')
  .controller('MainStadiumsCtrl', function ($scope, stadium) {
    $scope.stadium = stadium;
  });
