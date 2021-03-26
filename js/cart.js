// 引入包
const express = require('express');
// 引入连接池模块
const pool = require('./pool.js');
// 创建路由器对象
const cart = express.Router();
// 购物车路由
// 根据username获取当前购物车的图书
cart.get('/cart',(req,res)=>{
    // 1.获取post数据
    let username = req.query.username;
    // console.log(username);
    // 2.执行sql命令（获取购物车信息）
    let array = new Array();
    // array.push("test");
    let startTime = Date.now();
    pool.query("SELECT * FROM cart WHERE username = '"+username+"'",(err,result)=>{
        if(err) throw err;
        // console.log("cart: ");
        // console.log(result);
        // 3.执行sql命令（获取书本信息）
        if(result.length > 0) {
            for(let i = 0; i < result.length; i++){
                let id = result[i].bookID;
                // console.log("bookID: "+id);
                pool.query("SELECT * FROM books WHERE bookID = '"+id+"'",(err,result2)=>{
                    if(err) throw err;
                    // console.log("bookInfo: ");
                    // console.log(result2);
                    if(result2.length > 0) {
                        array.push({
                            id:result[i].id,
                            username:result[i].username,
                            bookID:result[i].bookID,
                            bookname:result2[0].bookname,
                            price:result2[0].price,
                            shuoming:result2[0].shuoming,
                            writer:result2[0].writer,
                            publisher:result2[0].publisher,
                            time:result2[0].time,
                            class:result2[0].class,
                            url:result2[0].url,
                            num:result[i].num,
                        });
                        console.log("array_length: "+array.length);
                    }
                });
            }
            let timer = setInterval(function(){
                let currentTime = Date.now();
                console.log("timer: "+(currentTime - startTime));
                if(array.length == result.length || currentTime - startTime > 5000) {
                    console.log("array: "+array);
                    res.send({data:array});
                    clearInterval(timer);
                }
            },1000);
        }
    });
});
// 删除购物车商品
cart.get('/delcart',(req,res)=>{
    // 1.获取post数据
    let id = req.query.id;
    // console.log(id);
    // 2.执行sql命令
    pool.query("DELETE FROM cart WHERE id = '"+id+"'",(err,result)=>{
        if(err) throw err;
        console.log(result);
        if(result.affectedRows === 0) {
            // 删除失败
            res.send({code:301,msg:'delete fail!'});
        } else {
            // 删除成功
            res.send({code:200,msg:'delete success!'});
        }
    });
});
// 更改购物车商品数量
cart.get('/updcart',(req,res)=>{
    // 1.获取post数据
    let id = req.query.id;
    let num = req.query.num;
    // console.log("id: "+id+"num: "+num);
    // 2.执行sql命令
    pool.query("UPDATE cart SET num = ? WHERE id = ?",[num,id],(err,result)=>{
        if(err) throw err;
        // console.log(result);
        if(result.affectedRows === 0) {
            // 更新失败
            res.send({code:301,msg:'update fail!'});
        } else {
            // 更新成功
            res.send({code:200,msg:'update success!'});
        }
    });
});
cart.get('/addcart',(req,res)=>{
    let obj = req.query;
    // console.log("addcart:"+obj);
    pool.query("insert into cart set ?",[obj],(err,result)=>{
        if(err) throw err;
        console.log(result);
        res.send({code:200,msg:'add success!'});
    });
})
cart.get('/sumsucc',(req,res)=>{
    let obj = req.query;
    console.log("sumsucc:"+obj);
    pool.query("delete from cart where username=?",[obj.username],(err,result)=>{
        if(err) throw err;
        // console.log(result);
        res.send({code:200,msg:'sumsucc success!'});
    });
})

// 导出路由器对象
module.exports = cart;