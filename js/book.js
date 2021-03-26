// 引入包
const express = require('express');
// 引入连接池模块
const pool = require('./pool.js');
// 创建路由器对象
const book = express.Router();
// 书本路由
// 书本列表
book.get('/list',(req,res)=>{
    // 执行sql命令
    pool.query("SELECT * FROM books",(err,result)=>{
        if(err) throw err;
        console.log(result);
        res.send({data:result});
    });
});
// 书本详情
book.get('/detail',(req,res)=>{
    // 1.获取post数据
    let id = req.query.bookID;
    console.log(id);
    // 2.执行sql命令
    pool.query("SELECT * FROM books WHERE bookID = "+id,(err,result)=>{
        if(err) throw err;
        console.log(result);
        res.send({data:result});
    });
});
// 删除书本
book.get('/delete',(req,res)=>{
    // 1.获取post数据
    let id = req.query.bookID;
    console.log(id);
    // 2.验证数据是否为空
    if(!id) {
        res.send({code:401,msg:'bookID required'});
        //阻止往后执行
        return ;
    }
    // 3.执行sql命令
    pool.query("DELETE FROM books WHERE bookID = "+id,(err,result)=>{
        if(err) throw err;
        console.log(result);
        if(result.affectedRows === 0) {
            res.send({code:301,msg:'delete fail!'});
        } else {
            res.send({code:200,msg:'delete success!'});
        }
    });
});
// 书本添加
book.post('/addBook',(req, res)=>{
    // 1.获取post数据
    let obj = req.body;
    console.log(obj);
    // 2.使用for-in遍历对象，验证各项是否为空
    let myCode = 400;
    for(let key in obj) {
        myCode++;
        if(!obj[key]) {
            res.send({code:myCode,msg:key+' required'});
            //阻止往后执行
            return ;
        }
    }
    let obj2 = {
        bookID:obj.bookID,
        bookname:obj.bookName,
        price:obj.price,
        shuoming:obj.introduce,
        writer:obj.writer,
        publisher:obj.publisher,
        time:obj.time,
        class:obj.cla,
        url:obj.url,
    }
    // 执行sql命令
    pool.query('INSERT INTO books SET ?',[obj2],(err,result)=>{
        if(err) throw err;
        console.log(result);
        // 注册成功
        res.send({code:200,msg:'add success!'});
    });
});
// 根据类型返回图书
book.get('/class',(req,res)=>{
    // 1.获取post数据
    let bookClass = req.query.class;
    console.log(bookClass);
    // 2.执行sql命令
    pool.query("SELECT * FROM books WHERE class = '"+bookClass+"'",(err,result)=>{
        if(err) throw err;
        console.log(result);
        res.send({data:result});
    });
});
// 根据作者返回图书
book.get('/writer',(req,res)=>{
    // 1.获取post数据
    let bookWriter = req.query.writer;
    console.log(bookWriter);
    // 2.执行sql命令
    pool.query("SELECT * FROM books WHERE writer = '"+bookWriter+"'",(err,result)=>{
        if(err) throw err;
        console.log(result);
        res.send({data:result});
    });
});
// 根据作者返回图书
book.get('/publish',(req,res)=>{
    // 1.获取post数据
    let bookPublish = req.query.publish;
    console.log(bookPublish);
    // 2.执行sql命令
    pool.query("SELECT * FROM books WHERE publisher = '"+bookPublish+"'",(err,result)=>{
        if(err) throw err;
        console.log(result);
        res.send({data:result});
    });
});
// 搜索
book.get('/search',(req,res)=>{
    // 1.获取post数据
    let bookName = req.query.search;
    console.log(bookName);
    // 2.执行sql命令
    pool.query("SELECT * FROM books WHERE bookname like '%"+bookName+"%'",(err,result)=>{
        if(err) throw err;
        console.log(result);
        res.send({data:result});
    });
});
// 根据书名和类别搜索
// book.post('/mysearch',(req,res)=>{
//     // 1.获取post数据
//     let obj = req.body;
//     console.log(obj);
//     // 2.生成sql语句
//     let searchSQl = "SELECT * FROM books";
//     let condition = " WHERE ";
//     for(let key in obj) {
//         if(obj[key]) {
//             searchSQl += condition + key;
//             if(key == "bookname") {
//                 searchSQl += " like '%" + obj[key] + "%'";
//             } else {
//                 searchSQl += " = '" + obj[key] + "'";
//             }
//             condition = " AND ";
//         }
//     }
//     // 3.执行sql命令
//     pool.query(searchSQl,(err,result)=>{
//         if(err) throw err;
//         console.log(result);
//         res.send({code:200,data:result});
//     });
// });
// 导出路由器对象
module.exports = book;