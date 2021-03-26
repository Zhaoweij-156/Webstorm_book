// 引入包
const express = require('express');
// 引入连接池模块
const pool = require('./pool.js');
// 创建路由器对象
const evaluate = express.Router();
// 评价路由
// 根据bookID获取书本的评价信息
evaluate.get('/evaluate',(req,res)=>{
    // 1.获取post数据
    let id = req.query.bookID;
    console.log(id);
    // 2.执行sql命令
    pool.query("SELECT * FROM evaluate WHERE bookID = '"+id+"'",(err,result)=>{
        if(err) throw err;
        console.log(result);
        res.send({data:result});
    });
});
// 导出路由器对象
module.exports = evaluate;