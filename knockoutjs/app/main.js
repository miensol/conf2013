// to depend on a bower installed component:
// define(['component/componentName/file'])

define(["jquery", "knockout", 'utils', "text!main.html", 'country', 'map', 'table'],
function ($, ko,utils, mainHtml, country, map, table) {

    country.countryData.loadCountries();

    var $container = $('.container');
    $container.empty().html(mainHtml);

    var mapViewModel = new map.MapViewModel(country.countryData);
    var mapView = new map.MapView($container.find('.map'), mapViewModel);

    var tableViewModel = new table.TableViewModel(country.countryData);
    ko.applyBindings(tableViewModel, $container.find('.table-container')[0]);
});
