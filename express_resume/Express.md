# 项目使用

来源 : https://juejin.cn/post/6844904023380721678

```
npm start
```



-----



虽然使用 Node.js 提供的原生 http 模块jiunneg创建 Web 服务器, 但是开发效率低；Express 是基于内置的 http 模块进一步封装出来的，能够极大的提高开发效率。

Express 和 http module 类似于浏览器中 Web API 和 jQuery 的关系。后者是基于前者进一步封装出来的。



对于前端程序员来说，最常见的两种服务器，分别是：

- Web 网站服务器：专门对外提供 Web 网页资源的服务器。

- API 接口服务器：专门对外提供 API 接口的服务器。

使用 Express，我们可以方便、快速的创建 Web 网站的服务器或 API 接口的服务器。



# 更强大的 Request / Response 对象

首先是 Request 请求对象，通常用 `req` 表示。重要成员：

- `req.body`：客户端请求体的数据，可能是表单或 JSON 数据
- `req.params`：请求 URI 中的路径参数
- `req.query`：请求 URI 中的查询参数
- `req.cookies`：客户端的 cookies



​	然后是 Response 响应对象，通常用 `res` 变量表示，可以执行一系列响应操作，例如：

```js
// 发送一串 HTML 代码
res.send('HTML String');

// 发送一个文件
res.sendFile('file.zip');

// 渲染一个模板引擎并发送
res.render('index');
```

Response 对象上的操作非常丰富，并且还可以链式调用：

```js
// 设置状态码为 404，并返回 Page Not Found 字符串
res.status(404).send('Page Not Found');
```

