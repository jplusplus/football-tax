'use strict';

angular.module('footballTaxApp')
  .controller('MainStadiumsCtrl', function ($scope, $rootScope, $translate, currencies, stadium, compute) {
    $scope.stadium = stadium;
    $scope.years =  compute.years(stadium.transfers);
    // Clean currencies
    var transfers =  compute.cleanAmount(stadium.transfers);
    // Pick the year with most spending
    $scope.yearMostSpeding = compute.mostSpending(transfers, 'date');
    // Pick the entity with the transfers
    $scope.territoryMostSpending = compute.mostSpending(transfers, 'payer');

    // Not every stadium has a page
    if( stadium.page ) {
      // Function to use the page translation
      let useLangContent = ()=> {
        // The translation must exist
        if( stadium.page.contents[ $translate.use() ] ) {
          $scope.page = stadium.page.contents[ $translate.use() ];
        // The page must be translated in English
        } else {
          $scope.page = stadium.page.contents['en'];
        }
      };
      // Watch for language change
      $rootScope.$on('$translateChangeEnd', useLangContent);
      // Use a language once
      useLangContent();
    }
  });
