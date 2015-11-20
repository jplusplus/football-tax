'use strict';

angular.module('footballTaxApp').config(function (RestangularProvider) {
  RestangularProvider.setBaseUrl('/api');
});
