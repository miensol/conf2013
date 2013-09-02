var fs = require('fs');
var path = require('path');
var express = require('express');
var wikiArticle = require("wikipedia-js");
var wikiSearch = require('./wiki-search.js');
var worldMap = require('./world.js');
var app = express();

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

app.get('/search/:term', function(req, res) {
    var term = req.params.term;
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
                        res.end(404, 'No article found');
                    } else {
                        res.send({
                            article: htmlWikiText
                        });
                    }
                });
        } else {
            console.error('article not found:', articleName);
            res.end(404);
        }
    });
});

app.get('/country', function(req,res){
     var countryList = Object.keys(worldMap.names).map(function(code){
        return {
            code: code,
            name: worldMap.names[code],
            svgPath: worldMap.shapes[code],
            value: 1 + Math.floor(Math.random() * 100)
        };
     });
    res.json(countryList);
});

module.exports = app;