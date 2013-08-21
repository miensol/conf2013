var express = require('express');
var wikiArticle = require("wikipedia-js");
var wikiSearch = require('./wiki-search.js');
var app = express();


app.use(express.bodyParser());
app.use(express.methodOverride());
app.use(app.router);
app.use(express.errorHandler({ dumpExceptions: true, showStack: true }));

app.get('/search/:term', function (req, res) {
    var term =req.params.term;
    wikiSearch.search(term, function(err, articleName){
        var article = '';
        if(articleName){
            console.log('searching for article', articleName);
            wikiArticle.searchArticle({
                    query: articleName,
                    format: "html"
                },
                function (err, htmlWikiText) {
                    if (err) {
                        res.end(404, 'No article found');
                    } else {
                        res.send({
                            article: htmlWikiText
                        });
                    }
                });
        } else {
            res.end(404, 'No article found');
        }
    });
});


app.listen(3000);