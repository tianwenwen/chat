const http = require('http');
const fs = require('fs');
const io = require('socket.io');
const mysql = require('mysql');
const url = require('url');
const path = require('path');

//数据库
const pool = mysql.createPool({
    host: 'localhost',
    user: 'root',
    password: '123456',
    database: "chat"
});
//http服务器
const httpServer = http.createServer(function(req, res) {
    let {
        pathname,
        query
    } = url.parse(req.url, true);
    
    if (pathname == '/req') {
        res.writeHeader(200, {
            'Content-Type': 'application/json;charset=utf-8'
        });
        console.log('有人注册', query);
        let {
            user,
            pass
        } = query;
        if(!pass || !user){
            res.write('密码或密码不能为空。。');
            res.end();
        }else if (!/^\w{6,32}$/.test(user)) {
            res.write(JSON.stringify({cose: 1,msg: "用户名不符合规范"}));
            res.end();
        } else if (!/^.{6,32}$/.test(pass)) {
            res.write(JSON.stringify({code: 1,msg: "密码不符合规范"}));
            res.end();
        } else {
            pool.getConnection((err, db) => {
                db.query(`SELECT username FROM user_table where username='${user}'`, (error, results, fields) => {
                    console.log("**************************",results);
                    if (error){
                        res.write(JSON.stringify({code:1,msg:'数据库出错'}));
                        res.end();
                    };
                    if (results && results.length) {
                        res.write(JSON.stringify({code: 1,msg: "此用户已存在" }));
                        res.end();
                    }else{
                         db.query(`INSERT INTO user_table (username,password,online) VALUES ('${user}','${pass}',0)`, (error, results, fields) => {
                            if (error) {
                                res.write(JSON.stringify({code:1,msg:'数据库出错'}));
                                res.end();
                            };
                            res.write(JSON.stringify({ code: 2,msg: "注册成功" }));
                            res.end();
                        });
                    } 
                });
            })
        }


    } else if (pathname == '/login') {
        console.log('有人登录', query);
        res.writeHeader(200, {
            'Content-Type': 'application/json;charset=utf-8'
        });
         let {
            user,
            pass
        } = query;
         if(!pass || !user){
            res.write('密码或密码不能为空。。');
            res.end();
        }else{
             pool.getConnection((err, db) => {

                db.query(`SELECT username FROM user_table where username='${user}'`,(error, results, fields) => {
                    if (error){
                        res.write(JSON.stringify({code:1,msg:'数据库出错'}));
                        res.end();
                    }else if (results && results.length) {
                        db.query(`SELECT username FROM user_table where username='${user}' and password='${pass}'`, (error, results, fields) => {
                             if (error){
                                res.write(JSON.stringify({code:1,msg:'数据库出错'}));
                                res.end();
                             }else if(results && results.length){
                                 console.log(221)
                                res.write(JSON.stringify({code:2,msg:'登陆成功'}));
                                res.end();
                             }else{
                                 console.log(222)
                                res.write(JSON.stringify({code: 1,msg: "用户名或密码错误" }));
                                res.end();
                             }
                        })
                    }else{
                        res.write(JSON.stringify({code: 1,msg: "此用户不存在" }));
                        res.end();
                    }

                })
             })

        }
       

    } else {
        //请求文件

        // var file = req.url == '/' ? 'html/index.html' : /\w*html\\\w*/.test(req.url) ? req.url : "/html" + req.url;
        console.log(req.url);
        fs.readFile(path.join(__dirname,req.url), (err, data) => {
            res.writeHeader(200, {
                'Content-Type': 'text/html; charset=utf-8'
            });
            if (err) {
                res.writeHeader(400);
                res.write('Not Found');
                res.end();
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