[全部 API](http://expressjs.com/en/4x/api.html)





# 路由机制

客户端向服务器发起请求时包括两个元素：**路径**（URI）以及 **HTTP 请求方法**（包括 GET、POST 等等）。路径和请求方法合起来一般被称为 API 端点（Endpoint）。而服务器根据客户端访问的 Endpoint 选择相应处理逻辑的机制就叫做路由。

在 Express 中，定义路由只需按下面这样的形式：

```js
app.METHOD(PATH, HANDLER)
```

其中：

- `app`  是一个 `express` 服务器对象
- `METHOD` 可以是任何**小写**的 HTTP 请求方法，包括 `get`、`post`、`put`、`delete` 等等
- `PATH` 是客户端访问的 URI，例如 `/` 或 `/about`
- `HANDLER` 是路由被触发时的回调函数，在函数中可以执行相应的业务逻辑

### 

## nodemon 加速开发

[Nodemon](https://link.juejin.cn?target=https%3A%2F%2Fwww.npmjs.com%2Fpackage%2Fnodemon) 是一款颇受欢迎的开发服务器，能够检测工作区代码的变化，并自动重启。通过以下命令安装 nodemon：

```bash
npm install nodemon --save-dev

$ npm start
```

这里我们将 nodemon 安装为开发依赖 `devDependencies`，因为仅仅只有在开发时才需要用到。同时我们在 package.json 中加入 `start` 命令，代码如下：

```bash
{
  "name": "express_resume",
  "version": "1.0.0",
  "description": "",
  "main": "index.js",
  "scripts": {
    "start": "nodemon server.js",
    "test": "echo \"Error: no test specified\" && exit 1"
  },
  "author": "",
  "license": "ISC",
  "dependencies": {
    "express": "^4.17.1"
  },
  "devDependencies": {
    "nodemon": "^2.0.2"
  }
}
```



# 中间件 Middleware

中间件并不是 Express 独有的概念。相反，它是一种广为使用的软件工程概念（甚至已经延伸到了其他行业），

Middleware 是指**将具体的业务逻辑和底层逻辑解耦的组件**（可查看这个[讨论](https://www.zhihu.com/question/19730582) 。

> 大致的效果是： 需要利用服务的人（前端写业务的），不需要知道底层逻辑（提供服务的）的具体实现，只要拿着中间件结果来用就好了。

换句话说，中间件就是能够适用多个应用场景、可复用性良好的代码。



Express 的简化版中间件流程如下图所示：

<img src="http://imagesoda.oss-cn-beijing.aliyuncs.com/Sodaoo/2022-07-13-043425.jpg" style="zoom:30%;" />

首先客户端向服务器发起请求，然后服务器依次执行每个中间件，最后到达路由，选择相应的逻辑来执行。

特别注意：

- 中间件是**按顺序执行**的，因此在配置中间件时顺序非常重要，不能弄错

- 中间件在执行内部逻辑的时候可以选择将请求传递给下一个中间件，也可以直接返回用户响应



在 Express 中，中间件就是一个函数：

```js
function someMiddleware(req, res, next) {
  /* 自定义逻辑 */
  next();
}
```

1. 三个参数中，`req` 和 `res` 就是 Request 请求对象和 Response 响应对象；

2. 而 `next` 函数则用来触发下一个中间件的执行。

> Note:  如果忘记在 Middleware 中调用 `next` 函数，并且又不直接返回响应时，服务器会直接卡在这个中间件不会继续执行下去哦！



在 Express 使用中间件有两种方式：**全局中间件**和**路由中间件**。



## 全局中间件

通过 `app.use` 函数就可以注册(全局)中间件，并且此中间件会在用户发起**任何请求**都可能会执行，例如：

```js
app.use(someMiddleware);
```





## 路由中间件

只有在访问 `/middleware` 时，定义的 `someMiddleware` 中间件才会被触发，访问其他路径时不会触发。

```js
app.get('/middleware', someMiddleware, (req, res) => {
  res.send('Hello World');
});
```



```js
// server.js
const express = require('express');
const hostname = 'localhost';
const port = 4000;

const app = express();

function loggingMiddleware(req, res, next) {
  const time = new Date();
  console.log(`[${time.toLocaleString()}] ${req.method} ${req.url} Apply loggingMiddleware! `);
  next();
}

app.use(loggingMiddleware);

app.get('/', (req, res) => {
  res.send('Hello World');
});

app.get('/msg', (req, res) => {   // 路由中间件
  res.send('Apply Msg !');
});

app.listen(port, () => {
  console.log(`Server running at http://${hostname}:${port}/`);
});
```



`npm start` 后 , 访问 `http://localhost/msg`  Terminal 输出 : 

> 注意 Node 文件的 console.log 是后台行为 , 和前端浏览器的 console 不是一回事 ~ 

```bash
Server running at http://localhost:4000/
[2022/7/13 12:54:09] GET / Apply loggingMiddleware! 
[2022/7/13 12:54:16] GET /msg Apply loggingMiddleware! 
```



> 在中间件中写 `console.log` 语句是比较糟糕的做法，
>
> 因为 `console.log`（包括其他同步的代码）都会阻塞 Node.js 的异步事件循环，降低服务器的吞吐率。
>
> 在实际生产中，推荐使用第三方优秀的日志中间件，例如 [morgan](https://link.juejin.cn?target=https%3A%2F%2Fwww.npmjs.com%2Fpackage%2Fmorgan)、[winston](https://link.juejin.cn?target=https%3A%2F%2Fwww.npmjs.com%2Fpackage%2Fwinston) 等等。



> 实际上，中间件不仅可以读取 `req` 对象上的各个属性，还可以添加新的属性或修改已有的属性（后面的中间件和路由函数都可以获取），能够很方便地实现一些复杂的业务逻辑（例如用户鉴权）。







# 模板引擎渲染页面

教程将使用 [Handlebars](https://link.juejin.cn/?target=https%3A%2F%2Fwww.npmjs.com%2Fpackage%2Fhandlebars) 作为模板引擎`npm install hbs`

创建 views 文件夹，用于放置所有的模板。然后在其中创建首页模板 `index.hbs` , 代码如下：

```html
<h1>个人简历</h1>
<p> 学习技术，磨炼本领。</p>
<a href="/contact">联系方式</a>
```

创建联系页面模板 `contact.hbs`，代码如下：

```html
<h1>联系方式</h1>
<p>QQ：1234567</p>
<p>微信：一只</p>
<p>邮箱：mrc@tuture.co</p>
```

最后便是在 server.js 中配置和使用模板。配置模板的代码非常简单：

```js
// 指定模板存放目录
app.set('views', '/path/to/templates');

// 指定模板引擎为 Handlebars
app.set('view engine', 'hbs');
```

在使用模板时，只需在路由函数中调用 `res.render` 方法即可：

```js
// 渲染名称为 hello.hbs 的模板
res.render('hello');
```



修改后的 server.js 代码如下：

```js
// ...

const app = express();

app.set('views', 'views');
app.set('view engine', 'hbs');

// 定义和使用 loggingMiddleware 中间件 ...

app.get('/', (req, res) => {
  res.render('index');
});

app.get('/contact', (req, res) => {
  res.render('contact');
})

// ...
```



# 静态文件服务

通常网站需要提供静态文件服务，例如图片、CSS 文件、JS 文件等等，而 Express 已经自带了静态文件服务中间件 `express.static`

例如，我们添加静态文件中间件如下，并指定静态资源根目录为 `public`：

```js
// ...

app.use(express.static('public'));

app.get('/', (req, res) => {
  res.render('index');
});

// ...
```

假设项目的 public 目录里面有这些静态文件：

```bash
public
├── css
│   └── style.css
└── img
    └── tuture-logo.png
```

就可以直接通过以下路径访问：

```bash
http://localhost:3000/css/style.css
http://localhost:3000/img/tuture-logo.png
```





# 处理 404 和服务器错误

HTTP 错误一般分为两大类：

- 客户端方面的错误（状态码 4xx），例如访问了不存在的页面（404）、权限不够（403）等等
- 服务器方面的错误（状态码 5xx），例如服务器内部出现错误（500）或网关错误（503）等等

如果打开服务器，访问一个不存在的路径，例如 `localhost:3000/what`，需要给用户以提示 

接下来将讲解如何在 Express 框架中处理 404（页面不存在）及 500（服务器内部错误）。在此之前，我们要完善一下 Express 中间件的运作流程，如下图所示：

<img src="http://imagesoda.oss-cn-beijing.aliyuncs.com/Sodaoo/2022-07-13-072149.jpg" style="zoom:50%;" />

这张示意图和之前的简单示意图有两点重大区别：

- 每个路由定义本质上是一个**中间件**（更准确地说是一个**中间件容器**，可包含多个中间件），当 URI 匹配成功时直接返回响应，匹配失败时继续执行下一个路由
- 每个中间件（包括路由）不仅可以调用 `next` 函数向下传递、直接返回响应，还可以**抛出异常**



从这张图就可以很清晰地看出怎么实现 404 和服务器错误的处理了：

- 对于 404，只需在**所有路由之后**再加一个中间件，用来接收所有路由均匹配失败的请求
- 对于错误处理，前面所有中间件抛出异常时都会进入错误处理函数，可以使用 Express 自带的，也可以自定义。



## 处理 404

在 Express 中，可以通过中间件的方式处理访问不存在的路径：

```js
app.use('*', (req, res) => {
  // ...
});
复制代码
```

>  `*` 表示匹配任何路径。将此中间件放在所有路由后面，即可捕获所有访问路径均匹配失败的请求。



## 处理内部错误

Express 已经自带了错误处理机制，我们先来体验一下。在 server.js 中添加下面这条”坏掉“的路由（模拟现实中出错的情形）：

```js
app.get('/broken', (req, res) => {
  throw new Error('Broken!');
});
```

然后开启服务器，访问 `localhost:3000/broken`：



此时 , 服务器会直接返回出错的调用栈 (报错信息) ！

1. 对普通用户来说体验糟糕，
2. 对专业用户而言 , 自爆弱点大大增加了被攻击的风险。



实际上，Express 的默认错误处理机制可以通过设置 `NODE_ENV` 来进行切换。我们将 NODE_ENV 设置为生产环境 `production`，再开启服务器。如果你在 Linux、macOS 或 Windows 下的 Git Bash 环境中，可以运行以下命令：

```bash
NODE_ENV=production node server.js
```

这时候访问 `localhost:3000/broken` 就会直接返回 Internal Server Error（服务器内部错误），不会显示任何错误信息：



理想的情况是能够返回一个友好的自定义页面。这可以通过 Express 的自定义错误处理函数来解决，错误处理函数的形式如下：

```js
app.use('*', (req, res) => {
  res.status(404).render('404', { url: req.originalUrl });
});

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).render('500');
});
```

> 上面使用了模板引擎中的变量插值功能。
>
> 具体而言，在 `res.render` 方法中将需要传给模板的数据作为第二个参数（例如这里的 `{ url: req.originalUrl }` 传入了用户访问的路径），在模板中就可以通过 `{{ url }}` 获取数据了。

404 和 500 的模板代码分别如下：

```html
// 404 page
<link rel="stylesheet" href="/css/style.css" />

<h1>找不到你要的页面了！</h1>
<p>你所访问的路径 {{ url }} 不存在</p>

// 500 page
<link rel="stylesheet" href="/css/style.css" />

<h1>服务器好像开小差了</h1>
<p>过一会儿再试试看吧！See your later~</p>
复制代码
```





# JSON API

最后，我们将实现一个非常简单的 JSON API。

如果你有过其他后端 API 开发（特别是 Java）的经验，那么你一定会觉得用 Express 实现一个 JSON API 端口简单得不可思议。

在之前提到的 Response 对象中，Express 为我们封装了一个 `json` 方法，直接就可以将一个 JavaScript 对象作为 JSON 数据返回，例如：

```js
res.json({ name: '百万年薪', price: 996 });
```

会返回 JSON 数据 `{ "name": "百万年薪", "price": 996 }`，状态码默认为 200。



我们还可以指定状态码，例如：

```js
res.status(502).json({ error: '公司关门了' });
```

会返回 JSON 数据 `{ "error": "公司关门了"}`，状态码为 502。



增加一个 `/api`  接口 

```js
// ...

app.get('/api', (req, res) => {
  res.json({ name: '图雀社区', website: 'https://tuture.co' });
});

// ...
```



# Router 路由拆分

当我们的网站规模越来越大时，把所有代码都放在 server.js 中可不是一个好主意。“拆分逻辑”（或者说“模块化”）是最常见的做法，而在 Express 中，我们可以通过子路由 `Router` 来实现。

```js
const express = require('express');

const router = express.Router();
```

`express.Router` 可以理解为一个迷你版的 `app` 对象，但是它功能完备，同样支持注册中间件和路由：

```js
// 注册一个中间件
router.use(someMiddleware);

// 添加路由
router.get('/hello', helloHandler);
router.post('/world', worldHandler);
```

最后，由于 Express 中“万物皆中间件”的思想，一个 `Router` 也作为中间件加入到 `app` 中:

```js
app.use('/say', router);
```



这样 `router` 下的全部路由都会加到 `/say` 之下，即相当于：

```js
app.get('/say/hello', helloHandler);
app.post('/say/world', worldHandler);
```

没明白, 看代码吧 :



首先创建 routes 目录，用于存放所有的子路由。创建 `routes/index.js` 文件，代码如下：

```js
const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
  res.render('index');
});

router.get('/contact', (req, res) => {
  res.render('contact');
});

module.exports = router;
```



创建 `routes/api.js`，代码如下：

```js
const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
  res.json({ name: '图雀社区', website: 'https://tuture.co' });
});

router.post('/new', (req, res) => {
  res.status(201).json({ msg: '新的篇章，即将开始' });
});

module.exports = router;
```



最后我们把 server.js 中老的路由定义全部删掉，替换成刚刚实现的两个 `Router`，代码如下：

```js
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
    res.status(500).render('500');
})

app.listen(port, () => {
  console.log(`Server running at http://${hostname}:${port}/`);
});
```

<img src="http://imagesoda.oss-cn-beijing.aliyuncs.com/Sodaoo/2022-07-13-072149.jpg" style="zoom:50%;" />
