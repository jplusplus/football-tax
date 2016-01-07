angular.module('footballTaxApp')
  .filter('currencies', function(currencies) {
    return currencies.figuresFormat
  });
