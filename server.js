const http = require('http');
const fs = require('fs');
const io = require('socket.io');
const mysql = require('mysql');
const url = require('url');

//数据库
const db = mysql.createPool({
    host: 'localhost',
    user: 'root',
    password: '123456',
    database: "chat"
});
//http服务器
const httpServer = http.createServer(function(req, res) {
    let {pathname,query} = url.parse(req.url,true);
    if (pathname == '/reg') {
        console.log('有人注册',query);

    } else if (pathname == '/login') {
        console.log('有人登录',query);

    } else {
        //请求文件
        var file = req.url == '/' ? 'html/index.html' : /\w*html\\\w*/.test(req.url) ? req.url : "/html" + req.url;
        console.log(file);
        fs.readFile(req.url, (err, data) => {
            res.writeHeader(200, {
                'Content-Type': 'text/html; charset=utf-8'
            });
            if (err) {
                res.writeHeader(400);
                res.write('Not Found');
            } else {
                res.write(data);
                res.end();
            }
        });
    }



});
httpServer.listen(8080);
console.log('start:');

const wsServer = io.listen(httpServer);
wsServer.on('connection', sock => {
    sock.on('a', function(a, b, c, d) {
        console.log(a, b, c, d);
    })
})