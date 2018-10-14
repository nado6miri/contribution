'use strict';
var express = require('express');
var router = express.Router();
var fs = require('fs');

/* GET users listing. */
router.get('/', function (req, res) {
    //res.send('round 0 page....');
    res.writeHead(200, { 'Content-Type': 'text/html' }); // header 설정
    fs.readFile(__dirname + '/round0.html', (err, data) => { // 파일 읽는 메소드
        if (err) {
            return console.error(err); // 에러 발생시 에러 기록하고 종료
        }
        res.end(data, 'utf-8'); // 브라우저로 전송  
    });
});

module.exports = router;
