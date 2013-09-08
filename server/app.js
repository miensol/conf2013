var fs = require('fs');
var path = require('path');
var express = require('express');
var wikiArticle = require("wikipedia-js");
var wikiSearch = require('./wiki-search.js');
var worldMap = require('./world.js');
var app = express();


var countryList = function () {
    var result = Object.keys(worldMap.names).map(function (code) {
        var country = {
            code: code,
            name: worldMap.names[code],
            svgPath: worldMap.shapes[code],
            value: 1 + Math.floor(Math.random() * 100)
        };
        country.valueFormatted = country.value + '%';
        return  country;
    });
    return result;
};


var findCountryByCode = function (code) {
    return countryList().filter(function (country) {
        return country.code === code;
    })[0];
};

app.use(express.bodyParser());
app.use(express.methodOverride());
app.use(app.router);
app.use(express.errorHandler({
    dumpExceptions: true,
    showStack: true
}));

['angularjs', 'backbonejs', 'knockoutjs'].forEach(function(framework) {
    //    app.get('/' + framework, function(req,res){
    //        res.redirect('/' + framework + '/');
    //    });
    if (fs.existsSync(__dirname + '/../' + framework + '/index.htm')) {
        app.get('/' + framework, function(req, res) {
            res.sendfile(path.resolve(__dirname + '/../' + framework + '/index.htm'));
        });
        app.use('/' + framework, express.static(__dirname + '/../' + framework + '/'));
    } else {
        app.use('/' + framework, express.static(__dirname + '/../' + framework + '/app'));
    }
});

app.get('/world.js', function(req, res){
    res.sendfile(__dirname + '/world.js');
});

app.get('/country/:code', function(req, res) {
    var country = findCountryByCode(req.params.code);
    var term = country.name;
    wikiSearch.search(term, function(err, articleName) {
        var article = '';
        if (articleName) {
            console.log('searching for article', articleName);
            wikiArticle.searchArticle({
                    query: articleName,
                    format: "html"
                },
                function(err, htmlWikiText) {
                    if (err) {
                        country.article = 'No article found';
                    } else {
                        country.article = htmlWikiText;
                    }
                    res.json(country);
                });
        } else {
            country.article = 'No article found';
            res.json(country);
        }
    });
});

app.get('/country', function(req,res){
    var countries = countryList();
    res.json(countries);
});

app.get('/country/:code', function(req, res){
    var code = req.params.code;
    var country =  findCountryByCode(code);

});

module.exports = app;