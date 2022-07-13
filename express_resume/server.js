const express = require('express');
const path = require('path');

const indexRouter = require('./routes/index');
const apiRouter = require('./routes/api');

const hostname = 'localhost';
const port = 4000;


const app = express();

// 指定模板存放目录
app.set('views', 'views');

// 指定模板引擎为 Handlebars
app.set('view engine', 'hbs');

function loggingMiddleware(req, res, next) {
  const time = new Date();
  console.log(`[${time.toLocaleString()}] ${req.method} ${req.url} Apply loggingMiddleware! `);
  next();
}

// 这个use要放在前面
app.use(loggingMiddleware);

// 静态数据
app.use(express.static('public'));

// 注册路由
app.use('/', indexRouter);
app.use('/api', apiRouter);

app.get('/broken',(req, res) => {
    throw new Error('Broken')
})

// 路由兜底：在所有路由的后面添加
app.use('*',(req,res) =>{
    res.status(404).render('404',{url:req.originalUrl})  // render view/404.hbs
})

// Error 处理函数
//  和普通的中间件函数相比，多了第一个参数，也就是 err 异常对象。
app.use((err, req, res, next) => {
    //console.error(err.stack);
    res.status(500).render('500');         // render view/500.hbs
})


app.listen(port, () => {
  console.log(`Server running at http://${hostname}:${port}/`);
});

