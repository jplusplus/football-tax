'use strict';

angular.module('footballTaxApp')
  .controller('MainClubsCtrl', function ($scope, $rootScope, $translate, $filter, club, compute) {
    $scope.club = club;
    $scope.years = compute.years();
    $scope.payers = [];
    let territories = _.groupBy(club.transfers, 'payer');

    for( let name in territories ) {
      let transfers = territories[name];
      let payer = _.find($scope.club.payers, { name: name });
      // Replace the payer array by an object
      if(payer) {
        // Add the payer's transfers
        payer.transfers = transfers;
        // No level for this payer? We add one !
        //payer.level = payer.level || 1
        // And ad the territory as a payer
        $scope.payers.push(payer);
      }
    }

    $scope.territoryFigures = (territory, transfers)=> {
      let currencies = $filter("currencies");
      let largestPayment = { value: 0, beneficiary: null, year: null };
      // Group transfers by years
      let byYears = _.groupBy(transfers, 'date');
      // For each year, group transfers by beneficiary
      _.each(byYears, (transfers, year)=> {
        byYears[year] = _.groupBy(transfers, 'beneficiary')
        // For each beneficiary...
        _.each(byYears[year], (transfers, beneficiary)=> {
          // ...compute the sum of the transfers
          let payment = _.chain(transfers).pluck('value').sum().value()
          // Is the payment bigger than the biggest one so far?
          if( largestPayment.value < payment ) {
            // Yes! So we save the current beneficiary
            largestPayment = {
              value: payment,
              beneficiary: beneficiary,
              date: year
            }
          }
        });
      });

      let largestTransfer =_.max(transfers, 'value');

      return {
        territory: territory,
        amount: $filter('currencies')(largestPayment.value),
        club: club.nameclub,
        years_number: $scope.missingYears(transfers).length,
        largest_transfer_year: largestTransfer.date,
        largest_transfer_type: $translate.instant(largestTransfer.type)
      };
    };

    $scope.missingYears = (transfers)=> {
      let years = _.chain(transfers).pluck("date").uniq().reject(isNaN).value()
      return _.reject($scope.years, y => years.indexOf(y) > -1);
    };

    // Not every club has a page
    if( club.page ) {
      // Function to use the page translation
      let useLangContent = ()=> {
        // The translation must exist
        if( club.page.contents[ $translate.use() ] ) {
          $scope.page = club.page.contents[ $translate.use() ];
        // The page must be translated in English
        } else {
          $scope.page = club.page.contents['en'];
        }
      };
      // Watch for language change
      $rootScope.$on('$translateChangeEnd', useLangContent);
      // Use a language once
      useLangContent();
    }
  });
