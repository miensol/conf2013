define('confApp', [
    'backbone',
    'confApp.index',
    'confApp.more',
    'confApp.country'], function(Backbone, index, more, country){
    var currentView = null;

    var countryData = country.countryData;

    var ConfAppRouter = Backbone.Router.extend({
        routes: {
            ':countryCode': 'default',
            ':countryCode/more': 'more',
            '*actions': 'default'
        },

        'default': function(countryCode){
            if(currentView instanceof index.MainView && countryData.isCountrySelected(countryCode)){
                return;
            }
            if(currentView){
                currentView.remove();
            }
            currentView = new index.MainView({
                el: this.newContainerChild(),
                router: this,
                selectedCountryCode: countryCode
            }).render();
        },

        newContainerChild:function(){
            var child = $('<div>');
            $('.container').append(child);
            return child;
        },

        'more': function(countryCode){
            if(currentView){
                currentView.remove();
            }
            currentView = new more.MoreView({
                el: this.newContainerChild(),
                model: new country.Country({code: countryCode})
            }).render();
        }

    });


    return {
        Router: ConfAppRouter
    };

});