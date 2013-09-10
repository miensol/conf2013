define('table', ['knockout'], function(ko){

    var TableItem = function(country){
        this.country = country;
        this.name = country.name;
        this.classNames = ko.computed(function(){
            var result = "country";
            if(country.isSelected()){
                result += " country-selected";
            }
            if(country.isHighlighted()){
                result += " country-highlighted";
            }
            return result;
        });

        this.code = country.code;

        this.startHighlighting = function(){
            country.startHighlighting();
        };
        this.stopHighlighting = function(){
            country.stopHighlighting();
        };
    };

    var TableViewModel = function(countryData){
        var that = this;
        this.filterText = ko.observable('');
        this.filterText.subscribe(function(text){
            that.filteredCountries();
        }.throttle(100));

        this.filteredCountries = ko.computed(function(){
            var text = this.filterText();
            return countryData.loadCountries().filter(function(country){
                return country.matchesFilter(text);
            }).map(function(country){
                    var tableItem = new TableItem(country);
                    tableItem.selectCountry = function(){
                        countryData.selectCountry(country);
                    };
                    return  tableItem;
            });
        }, this);
    };

    return {
        TableViewModel: TableViewModel
    };

});