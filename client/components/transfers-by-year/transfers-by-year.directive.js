angular.module('footballTaxApp')
  .directive("transferByYear", function($window, $translate) {
    return {
      restrict: 'AE',
      template: '<svg class="transfers-by-year"></svg>',
      scope: {
        transferByYear:"="
      },
      link: function(scope, element, attrs) {

        var init = function() {
          // Some setup stuff.
          var width = element.width();
          var height = element.height();
          // Remove content for regeneration
          element.find(".transfers-by-year").empty()
        };

        init();
        angular.element($window).bind("resize", init);
      }
    };
  });
