'use strict';

angular.module('footballTaxApp')
  .config(function($translateProvider) {
    $translateProvider
      .useStaticFilesLoader({
        prefix: 'assets/locales/',
        suffix: '.json'
      })
      .registerAvailableLanguageKeys(['en', 'fr'])
      .determinePreferredLanguage()
      .fallbackLanguage(['en'])
      .useCookieStorage()
  });
