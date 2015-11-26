'use strict';

angular.module('footballTaxApp')
  .controller('MainStadiumsCtrl', function ($scope, currencies, stadium) {
    $scope.stadium = stadium;
    $scope.years = _.range(
      _.min(stadium.transfers, 'date').date * 1,
      _.max(stadium.transfers, 'date').date * 1 + 1
    );

    // Pick the year with most spending
    $scope.yearMostSpeding = _.chain(stadium.transfers)
      // Clean currencies
      .map( transfer=> {
        transfer.value = currencies.fromStr(transfer.amount);
        return transfer;
      })
      // Group transfers by date (year)
      .groupBy('date')
      // Create an array of objects for each year
      .reduce( (res, transfers, date)=>{
        res.push({
          date: date,
          transfers: transfers,
          // Sum every transfer's value
          total: _.reduce(transfers, (res, t)=>res + t.value, 0)
        });
        return res
      }, [])
      // Pick and return the year with the maximum value for 'total'
      .max('total').value();
  });
