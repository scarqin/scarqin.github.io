---
title: Cookie 详解
date: 2022/02/22 10:00:00
description:
categories: 技术


---

# Cookie 是什么？

![Fortune cookie](https://raw.githubusercontent.com/scarqin/imageshack/main/images/20220222222828.png)

Cookie，它的名字源自一种叫 Fortune cookie 的饼干，这种饼干包着一些写着短小精悍句子的小纸条。

在浏览器中，Cookie 是服务器让浏览器帮忙携带信息的手段，就像饼干里的纸条，**浏览器会储存它，并且在后续的 HTTP 请求中再次发送给服务器**。

<div align=center>
<img src="https://raw.githubusercontent.com/scarqin/imageshack/main/images/20220222223049.png"/>
</div>

以用户登录-退出登陆为例，Cookie 的生命周期如下：

前端通过用户登录 API 向后端传递用户信息，后端核对与数据库信息是否匹配。

匹配后**在登录 API 返回头部 `set-cookie` 返回记录用户状态的 cookie 值 userToken：**

![](https://raw.githubusercontent.com/scarqin/imageshack/main/images/20220222225339.png)
浏览器按照 `set-cookie` 的规则解析后存入浏览器

![](https://raw.githubusercontent.com/scarqin/imageshack/main/images/20220222225602.png)
**后续浏览器会自动将 userToken 加到满足条件（域名、路径）的 API 的 请求头部 cookie 中**

![](https://raw.githubusercontent.com/scarqin/imageshack/main/images/20220222225708.png)
如果退出登陆，返回头部的 `set-cookie` 会拜托浏览器帮忙删除 userToken，浏览器的 cookie 储存库就会将 userToken 字段删除，后续的 API 请求头部 `cookie` 也不会发送它。
![](https://raw.githubusercontent.com/scarqin/imageshack/main/images/20220222225829.png)

# Cookie 应用

主要用于以下三个方面：

- 会话状态管理（如用户登录状态、购物车、游戏分数或其它需要记录的信息）
- 个性化设置（如用户自定义设置、主题等）
- 浏览器行为跟踪（如跟踪分析用户行为等）

因为 HTTP 是无状态的，所以为了协助 Web 保持状态，Cookie 诞生了。

在 HTML5 的 localStorage、sessionStorage 出现之前，它作为当时唯一的储存手段也曾一度被用于客户端储存。随着浏览器储存机制的完善，为了减小不必要的性能开销（因为每次请求浏览器都会携带 Cookie 数据），一些**客户端需要而服务器不需要的数据**的场景渐渐被其他储存方式替代，例如记住用户的主题信息，Cookie 的使用也渐渐回归初心。

# 如何设置 Cookie

服务端和浏览器有不同设置 Cookie 的方式。

## 速查表

| 平台  | 操作示例                                       | 说明                                                                                                       |
| --- | ------------------------------------------ | -------------------------------------------------------------------------------------------------------- |
| 服务端 | set-cookie: \<cookie-name>=\<cookie-value> | 服务端通过设置 set-cookie 返回头部控制 Cookie                                                                         |
| 浏览器 | document.cookie = ;                        | 获取并设置与当前文档相关联的 cookie，操作不灵活。<br>[详细了解](https://developer.mozilla.org/zh-CN/docs/Web/API/Document/cookie) |
| 浏览器 | cookieStore.set("name", "scar")            | 新特性，仅支持在 HTTPS 使用，目前还在实验阶段。<br>[详细了解](https://developer.mozilla.org/en-US/docs/Web/API/CookieStore)      |

### 代码示例

> 服务端以 Node.js 为例，

服务端：

```

```

[服务端删除](https://stackoverflow.com/questions/5285940/correct-way-to-delete-cookies-server-side)

服务端通过 HTTP 请求的返回头部 `set-cookie` 设置 Cookie。客户端收到后，解析头部内容，得到 Cookie 的具体信息。

### 客户端：document.cookie

客户端通过浏览器暴露的方法 [document.cookie](https://developer.mozilla.org/zh-CN/docs/Web/API/Document/cookie) 读写当前界面的 Cookie

```JavaScript
document.cookie = newCookie;
```

[客户端删除](https://stackoverflow.com/questions/2144386/how-to-delete-a-cookie)

## 客户端：cookieStore

```

```

## Set-Cookie 详解

```http
Set-Cookie: <cookie-name>=<cookie-value>
Set-Cookie: <cookie-name>=<cookie-value>; Expires=<date>

// 同时指定多个属性 Domain、Secure、HttpOnly
Set-Cookie: <cookie-name>=<cookie-value>; Domain=<domain-value>; Secure; HttpOnly

// cookie 前缀，值可能性为 __Secure-、__Host-
Set-Cookie: <cookie-prefix><cookie-name>=<cookie-value>
```

从语法可以看出，Set-Cookie 由**前缀、键值对、属性**三部分组成

- 前缀[非必须]
  
  - 示例：`Set-cookie: __Secure-lol=foo;Domain=example.xxx`， \_Sercure- 就是前缀
  - Cookie 前缀需配合属性使用，使 Cookie 更安全

- 键值对（名称=值）
  
  - 示例：`Set-cookie: __Secure-lol=foo`。
  - Cookie 携带信息

- 属性[非必须]
  
  - 示例：`Domain=somecompany.co.uk; Path=/; Expires=Wed, 30 Aug 2019 00:00:00 GMT`
  - Cookie 的设置，告诉客户端如何使用 Cookie 信息，可以设置 Cookie 生效的时间、域名等等信息。

### Cookie 前缀

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

除了 IE 不支持，其他各大浏览器基本支持，例如 Chrome 从 49 版本开始支持。

不同浏览器限制可能不同，例子的最后一条，设置 `__Host-`前缀的时候，即使缺少 `Path=/`，FireFox 可以设置成功，而 Chrome 会拒绝。

但为什么有 `Secure` 属性还要加个 `__Secure-` 前缀呢？

因为 `Secure` 属性设置后是可以被人恶意移除的，而 Cookie 名称被人移除前缀，服务器不会认它，所以更加安全。

### Cookie 键值对

```
<cookie-name>=<cookie-value>
```



真正携带信息的部分，例如：

```
id=38afes7a8
```

`<cookie-name>` 可以是除了控制字符 (CTLs)、空格 (spaces) 或制表符 (tab)之外的任何 US-ASCII 字符。同时不能包含以下分隔字符： ( ) < > @ , ; : \ " /  [ ] ? = { }。



`<cookie-value>` 非必填，如果有值，那么需要包含在双引号里面。支持除了控制字符（CTLs）、空格（whitespace）、双引号（double quotes）、逗号（comma）、分号（semicolon）以及反斜线（backslash）之外的任意 US-ASCII 字符。

### Cookie 属性

告诉浏览器 Cookie 的一些额外信息，例如什么时候失效

#### 属性表

| Cookie 属性 | 说明   | 类型                                                                     | 默认值       | 示例                            |
| --------- | ---- | ---------------------------------------------------------------------- | --------- | ----------------------------- |
| Expires   | 过期时间 | [Date](https://developer.mozilla.org/zh-CN/docs/Web/HTTP/Headers/Date) | 浏览器会话关闭时间 | Thu, 22 Jul 2021 00:53:13 GMT |
| Max-Age   |      |                                                                        |           |                               |
| Domain    |      |                                                                        |           |                               |
| Path      |      |                                                                        |           |                               |
| Secure    |      |                                                                        |           |                               |
| HttpOnly  |      |                                                                        |           |                               |
| SameSite  |      |                                                                        |           |                               |

#### 详细说明

##### Expires

默认为会话关闭时间

> 如果浏览器提供了会话恢复功能，恢复回话之时，Cookie 也会一起恢复，就好像会话从来没有关闭一样。

# Q&A

一些关于 Cookie 的疑问和新特性，以 Q&A 形式记录。

## Cookie 储存大小

HTTP Cookies 有数量限制，大多数浏览器支持最大为 4KB 的 Cookie，而且只允许每个站点存储 30 或 50 个 Cookie（不同浏览器支持的数量不同），当超过时，最早的 Cookie 便被删除。

> 4KB 是针对 Cookie 单条记录的 Value 值，不是当前域下的所有 Cookie 大小总和

## async cookie

新特性

## Floc 替代第三方 Cookie？

http://www.ftchinese.com/story/001095154?full=y&archive

## 和 Cookie 相关的不安全事件有哪些？

## 同名 Cookie 发送时，优先级如何判断？

[http - How to handle multiple cookies with the same name? - Stack Overflow](https://stackoverflow.com/questions/4056306/how-to-handle-multiple-cookies-with-the-same-name)

# 资料

- [Cookies - mozilla](https://developer.mozilla.org/zh-CN/docs/Web/HTTP/Cookies)
- [Set-Cookies - mozilla](https://developer.mozilla.org/zh-CN/docs/Web/HTTP/Headers/Set-Cookie)
- [Cookie 前缀如何让 Cookie 更安全？- 阿里云社区](https://developer.aliyun.com/article/116668)
- [What is a Session Cookie?](https://www.cookiepro.com/knowledge/what-is-a-session-cookie/)
- [View, edit, and delete cookies](https://developer.chrome.com/docs/devtools/storage/cookies/?utm_source=devtools)
- [Correct way to delete cookies server-side](https://stackoverflow.com/questions/5285940/correct-way-to-delete-cookies-server-side)
