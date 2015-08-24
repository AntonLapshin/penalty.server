require('./server').start()
    .then(function ()
    {
        console.log('Server started');
    }, function (err)
    {
        throw err;
    });