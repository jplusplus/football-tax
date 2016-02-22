'use strict';

angular.module('footballTaxApp')
  .controller('MainCtrl', function ($scope, $state, Restangular) {
    $scope.clubs = [];
    $scope.stadiums = [];
    // Selected club and stadium
    $scope.selectedClub = $scope.selectedStadium = null;
    // Looks for an address
    $scope.addrLookup = function(q) {
      $state.go('main.territories.search', { q: q });
    };
    // Looks for a club and a stadium
    $scope.polymorphicLookup = function(q) {
      if(!q) {
        $scope.items = []
        return;
      }
      Restangular.one('polymorphics')
        .getList('search', { q: q })
        .then(function(items) {
          $scope.items = items;
        });
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
    };
    // A stadium is Selected
    $scope.selectStadium = function(slug) {
      $state.go("main.stadiums", { slug: slug });
    };
    // A polymorphyc is Selected
    $scope.selectPolymorphic = function(item) {
      switch(item.domain) {
        case 'stadium':
          $state.go("main.stadiums", { slug: item.properties.slug });
          break;
        case 'club':
          $state.go("main.clubs", { slug: item.properties.slug });
          break
      }
    };
  });
