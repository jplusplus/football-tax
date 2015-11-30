'use strict';

angular.module('footballTaxApp')
  .controller('PagesCtrl', function ($scope, $rootScope, $translate, page) {
    // Function to use the page translation
    let useLangContent = ()=> {
      // The translation must exist
      if( page.contents[ $translate.use() ] ) {
        $scope.page = page.contents[ $translate.use() ];
      // The page must be translated in English
      } else {
        $scope.page = page.contents['en'];
      }
    };
    // Watch for language change
    $rootScope.$on('$translateChangeEnd', useLangContent);
    // Use a language once
    useLangContent();
  });
