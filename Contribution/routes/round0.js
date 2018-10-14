'use strict';
var express = require('express');
var router = express.Router();
var http = require('http');
var fs = require('fs');

/* GET users listing. */
router.get('/', function (req, res) {
    //res.send('round 0 page........00');
    res.writeHead(200, { 'Content-Type': 'text/html' }); // header 설정
    fs.readFile(__dirname + '/round0.html', (err, data) => { // 파일 읽는 메소드
        if (err) {
            return console.error(err); // 에러 발생시 에러 기록하고 종료
        }
        res.end(data, 'utf-8'); // 브라우저로 전송   
    });
});



const socket_server = http.createServer((req, res) => { }).listen(5555);
// upgrade http server to socket.io server
var io = require('socket.io').listen(socket_server);

//===============================================================================

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
        .then((result) => { console.log(result); return result; })
        .catch((error) => { colsole.error(error); return 0; });
}


// http://bcho.tistory.com/899 
io.sockets.on('connection', function (socket) {
    socket.on('clientcmd', function (data) {
        var cmd = data.msg;
        if ("first" == cmd) {
            socket.emit('insert_first', { msg: '[Round0] New Contribution... Insert row First !!' });
            console.log('insert first row :' + data.msg);
        }
        else if ("last" == cmd) {
            socket.emit('insert_last', { msg: '[Round0] New Contribution... Insert row Last !!' });
            console.log('insert last row :' + data.msg);
        }
        else {
            testnet_config.keyProvider = ['5KPdP9wjD7hPdNcYeWZ2JLjEnf4kuwwTrJpHQ2fDxaNrm2gCvrc']
            var list = get_table(Eos(testnet_config), "goldenbucket", 'goldenbucket', 'roundinfos', 'id');
            socket.emit('insert_first', { msg: '[Round0] Get Contribution List OK...... update row !!' });
            console.log("list return value = ");
            console.log(list);
        }
        console.log('Message from client :' + data.msg);
    });
});


module.exports = router;
