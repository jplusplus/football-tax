'use strict';

angular.module('footballTaxApp')
  .config(function ($stateProvider) {
    $stateProvider
      .state('main.clubs', {
        url: 'clubs/:slug',
        templateUrl: 'app/main/clubs/clubs.html',
        controller: 'MainClubsCtrl',
        resolve: {
          club: function(Restangular, $stateParams) {
            return Restangular.one('clubs', $stateParams.slug).get()
          }
        }
      });
  });
