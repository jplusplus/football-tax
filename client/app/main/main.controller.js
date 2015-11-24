'use strict';

angular.module('footballTaxApp')
  .controller('MainCtrl', function ($scope, $state, Restangular) {
    $scope.clubs = [];
    $scope.stadiums = [];
    // Selected club
    $scope.selectedClub = null;
    // Looks for an address
    $scope.addrLookup = function(q) {
      $state.go('main.territories.search', { q: q });
    };
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
    // Looks for a club
    $scope.stadiumLookup = function(q) {
      if(!q) {
        $scope.stadiums = []
        return;
      }
      Restangular.one('stadiums')
        .getList('search', { q: q })
        .then(function(stadiums) {
          $scope.stadiums = stadiums;
        });
    };
    // A club is Selected
    $scope.selectClub = function(slug) {
      $state.go("main.clubs", { slug: slug });
    }
  });
