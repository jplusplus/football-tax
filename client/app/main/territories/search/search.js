'use strict';

angular.module('footballTaxApp')
  .config( function($stateProvider) {
    $stateProvider
      .state('main.territories.search', {
        url: '?q',
        templateUrl: 'app/main/territories/search/search.html',
        controller: 'MainTerritoriesSearchCtrl',
        resolve: {
          addr: function($http, $q, $stateParams) {
            let deferred = $q.defer();
            // If no address is provided
            if(! $stateParams.q ) {
              return deferred.reject('No value');
            }
            // Use OSM API to geocode the given address
            let url  = "//nominatim.openstreetmap.org/search?";
            url += "format=json&";
            url += "limit=1&";
            url += "osm_type=N&";
            url += "&q=" + $stateParams.q + "&json_callback=JSON_CALLBACK";
            // OSM API uses JSONP to return result
            $http.jsonp(url).then( function(res){
              if(res.data && res.data.length) {
                deferred.resolve(res.data[0]);
              } else {
                deferred.reject('No result');
              }
            });
            return deferred.promise;
          },
          results: function(Restangular, addr) {
            let latlng = addr.lat + "," + addr.lon;
            return Restangular.one("territories", "reverse").get({ latlng: latlng });
          },
          territories: results => results.territories,
          stadiums: results => results.stadiums
        }
      });
  });
