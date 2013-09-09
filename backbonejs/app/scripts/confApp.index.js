define('confApp.index', [
    'backbone',
    'handlebars',
    'hbs!../views/main',
    'confApp.map',
    'confApp.table',
    'confApp.country'], function (Backbone, Handlebars, mainHtml, map, table, country) {
    var countryData = country.countryData;

    var MainView = Backbone.View.extend({
        initialize: function () {
            countryData.once('reset', this.selectCountryByCodeInOptions, this);
            countryData.fetch({
                reset: true
            });
        },
        selectCountryByCodeInOptions: function(){
            var countryCode = this.options.selectedCountryCode;
            if(countryCode){
                countryData.selectCountryByCode(countryCode);
            }
        },
        render: function () {
            var that = this;
            this.$el.append(mainHtml({}));
            new map.MapView({
                model: countryData,
                el: this.$el.find('.map'),
                clickHandler: function (country) {
                    countryData.selectCountry(country);
                    that.options.router.navigate(country.get('code'), {trigger: true});
                }
            }).render();
            new table.TableView({
                model: countryData,
                el: this.$el.find('.table-container'),
                router: this.options.router
            }).render();
            new map.ShapeView({
                el: this.$el.find('.country-description'),
                model: countryData,
                router: this.options.router
            }).render();
            return this;
        }
    });


    return {
        MainView: MainView
    };
});