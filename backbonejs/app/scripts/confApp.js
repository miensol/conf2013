define('confApp', ['backbone', 'confApp.index','confApp.more', 'confApp.country'], function(Backbone, index, more, countryData){
    var currentView = null;

    var ConfAppRouter = Backbone.Router.extend({
        routes: {
            ':countryCode': 'default',
            ':countryCode/more': 'more',
            '*actions': 'default'
        },

        'default': function(countryCode){
            if(countryData.isCountrySelected(countryCode)){
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
            console.log('viewing more', currentView);
            if(currentView){
                console.log('destroying previous view');
                currentView.remove();
            }
            currentView = new index.MainView({
                el: this.newContainerChild()
            });
        }

    });


    return {
        Router: ConfAppRouter
    };

});