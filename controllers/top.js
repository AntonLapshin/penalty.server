var DB = require('../db'),
  $ = require('jquery-deferred');

var LIMIT_TOP_PLAYERS = 10;

exports.upsert = upsert;
exports.getTopPlayers = getTopPlayers;
exports.getPlayers = getPlayers;

function update(id, score, goals, miss, exp) {
  return $.Deferred(function(defer) {
    DB.getTop().update({
      _id: id
    }, {
      score: score,
      last: Date.now(),
      exp: exp,
      goals: goals,
      miss: miss
    }, function(err, value) {
      if (err)
        defer.reject(err);
      else
        defer.resolve(value);
    });
  });
}

function insert(id, score, goals, miss, exp) {
  return $.Deferred(function(defer) {
    DB.getTop().insert({
      _id: id,
      score: score,
      last: Date.now(),
      exp: 1,
      goals: goals,
      miss: miss
    }, function(err, value) {
      if (err)
        defer.reject(err);
      else
        defer.resolve(value);
    });
  });
}

function upsert(id, score, goals, miss, exp) {
  return $.Deferred(function(defer) {
    exists(id).then(
      function(res) {
        if (res) {
          return update(id, score, goals, miss, exp)
            .then(function(err, value) {
              if (err)
                defer.reject(err);
              else
                defer.resolve(value);
            });
        } else {
          return insert(id, score, goals, miss, exp)
            .then(function(err, value) {
              if (err)
                defer.reject(err);
              else
                defer.resolve(value);
            });
        }
      }
    );
  });
}

function exists(id) {
  return $.Deferred(function(defer) {
    DB.getTop().findOne({
      _id: id
    }, {
      _id: 1
    }, function(err, value) {
      if (err)
        defer.reject(err);
      else
        defer.resolve(value);
    });
  });
}

function getTopPlayers() {
  return $.Deferred(function(defer) {
    DB.getTop()
      .find({}, {
        _id: 1,
        score: 1,
        exp: 1,
        goals: 1,
        miss: 1
      })
      .sort({
        'score': -1
      })
      .limit(LIMIT_TOP_PLAYERS)
      .toArray(function(err, value) {
        if (err)
          defer.reject(err);
        else
          defer.resolve(value);
      });
  });
}

function getPlayers(ids) {
  return $.Deferred(function(defer) {
    DB.getTop()
      .find({
        _id: {
          '$in': ids
        }
      }, {
        _id: 1,
        score: 1,
        exp: 1,
        goals: 1,
        miss: 1,
        last: 1
      })
      .sort({
        'score': -1
      })
      .toArray(function(err, value) {
        if (err)
          defer.reject(err);
        else
          defer.resolve(value);
      });
  });
}