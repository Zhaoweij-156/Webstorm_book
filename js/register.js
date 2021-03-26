const express = require('express');
const pool = require('../js/pool.js');
const querystring = require('querystring');
const r = express.Router();

r.post('/check',(req,res)=>{
    //获取post请求数据
    let temp = req.query;
    // console.log(temp);
    if(temp.value === '') {
        res.send({code: 203, msg: temp.idname + '不能为空'});
    }
    else {
        pool.query("select * from customer where username='"+temp.value+"'",(err, result) => {
            if (err) throw err;
            // console.log(result);
            if (result.length > 0) {
                res.send({code:201,msg:"用户名存在"});
            } else {
                res.send({code:200,msg:'用户名可以使用'});
            }
        })
    }
});
r.post('/register',(req,res)=>{
    console.log(req.body);
    let obj = req.body;
    if(obj.uname==='' || obj.upwd===''){
        res.send({code:400,msg:'用户名或密码为空',check:0});
    }
    else {
        pool.query("select * from customer where username=?",[obj.uname],(err, result) => {
            if (err) throw err;
            if (result.length > 0) {
                res.send({code:201,msg:"username存在",check:0});
            }else{
                pool.query("insert into customer (username,userpassw) values (?,?)",[obj.uname,obj.upwd],(err, result) =>{
                    if(err) throw err;
                    console.log(result);
                    res.send({code:200,msg:"注册成功",check:1});
                })
            }
        })
    }
});
module.exports = r;