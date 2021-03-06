var Mongo = require('mongodb'),
    $ = require('jquery-deferred');

var _db = null,
    _top = null,
    REMOTE_UNIVERSAL = {
        host: 'ds035553.mongolab.com',
        port: 35553,
        database: 'heroku_z0k6fmph',
        username: 'penalty',
        password: '24547294'
    },
    COLLECTION_NAME = 'top';

exports.getDb = getDb;
exports.getTop = getTop;
exports.connect = connect;
exports.init = init;
exports.getCollection = getCollection;

function getDb(){
    return _db;
}

function getTop(){
    return _top;
}

function connect(options) {
    var dbInstance = new Mongo.Db(
        options.database,
        new Mongo.Server(
            options.host,
            options.port,
            {auto_reconnect: true},
            {}
        )
    );

    return $.Deferred(function(defer){
        dbInstance.open(function (err, db) {
            if (err)
                defer.reject(err);
            else {
                _db = db;
                auth(options).then(defer.resolve, defer.reject);
            }
        });
    });
}

function auth(options) {
    return $.Deferred(function(defer){
        _db.authenticate(options.username, options.password, function(err, value){
            if (err)
                defer.reject(err);
            else
                defer.resolve(value);
        });
    });
}

function init() {
    return $.Deferred(function(defer) {
        if (_db !== null) {
            defer.resolve();
            return;
        }
        exports.connect(REMOTE_UNIVERSAL)
            .then(function(){
                return getCollection(COLLECTION_NAME);
            },
            defer.reject)
            .then(function(coll){
                _top = coll;
                defer.resolve(coll);
            },
            defer.reject);
    });
}

function getCollection(name) {
    return $.Deferred(function(defer) {
        _db.collection(name, function(err, value){
            if (err)
                defer.reject(err);
            else
                defer.resolve(value);
        });
    });
}