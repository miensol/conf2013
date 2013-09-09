define('confApp.country', ['backbone'], function (Backbone) {
    var Country = Backbone.Model.extend({
        notSelectedStroke: { color: "#ccc6ae", width: 1 },
        selectedStroke: { color: "#ff4400", width: 5 },
        idAttribute: 'code',

        initialize: function () {
            var relative = ((this.get('value') - 1) / 100.0 * 225).toFixed(0);

            this.set({
                color: 'rgb(' + relative + ',' + relative + ',' + 255 + ')',
                isSelected: false,
                isHighlighted: false
            });

            this.stopHighlighting();
            this.unselect();
        },

        getStrokeBasedOnSelected: function (other) {
            return this.get('isSelected') ? this.selectedStroke : other;
        },
        select: function () {
            this.set('isSelected', true);
            this.set('stroke', this.getStrokeBasedOnSelected(this.notSelectedStroke));
        },
        unselect: function () {
            this.set('isSelected', false);
            this.set('stroke', this.getStrokeBasedOnSelected(this.notSelectedStroke));
        },
        startHighlighting: function () {
            this.set('isHighlighted', true);
            this.set('stroke', this.getStrokeBasedOnSelected({ color: "#ff8800", width: 4 }));
        },

        stopHighlighting: function () {
            this.set('isHighlighted', false);
            this.set('stroke', this.getStrokeBasedOnSelected({ color: "#ccc6ae", width: 1 }));
        },
        hasCodeEqualTo: function (code) {
            return this.get('code') === code;
        },
        matchesFilter: function (text) {
            if (!text) {
                return true;
            }
            text = text.toLowerCase();
            return this.get('name').toLowerCase().indexOf(text) !== -1
                || this.get('code').toLowerCase().indexOf(text) !== -1;
        }
    });


    var CountryData = Backbone.Collection.extend({
        model: Country,
        url: '/country',

        initialize: function () {

        },

        isCountrySelected: function (countryCode) {
            var result = false;
            this.forEach(function (country) {
                if (country.get('isSelected') && country.hasCodeEqualTo(countryCode)) {
                    result = true;
                }
            }, this);
            return result;
        },

        selectCountry: function (countryToSelect) {
            if (countryToSelect.get('isSelected')) {
                return;
            }
            this.forEach(function (country) {
                country.unselect();
            });
            countryToSelect.select();
            this.trigger('selectedCountryChanged', countryToSelect);
        },
        selectCountryByCode: function (countryCode) {
            this.forEach(function (country) {
                if (country.hasCodeEqualTo(countryCode)) {
                    this.selectCountry(country);
                }
            }, this);
        }
    });

    return new CountryData();
});