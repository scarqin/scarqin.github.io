---
title: Cookie 从入门到进阶：一文彻底弄懂其原理以及应用
date: 2022/03/15 10:00:00
description:
categories: 技术
---

# Cookie 是什么？

![Fortune cookie](https://images.scar.site/20220222222828.png)

Cookie，它的名字源自一种叫 Fortune cookie 的饼干，这种饼干里面有一张写着精辟句子的小纸条。

在浏览器中，Cookie 是服务器让浏览器帮忙携带信息的手段，就像饼干里的纸条，**浏览器会储存它，并且在后续的 HTTP 请求中再次发送给服务器**。

![](https://images.scar.site/2022-02-18-00-06-27-image.png)

![](https://images.scar.site/2022-02-18-00-07-42-image.png)

# Cookie 应用

主要用于以下三个方面：

- 会话状态管理（如用户登录状态、购物车、游戏分数或其它需要记录的信息）
- 个性化设置（如用户自定义设置、主题等）
- 浏览器行为跟踪（如跟踪分析用户行为等）

因为 HTTP 是无状态的，所以为了协助 Web 保持状态，Cookie 诞生了。在 HTML5 的 localStorage、sessionStorage 出现之前，它作为当时唯一的储存手段也曾一度被用于客户端储存。

随着浏览器储存机制的完善，为了减小不必要的性能开销（因为每次请求浏览器都会携带 Cookie 数据），一些**客户端需要而服务器不需要的数据的场景渐渐被其他储存方式替代**，例如记住用户的主题信息，Cookie 的应用场景也渐渐回归初心。

目前 Cookie 主要用于会话状态管理，以用户登录-退出登陆为例，Cookie 的生命周期如下：

前端通过用户登录 API 向后端传递用户信息，后端核对与数据库信息是否匹配。

匹配后**在登录 API 返回头部 `set-cookie` 返回记录用户状态的 cookie 值 userToken：**

![](https://images.scar.site/20220222225339.png)
浏览器按照 `set-cookie` 的规则解析后存入浏览器

![](https://images.scar.site/20220222225602.png)
**后续浏览器会自动将 userToken 加到满足条件（域名、路径）的 API 的 请求头部 cookie 中**

![](https://images.scar.site/20220222225708.png)
如果退出登陆，返回头部的 `set-cookie` 会拜托浏览器帮忙删除 userToken，浏览器的 cookie 储存库就会将 userToken 字段删除，后续的 API 请求头部 `cookie` 也不会发送它
![](https://images.scar.site/20220222225829.png)

# 如何设置 Cookie

服务端和浏览器有不同设置 Cookie 的方式。

## 速查表

| 平台                       | 操作示例                                       | 说明                           |
| ------------------------ | ------------------------------------------ | ---------------------------- |
| 服务端                      | set-cookie: \<cookie-name>=\<cookie-value> | 服务端通过设置 set-cookie 控制 Cookie |
| 浏览器 <br> document.cookie | document.cookie = "name=scar";             | 获取并设置与当前文档相关联的 cookie，操作不灵活。 |
| 浏览器<br>Cookie Store API  | cookieStore.set("name", "scar")            | 新特性，仅支持在 HTTPS 使用，目前还在实验阶段。  |

## 详细说明

### 服务端：Set-Cookie

> 服务端以 Node.js 为例，不同语言有不同的用法，但 Cookie 设置逻辑是一样的

```javascript
const http = require("http");
http
  .createServer((req, res) => {
    if (req.url === "/read") {
      // 读取 Cookie
      res.end(`Read Cookie: ${req.headers.cookie || ""}`);
    } else if (req.url === "/write") {
      // 设置 Cookie
      res.setHeader("Set-Cookie", [
        `name=scar;`,
        //set-cookie 属性大小写不敏感，你可以写成 path=/ 或者 Path=/
        `language=javascript;Path=/; HttpOnly;Expires=${new Date(
          Date.now() + 1000
        ).toUTCString()};`,
      ]);
      res.end("Write Success");
    } else if (req.url === "/delete") {
      // 删除 cookie
      res.setHeader("Set-Cookie", [
        // 设置过期时间为过去的时间
        `name=;expires=${new Date(1).toUTCString()}`,
        // 有效期 max-age 设置成 0 或 -1 这种无效秒，让 cookie 当场去世
        // 有些浏览器不支持 max-age 属性，所以用此方法需要考虑兼容性
        "language=javascript; max-age=0",
      ]);
      res.end("Delete Success");
    } else {
      res.end("Not Found");
    }
  })
  .listen(3000);
```

### 客户端：document.cookie

客户端通过浏览器方法 [document.cookie](https://developer.mozilla.org/zh-CN/docs/Web/API/Document/cookie) 读写当前界面的 Cookie。

```javascript
// 编辑 ookie
document.cookie = "name=scar";
document.cookie = "language=javascript";
// 读取 Cookie
console.log(document.cookie);
//name=scar; language=javascript

// 删除 Cookie
document.cookie = "name=scar;expires=Thu, 01 Jan 1970 00:00:01 GMT";
```

### 客户端：Cookie Store API

[Cookie Store](https://developer.mozilla.org/en-US/docs/Web/API/CookieStore) API 目前正在试验阶段，Firefox、Safari 浏览器 还不支持，所以不建议在生产环境使用，相信在将来我们会用上它更方便地操作 Cookie。

```javascript
// 读取 Cookie
await cookieStore.get("enName");
await cookieStore.getAll();

// 设置 Cookie
const day = 24 * 60 * 60 * 1000;
cookieStore
  .set({
    name: "enName",
    value: "scar",
    expires: Date.now() + day,
    domain: "scar.siteÏ",
  })
  .then(
    function () {
      console.log("It worked!");
    },
    function (reason) {
      console.error("It failed: ", reason);
    }
  );

// 删除 Cookie
await cookieStore.delete("session_id");

// 监听 Cookie 变化
cookieStore.addEventListener("change", (event) => {
  for (const cookie of event.changed) {
    if (cookie.name === "name") sessionCookieChanged(cookie.value);
  }
  for (const cookie of event.deleted) {
    if (cookie.name === "enName") sessionCookieChanged(null);
  }
});
```

除了更方便的用法，他还有以下特性：

#### 异步操作

它可以异步访问 Cookie，不阻塞主进程，document.cookie 是同步操作。

#### 错误抛出机制

Cookie Store API 有一个明确的机制来报告 Cookie 存储错误，而 document.cookie 如果设置失败也不会提醒，所以需要轮询查 Cookie 的方法来确保设置成功。

#### service workers 支持

因为 document.cookie 的同步设计，所以 service workers 不支持。Cookie Store API 的异步特性更适合，所以 service workers 支持通过它访问 Cookie。

# Set-Cookie 详解

从语法可以看出，Set-Cookie 由**前缀、键值对、属性**三部分组成。

```http
Set-Cookie: <cookie-name>=<cookie-value>
Set-Cookie: <cookie-name>=<cookie-value>; Expires=<date>

// 同时指定多个属性 Domain、Secure、HttpOnly
Set-Cookie: <cookie-name>=<cookie-value>; Domain=<domain-value>; Secure; HttpOnly

// cookie 前缀，值可能性为 __Secure-、__Host-
Set-Cookie: <cookie-prefix><cookie-name>=<cookie-value>
```

- 前缀[非必须]
  
  - 示例：`Set-cookie: __Secure-lol=foo;Domain=example.xxx`， \_Sercure- 就是前缀
  - Cookie 前缀需配合属性使用，使 Cookie 更安全

- 键值对（名称=值）
  
  - 示例：`Set-cookie: __Secure-lol=foo`。
  - Cookie 携带信息

- 属性[非必须]
  
  - 示例：`Domain=somecompany.co.uk; Path=/; Expires=Wed, 30 Aug 2019 00:00:00 GMT`
  - Cookie 的设置，告诉客户端如何使用 Cookie 信息，可以设置 Cookie 生效的时间、域名等等信息。

## Cookie 前缀

Cookie 前缀是一种在 Cookie 名称中携带信息的方式，它必须和某些属性同时出现，否则 Cookie 无法设置成功。

| 名称          | 说明                                                                       |
| ----------- | ------------------------------------------------------------------------ |
| \_\_Secure- | 必须同时设置 Secure 属性                                                         |
| \_\_Host-   | 必须同时设置 Path=/ 和 Secure 属性，且不能设置 Domain 属性。<br>限制来自安全域的 Cookie 被作用在不安全的域上 |

例子：

```javascript
// 支持 Cookie 前缀的收到下面设置的时候会拒绝，因为没有同时设置 Secure 属性
document.cookie = "__Secure-invalid-without-secure=1";
// 这样设置才能成功！
document.cookie = "__Secure-valid-with-secure=1; Secure";
```

```http
// 当响应来自于一个安全域（HTTPS）的时候，二者都可以被客户端接受
Set-Cookie: __Secure-ID=123; Secure; Domain=example.com
Set-Cookie: __Host-ID=123; Secure; Path=/

// 缺少 Secure 属性，会被拒绝
Set-Cookie: __Secure-id=1

// 缺少 Path=/ ，会被拒绝
Set-Cookie: __Host-id=1; Secure
```

说实话这个前缀我之前从没见过，孤陋寡闻了。

除了 IE 不支持，其他各大浏览器基本支持。不同浏览器限制可能不同，例如：`Set-Cookie: __Host-id=1; Secure`设置 `__Host-`前缀的时候，即使缺少 `Path=/`，FireFox 可以设置成功，而 Chrome 会拒绝。

> **但为什么有 `Secure` 属性还要加个 `__Secure-` 前缀呢？**
> 
> 因为 `Secure` 属性设置后是可以被人恶意移除的，而 Cookie 名称被人移除前缀，服务器不会认它，所以更加安全。

## Cookie 键值对

```
<cookie-name>=<cookie-value>
```

真正携带信息的部分，例如：

```
id=38afes7a8
```

`<cookie-name>`  可以是除了控制字符 (CTLs)、空格 (spaces) 或制表符 (tab)之外的任何 US-ASCII 字符。同时不能包含以下分隔字符： ( ) < > @ , ; : \ " /  [ ] ? = { }。

`<cookie-value>`  非必填，如果有值，那么需要包含在双引号里面。支持除了控制字符（CTLs）、空格（whitespace）、双引号（double quotes）、逗号（comma）、分号（semicolon）以及反斜线（backslash）之外的任意 US-ASCII 字符。

## Cookie 属性

Cookie 属性可以理解为 Cookie 的配置项，告诉浏览器 Cookie 的一些额外信息，例如什么时候失效

### 速查表

| Cookie 属性 | 说明                                           | 类型                                                                     | 默认值              | 示例                              |
| --------- | -------------------------------------------- | ---------------------------------------------------------------------- | ---------------- | ------------------------------- |
| Domain    | 生效域名                                         | String                                                                 | 当前访问地址中的 host 部分 | scar.site                       |
| Path      | 生效路径                                         | String                                                                 | /                | /docs                           |
| Expires   | 过期时间                                         | [Date](https://developer.mozilla.org/zh-CN/docs/Web/HTTP/Headers/Date) | 浏览器会话关闭时间        | Thu, 22 Jul 2021 00:53:13 GMT   |
| Max-Age   | 有效期，单位秒                                      | Number                                                                 |                  | 1000                            |
| Secure    | 仅 HTTPS 可用                                   |                                                                        |                  | `无值`，出现即设置                      |
| HttpOnly  | 设置了 HttpOnly 属性的 cookie 不能使用 JavaScript 进行访问 |                                                                        |                  | `无值`，出现即设置                      |
| SameSite  | 允许服务器设定 Cookie 不随着跨站请求一起发送                   | string                                                                 | Lax              | 值可能性为:<br>Lax<br>Strict<br>None |
| SameParty | 允许特定条件跨域共享 Cookie                            |                                                                        |                  | `无值`，出现即设置                      |
| Priority  | 优先级，仅 Chrome 支持                              |                                                                        | Medium           | 值可能性为:<br>Low<br>Medium<br>High |

### 详细说明

#### Domain

`Domain` 指定了哪些主机地址可以接收 Cookie。来看看如下设置：

```http
Set-Cookie: __Secure-ID=123; Secure; Domain=example.com
```

表示只要请求的目标地址匹配 Domain 规则，那 Cookie 就会被发送过去，所即使`scar.site` 向 `example.com` 发起的请求，Cookie 会被发送过去。**所以不要再误会 `Domain`是发起请求的域名啦，其实是接受请求的域名**。

如果不设置，默认为 [origin](https://developer.mozilla.org/zh-CN/docs/Glossary/Origin)，**不包含子域名**，如果指定了`Domain`，则一般包含子域名，例如，如果设置 `Domain=mozilla.org`，则 Cookie 也包含在子域名中（如`developer.mozilla.org`）。

> 当前大多数浏览器遵循 [RFC 6265](https://tools.ietf.org/html/rfc6265)，设置 `Domain` 时 不需要加前导点。浏览器不遵循该规范，则需要加前导点，例如：`Domain=.mozilla.org`

#### Path

`Path` 标识指定了主机下的哪些路径可以接受 Cookie（该 URL 路径必须存在于请求 URL 中）。以字符 `%x2F` ("/") 作为路径分隔符，子路径也会被匹配。

例如，设置 `Path=/docs`，则以下地址都会匹配：

- `/docs`
- `/docs/Web/`
- `/docs/Web/HTTP`

#### Expires

设置过期时间，可以传一个符合 [HTTP-Date](https://developer.mozilla.org/zh-CN/docs/Web/HTTP/Headers/Date) 格式的值，例如： `expires=Mon, 14 Mar 2022 15:39:34 GMT;`

如果不设置 `Expires`，则默认为会话关闭时间;

> 会话是浏览器的一个概念，一般是一个浏览器 Tab 窗口。
> 
> 如果浏览器提供了会话恢复功能，恢复回话之时，Cookie 也会一起恢复，就好像会话从来没有关闭一样。

#### Max-Age

在 Cookie 失效之前需要经过的秒数。秒数为 0 或 -1 将会使 cookie 直接过期。一些老的浏览器（IE 6、IE 7 和 IE 8）不支持这个属性。

如果 `Expires` 和`Max-Age` 同时存在时，`Max-Age`优先级更高。

> Expires/Max-age 最大值在 chrome 是 400 天，详情可见：[Cookie Expires/Max-Age attribute upper limit - Chrome Platform Status](https://chromestatus.com/feature/4887741241229312)

#### HttpOnly

设置了 HttpOnly 属性的 cookie 不能使用 JavaScript 经由  [`Document.cookie`](https://developer.mozilla.org/zh-CN/docs/Web/API/Document/cookie) 属性、[`XMLHttpRequest`](https://developer.mozilla.org/zh-CN/docs/Web/API/XMLHttpRequest) 和  [`Request`](https://developer.mozilla.org/zh-CN/docs/Web/API/Request) APIs、[`Cookie Store`](https://developer.mozilla.org/en-US/docs/Web/API/CookieStorechr) APIs 进行访问。

![](https://images.scar.site/20220312181822.png)

#### Secure

标记为 `Secure` 的 Cookie 只应通过被 HTTPS 协议加密过的请求发送给服务端，因此可以预防 [man-in-the-middle](https://developer.mozilla.org/zh-CN/docs/Glossary/MitM) 攻击。

但即便设置了 `Secure` 标记，敏感信息也不应该通过 Cookie 传输，因为 Cookie 固有的不安全性，`Secure` 标记也无法提供确实的安全保障，例如：可以访问客户端硬盘的人可以读取它。

#### SameSite

服务器要求某个 Cookie 在跨站请求时不会被发送，从而可以阻止[跨站请求伪造攻击](https://developer.mozilla.org/zh-CN/docs/Glossary/CSRF)。

SameSite 可以有下面三种值：

- **`None`**：浏览器会在同站请求、跨站请求下继续发送 Cookies，不区分大小写。

- **`Strict`**：浏览器将只在访问站点与 Cookie 生效的域相同时发送 Cookie。

- **`Lax`**：新版本浏览器默认设置为 Lax。与 `Strict` 类似，但是特定条件也可以发送跨域请求：
  
  * URL 必须发生变化
  
  * HTTP 请求方式必须是[安全](https://developer.mozilla.org/en-US/docs/Glossary/Safe/HTTP)的，例如 `GET`、`HEAD`、`OPTIONS`，它们不改变数据。
  
  举个例子，用户从 a.com 跳转到 b.com，URL 发生了变化的同时请求方式为 GET，所以 设置了 `Lax`的 Cookie 会被发送过去 ，除此之外还有图片加载、iframe 调用等等。

##### SameSite 和 Domain 的区别

上面提到过，`Domain` 可以指定 Cookie 生效的域名，那它和 `Domain`的区别是什么呢？

**`Domain` 属性限制了接收 Cookie 的域名，而 `SameSite`属性限制了发送 Cookie 的域名**

举个例子：

```http
Set-Cookie: Foo=bar; Path=/; Secure; Domain=scar.site;
```

无论是从 `scar.site` 还是 `foo.example.com` 发起的请求，只要被发送到了 `scar.site` 或者它的子域名，那 Cookie 就能发过去。 

```http
Set-Cookie: name=scar; Path=/; Secure; Domain=scar.site;SameSite=strict;
```

如果设置了 `SameSite=strict`,那么这个请求只能从 `scar.site` 发起 Cookie 才能带过去。

#### SameParty

> 目前还在实验阶段

配合  `First-Party Sets` 实现跨域共享属性，详细可以访问：[详解 Cookie 新增的 SameParty 属性](https://juejin.cn/post/7002011181221167118)。

<!-- #### Partition Key -->

#### Priority

> 目前只有 Chrome 实现了这个[提案](https://datatracker.ietf.org/doc/html/draft-west-cookie-priority)

因为 Cookie 有数量限制，所以在 Cookie 超过一定数量时，浏览器会清除最早过期的 Cookie。

如果设置了 Priority，Chrome 会先将优先级低的清除，并且每种优先级 Cookie 至少保留一个。可以有下面三种值：

* Low：低优先级

* Medium：默认值，中优先级

* High：高优先级

# Q&A

一些关于 Cookie 的疑问和新特性，以 Q&A 形式记录。比较杂、比较散，可以说没什么知识点全是感情，属于那种你知道了可能没什么用但是就是想把它弄懂。

## 1. Cookie 的限制

### 大小限制

大多数浏览器支持最大为 4KB 的 Cookie，4KB 是针对 Cookie 单条记录的 Value 值。

### 数量限制

Cookie 有数量限制，而且只允许每个站点存储一定数量的 Cookie，当超过时，最早过期的 Cookie 便被删除。

不同浏览器支持的数量可能不同, 基于 Webkit 内核的是 180 个，基于 gecko 内核的是 150 个，感兴趣可以访问[江涛学编程-编写的 Cookie 实验](https://zhengjiangtao.cn/show/zj/cookie.html) 试试自己的浏览器 Cookie 数量限制

> 实际上影响 Cookie 被删除的要素不止是 `Expires` 和 `Max-Age`，还有 `Priority`、`Secure`，对移除策略感兴趣的可以看：[Cookie 知识二则](https://zhuanlan.zhihu.com/p/50541175)

## 2. 和 Cookie 相关的不安全事件有哪些？

### CSRF 攻击

> CSRF：跨站请求攻击，简单地说，是攻击者通过一些技术手段欺骗用户的浏览器去访问一个自己曾经认证过的网站并运行一些操作（如发邮件，发消息，甚至财产操作如转账和购买商品）。

举个例子，一家银行用以运行转账操作的 URL 如下：

```
http://www.examplebank.com/withdraw?account=AccoutName&amount=1000&for=PayeeName
```

那么，一个恶意攻击者可以在另一个网站上放置如下代码： 

```HTML
<img src="<http://www.examplebank.com/withdraw?account=scar&amount=1000&for=Badman>">
```

如果有账户名为 Alice 的用户访问了恶意站点，而她之前刚访问过银行不久，登录信息尚未过期，导致发起请求后后端以为是用户正常操作，于是进行扣款操作，那么她就会损失 1000 资金。通过设置 `sameSite` 可以防止跨域发送 Cookie，抵御 CSRF。

### XSS 攻击

> 跨站脚本（Cross-site scripting）是一种网站应用程序的安全漏洞攻击，简称为 CSS, 但这会与层叠样式表（Cascading Style Sheets）CSS的缩写混淆。因此，跨站脚本攻击缩写为 XSS。

XSS 攻击通常指的是通过利用网页开发时留下的漏洞，通过巧妙的方法注入恶意指令代码到网页，使用户加载并执行攻击者恶意制造的网页程序。攻击成功后，攻击者可能得到 Cookie 从而实现攻击。

## 3. Floc 替代第三方 Cookie？

> 引用自：[如果不用第三方 Cookie，Google FLoC 会是更好的替代者吗？ - 少数派](https://sspai.com/post/66056)

FLoC 是一种新的广告追踪技术，全称为 Federated Learning of Cohorts，即「同类群组联合学习」。FLoC 的工作原理是监视你的浏览记录，为访客的汇总行为分配一个 ID，然后将具有类似浏览行为的浏览器分组在一起。这些群组的数据称为同类群组，然后用于向人们展示针对性更强的广告。

![](https://images.scar.site/20220314225720.png)

**FLoC 在自身设计层面，是比 Cookie 隐私性更好的**，但是首先它依然是一个广告追踪技术，其次才是一个相对保护隐私的广告追踪技术。

FLoC 由 Google 主导，所以三方团体担忧：当所有的浏览器开始默认屏蔽第三方 Cookie，广告商转向使用 FLoC 以后，Google 将在广告追踪市场一家独大。

<!-- ## 跨域 Cookie

[authentication - Set cookies for cross origin requests - Stack Overflow](https://stackoverflow.com/questions/46288437/set-cookies-for-cross-origin-requests) -->

## 4. 同名 Cookie 发送时，优先级如何判断？

```http
Cookie: a=2; a=1
```

首先来看看 `Cookie` 发送顺序，[RFC 6265](https://www.rfc-editor.org/rfc/rfc6265#section-5.4)提案提到：

* `Path` 属性较长的应该在前面

* 如果 `Path` 路径一样，创建时间早的在前面

具体的浏览器表现我没有去探究，但提案只是倡导，所以每个客户端不一定会按照它实现 Cookie 的发送顺序。

除了考虑发送顺序，还要考虑不同的服务器框架可能有不同的接收逻辑，所以笔者推荐尽量避免出现同名 Cookie，减少端表现不统一带来的不确定性。

## 5. 如何快速调试 Cookie

F12 打开控制台可以快速看到本域下的所有 Cookie

![](https://images.scar.site/notebook.png)

通过分析 Cookie 属性来定位问题。

例如某个 Cookie 导致了业务问题，如果它设置了 HttpOnly，那么代表客户端无法操作 Cookie，可以快速的把问题定位到 API 层面。

# 总结

本来我在写：Cookie、Session、Token ，写着写着发现 Cookie 的篇幅比较多，而那篇文章的重点不在于这些部分，所以摘了出来。如果对 Cookie、Session、Token 感兴趣的可以持续关注一下我，近期会发哦～

作为一名前端人员，平时用得少所以不熟悉，但了解后其实也没有什么难点，相信你们看完这篇就可以彻底了解了。如果文章中还有关于 Cookie 你想知道但是我没写的部分都可以评论，我会回复。

# 资料

- [Cookies - mozilla](https://developer.mozilla.org/zh-CN/docs/Web/HTTP/Cookies)
- [Set-Cookies - mozilla](https://developer.mozilla.org/zh-CN/docs/Web/HTTP/Headers/Set-Cookie)
- [Cookie 前缀如何让 Cookie 更安全？- 阿里云社区](https://developer.aliyun.com/article/116668)
- [What is a Session Cookie?](https://www.cookiepro.com/knowledge/what-is-a-session-cookie/)
- [View, edit, and delete cookies](https://developer.chrome.com/docs/devtools/storage/cookies/?utm_source=devtools)
- [Correct way to delete cookies server-side](https://stackoverflow.com/questions/5285940/correct-way-to-delete-cookies-server-side)
- [Feature: Cookie Store API](https://chromestatus.com/feature/5658847691669504)
- [面试：彻底理解 Cookie 以及 Cookie 安全](https://juejin.cn/post/6844904102544031757)
- [如果不用第三方 Cookie，Google FLoC 会是更好的替代者吗？ - 少数派](https://sspai.com/post/66056)
- [FLoC 是什么？以及你为什么需要在 Chrome 浏览器中禁用它 · Ruby China](https://ruby-china.org/topics/41320)
- [分享一个关于 Cookie 做的实验结果 - ataola - 博客园](https://www.cnblogs.com/cnroadbridge/p/13552566.html)
- [What are the security differences between cookies with Domain vs SameSite strict? - Stack Overflow](https://stackoverflow.com/questions/57090774/what-are-the-security-differences-between-cookies-with-domain-vs-samesite-strict)
- [What is difference between SameSite=&quot;Lax&quot; and SameSite=&quot;Strict&quot;? - Stack Overflow](https://stackoverflow.com/questions/59990864/what-is-difference-between-samesite-lax-and-samesite-strict)
- [Cookie 知识二则](https://zhuanlan.zhihu.com/p/50541175)
- [How to handle multiple cookies with the same name? - Stack Overflow](https://stackoverflow.com/questions/4056306/how-to-handle-multiple-cookies-with-the-same-name)
