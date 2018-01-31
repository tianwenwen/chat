const http = require('http');
const fs = require('fs');
const path = require('path');

let server = http.createServer((req, res) => {
    //只要有人请求，都会返回
    console.log("hi", req.url);

    var file = path.join(__dirname, req.url == '/' ? 'html/index.html' : /\w*html\\\w*/.test(req.url) ? req.url : "/html" + req.url);
    fs.readFile(file, (err, data) => {
        res.writeHeader(200, {
            'Content-Type': 'text/html; charset=utf-8'
        });
        if (err) {
            fs.readFile(path.join(__dirname, 'html/404.html'), (err, data) => {
                if (err) {
                    res.writeHeader(400);
                    res.write('Not Found');
                } else {
                    res.write(data);
                    res.end();
                }
            })

        } else {
            res.write(data);
            res.end();
        }

    });
});
server.listen(8080); //==等待客户端的链接
console.log('开始监听：');