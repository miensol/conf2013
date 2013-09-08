'use strict';

angular.module('confApp', ['ngResource'])
    .config(function ($routeProvider) {
        $routeProvider
            .when('/:countryCode', {
                templateUrl: 'views/main.html',
                controller: 'MainCtrl'
            })
            .when('/:countryCode/more/', {
                templateUrl: 'views/more.html',
                controller: 'MoreController'
            })
            .otherwise({
                redirectTo: '/'
            });
    });
