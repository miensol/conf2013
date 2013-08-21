var superAgent      = require("superagent"),
    search = function(query, callback){
        var queryParams = {
            action:'opensearch',
            search: query
        };
        superAgent.get('http://en.wikipedia.org/w/api.php')
            .query(queryParams)
            .end(function(res){
                if (res.ok) {
                    console.log('opensearch result', res.text);
                    var jsonData = JSON.parse(res.text);
                    callback(null,jsonData[1][0])
                } else {
                    process.nextTick(function () {
                        return callback(new Error("Unexpected HTTP status received [status=" + res.status + "]"));
                    });
                }
            });


    };

module.exports.search = search;