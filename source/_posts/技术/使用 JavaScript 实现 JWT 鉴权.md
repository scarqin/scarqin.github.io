---
title: 使用 JavaScript 实现 JWT 鉴权
date: 2019/12/04 00:13
description:
categories: 技术
---

随着互联网的崛起，对 Web 服务应用的安全性要求越来越高。在前后端分离的开发模式中，服务端使用特定的加密方式生成 token，客户端储存 token 作为授权传递给服务端，验证身份等信息是保障安全性的一种方式。其中 JWT（JSON Web Token）这种用于通信双方之间以 JSON 对象的形式传递信息的轻量鉴权方式受到越来越多的开发者喜爱。

# 什么是鉴权

如果没有鉴权信息,他人能够轻而易举的调用 API 对我们的数据进行操作。下图是一种常见的鉴权流程。客户端输入用户名密码等身份信息，服务端生成一个 token（token 可以是 user 唯一能识别身份的非敏感信息通过鉴权的加密方式生成），然后再将 token 返回给浏览器客户端，再次访问服务器时带上 token 信息，服务器会使用同样的鉴权方式对 token 进行验证，token 验证一致后执行具体操作。
![](http://images.scar.site/20220225001302.png)

# 应用

我需要一下将 json 信息使用 jwt 鉴权方式生成 token。

```
{
  "name": "scar",
  "role": "admin",
  "expirationData": "2018-10-24 17:05:00"
}
```

# JWT 鉴权

JWT 由三部分组成。

1.头部 Header

json 格式，指定了加密算法(alg)和 token 类型(typ)。

2.有效信息 payload

json 格式，标准中的注册可选参数以及需要传输的待加密信息，官方提供了可选参数如下表。

**payload 官方可选参数**
| 可选参数 | 描述 |
| :------------ | :------------ |
|iss | jwt 签发者|
|sub | jwt 所面向的用户|
|aud | 接收 jwt 的一方|
|exp | jwt 的过期时间，这个过期时间必须要大于签发时间|
|nbf | 定义在什么时间之前，该 jwt 都是不可用的|
|iat | jwt 的签发时间|
|jti | jwt 的唯一身份标识，主要用来作为一次性 token,从而回避重放攻击|

3.签名 signature

由 Header 和 Payload 经过处理得到，防止信息被篡改。

将 Header 和 Payload 分别经过 base64UrlEncode 加密，得到 

```javascript
before_sign = base64UrlEncode(Header).base64UrlEncode(Payload)；

```

中间用英文句号连接，然后将 before_sign 作为加密函数的第一个传参，Secret Salt（盐）作为加密函数的第二个传参，通过 Header 里面定义好的 alg 加密方式进行加密；

最后用英文句号连接 before_sign 和加密后的 before_sign。final_sign=before_sign+'.'+HS256(before_sign, secretSalt);

# 实现的代码

首先引入加密库 CryptoJS 与 jsrsasign，

```javascript

//和普通 base64 加密不一样
function base64UrlEncode(str) {
var encodedSource = CryptoJS.enc.Base64.stringify(str);
var reg = new RegExp('/', 'g');
encodedSource = encodedSource.replace(/=+$/,'').replace(/\+/g,'-').replace(reg,'\_');
return encodedSource;
}

let header = JSON.stringify({
"alg": "HS256",
"typ": "JWT"
})

let payload =JSON.stringify({
"name": "scar",
"role": "admin",
"expirationData": "2018-10-24 17:05:00"
});
let secretSalt = "user";

let before_sign = base64UrlEncode(CryptoJS.enc.Utf8.parse(header)) + '.' + base64UrlEncode(CryptoJS.enc.Utf8.parse(payload));

let signature =CryptoJS.HmacSHA256(before_sign, secretSalt);
signature = base64UrlEncode(signature);

let final_sign = before_sign + '.' + signature;
//final_sign:eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJuYW1lIjoic2NhciIsInJvbGUiOiJhZG1pbiIsImV4cGlyYXRpb25EYXRhIjoiMjAxOC0xMC0yNCAxNzowNTowMCJ9.bVc48JsxiM7ZZgtZch1QnRpLyt08M9LepwoLvs_aejI

```

![图片来自jwt.io](http://images.scar.site/20220225001321.png)
使用 javascript 实现有一定的加密算法限制，目前 ES512（ECDSA with curve P-521 and SHA-512）是不被支持的。

# 使用 eoLinker 做验证

![](http://images.scar.site/20220225001328.png)
填写好响应的信息，此处我将 jwt 鉴权 token 放在请求头部的 Authorization 中。

点击测试后，得到和我们的加密函数一样的结果
![](http://images.scar.site/20220225001349.png)
```
