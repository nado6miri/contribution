'use strict';
var debug = require('debug');
var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

var routes = require('./routes/index');
var users = require('./routes/users');
var round0 = require('./routes/round0');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

// uncomment after placing your favicon in /public
//app.use(favicon(__dirname + '/public/favicon.ico'));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', routes);
app.use('/users', users);
app.use('/round0', round0);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
    app.use(function (err, req, res, next) {
        res.status(err.status || 500);
        res.render('error', {
            message: err.message,
            error: err
        });
    });
}

// production error handler
// no stacktraces leaked to user
app.use(function (err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
        message: err.message,
        error: {}
    });
});

app.set('port', process.env.PORT || 3000);

var server = app.listen(app.get('port'), function () {
    debug('Express server listening on port ' + server.address().port);
});


//=====================================================================

const Eos = require('eosjs');

const config = {
    expireInSeconds: 60,
    broadcast: true,
    debug: false,
    sign: true,
    // mainNet bp endpoint
    httpEndpoint: 'https://api.eosnewyork.io',
    // mainNet chainId
    chainId: 'aca376f206b8fc25a6ed44dbdc66547c36c6c33e3a119ffbeaef943642f0e906',
};

// junglenet
const testnet_config = {
    expireInSeconds: 60,
    broadcast: true,
    debug: true,
    sign: true,
    httpEndpoint: 'http://jungle.cryptolions.io:18888',
    chainId: '038f4b0fc8ff18a4f0842a8f0564611f6e96e8535901dd45e43ac8691a1c4dca',
};

/*
testnet_config.keyProvider = ['5KPdP9wjD7hPdNcYeWZ2JLjEnf4kuwwTrJpHQ2fDxaNrm2gCvrc']
get_table(Eos(testnet_config), "goldenbucket", 'goldenbucket', 'activebets', 'id');
*/
/*
eos.getTableRows({
        json: true,
        code:'CONTRACT_NAME',
        scope:'SCOPE_ACCOUNT (Normally contract)',
        table:'TABLE_NAME'
        table_key: 'school_key',
        lower_bound: school_id,
        })
*/

function get_table(eos, code, scope, table, tablekey) {
    // json, code, scope, table, table_key
    eos.getTableRows(true, code, scope, table, tablekey)
        .then((result) => { console.log(result) })
        .catch((error) => { colsole.error(error) });
}


// upgrade http server to socket.io server
var io = require('socket.io').listen(server);

// http://bcho.tistory.com/899 
io.sockets.on('connection', function (socket) {
    socket.on('clientcmd', function (data) {
        var cmd = data.msg;
        if ("first" == cmd) {
            socket.emit('insert_first', { msg: 'New Contribution... Insert row First !!' });
            console.log('insert first row :' + data.msg);
        }
        else if ("last" == cmd) {
            socket.emit('insert_last', { msg: 'New Contribution... Insert row Last !!' });
            console.log('insert last row :' + data.msg);
        }
        else { }
        console.log('Message from client :' + data.msg);
    });
    /*
    socket.on('clientcmd', function (data) {
        socket.broadcast.emit('toclient', data); // 자신을 제외하고 다른 클라이언트에게 보냄
        socket.emit('toclient', data); // 해당 클라이언트에게만 보냄. 
        console.log('Message from client :' + data.msg);
    });
    */

});
