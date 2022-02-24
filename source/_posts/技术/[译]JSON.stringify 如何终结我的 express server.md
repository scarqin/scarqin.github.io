---
title: 【译】JSON.stringify 如何 kill 掉我的 express server
date: 2019/12/04 00:36
description:
categories: 技术
---

> - 原文地址：https://itnext.io/how-json-stringify-killed-my-express-server-d8d0565a1a61
> - 原文作者：Efi Shtain
> - 译者：scarqin

一些小小的改变，即可在 Express server 获得 300％的性能提升。

Express 是创建服务器最常用的 Node.js 框架之一。
这是 Express server 监听 3000 端口并返回 JSON 的简单示例。

```
const express = require('express')
const app = express()

const json = {a:1}

app.get('/not_cached', (req,res)=>res.status(200).json(json))

app.listen(3000, ()=>console.log('Server started'))
```

运行上面的代码，使用 autocannon 对其进行多次基准测试，表明该服务器运行在 2018 年 MacBook Pro 上，在 11 秒内处理了大约 190K 请求〜= 1900 RPS

> ➜ autocannon http://localhost:3000/not_cached

> 译者注：基准测试，通过设计科学的测试方法、测试工具和测试系统，实现对一类测试对象的某项性能指标进行定量的和可对比的测试

### 我们可以做得更好！

由于上面示例的代码很少，我们只能找寻能更具体地表现 express 的源码！res 对象上 json 函数的定义
[完整代码](https://github.com/expressjs/express/blob/master/lib/response.js)

```
res.json = function json(obj) {
  var val = obj;

  // allow status / body
  if (arguments.length === 2) {
    // res.json(body, status) backwards compat
    if (typeof arguments[1] === 'number') {
      deprecate('res.json(obj, status): Use res.status(status).json(obj) instead');
      this.statusCode = arguments[1];
    } else {
      deprecate('res.json(status, obj): Use res.status(status).json(obj) instead');
      this.statusCode = arguments[0];
      val = arguments[1];
    }
  }

  // settings
  var app = this.app;
  var escape = app.get('json escape')
  var replacer = app.get('json replacer');
  var spaces = app.get('json spaces');
  var body = stringify(val, replacer, spaces, escape)

  // content-type
  if (!this.get('Content-Type')) {
    this.set('Content-Type', 'application/json');
  }

  return this.send(body);
};
```

最重要的部分发生在第 22 行，严格来说，**每个我们使用的 res.json 都需要字符串化后，才能作为 http 返回值发送**。 对数据进行字符串化后，将设置 content-type 并发送响应。

JSON.stringify 是一个 cpu 绑定操作，不是 Node.js 最好的朋友（译者注：Node.js 适合处理 IO 密集型的任务），所以让我们换个思路再试试。

我们可以对结果进行字符串化并将其保存到变量中，对于每个传入的请求，我们可以将 content-type 设置为 application/json 并使用 end 方法将字符串直接写入 socket：

```
const express = require('express')
const app = express()

const stringifedJson = JSON.stringify({a:1})

app.get('/cached', (req,res)=>{
    res.setHeader('Content-Type', 'application/json');
    res.end(stringifedJson)
})
app.listen(3000, ()=>console.log('Server started'))
```

再次运行自动 autocannon，可在 11 秒内（约 3500 RPS）处理 350K 个请求，吞吐量提升了 80％！

**但是，请耐心等待，您向我保证会提高 300％！ 你会是对的**

性能差异很大程度上取决于返回的对象。

我想表达的是，即使是很小的物体上的微小变化也可能是重要的。

尝试对较大的 json 对象（例如 500–600 Kb）执行相同的操作，你会发现性能的提高。 实际上，使用 res.json 可能真的会导致服务器在有限制的环境中崩溃，例如在 kubernetes 上运行的容器。

### 结论

使用 express 时，如果服务器的 RPS 表现不佳，请尝试缓存任何共享响应并将字符串直接写入响应流，而不要每次使用 JSON.stringify 的 res.json。
