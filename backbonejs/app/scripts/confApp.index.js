define('confApp.index', ['backbone', 'hbs!../views/main', 'raphael', 'handlebars', 'confApp.country'], function (Backbone, mainHtml, Raphael, Handlebars, countryData) {

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

    var TableView = Backbone.View.extend({

        events: {
            'keydown thead input, change thead input': 'filterByText'
        },

        filterText: '',
        filterByText: function () {
            this.filterText = this.$el.find('thead input').val();
            this.render();
        }.throttle(200),

        initialize: function () {
            this.rowTemplate = Handlebars.compile('<tr ng-repeat="country in countries" \
            class="country"> \
                <td>{{country.code}}</td> \
                <td><div class="country-name">{{country.name}}</div></td> \
            </tr>');
            this.model.bind('reset', this.render, this);
        },

        getClassForCountry: function (country) {
            var result = "country";
            if (country.get('isSelected')) {
                result += " country-selected";
            } else if (country.get('isHighlighted')) {
                result += " country-highlighted";
            }
            return result;
        },

        render: function () {
            var $body = this.$el.find('tbody');
            $body.empty();
            var that = this;

            this.model.filter(function (item) {
                return item.matchesFilter(this.filterText);
            }, this).forEach(function (item) {
                    var itemAsJson = item.toJSON();
                    var $row = $(this.rowTemplate({country: itemAsJson}))
                        .bind({
                            click: function () {
                                that.model.selectCountry(item);
                            },
                            mouseenter: item.startHighlighting.bind(item),
                            mouseleave: item.stopHighlighting.bind(item)
                        });
                    item.bind('change:isSelected change:isHighlighted', function () {
                        $row.attr('class', this.getClassForCountry(item));
                    }, this);
                    $body.append($row);
                }, this);


            return this;
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

        initialize: function(){
            this.model.bind('selectedCountryChanged', function(country){
                this.render(country.toJSON());
            }, this);
        },

        render: function(countryJson){
            this.$el.empty().html(this.tmpl({selectedCountry: countryJson}));
            if(countryJson){
                var svgContainer = this.$el.find('.country-shape');
                var paper =  Raphael(svgContainer[0]);
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


    var MainView = Backbone.View.extend({
        initialize: function () {
            countryData.fetch({
                reset: true
            });
        },
        render: function () {
            this.$el.append(mainHtml({}));
            new MapView({
                model: countryData,
                el: this.$el.find('.map'),
                clickHandler: function (country) {
                    countryData.selectCountry(country);
                }
            }).render();
            new TableView({
                model: countryData,
                el: this.$el.find('.table-container')
            }).render();
            new ShapeView({
                el: this.$el.find('.country-description'),
                model: countryData
            }).render();
            return this;
        }
    });


    return {
        MainView: MainView
    };
});