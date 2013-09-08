(function(){
    var confApp = angular.module('confApp');

    confApp.controller('MoreController', function($scope, $routeParams, countryData){
        $scope.isLoading = true;
        countryData.onCountryWithCodeDo($routeParams.countryCode, function(country){
            $scope.selectedCountry = country;
            countryData.loadFullCountry(country.code).then(function(country){
                $scope.isLoading = false;
                $scope.fullCountry = country;
            });
        });

    });

}());