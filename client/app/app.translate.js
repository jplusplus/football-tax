'use strict';

angular.module('footballTaxApp')
  .config(function($translateProvider) {
    $translateProvider
      .useStaticFilesLoader({
        prefix: 'assets/locales/',
        suffix: '.json'
      })
      .registerAvailableLanguageKeys(['en', 'fr', 'de'], {
        'en_US': 'en',
        'en_UK': 'en',
        'fr_FR': 'fr',
        'fr_CA': 'fr',
        'fr_BE': 'fr',
        'es_ES': 'es'
      })
      .determinePreferredLanguage(function() {
        var lang = navigator.language || navigator.userLanguage;
        var avalaibleKeys = [
          'en_US', 'en_UK', 'en',
          'fr_FR', 'fr_CA', 'fr_BE', 'fr',
          'es_ES', 'es'
        ];
        return avalaibleKeys.indexOf(lang) === -1 ? 'en' : lang;
      })
      .fallbackLanguage(['en', 'fr'])
      .useMessageFormatInterpolation()
      .useCookieStorage()
      .useSanitizeValueStrategy(null);
  });
