'use strict';

angular.module('footballTaxApp')
  .controller('MainTerritoriesDetailsCtrl', function($scope, currencies, territory, transfers) {
    $scope.territory = territory;
    $scope.transfers = transfers;
    $scope.years = _.range(
      _.min(transfers, 'date').date * 1,
      _.max(transfers, 'date').date * 1 + 1
    );

    // Clean currencies
    transfers =  _.map(transfers, transfer=> {
      transfer.value = currencies.fromStr(transfer.amount);
      return transfer;
    });

    // Pick the year with most spending
    $scope.yearMostSpending = _.chain(transfers)
      // Group transfers by date (year)
      .groupBy('date')
      // Create an array of objects for each year
      .reduce( (res, transfers, date)=>{
        res.push({
          year: date,
          transfers: transfers,
          // Sum every transfer's value
          total: _.reduce(transfers, (res, t)=>res + t.value, 0)
        });
        return res
      }, [])
      // Pick and return the year with the maximum value for 'total'
      .max('total').value();

    // Pick the entity with the transfers
    $scope.beneficiaryMostSpending = _.chain(transfers)
      // Group transfers by beneficiary
      .groupBy('beneficiary')
      // Create an array of objects for each beneficiary
      .reduce( (res, transfers, beneficiary)=>{
        res.push({
          beneficiary: beneficiary,
          transfers: transfers,
          // Sum every transfer's value
          total: _.reduce(transfers, (res, t)=>res + t.value, 0),
          // Find club from the first transfers (they are all the same)
          club: transfers[0].club
        });
        return res
      }, [])
      // Pick and return the beneficiary with the maximum value for 'total'
      .max('total').value();
  });
