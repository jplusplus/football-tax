'use strict';

angular.module('footballTaxApp')
  .config(function ($stateProvider) {
    $stateProvider
      .state('main', {
        url: '/',
        templateUrl: 'app/main/main.html',
        controller: 'MainCtrl',
        resolve: {
          // Take a breath
          timeout: $timeout=> $timeout(1000)
        }
      });
  });
