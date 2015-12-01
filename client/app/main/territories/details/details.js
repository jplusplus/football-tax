'use strict';

angular.module('footballTaxApp')
  .config(function ($stateProvider) {
    $stateProvider
      .state('main.territories.details', {
        url: '/:slug',
        templateUrl: 'app/main/territories/details/details.html',
        controller: 'MainTerritoriesDetailsCtrl',
        resolve: {
          territory: function($stateParams, Restangular) {
            return Restangular.one('territories', $stateParams.slug).get();
          },
          transfers: function(territory) {
            let all = _.chain(territory.clubs).reduce( (res, club)=>{
              // Add the club namme to each transfers
              _.map(club.transfers, t=> t.club = club);
              // Add the transfers array to the result
              res.push(club.transfers);
              return res;
            }, []).value();
            // Merge every transfers arrays
            return _.union.apply(null, all);
          }
        }
      });
  });
