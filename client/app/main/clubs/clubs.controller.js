'use strict';

angular.module('footballTaxApp')
  .controller('MainClubsCtrl', function ($scope, club) {
    $scope.club = club
  });
