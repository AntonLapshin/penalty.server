exports.start = function ()
{
    var Express = require('express'),
        Db = require('./db'),
        $ = require('jquery-deferred');

    var app = Express();
    app.configure(function ()
    {
        app.use(Express.compress());
        app.use(Express.cookieParser());
        app.use(Express.session({ secret:'iuBviX21'}));
    });

    return $.Deferred(function(defer){
        Db.init().then(function(){
            app.get('*', function (req, res) {
                try {
                    require('./routes/routes').handler(req, res);
                }
                catch (e) {
                    res.jsonp("error: " + e + " url: " + req.url);
                }
            });
            app.listen(Number(process.env.PORT || 8080));
        });
    });
};


