'use strict';

angular.module('footballTaxApp')
  .controller('MainClubsCtrl', function ($scope, club) {
    $scope.club = club;
    $scope.payers = _.groupBy(club.transfers, 'payer');
    $scope.years = _.range(
      _.min(club.transfers, 'date').date * 1,
      _.max(club.transfers, 'date').date * 1 + 1
    );
  });
