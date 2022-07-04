---
title: Eoapi+Vercel+Serverless，部署一个 API 调试工具
date: 2022/04/29 15:30
description:
categories: 技术
---

这是一个超详细的实例，跟着做完你会：

- 光速入门 Vercel、Serverless Functions
- 得到一个和图片一模一样的专属的 API 工具

![](https://images.scar.site/20220606091130.png)

# 一、概念解析

## 1. Serverless 是什么？

Serverless 架构即“无服务器”架构，它是一种全新的架构方式，是云计算时代一种革命性的架构模式。

Serverless 的核心思想是让**作为计算资源的服务器不再需要被使用者关注**。

![](https://images.scar.site/20220606091150.png)

FaaS（Functions as a Service）函数即服务，FaaS是 Serverless 计算的一种形式，后续我们将用 Serverless API 实现一个使用 Node 帮助客户端发送 API 请求得到响应的服务。

如果看完还是云里雾里，冇嘢冇嘢接着看。

## 2. Eoapi 是什么？

一个可拓展的开源 API 工具，就是开头的那个配图，可以用它快速调试 API，可以体验一下 [Demo 地址](https://demo.eoapi.io/)。

 ## 3. Vercel 是什么？

Vercel 是一个站点托管平台， 类似于 `Github Pages`，你丢上去网页的构建后的代码，还你一个 Web 服务链接，同时支持持续集成， 可以关联 Push、PR，提交代码后自动部署 。

![](https://images.scar.site/20220606091306.png)

# 二、快速开始！

## 1. Fork Eoapi 仓库

访问：https://github.com/eolinker/eoapi

![](https://images.scar.site/20220606091540.png)

Fork 成功后可以在自己的 Repositories 看到 eoapi。

## 2. 配置 Vercel

访问：<https://vercel.com/>

注册成功后点击新建项目

![](https://images.scar.site/20220606091607.png)

配置 Vercel 访问 Github 项目的权限，选中 Eoapi

![](https://images.scar.site/20220606091617.png)


配置安装、构建命令以及构建后文件夹，配置好之后点击构建按钮。

-   BUILD COMMAND：`cd src/workbench/browser&&yarn build:web`
-   OUTPUT DIRECTORY：`src/workbench/browser/dist`
-   INSTALL ：`yarn`

![](https://images.scar.site/20220606091636.png)

通过这个链接就可以访问你的专属 API 工具啦！

![](https://images.scar.site/20220606091649.png)

![](https://images.scar.site/20220606091658.png)


# 三、Serverless Funcions

## 1. 源码解析

![](https://images.scar.site/20220606091717.png)


`api` 文件夹下有一个名为 unit.js 的文件，当我们部署到服务器时，它就变成了一个 HTTP 接口，一个文件一个接口，接口地址就是 `api/<file_name>`，是不是简单粗暴~

Serverless Functions 让我们写接口和写纯函数一样简单

![](https://images.scar.site/20220606091734.png)

我们只需要 exports 一个纯函数，通过函数第一个入参 req 拿到请求体，再通过 res.end() 返回响应体，就可以快速发布一个 API。

```javascript
let _LibsFlowCommon = require('../src/workbench/node/request/unit.js');

let _LibsCommon = require('../src/workbench/node/request/libs/common.js');

module.exports = (req, res) => {
  try {

    let data = req.body.data;

    data.env = _LibsCommon.parseEnv(data.env);

    new _LibsFlowCommon.core().main(data, (tmpInputReport, tmpInputHistory) => {

      res.send(
        JSON.stringify('i am response')
      );

    });

  } catch (e) {
    console.error('unit.js', e, req.body);
  }
};
```
## 2. 如何本地调试

Vercel 官方提供了 cli 工具

```
npm i -g vercel

vercel dev
```

剩下的跟着命令行指引配置完后就可以在本地调试 Serverless Functions 了

# 四、作者心得

我是 Eoapi 的一名开发者，[Live Demo](<https://demo.eoapi.io/ >)就是使用上面的步骤配置出来的，如果大家对项目感兴趣，欢迎大家持续关注我们项目：https://github.com/eolinker/eoapi。

说实话我第一次配置 Vercel 的时候还是踩了不少坑，但总体来说体验还是很不错的。

我手头上所有的网站基本上都迁移到了 Vercel。除了 Eoapi，我还部署了我的官网、一个抽奖程序，很酷炫。

嘿嘿，你也可以部署试试看，作为检验自己是否掌握知识点的小作业。

Github 地址：https://github.com/moshang-xc/lottery

![](https://images.scar.site/20220606091937.png)

# 五、参考资料

-   [Serverless(无服务)基础知识 - 掘金](https://juejin.cn/post/6844903904224903181#heading-0)
-   [三分钟了解 Serverless 是什么](https://zhuanlan.zhihu.com/p/340882159)
-   https://segmentfault.com/a/1190000041223777
-   [什么是Serverless架构和FaaS函数即服务？](https://zhuanlan.zhihu.com/p/31386919)
-   [Download Vercel CLI – Vercel](https://vercel.com/cli)
-   https://vercel.com/docs/concepts/functions/serverless-functions