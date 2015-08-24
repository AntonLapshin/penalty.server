var Top = require('../controllers/top');

var ERR_DEFAULT = { error: "Ошибка :( Перезапустите игру"};
var ERR_ROUTE = "Invalid route";
var ERR_PARAM = "Invalid param: ";

exports.handler = function (req, res)
{
    function successHandler(answer)
    {
        if (answer == undefined)answer = true;
        console.log(answer);
        res.jsonp(answer);
    }

    function errorHandler(err)
    {
        console.log("error: " + err + " url: " + req.url);
        res.jsonp(ERR_DEFAULT);
    }

    function getParamValue(name, type)
    {
        if (type === undefined)
            type = 'string';
        var value = req.query[name];
        if (value === undefined)
            throw ERR_PARAM + name;
        if (type === 'int')
            value = parseInt(value);
        return value;
    }

    if (req.url == '/favicon.ico')
    {
        successHandler({});
        return;
    }

    var route = req.params[0];

    switch (route)
    {
        case '/':
            successHandler('Hello!');
            break;
        case '/upsert':
            var id = getParamValue('id', 'int');
            var score = getParamValue('score', 'int');
            var goals = getParamValue('goals', 'int');
            var miss = getParamValue('miss', 'int');
            var exp = getParamValue('exp', 'int');
            Top.upsert(id, score, goals, miss, exp).then(successHandler, errorHandler);
            break;

        case '/top':
            Top.getTopPlayers().then(successHandler, errorHandler);
            break;

        case '/scores':
            var idsText = getParamValue('ids').split(','),
                ids = [];
            for(var i = 0; i < idsText.length; i++){
                ids.push(parseInt(idsText[i]));
            }
            Top.getPlayers(ids)
                .then(successHandler, errorHandler);
            break;

        default:
            errorHandler(ERR_ROUTE);
    }
};
