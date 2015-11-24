'use strict';

angular.module('footballTaxApp')
  .config(function ($stateProvider) {
    $stateProvider
      .state('main.stadiums', {
        url: 'stadiums/:slug',
        templateUrl: 'app/main/stadiums/stadiums.html',
        controller: 'MainStadiumsCtrl',
        resolve: {
          stadium: function(Restangular, $stateParams) {
            return Restangular.one('stadiums', $stateParams.slug).get()
          }
        }
      });
  });
