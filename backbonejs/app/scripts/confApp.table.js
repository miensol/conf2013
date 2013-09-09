define('confApp.table',
        ['backbone', 'handlebars'],
function(Backbone, Handlebars){


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
                                that.options.router.navigate(item.get('code'), {trigger: true});
                            },
                            mouseenter: item.startHighlighting.bind(item),
                            mouseleave: item.stopHighlighting.bind(item)
                        });
                    item.bind('change:isSelected change:isHighlighted', function () {
                        $row.attr('class', this.getClassForCountry(item));
                    }, this);
                    $row.attr('class', this.getClassForCountry(item));
                    $body.append($row);
                }, this);


            return this;
        }
    });

    return {
        TableView: TableView
    };
});