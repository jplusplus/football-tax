'use strict';

angular.module('footballTaxApp')
  .controller('MainClubsCtrl', function ($scope, $rootScope, $translate, $filter, club, compute) {
    $scope.club = club;
    $scope.payers = _.groupBy(club.transfers, 'payer');
    $scope.years = compute.years(club.transfers);

    $scope.territoryFigures = (territory, transfers)=> {
      let currencies = $filter("currencies");
      let largestPayment = _.max(transfers, 'value');
      return {
        territory: name,
        amount: currencies( _.chain(transfers).pluck('value').sum().value() ),
        club: club.nameclub,
        year_largest_payment: largestPayment.date,
        years_number: $scope.missingYears(transfers).length,
        type_payment: $translate.instant(largestPayment.type)
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
