define('confApp.more', [
    'backbone', 'confApp.country', 'hbs!../views/more'], function(Backbone, countryData, moreTemplate){

    var MoreView = Backbone.View.extend({
        initialize:function(){
            this.model.bind('change', this.renderFullyLoaded, this);
            this.model.fetch();
        },
        render:function(){
            this.$el.text('Loading...');
            return this;
        },

        renderFullyLoaded: function(){
            this.$el.html(moreTemplate({selectedCountry: this.model.toJSON()}));
            return this;
        }
    });


    return {
        MoreView: MoreView
    };

});