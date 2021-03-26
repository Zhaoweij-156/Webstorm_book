// 引入包
const express = require('express');
// 引入连接池模块
const pool = require('./pool.js');
// 创建路由器对象
const user = express.Router();
// 用户路由
// 用户登录
user.post('/login',(req,res)=>{
    // 1.获取post数据
    let obj = req.body;
    console.log(obj);
    // 2.验证数据是否为空
    if(!obj.username) {
        res.send({code:401,msg:'username required'});
        //阻止往后执行
        return ;
    }
    if(!obj.userpassw) {
        res.send({code:402,msg:'password required'});
        //阻止往后执行
        return ;
    }
    // 3.执行sql命令
    pool.query("SELECT * FROM customer WHERE username = '"+obj.username+"' AND userpassw = '"+obj.userpassw+"'",(err,result)=>{
        if(err) throw err;
        console.log(result);
        if(result.length < 1) {
            // 用户名或密码错误
            res.send({code:301,msg:'username or password error!'});
        } else {
            // 登录成功
            res.send({code:200,msg:'login success'});
        }
    });
});
user.post('/updata',(req,res)=>{
    let obj = req.body;
    pool.query("update customer set userphone=?,useraddress=?,name=? where username=?",[obj.userphone,obj.useraddress,obj.name,obj.username],(err,result)=>{
        if(err) throw err;
        if(result.affectedRows > 0){
            res.send({code:200,msg:"更新成功"});
        }else{
            res.send({code:301,msg:"更新失败"});
        }
    })
})
// 修改用户信息
user.post('/update',(req,res)=>{
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
    // 3.执行sql命令，修改数据
    pool.query("UPDATE customer SET ? WHERE username = ?",[obj,obj.username],(err,result)=>{
        if(err) throw err;
        // 返回的是对象，如果对象下的affectedRows为0说明修改失败，否则成功
        console.log(result);
        if(result.affectedRows === 0) {
            // 更新失败
            res.send({code:301,msg:'update fail!'});
        } else {
            // 更新成功
            res.send({code:200,msg:'update success!'});
        }
    });
});
// 获取当前用户所有信息
user.get('/getuser',(req,res)=>{
    // 1.获取post数据
    let username = req.query.username;
    console.log(username);
    // 2.执行sql命令
    pool.query("SELECT * FROM customer WHERE username = '"+username+"'",(err,result)=>{
        if(err) throw err;
        console.log(result);
        res.send({data:result});
    });
});
// 检查用户
user.get('/check',(req,res)=>{
    // 1.获取post数据
    let username = req.query.username;
    console.log(username);
    // 2.执行sql命令
    pool.query("SELECT * FROM customer WHERE username = '"+username+"'",(err,result)=>{
        if(err) throw err;
        console.log(result);
        if(result.length < 1) {
            // 用户名不存在
            res.send({code:200,msg:'the username can be used'});
        } else {
            // 用户名存在
            res.send({code:201,msg:'username already exists!'});
        }
    });
});
// 导出路由器对象
module.exports = user;