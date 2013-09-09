(function () {
    var confApp = angular.module('confApp');

    var emptyFunction = function () {};

    confApp.factory('countryData', function ($resource) {
        var CountryViewModel = function () {
            var relative = ((this.value - 1) / 100.0 * 225).toFixed(0);
            var notSelectedStroke = { color: "#ccc6ae", width: 1 };
            var selectedStroke = { color: "#ff4400", width: 5 };

            this.getStrokeBasedOnSelected = function (other) {
                return this.isSelected ? selectedStroke : other;
            };
            this.color = 'rgb(' + relative + ',' + relative + ',' + 255 + ')';

            this.startHighlighting = function () {
                this.isHighlighted = true;
                this.stroke = this.getStrokeBasedOnSelected({ color: "#ff8800", width: 4 });
            };
            this.stopHighlighting = function () {
                this.isHighlighted = false;
                this.stroke = this.getStrokeBasedOnSelected({ color: "#ccc6ae", width: 1 });
            };
            this.nameMatchesText = function (text) {
                return this.name.toLowerCase().indexOf(text) !== -1;
            };
            this.codeMatchesText = function (text) {
                return this.code.toLowerCase().indexOf(text) !== -1;
            };
            this.matchesFilter = function (text) {
                if (!text) {
                    return true;
                }
                text = text.toLowerCase();
                return this.nameMatchesText(text) || this.codeMatchesText(text);
            };

            this.select = function () {
                this.isSelected = true;
                this.stroke = this.getStrokeBasedOnSelected(notSelectedStroke);
            };
            this.unselect = function () {
                this.isSelected = false;
                this.stroke = this.getStrokeBasedOnSelected(notSelectedStroke);
            };

            this.hasCodeEqualTo = function(code){
                return this.code === code;
            };

            this.stopHighlighting();
            this.unselect();
        };
        var countryResource = $resource('/country/:code');
        return {
            countries: null,
            fetchCountries: function (callback) {
                this.countries = countryResource.query(function (elements) {
                    elements.forEach(function (country) {
                        CountryViewModel.call(country);
                    });
                    callback(elements);
                });
            }, loadCountries: function (callback) {
                callback = callback || emptyFunction;
                if (!this.countries) {
                    this.fetchCountries(callback);
                } else {
                    callback(this.countries);
                }
                return this.countries;
            },
            loadFullCountry: function(countryCode){
                var result = new $.Deferred();
                countryResource.get({code: countryCode}, function(country){
                    result.resolve(country);
                });
                return result;
            },
            selectCountry: function (countryToSelect) {
                if (countryToSelect.isSelected) {
                    return;
                }
                this.countries.forEach(function (country) {
                    country.unselect();
                });
                countryToSelect.select();
            },
            onCountryWithCodeDo: function (code, countryCallback) {
                this.loadCountries(function(countries){
                    countries.forEach(function(country){
                        if(country.hasCodeEqualTo(code)){
                            countryCallback(country);
                        }
                    });
                });
            }
        };
    });

}());