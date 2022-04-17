---
title: windows下如何解决node-sass安装失败?
date: 2017/08/07 20:28
description:
categories: 技术
---

配置环境也是门学问，反正我每次配环境能出一堆问题，望所有同学都有耐心，最后一定会解决的~

> ps：如果解决不了，可使用**饮鸩止渴大法--叫同组小伙伴直接发 node-module 给你哈哈哈~**

#### 报错

```
> node-sass@3.13.1 install E:\node_modules\gulp-sass\node_modules\node-sass
> node scripts/install.js

Downloading binary from https://github.com/sass/node-sass/releases/download/v3.13.1/win32-x64-57_binding.node
//报错的的链接本身就失效了
Cannot download "https://github.com/sass/node-sass/releases/download/v3.13.1/win32-x64-57_binding.node":

HTTP error 404 Not Found

Hint: If github.com is not accessible in your location
      try setting a proxy via HTTP_PROXY, e.g.

      export HTTP_PROXY=http://example.com:1234

or configure npm proxy via

      npm config set proxy http://example.com:8080
```

#### node-sass 安装失败解决方法

从报错可以看出，node-sass 安装失败的原因是网络限制导致无法下载.node 文件

##### 解决办法一

我们把所需文件下载路径复制一份到浏览器里，然后使用浏览器下载文件就可以了。

1. 从 node 命令行中复制.node 文件下载链接并在浏览器打开下载文件

```
https://github.com/sass/node-sass/releases/download/v3.13.0/win32-x64-46_binding.node
```

2. 文件下载成功后，在命令行工具输入下面指令：

```
set SASS_BINARY_PATH=.node所在的路径
```

设置 SASS_BINARY_PATH 环境变量，目的是告诉程序直接使用本地的.node 文件，无需从网上下载

3. 配置完成，重新输入指令：

```
npm i node-sass -D --verbose
```

node-sass 安装成功了

##### 解决方法二

使用淘宝镜像,使用镜像前请把 node_modules 文件夹下原有的 node-sass 有关的文件全删了

```
 npm set sass_binary_site=https://npm.taobao.org/mirrors/node-sass/
```

or

```
npm install -g cnpm --registry=https://registry.npm.taobao.org
cnpm install node-sass
```

##### 方式三（如果你安装了翻墙软件）

假设你的翻墙软件在你本地机器上开启了一个第三方服务器 127.0.0.1:1080，那么只需按照下面的方法配置一下就能正常安装 node-sass 了（如果你开启的是 PAC 模式而不是全局模式，那还需要将 s3.amazonaws.com 加入 PAC 列表）：

```
npm config set proxy http://127.0.0.1:1080
npm i node-sass
```

下载完成后删除 http 代理

```
npm config delete proxy
```

以上解决 node-sass 安装的解决办法

#### 番外篇

作者以为就此成功走向开发顺利的康庄大道，
....bower 失败了....
报错如下

```
E:\bower install
module.js:487
    throw err;
    ^

Error: Cannot find module 'internal/fs'
    at Function.Module._resolveFilename (module.js:485:15)
    at Function.Module._load (module.js:437:25)
    at Module.require (module.js:513:17)
    at require (internal/module.js:11:18)
    at evalmachine.<anonymous>:40:20
    at Object.<anonymous> (C:\Users\scar\AppData\Roaming\npm\node_modules\bower\lib\node_modules\graceful-fs\fs.js:11:1)
    at Module._compile (module.js:569:30)
    at Object.Module._extensions..js (module.js:580:10)
    at Module.load (module.js:503:32)
    at tryModuleLoad (module.js:466:12)
```

查阅文章发现 module 找不到有两个原因 1.没安装 2.多个版本被安装
包依赖这个大魔王，真折磨人啊~

```
npm list graceful-fs
```

![](http://images.scar.site/20220224085850.png)

发现我的问题是包重复安装了
仔细瞅瞅，可能是我的全局 graceful-fs 没有安装好

```
npm install -g graceful-fs
```

成功了!

#### 资料

- [解决 node-sass 偶尔安装失败的方法](http://blog.csdn.net/zhu1500527791/article/details/53444870)
- [安装 node-sass 的正确姿势](https://github.com/lmk123/blog/issues/28)
- [npm 使用过程中遇到的 Cannot find module 'internal/fs' 的问题](http://blog.csdn.net/J3oker/article/details/72900728)
