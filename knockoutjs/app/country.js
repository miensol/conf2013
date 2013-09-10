define('country', ['knockout'], function(ko){
    var emptyFunction = function(){};

    var Country = function () {
        var relative = ((this.value - 1) / 100.0 * 225).toFixed(0);
        var notSelectedStroke = { color: "#ccc6ae", width: 1 };
        var selectedStroke = { color: "#ff4400", width: 5 };

        this.getStrokeBasedOnSelected = function (other) {
            return this.isSelected() ? selectedStroke : other;
        };
        this.color = ko.observable('rgb(' + relative + ',' + relative + ',' + 255 + ')');
        this.isHighlighted = ko.observable(false);
        this.isSelected = ko.observable(false);
        this.stroke = ko.observable(notSelectedStroke);

        this.startHighlighting = function () {
            this.isHighlighted(true);
            this.stroke(this.getStrokeBasedOnSelected({ color: "#ff8800", width: 4 }));
        };
        this.stopHighlighting = function () {
            this.isHighlighted(false);
            this.stroke(this.getStrokeBasedOnSelected({ color: "#ccc6ae", width: 1 }));
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
            this.isSelected(true);
            this.stroke(this.getStrokeBasedOnSelected(notSelectedStroke));
        };
        this.unselect = function () {
            this.isSelected(false);
            this.stroke(this.getStrokeBasedOnSelected(notSelectedStroke));
        };

        this.hasCodeEqualTo = function(code){
            return this.code === code;
        };

        this.stopHighlighting();
        this.unselect();
    };

    var countryData = {
        countries: ko.observableArray(),
        fetchCountries: function (callback) {
            this._fetched = true;
            var that = this;
            $.get('/country').then(function(elements){
                elements.forEach(function (country) {
                    Country.call(country);
                });
                callback(elements);
                that.countries.push.apply(that.countries, elements);
            });
        }, loadCountries: function (callback) {
            callback = callback || emptyFunction;
            if (!this._fetched) {
                this.fetchCountries(callback);
            } else {
                callback(this.countries());
            }
            return this.countries();
        },
        loadFullCountry: function(countryCode){
            var result = new $.Deferred();
            countryResource.get({code: countryCode}, function(country){
                result.resolve(country);
            });
            return result;
        },
        selectCountry: function (countryToSelect) {
            if (countryToSelect.isSelected()) {
                return;
            }
            this.countries().forEach(function (country) {
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


    return {
        Country: Country,
        countryData: countryData
    };

});