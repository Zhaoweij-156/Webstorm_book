const express = require('express');
const pool = require('./pool.js');
const admin = express.Router();
admin.post('/adminlogin',(req, res)=>{
    let admin = req.body;
    pool.query("SELECT * FROM admin WHERE adminname=?",[admin.uname],(err,result)=>{
        if(err) throw err;
        console.log(result);
        if(result.length<=0)
            res.send({code:401,msg:"用户名不存在"});
        else {
            pool.query("SELECT * FROM admin WHERE adminname=? and adminpassw=?",[admin.uname,admin.upwd],(err,result)=>{
                if(err) throw err;
                console.log(result);
                if(result.length<=0)
                    res.send({code:401,msg:"密码错误"});
                else
                    res.send({code:200,msg:"登录成功"});
            })
        }
    })

})
module.exports = admin;