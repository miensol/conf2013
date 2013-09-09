define('confApp.map',
    ['backbone',
        'raphael',
        'handlebars',
        'confApp.country'],
    function(Backbone, Raphael, Handlebars, country){
        var countryData = country.countryData;

        var MapView = Backbone.View.extend({
            constWidth: 1000,
            constHeight: 400,
            applySizeForAutoScale: function () {
                this.$el.css({
                    width: this.constWidth,
                    height: this.constHeight
                });
                this.paper.setViewBox(0, 0, this.$el.width(), this.$el.height(), true);
                var svg = this.$el.find("svg");
                svg.removeAttr("width");
                svg.removeAttr("height");
            },


            render: function () {
                var dom = this.$el[0];
                this.paper = Raphael(dom, this.constWidth, this.constHeight);
                countryData.bind('reset', this.renderSvg, this);
                return this;
            },

            renderSvg: function () {
                this.applySizeForAutoScale();
                this.paper.setStart();
                this.model.forEach(function (shape) {
                    var that = this;
                    var countryPath = this.paper.path(shape.get('svgPath'))
                        .attr({
                            stroke: shape.get('stroke').color,
                            fill: shape.get('color'),
                            'stroke-opacity': 0.9,
                            "stroke-width": shape.get('stroke').width
                        });
                    shape.bind('change:stroke', function (child, newStroke) {
                        countryPath.stop().animate({
                            stroke: newStroke.color,
                            'stroke-width': newStroke.width
                        }, 200);
                    });
                    countryPath.hover(function () {
                        shape.startHighlighting();
                    },function () {
                        shape.stopHighlighting();
                    }).click(function (event) {
                            event.stopPropagation();
                            that.options.clickHandler(shape);
                        });
                }, this);
                var world = this.paper.setFinish();
                this.$el.css({
                    width: '',
                    height: ''
                });

            }
        });

        var ShapeView = Backbone.View.extend({
            tmpl: Handlebars.compile('<p>\
    <span>Name:</span><strong>{{selectedCountry.name}}</strong>\
</p>\
<p class="country-shape">\
</p>\
<div class="country-value">{{selectedCountry.valueFormatted}}</div>\
<p>\
    <a ng-href="#/{{selectedCountry.code}}/more">Read more...</a>\
</p>'),

            events: {
                'click a': function (event) {
                    if(this.selectedCountry){
                        this.options.router.navigate(this.selectedCountry.get('code') + '/more', {trigger: true});
                    }
                }
            },

            initialize: function () {
                this.selectedCountry = null;
                this.model.bind('selectedCountryChanged', function (country) {
                    this.selectedCountry = country;
                    this.render(country.toJSON());
                }, this);
            },

            render: function (countryJson) {
                if (countryJson) {
                    this.$el.empty().html(this.tmpl({selectedCountry: countryJson}));
                    var svgContainer = this.$el.find('.country-shape');
                    var paper = Raphael(svgContainer[0]);
                    var shapePath = paper.path(countryJson.svgPath);
                    var bb = shapePath.getBBox();
                    shapePath.attr({
                        stroke: "#ccc6ae",
                        fill: countryJson.color,
                        'stroke-opacity': 0.9
                    });
                    paper.setViewBox(bb.x, bb.y, bb.width, bb.height, true);
                    return this;
                }
            }

        });



        return {
            MapView: MapView,
            ShapeView: ShapeView
        };
    });