---
title: JS实现HTTP请求头-Basic Authorization
date: 2018/01/29 15:46:55
description:
categories: 技术
---

HTTP 协议中的  **Authorization**  请求消息头含有服务器用于验证用户代理身份的凭证，通常会在服务器返回[401](https://developer.mozilla.org/zh-CN/docs/Web/HTTP/Status/401) Unauthorized  状态码以及[WWW-Authenticate](https://developer.mozilla.org/zh-CN/docs/Web/HTTP/Headers/WWW-Authenticate)  消息头之后在后续请求中发送此消息头。

     Authorization:Basic c2NhcjoxMjM0NTY=
     Authorization: <type> <credentials>
     //(c2NhcjoxMjM0NTY=) 是(scar:123456)的base64编码

格式是 Basic 字符串+空格+**用户名:密码**的 Base64 编码。
将凭证<credentials>部分进行 Base64 编码，然后再拼接字符串'Basic '，就可以生成基础验证方案。
因为 DOMString  是 16 位编码的字符串，如果有字符超出了 8 位 ASCII 编码的字符范围时，在大多数的浏览器中对 Unicode 字符串调用  window.btoa 将会造成一个  Character Out Of Range  的异常。
所以下列方法将 UTF-16 的  DOMStrin  转码为 UTF-8 的字符数组然后再编码。

# 方法一: btoa()

js 原生方法 btoa()实现

```
 //base64，js原生方法btoa()实现
  function b64EncodeUnicode(str) {
       return btoa(encodeURIComponent(str).replace(/%([0-9A-F]{2})/g,
                         function(match, p1) {
                              return String.fromCharCode('0x' + p1);
                         }));
  }
```

# 方法二：转码函数

base64 编码方法

```
/* Copyright (C) 1999 Masanao Izumo <iz@onicos.co.jp>
* Version: 1.0
* LastModified: Dec 25 1999
* This library is free. You can redistribute it and/or modify it.
*/
/*
* Interfaces:
* b64 = base64encode(data);
* data = base64decode(b64);
*/

var base64EncodeChars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";
var base64DecodeChars = new Array(
    -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1,
    -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1,
    -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, 62, -1, -1, -1, 63,
    52, 53, 54, 55, 56, 57, 58, 59, 60, 61, -1, -1, -1, -1, -1, -1,
    -1, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14,
    15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, -1, -1, -1, -1, -1,
    -1, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 36, 37, 38, 39, 40,
    41, 42, 43, 44, 45, 46, 47, 48, 49, 50, 51, -1, -1, -1, -1, -1);
function base64encode(str) {
    var out, i, len;
    var c1, c2, c3;
    len = str.length;
    i = 0;
    out = "";
    while (i < len) {
        c1 = str.charCodeAt(i++) & 0xff;
        if (i == len) {
            out += base64EncodeChars.charAt(c1 >> 2);
            out += base64EncodeChars.charAt((c1 & 0x3) << 4);
            out += "==";
            break;
        }
        c2 = str.charCodeAt(i++);
        if (i == len) {
            out += base64EncodeChars.charAt(c1 >> 2);
            out += base64EncodeChars.charAt(((c1 & 0x3) << 4) | ((c2 & 0xF0) >> 4));
            out += base64EncodeChars.charAt((c2 & 0xF) << 2);
            out += "=";
            break;
        }
        c3 = str.charCodeAt(i++);
        out += base64EncodeChars.charAt(c1 >> 2);
        out += base64EncodeChars.charAt(((c1 & 0x3) << 4) | ((c2 & 0xF0) >> 4));
        out += base64EncodeChars.charAt(((c2 & 0xF) << 2) | ((c3 & 0xC0) >> 6));
        out += base64EncodeChars.charAt(c3 & 0x3F);
    }
    return out;
}
function base64decode(str) {
    var c1, c2, c3, c4;
    var i, len, out;
    len = str.length;
    i = 0;
    out = "";
    while (i < len) {
        /* c1 */
        do {
            c1 = base64DecodeChars[str.charCodeAt(i++) & 0xff];
        } while (i < len && c1 == -1);
        if (c1 == -1)
            break;
        /* c2 */
        do {
            c2 = base64DecodeChars[str.charCodeAt(i++) & 0xff];
        } while (i < len && c2 == -1);
        if (c2 == -1)
            break;
        out += String.fromCharCode((c1 << 2) | ((c2 & 0x30) >> 4));
        /* c3 */
        do {
            c3 = str.charCodeAt(i++) & 0xff;
            if (c3 == 61)
                return out;
            c3 = base64DecodeChars[c3];
        } while (i < len && c3 == -1);
        if (c3 == -1)
            break;
        out += String.fromCharCode(((c2 & 0XF) << 4) | ((c3 & 0x3C) >> 2));
        /* c4 */
        do {
            c4 = str.charCodeAt(i++) & 0xff;
            if (c4 == 61)
                return out;
            c4 = base64DecodeChars[c4];
        } while (i < len && c4 == -1);
        if (c4 == -1)
            break;
        out += String.fromCharCode(((c3 & 0x03) << 6) | c4);
    }
    return out;
}

```

将 UTF-16 的  DOMString  转码成 UTF-8 的字符串进行 base64 编码

    sEncoded=base64encode(utf16to8(str));

# 验证

使用**eoLinker**发送 Basic Auth，输入用户名 scar 密码 123456
![使用eoLinker的Basic验证](http://images.scar.site/20220224090828.png)

**PS:** eoLinker 是一个很好用的接口管理网站，前端测试很方便
![请求头Auth](http://images.scar.site/20220224090837.png)

在 JS Bin 运行后，发现和 eoLinker 结果一致，成功！！
![JS Bin结果](http://images.scar.site/20220224090846.png)
[方法一 JS Bin 示例](http://jsbin.com/qimeviy)
[方法二 JS Bin 示例](http://jsbin.com/nuboyow/)

# 资料

[Authorization](https://developer.mozilla.org/zh-CN/docs/Web/HTTP/Headers/Authorization)
[Authentication](https://developer.mozilla.org/zh-CN/docs/Web/HTTP/Authentication)
[Javascript base64](http://www.webtoolkit.info/javascript-base64.html#.Wdn_0GiCzIV)
[Base64 的编码与解码](https://developer.mozilla.org/zh-CN/docs/Web/API/WindowBase64/Base64_encoding_and_decoding)
[Base64 笔记-阮一峰老师](http://www.ruanyifeng.com/blog/2008/06/base64.html)
[btoa 方法](https://developer.mozilla.org/zh-CN/docs/Web/API/WindowBase64/btoa)
