var angular = require('angular')
require('angular-ui-router')
require('angular-ui-bootstrap')
require('ng-file-upload')
require('ngprogress/build/ngProgress')

var app = angular.module('filelibraryAdmin', [
  'ngFileUpload',
  'ui.router',
  'ui.bootstrap',
  'filelibrary.constants',
  'ngProgress'])

// controllers
app.controller('mainController', require('./controllers/main'))

// services
app.factory('filesFactory', require('./services/files'))

app.config(function ($stateProvider, $urlRouterProvider) {
  $urlRouterProvider.otherwise('/list')

  $stateProvider
  .state('list', {
    url: '/list',
    views: {
      'partSize1': {
        templateUrl: 'templates/list.html',
        controller: require('./controllers/list'),
        controllerAs: 'list'
      }
    }
  })
  .state('options', {
    url: '/options',
    templateUrl: 'templates/options.html',
    controller: require('./controllers/options'),
    controllerAs: 'options'
  })
  .state('list.file', {
    url: '/:id',
    views: {
      'partSize2@': {
        templateUrl: 'templates/file.html',
        controller: require('./controllers/file'),
        controllerAs: 'file'
      }
    }
  })
})
