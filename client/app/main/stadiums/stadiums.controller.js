'use strict';

angular.module('footballTaxApp')
  .controller('MainStadiumsCtrl', function ($scope, currencies, stadium, compute) {
    $scope.stadium = stadium;
    $scope.years = _.range(
      _.min(stadium.transfers, 'date').date * 1,
      _.max(stadium.transfers, 'date').date * 1 + 1
    );
    // Clean currencies
    var transfers =  compute.cleanAmount(stadium.transfers);
    // Pick the year with most spending
    $scope.yearMostSpeding = compute.mostSpending(transfers, 'date')
    // Pick the entity with the transfers
    $scope.territoryMostSpending = compute.mostSpending(transfers, 'payer')
  });
