angular.module('footballTaxApp')
  .factory('currencies', function($translate) {

    function Currencies() {
      return this;
    }

    Currencies.prototype.figuresFormat = function(d) {
      if(d >= 1e9) {
        return $translate.instant('BILLION_FIGURE', { amount: Math.round(d/1e9) });
      } else if(d >= 1e6) {
        return $translate.instant('MILLION_FIGURE', { amount: Math.round(d/1e6) });
      } else if(d >= 1e3) {
        return $translate.instant('THOUSAND_FIGURE', { amount: Math.round(d/1e3) });
      } else {
        return d;
      }
    };



    Currencies.prototype.millions = function(d) {
      if(d >= 1e6) {
        return Math.round(d/1e6)
      } else {
        return Math.round(d/1e4)/1e2
      }
    }


    Currencies.prototype.fromStr = function(d) {
      return isNaN(d) ? (d+"").replace(/€|,|\s/gi, '') * 1 : d;
    };

    var that = new Currencies();
    return that;
});
