'use strict';

angular.module('footballTaxApp')
  .controller('MainStadiumsCtrl', function ($scope, stadium) {
    $scope.stadium = stadium;
    $scope.years = _.range(
      _.min(stadium.transfers, 'date').date * 1,
      _.max(stadium.transfers, 'date').date * 1 + 1
    );
  });
