'use strict';

angular.module('footballTaxApp')
  .controller('MainStadiumsCtrl', function ($scope, currencies, stadium) {
    $scope.stadium = stadium;
    $scope.years = _.range(
      _.min(stadium.transfers, 'date').date * 1,
      _.max(stadium.transfers, 'date').date * 1 + 1
    );

    // Generates territory slug using its name
    $scope.territorySlug = (name)=> {
      return slug( [stadium.country, name].join("-").toLowerCase() );
    }

    // Clean currencies
    var transfers =  _.map(stadium.transfers, transfer=> {
      transfer.value = currencies.fromStr(transfer.amount);
      return transfer;
    });

    // Pick the year with most spending
    $scope.yearMostSpeding = _.chain(transfers)
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

    // Pick the entity with the transfers
    $scope.territoryMostSpending = _.chain(transfers)
      // Group transfers by payer
      .groupBy('payer')
      // Create an array of objects for each payer
      .reduce( (res, transfers, payer)=>{
        res.push({
          payer: payer,
          transfers: transfers,
          // Sum every transfer's value
          total: _.reduce(transfers, (res, t)=>res + t.value, 0),
          // Find club from the first transfers (they are all the same)
          club: transfers[0].club
        });
        return res
      }, [])
      // Pick and return the payer with the maximum value for 'total'
      .max('total').value();
  });
