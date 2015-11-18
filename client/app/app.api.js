'use strict';

angular.module('footballTaxApp').config(function (RestangularProvider) {
  RestangularProvider.setBaseUrl('/api');
  RestangularProvider.setRestangularFields({
    id: "_id"
  });
});
