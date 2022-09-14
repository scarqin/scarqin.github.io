---
title: 探究 HTTP 记忆之谜 - Cookie、Session、Token
date: 2022/07/19 10:00:00
description:
categories: 技术

---

# 历史背景

咱就是说 **HTTP 是一种没有记忆的[无状态](https://juejin.cn/post/6952077852514713637)协议**，同样的请求信息能得到同样返回值，就像纯函数，同样的输入往往能得到同样的输出。

![](https://images.scar.site/2022-02-18-00-01-22-image.png)

追本溯源，在很久很久以前，我们只是用 Web 浏览基础的文本，一个网站就是一个静态资源，谁都可以访问，请求返回的内容都一模一样，所以当时没有保持服务状态的需求。

![最早的网页](https://images.scar.site/20220504113235.png)

伴随着我们冲浪的需求越来越复杂，对 Web 要求也越来越高，像**用户登陆、权限校验等**需要 记住状态的功能此起彼伏罄竹难书。

但 HTTP 这种众生平等的特性并没有办法满足上诉需求，所以我们需要借用额外的手段例如 **Cookie、Session、Token 等机制储存应用状态信息**，将这些信息添加到后续的 HTTP 请求中达到保持状态的目的。

今天，我将带领大家一起弄懂 Cookie、Session、Token，告别懵懂 （🚩 立个  Flag）！

# Cookie、Session、Token

其实状态管理无处不在，假设某天你要去网吧上网，前台是一个只有七秒记忆的大姨，所以就算你天天通宵她也不认识你，那怎么证明你就是网吧会员呢？

- 给你发个**网卡**，每次刷网卡核对网吧有没有你信息
  ![](https://images.scar.site/20220329085523.png)
- 给你发个**冒险小虎队卡**，前台小姐姐拿着解密卡扫一下拿到里面的信息，发现是你的大脸并允许你上了两小时钟

![](https://images.scar.site/飞书20220321-094345.jpg)

<p align="center">(一张暴露年龄的卡)</p>

这两种方案的主要区别是【数据存储的位置】：

- **网卡里面没有身份信息**，只是一个身份标示，需要根据网卡从网吧获取身份信息核对

- **冒险小虎队卡里面就有身份信息**，网吧需要每次解密获取里面的身份信息

例子中网卡类似于 Session 机制，通过 Session ID 获取存储在服务器的状态信息；

冒险小虎队类似于 Token，自己携带状态信息，通过加密保证安全性。

具体的表现如何呢？咱们接着看。

# Session：服务器缓存机制

Session ID 就等于服务端给你发放的一张网卡，网吧给你的一张唯一标识你身份的东西，后续你每次请求服务的时候，带上 Session ID，服务端通过 ID 查到信息后再返回给客户端。

过程如图：
![](https://images.scar.site/2022-02-18-00-04-40-image.png)

1.发送已登陆信息（用户名 ID，密码） | 向用户发放 Token，里面包含状态信息

2.发送包含状态信息的 Token，Authorization: xxxxxx

3.

**Session ID 只存了用户的唯一标识 ID，那真正的信息存哪里呢？**

Session 的状态数据主要存储在服务器，这个储存位置可能是：

- 内存

- 文件

- 数据库，例如 Redis、Memcached
  ![](https://images.scar.site/20220419090601.png)
  
  <p style="text-align:center;color:#999">Redis Session 截图</p>

无论是储存在内存还是储存在文件，最终都会遇到一个很大的问题——**横向拓展比较困难**。

举个例子，因为网吧生意火爆，所以老板决定开分店，但是有一天 1 店的电脑坏了，要实现**一键换机（不下机）**，如果上机状态储存在网吧 1，那我去网吧 2 的时候肯定要重新上机，

所以需要实时复制一份 Session 数据去网吧 2 才能实现这个功能。
![](https://images.scar.site/20220429090604.png)
虽然复制也是一种方案，可以解决多个分店下（分布式架构）下 Session 一致性的问题。

但它太麻烦了！如果我开七八九十家分店，复制的成本岂不是指数增长？

方法总比困难多，如果这时候有个公共的地方储存 session，我们所有网吧都去它那获取状态信息，这样不管我开多少家，数据都是一致的，完全不用担心横向拓展的问题。

![](https://images.scar.site/20220429091310.png)

除了上面的手段，还可以通过**会话保持**，**保证每个客户端固定的访问到后端的同一台应用服务器**，例如 Nginx 可以通过请求的 IP 地址分配一个固定的服务端地址。

只要保证每个用户只能进同一个网吧，就不需要共享状态信息了，虽然没法实现一键换机功能，也能满足大多数需求了。

这时候网吧老板就问了，Session 负载均衡太麻烦了，能不能让那帮上网的小崽子自己携带状态信息，我就不用花钱买服务器帮他存了，本程序员思索了一番后答道：“可以，用 Token。”

# Token：客户端缓存机制

为什么有的人 Token 存 Cookie 里面呢？

Token 是什么？

Token 怎么实现？

- 创建 Token

- OpenID

- token 过期机制

- - OAuth
  
  - JWT
    
    关于 JWT  客户端实现的代码可以看这里：[使用JS实现JWT鉴权 - 掘金](https://juejin.cn/post/6844904013020790792)
* 为什么有的人 Token 存 Cookie 里面呢？

# Session 和 Token 的区别

## 储存位置

## 控制力

https://www.zhihu.com/question/315397046/answer/619457469

# Cookie

Cookie 我放在最后讲是因为**它往往是一种辅助保持服务状态的手段**，不独立作为保持状态的方案存在。

例如它在 Session 中承担的作用就是一个**智能、适合状态管理的客户端缓存**，即使你用 LocalStorage、IndexedDB 储存，也能辅助实现 Session、Token 机制。

Cookie 辅助保持状态的过程如图：

![](https://images.scar.site/2022-02-18-00-06-27-image.png)

<p align="center">(你第一次去上网，给你发张网卡)</p>

![](https://images.scar.site/2022-02-18-00-07-42-image.png)

<p align="center">Cookie 就像你裤兜，上网兜着网卡去，就认识你了</p>

Cookie 和 Session 是一种相辅相成的关系，所以这里不会对他们做对比，对比了反而担心大家混淆概念。

关于 Cookie 的超详细解析可以看这篇：[Cookie 从入门到进阶：一文彻底弄懂其原理以及应用](https://juejin.cn/post/7075129301527429133)。

# Q&A

一些零散不知道如何组织到文章中的思考，图个方便做成了 Q&A，我可真是个小机灵鬼。

## Q1：Session 不是会话吗？

本文提到的 Session 指的是一种**用 Session ID 保持 HTTP 状态的机制的技术方案，是一种实现**。

**Session 还能代表会话，是一种抽象概念**，比如浏览器的一次会话指的是从打开浏览器到关闭浏览器的过程，系统的会话指从注册进入系统到注销退出系统之间所经过的时间。

Web Session 定义如下：

> **会话**(Session)是一个客户与服务器之间的不中断的请求响应序列。对客户的每个请求，服务器能够识别出请求来自于同一个客户。当一个未知的客户向 Web 应用程序]发送第一个请求时就开始了一个会话。当客户明确结束会话或服务器在一个预定义的时限内不从客户接受任何请求时，会话就结束了。当会话结束后，服务器就忘记了客户以及客户的请求。

所有为了保持 HTTP 状态且数据储存到服务端到方案都可以称为 Session 方案，例如：Session ID+Cookie、Session ID+LocalStorage+Redis 等等，**所以我们不要混淆 Session 概念和 Session ID 实现啦～**

## Q2：我们为什么不直接把状态数据放到 Cookie 里面呢？

又又又拿上网卡当例子的话，Cookie 就是一张上面写了你账号密码的网卡，卡丢了直接给你祖传的密码也丢了（起码作者各网站的密码都是固定的），人家获取到的可不只是仅和网吧有关的信息了，信息量极大。

而 Session 是一张只有网吧会员 ID 的网卡，卡丢了最多花你网费，你密码起码不会丢。

技术上来说，有四点原因：

### 1. 安全问题

Cookie 数据储存在客户端，容易被攻击者获取/篡改，例如 XSS 攻击；

相比之下 Session 暴露的是 Session ID，所以安全性会高一些。

### 2. 储存大小限制

Cookie 有数量限制，而且只允许每个站点存储一定数量的 Cookie，当超过时，最早过期的 Cookie 便被删除。

### 3. 影响性能

就算人浏览器不给你限制 Cookie 大小，整个系统盘都让给你储存。老铁们别忘了 Cookie 会附带在请求头上，内容多了占带宽，直接影响性能。

### 4. 可以被用户禁用

这会导致又一堆程序员失去梦想

## Q3：为什么不用其他浏览器缓存手段来缓存 Session ID 呢？

Cookie 本身就是为了辅助 HTTP 协议保持状态而被创造出来的，Session 机制之所以常常和它双剑合璧的原因是：

- Cookie 会自动添加到后续的请求头部
- 可以纯粹由后端控制增删查改，前端可以不关注状态管理
- 提供过期时间（expire）、生效域名范围（domain）等功能

这些功能特性都是 Local Storage、Session Storage 无法提供的，当然你手动撸一个也不是不行。

## Q4：Cookie 加了密是不是就可以代替 Token

傻瓜，当然不是啦，原因如下：

### 1. 跨端需要 Token

浏览器支持 Cookie，但移动端 App、微信小程序不支持 Cookie，所以跨端应用需要使用 Token。

### 2. 跨域需要 Token

Cookie 有 domain，仅在指定的域名下生效，Token 只需要在请求头里面带上 Token 就行。

### 3. Token 可以防止 CSRF 攻击，Cookie 不行

> CSRF：跨站请求攻击，简单地说，是攻击者通过一些技术手段欺骗用户的浏览器去访问一个自己曾经认证过的网站并运行一些操作（如发邮件，发消息，甚至财产操作如转账和购买商品）。

举个例子，一家银行用以运行转账操作的 URL 如下：

```
http://www.examplebank.com/withdraw?account=AccoutName&amount=1000&for=PayeeName
```

那么，一个恶意攻击者可以在另一个网站上放置如下代码：

```HTML
<img src="<http://www.examplebank.com/withdraw?account=Alice&amount=1000&for=Badman>">
```

如果有账户名为 Alice 的用户访问了恶意站点，而她之前刚访问过银行不久，登录信息尚未过期，那么她就会损失 1000 资金。

- Cookie：用户点击了链接，Cookie 未失效，导致发起请求后后端以为是用户正常操作，于是进行扣款操作。
- Token：用户点击链接，由于浏览器不会自动带上 Token，所以即使发了请求，后端的 Token 验证不会通过，所以不会进行扣款操作。

所以如果用 Cookie 缓存身份信息，你就会被攻击。

> 以上关于 CSRF 解释来自 [chaijinsong](https://github.com/Advanced-Frontend/Daily-Interview-Question/issues/31#issuecomment-496368647)

# 总结

- Cookie 是浏览器提供的缓存方案
- Session 是储存在服务端的保持状态方案
- Token 是储存在客户端的保持状态方案

Token 和 Session 都是比较成熟的状态保持方案，方案没有谁优谁略，只有适合与不适合。

文章所有外星人配图来自于[图解 HTTP](https://awesome-programming-books.github.io/http/%E5%9B%BE%E8%A7%A3HTTP.pdf)，强烈推荐给想要了解 HTTP 协议的同学，作者这种图文并茂的表现形式是我学习的榜样。

这篇文章从去年 4 月份就开始写一直到今天，中途起草了另一篇文章关于 Chrome 插件入门的文章，写着写着又觉得写完这篇好像更开心一点，又回来写这篇，这波属于是风险对冲了。

# 资料

- [你真的了解 Cookie 和 Session 吗? - ityouknow](https://juejin.cn/post/6844903842773991431#heading-3)
- [Difference between cookies, session and tokens - Valentin Despa](https://www.youtube.com/watch?v=44c1t_cKylo&ab_channel=ValentinDespa)
- [Cookie 与 Session 的区别 - 阿里百川](https://juejin.cn/post/6844903434366222350)
- [使用 Session 和 Cookie - 廖雪峰](https://www.liaoxuefeng.com/wiki/1252599548343744/1328768897515553)
- [分布式 Session 一致性的 4 种解决方案 - 民工哥](https://segmentfault.com/a/1190000022404396)
- [彻底理解 cookie，token，session - 墨颜](https://www.cnblogs.com/moyand/p/9047978.html)
- [WT Token 刷新和作废 - weixin_39581652](https://blog.csdn.net/weixin_39581652/article/details/110801338)
- [深入理解 web 开发中的 Session 和 Cookie - Niklaus.chi](https://tianqing370687.github.io/2016/10/22/%E8%BD%AC%E8%BD%BD-%E6%B7%B1%E5%85%A5%E7%90%86%E8%A7%A3web%E5%BC%80%E5%8F%91%E4%B8%AD%E7%9A%84Session%E5%92%8CCookie/)
- [跨站请求伪造 CSRF - Vincent](https://www.cnblogs.com/vincent-c/articles/15380195.html)
- [傻傻分不清之 Cookie、Session、Token、JWT - 秋天不落叶](https://juejin.cn/post/6844904034181070861)
