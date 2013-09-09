/*global require*/
'use strict';

require.config({
    shim: {
        underscore: {
            exports: '_'
        },
        backbone: {
            deps: [
                'underscore',
                'jquery'
            ],
            exports: 'Backbone'
        },
        bootstrap: {
            deps: ['jquery'],
            exports: 'jquery'
        },
        confApp: {
            deps: ['backbone'],
            exports: 'confApp'
        }
    },
    paths: {
        jquery: '../bower_components/jquery/jquery',
        backbone: '../bower_components/backbone/backbone',
        underscore: '../bower_components/underscore/underscore',
        bootstrap: 'vendor/bootstrap',
        text : "../bower_components/requirejs-text/text",
        hbs : "../bower_components/require-handlebars-plugin/hbs",
        i18nprecompile: "../bower_components/require-handlebars-plugin/hbs/i18nprecompile",
        json2 : "../bower_components/require-handlebars-plugin/hbs/json2",
        handlebars : "../bower_components/require-handlebars-plugin/Handlebars",
        raphael: "../bower_components/raphael/raphael"
    },
    hbs: {
        disableI18n: true,
        templateExtension: "html"
    }
});

require([
    'backbone', 'confApp'
], function (Backbone, confApp) {

    new confApp.Router();

    Backbone.history.start();
});
