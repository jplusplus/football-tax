'use strict';

angular.module('footballTaxApp')
  .config(function ($stateProvider) {
    $stateProvider
      .state('main.territories.details', {
        url: '/:id',
        templateUrl: 'app/main/territories/details/details.html',
        controller: 'MainTerritoriesDetailsCtrl',
        resolve: {
          territory: function($stateParams, Restangular) {
            return Restangular.one('territories', $stateParams.id).get()
          }
        }
      });
  });
