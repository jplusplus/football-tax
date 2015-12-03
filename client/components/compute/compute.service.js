angular.module('footballTaxApp')
  .factory('compute', function(currencies) {

    function Compute() {
      return this;
    }

    Compute.prototype.mostSpending = function(transfers, aggregate) {
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
            // Find club from the first transfers (they are all the same)
            club: transfers[0].club
          });
          return res
        }, [])
        // Pick and return the year with the maximum value for 'total'
        .max('total').value();
    }


    Compute.prototype.cleanAmount = function(transfers) {
      // Clean currencies
      return  _.map(transfers, transfer=> {
        transfer.value = currencies.fromStr(transfer.amount);
        return transfer;
      });
    };

    return new Compute();
});
