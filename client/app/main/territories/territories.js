'use strict';

angular.module('footballTaxApp')
  .config( function($stateProvider) {
    $stateProvider
      .state('main.territories', {
        url: 'territories',
        abstract: true,
        template: '<ui-view></ui-view>'
      });
  });
