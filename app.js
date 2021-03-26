const express = require('express');
const registerRouter = require('./js/register.js');
const userRouter = require('./js/user.js');
const bookRouter = require('./js/book.js');
const adminRouter = require('./js/admin.js');
const cartRouter = require('./js/cart.js');
const orderRouter = require('./js/order.js');
const evaluateRouter = require('./js/evaluate.js');
const bodyParser = require('body-parser');
const app = express();
app.listen(8081);
app.use(bodyParser.urlencoded({
    extended: false
}));
app.use(bodyParser.json());
app.all('*', function(req, res, next) {
    //深刻了解这次错误，以后不会再犯，跨域请求允许
    res.header("Access-Control-Allow-Origin", "*");
    //这里最好不用*通配符，之前就这报错，写上指定域名例如 http://127.0.0.1:8080
    res.header("Access-Control-Allow-Headers", "content-type");
    res.header("Access-Control-Allow-Methods","PUT,POST,GET,DELETE,OPTIONS");
    res.header("Access-control-Allow-Credentials","true");
    //这个地方是最坑了，百度查了好多大佬给的方案都没加这条，报错一直报这个，加上就ok
    next();
});
app.use(express.static('./html'));
app.use(express.static('./css'));
app.use('/user',userRouter);
app.use('/user',cartRouter);
app.use('/user',orderRouter);
app.use('/book',bookRouter);
app.use('/book',evaluateRouter);
app.use('/register',registerRouter);
app.use('/admin',adminRouter);