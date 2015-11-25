'use strict';

angular.module('footballTaxApp')
  .controller('MainClubsCtrl', function ($scope, club) {
    $scope.club = club;
    $scope.payers = _.groupBy(club.transfers, 'payer');
  });
