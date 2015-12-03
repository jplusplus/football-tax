angular.module('footballTaxApp')
  .filter('slug', function() {
    return function() {  
      return slug( _.values(arguments).join("-").toLowerCase() );
    };
  });
