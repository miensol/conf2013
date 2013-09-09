define('confApp', ['backbone', 'confApp.index','confApp.more'], function(Backbone, index, more){
    var ConfAppRouter = Backbone.Router.extend({
        routes: {
            '/:countryCode': 'default',
            '/:countryCode/more': 'more',
            '*actions': 'default'
        },

        'default': function(countryCode){
            new index.MainView({el: $('.container')}).render();
        },

        'more': function(countryCode){}

    });


    return {
        Router: ConfAppRouter
    };

});