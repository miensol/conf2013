'use strict';

angular.module('confApp')
  .controller('MainCtrl', function ($scope, countryData, $route, $routeParams, $location) {
        var lastRoute = $route.current;
        $scope.$on('$locationChangeSuccess', function(event) {
            if(!$route.current.$$route.redirectTo){
                lastRoute.params.countryCode = $scope.selectedCountry.code;
                $route.current = lastRoute;
            }
        });

        $scope.selectCountry = function(country){
            countryData.selectCountry(country);
            $scope.selectedCountry = country;
            $location.path("/" + country.code);
        };

        $scope.selectCountryByCode = function(countryCode){
            countryData.onCountryWithCodeDo(countryCode, function(country){
                $scope.selectCountry(country);
            });
        };

        var countryCode = $routeParams.countryCode;
        if(countryCode){
            $scope.selectCountryByCode(countryCode);
        }


  });
