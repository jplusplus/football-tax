angular.module('footballTaxApp')
  .factory('compute', function(currencies) {

    function Compute() {
      return this;
    }

    Compute.prototype.aggregate = function(transfers, aggregate) {
      // Pick the year with most spending
      return _.chain(transfers)
        // Group transfers by date (year)
        .groupBy(aggregate)
        // Create an array of objects for each year
        .reduce( (res, transfers, name)=>{
          res.push({
            name: name,
            transfers: transfers,
            // Sum every transfer's value
            total: _.reduce(transfers, (res, t)=>res + t.value, 0),
            // Maximum value
            max: _.max(transfers, 'value').value,
            // Find club from the first transfers (they are all the same)
            club: transfers[0].club
          });
          return res
        }, []).sortBy('name').value()
    };

    Compute.prototype.mostSpending = function(transfers, aggregate) {
      // Pick and return the group with the maximum value for 'total'
      return _.max( this.aggregate(transfers, aggregate), 'total');
    };

    Compute.prototype.cleanAmount = function(transfers) {
      // Clean currencies
      return  _.map(transfers, transfer=> {
        transfer.value = currencies.fromStr(transfer.amount);
        return transfer;
      });
    };

    Compute.prototype.years = function(transfers) {
      return _.range(
        _.min(transfers, 'date').date * 1,
        _.max(transfers, 'date').date * 1 + 1
      );
    };

    return new Compute();
});
