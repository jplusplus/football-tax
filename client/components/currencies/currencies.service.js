angular.module('footballTaxApp')
  .factory('currencies', function($translate) {

    function Currencies() {
      return this;
    }

    Currencies.prototype.figuresFormat = function(d) {
      if(d > 10e9) {
        return Math.round(d/10e9) + $translate.instant('BILLION_FIGURE');
      } else if(d > 10e6) {
        return Math.round(d/10e6) + $translate.instant('MILLION_FIGURE');
      } else if(d > 10e3) {
        return Math.round(d/10e3) + $translate.instant('THOUSAND_FIGURE');
      } else {
        return d;
      }
    };

    Currencies.prototype.fromStr = function(d) {
      return isNaN(d) ? (d+"").replace(/€|,/gi, '') * 1 : d;
    };

    var that = new Currencies();
    return that;
});
