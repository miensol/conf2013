'use strict';

angular.module('confApp')
  .controller('MainCtrl', function ($scope, countryData, $route, $routeParams, $location) {
        var lastRoute = $route.current;
        $scope.$on('$locationChangeSuccess', function(event) {
            $route.current = lastRoute;
        });

        $scope.selectCountry = function(country){
            countryData.selectCountry(country);
            $scope.selectedCountry = country;
            $location.path("/" + country.code);
        };
        if($routeParams.countryCode){
            countryData.onCountryWithCodeDo($routeParams.countryCode, function(country){
                $scope.selectCountry(country);
            });
        }


  });
