(function () {
    var confApp = angular.module('confApp');

    confApp.directive('raphaelShape', function(){
        return function($scope, $element, $attrs){
            var dom = $element[0];
            var paper = Raphael(dom);
            var shapeAttrName = $attrs.raphaelShape;
            $scope.$watch(shapeAttrName, function(newShape){
                paper.clear();
                if(newShape){
                    var shapePath = paper.path(newShape.svgPath);
                    var bb = shapePath.getBBox();
                    shapePath.attr({
                        stroke: "#ccc6ae",
                        fill: newShape.color,
                        'stroke-opacity': 0.9
                    });
                    paper.setViewBox(bb.x, bb.y, bb.width, bb.height, true);
                }
            });
        };
    });

    confApp.directive('raphaelMap', function ($parse) {
        return function ($scope, $element, $attrs) {
            var dom = $element[0];
            var constWidth = 1000;
            var constHeight = 400;
            var paper = Raphael(dom, constWidth, constHeight);
            var clickHandler = $parse($attrs.raphaelClick)($scope);
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

            $scope.$watch($attrs.raphaelMap + ".length", function () {
                var shapes = $scope[$attrs.raphaelMap];
                applySizeForAutoScale();
                paper.setStart();
                shapes.forEach(function (shape) {
                    var mapCountryScope = $scope.$new();
                    mapCountryScope.shape = shape;
                    var countryPath = paper.path(shape.svgPath)
                        .attr({
                            stroke: shape.stroke.color,
                            fill: shape.color,
                            'stroke-opacity': 0.9,
                            "stroke-width": shape.stroke.width
                        });
                    mapCountryScope.$watch('shape.stroke', function (newStroke, oldStroke) {
                        if(oldStroke){
                            countryPath.stop().animate({
                                stroke: newStroke.color,
                                'stroke-width': newStroke.width
                            }, 200);
                        }
                    });
                    countryPath.hover(function () {
                        shape.startHighlighting();
                        mapCountryScope.$apply();
                    }, function () {
                        shape.stopHighlighting();
                        mapCountryScope.$apply();
                    }).click(function(event){
                        event.stopPropagation();
                        clickHandler(shape);
                        mapCountryScope.$apply();
                    });
                });
                var world = paper.setFinish();
                $element.css({
                    width: '',
                    height: ''
                });

            });
        };
    });

    confApp.controller('MapController', function ($scope, countryData) {
        $scope.countryList = countryData.loadCountries();
    });
}());
