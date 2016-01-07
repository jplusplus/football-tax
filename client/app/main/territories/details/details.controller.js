'use strict';

angular.module('footballTaxApp')
  .controller('MainTerritoriesDetailsCtrl', function($scope, currencies, compute, territory, transfers) {
    $scope.territory = territory;
    $scope.transfers = transfers;
    $scope.years =  compute.years();
    // Clean currencies
    transfers = compute.cleanAmount(transfers);
    // Total of transfers
    $scope.total = _.chain(transfers).pluck('value').sum().value();
    // Pick the year with most spending
    $scope.yearMostSpending = compute.mostSpending(transfers, 'date');
    // Pick the entity with the transfers
    $scope.beneficiaryMostSpending = compute.mostSpending(transfers, 'beneficiary');    
  });
