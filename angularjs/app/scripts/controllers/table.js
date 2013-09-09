(function(){
    var confApp = angular.module('confApp');

    confApp.controller('TableController', function($scope, countryData){

        $scope.countries = countryData.loadCountries();

        $scope.filterText = "";
        $scope.applyFiltering = function(){
            $scope.countries = countryData.loadCountries().filter(function(country){
                return country.matchesFilter($scope.filterText);
            });
        }.throttle(100);

        $scope.classForCountry = function(country){
            if(country.isSelected){
                return "country-selected";
            }
            if(country.isHighlighted){
                return "country-highlighted";
            }
            return "";
        };

    });
}());