'use strict';

angular.module('footballTaxApp')
  .config(function ($stateProvider) {
    $stateProvider
      .state('pages', {
        url: '/pages/:slug',
        templateUrl: 'app/pages/pages.html',
        controller: 'PagesCtrl',
        resolve: {}
      });
  });
