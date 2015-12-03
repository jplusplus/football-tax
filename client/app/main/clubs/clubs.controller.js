'use strict';

angular.module('footballTaxApp')
  .controller('MainClubsCtrl', function ($scope, $rootScope, $translate, club) {
    $scope.club = club;
    $scope.payers = _.groupBy(club.transfers, 'payer');
    $scope.years = _.range(
      _.min(club.transfers, 'date').date * 1,
      _.max(club.transfers, 'date').date * 1 + 1
    );
    
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
