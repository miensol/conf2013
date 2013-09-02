(function () {
    var confApp = angular.module('confApp');

    confApp.factory('countryData', function ($resource) {
        var CountryViewModel = function(){
            var relative = ((this.value - 1) / 100.0 * 225).toFixed(0);
            var notSelectedStroke = { color: "#ccc6ae", width: 1 };
            var selectedStroke = { color: "#ff4400", width: 5 };

            this.getStrokeBasedOnSelected = function(other){
                return this.isSelected ? selectedStroke : other;
            };
            this.color = 'rgb('+relative+','+relative+','+255+')';

            this.startHighlighting = function(){
                this.isHighlighted = true;
                this.stroke =  this.getStrokeBasedOnSelected({ color: "#ff8800", width: 4 });
            };
            this.stopHighlighting = function(){
                this.isHighlighted = false;
                this.stroke =  this.getStrokeBasedOnSelected({ color: "#ccc6ae", width: 1 });
            };
            this.matchesText = function(text){
                if(!text){
                    return true;
                }
                text = text.toLowerCase();
                return this.name.toLowerCase().indexOf(text) !== -1
                    || this.code.toLowerCase().indexOf(text) !== -1;
            };

            this.select = function(){
                this.isSelected = true;
                this.stroke = this.getStrokeBasedOnSelected(notSelectedStroke);
            };
            this.unselect = function(){
                this.isSelected = false;
                this.stroke = this.getStrokeBasedOnSelected(notSelectedStroke);
            };

            this.stopHighlighting();
            this.unselect();
        };
        var countryResource = $resource('/country');
        return {
            countries: null,
            loadCountries: function (callback) {
                if (!this.countries) {
                    this.countries = countryResource.query(function (elements) {
                        elements.forEach(function(country){
                            CountryViewModel.call(country);
                        });
                        if(callback){
                            callback(elements);
                        }
                    });
                }

                return this.countries;
            },
            selectCountry: function(countryToSelect){
                if(countryToSelect.isSelected){
                    return;
                }
                this.countries.forEach(function(country){
                    country.unselect();
                });
                countryToSelect.select();
            }
        };
    });

}());