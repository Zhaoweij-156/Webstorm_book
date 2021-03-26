// 引入包
const express = require('express');
// 引入连接池模块
const pool = require('./pool.js');
// 创建路由器对象
const order = express.Router();
// 订单路由
// 根据username获取当前订单页面的图书
order.get('/order',(req,res)=>{
    // 1.获取post数据
    let obj = req.query;
    // 2.执行sql命令
    pool.query("SELECT b.bookID,b.id,a.bookname,a.price,a.url,b.state,b.num FROM books a,od b WHERE b.username=? and a.bookID=b.bookID",[obj.username],(err,result)=>{
        if(err) throw err;
        console.log(result);
        res.send({data:result});
    });
});
order.get('/getorder',(req,res)=>{
    // 1.获取post数据
    let obj = req.query;
    // 2.执行sql命令
    pool.query("SELECT b.bookID,b.id,a.bookname,a.price,a.url,b.state,b.num,b.username FROM books a,od b where a.bookID=b.bookID",(err,result)=>{
        if(err) throw err;
        console.log(result);
        res.send({data:result});
    });
});
order.get('/setorder',(req,res)=>{
    // 1.获取post数据
    let obj = req.query;
    // 2.执行sql命令
    pool.query("update od set state=? where id=?",[obj.state,obj.id],(err,result)=>{
        if(err) throw err;
        console.log(result);
        if(result.affectedRows>0)
            res.send({code:200,msg:'update success'});
        else
            res.send({code:400,msg:'update fail'});
    });
});
order.get('/addorder',(req,res)=>{
    let obj = req.query;
    console.log("addorder:"+obj);
    pool.query("insert into od set ?",[obj],(err,result)=>{
        if(err) throw err;
        // console.log(result);
        res.send({code:200,sg:'add success!'});
    });
})
// 导出路由器对象
module.exports = order;