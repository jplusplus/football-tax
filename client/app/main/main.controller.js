'use strict';

angular.module('footballTaxApp')
  .controller('MainCtrl', function ($scope, Restangular) {
    $scope.clubs = [];
    $scope.selectedClub = {};
    $scope.clubLookup = function(q) {
      if(!q) {
        $scope.clubs = []
        return;
      }
      Restangular.one('clubs')
        .getList('search', { q: q })
        .then(function(clubs) {
          $scope.clubs = clubs;
        });
    };
  });
