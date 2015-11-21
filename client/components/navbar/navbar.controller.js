'use strict';

angular.module('footballTaxApp')
  .controller('NavbarCtrl', function ($scope, $translate) {
    $scope.isCollapsed = true;
    $scope.use = $translate.use;  
  });
