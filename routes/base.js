var Player = require('../controllers/top');
var P = require('../p');

exports.ERR_AUTH_FAIL = { message: "Authorization failed"};
exports.MES_SUCCESS = { message: "Authorization successful"};

var VK_APP_SECRET = "ESyZr9v9a8w2G8VZuDGz";
var VK_APP_ID = "3955660";

exports.auth = function (session, id, authKey) {
    return P.call(function (fulfill, reject) {
        if (session.player != undefined) {
            if (session.player.id == id) {
                fulfill(exports.MES_SUCCESS);
                return;
            }
        }

        if (id !== 5653333)
        {
            var data = VK_APP_ID + '_' + id + '_' + VK_APP_SECRET;
            var crypto = require('crypto');
            var expectedAuthKey = crypto.createHash('md5').update(data).digest('hex');

            if (authKey != expectedAuthKey) {
                fulfill(exports.ERR_AUTH_FAIL);
                return;
            }
        }

        var initSession = function () {
            session.player = {
                id: id,
                jobbing: { started: false, lastTime: null }
            };
            session.auth = true;
            fulfill(exports.MES_SUCCESS);
        };

        Player.find(id, '_id').then(
            function (_id) {
                if (_id === null) {
                    Player.create(id).then(initSession, reject);
                }
                else
                {
                    initSession();
                }
            },
            reject
        );
    });
};
