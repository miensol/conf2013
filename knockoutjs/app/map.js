define('map',
    ['knockout', 'raphael'],
    function (ko, Raphael) {


        var MapViewModel = function (countryData) {
            this.shapes = countryData.countries;

            this.clickCountry = function (country) {
                countryData.selectCountry(country);
            };
        };

        var MapView = function ($element, mapViewModel) {
            var dom = $element[0];
            ko.applyBindings(mapViewModel, dom);
            var constWidth = 1000;
            var constHeight = 400;
            var paper = Raphael(dom, constWidth, constHeight);
            var clickHandler = mapViewModel.clickCountry;

            function applySizeForAutoScale() {
                $element.css({
                    width: constWidth,
                    height: constHeight
                });
                paper.setViewBox(0, 0, $element.width(), $element.height(), true);
                var svg = document.querySelector("svg");
                svg.removeAttribute("width");
                svg.removeAttribute("height");
            }

            mapViewModel.shapes.subscribe(function (shapes) {
                applySizeForAutoScale();
                paper.setStart();
                shapes.forEach(function (shape) {
                    var stroke = shape.stroke();
                    var countryPath = paper.path(shape.svgPath)
                        .attr({
                            stroke: stroke.color,
                            fill: shape.color(),
                            'stroke-opacity': 0.9,
                            "stroke-width": stroke.width
                        });
                    shape.stroke.subscribe(function (newStroke, oldStroke) {
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
                            clickHandler(shape);
                        });
                });
                paper.setFinish();
                $element.css({
                    width: '',
                    height: ''
                });

            });

        };




        return {
            MapViewModel: MapViewModel,
            MapView: MapView
        };
    });