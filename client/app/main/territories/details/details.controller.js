'use strict';

angular.module('footballTaxApp')
  .controller('MainTerritoriesDetailsCtrl', function($scope, currencies, compute, territory, transfers) {
    $scope.territory = territory;
    $scope.transfers = transfers;
    $scope.years =  compute.years(transfers);  

    // Clean currencies
    transfers = compute.cleanAmount(transfers);
    // Pick the year with most spending
    $scope.yearMostSpending = compute.mostSpending(transfers, 'date');
    // Pick the entity with the transfers
    $scope.beneficiaryMostSpending = compute.mostSpending(transfers, 'beneficiary');
  });
