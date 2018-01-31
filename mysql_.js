var mysql = require('mysql');
//连接池
var pool = mysql.createPool({
    connectionLimit : 10,
    host:'localhost',
    user:'root',
    password:'123456',
    database:"chat"
});
// db.connect();
pool.getConnection(function(err,connection){
    connection.query('SELECT * from user_table',(error,results,fields)=>{
        if(error) throw error;
        console.log('The solution is: ',results);
    });
});

// db.end();