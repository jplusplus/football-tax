'use strict';

angular.module('footballTaxApp')
  .controller('MainCtrl', function ($scope, $state, Restangular) {
    $scope.clubs = [];
    // Selected club
    $scope.selectedClub = null;
    // Looks for a club
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
    // A club is Selected
    $scope.selectClub = function(slug) {
      $state.go("main.clubs", { slug: slug });
    }
  });
