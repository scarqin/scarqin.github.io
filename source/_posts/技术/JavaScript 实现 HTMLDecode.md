---
title: JavaScript 实现 HTMLDecode
date: 2021/03/24 08:59
description:
categories: 技术
---

## 背景

最近公司有个格式整理的需求，需要将转义序列 `\&#x4F60;\&#x597D;` 转换为中文。

## &# 是什么？

`HTML`、`XML` 等 `SGML` 类语言的转义序列（escape sequence），它们不是「编码」。

```html
&#x4e2d;&#x56fd;<!--中国-->
&#20013;&#22269;<!--中国-->
```

这种转义序列叫 `numeric character reference（NCR）`。

格式为 &# 拼接 `Unicode code point`，有两种：

- 以「&#」开头的后接十进制数字
- 以「&#x」开头的后接十六进制数字。

例如 「中国」二字分别是 Unicode 字符 U+4E2D 和 U+56FD，十六进制表示的 code point 数值「4E2D」和「56FD」就是十进制的「20013」和「22269」，所以上面两种 NCR 写法都会在显示时转换为「中国」二字。

## 实现

### 1. 通过浏览器

```javascript
function decodeHtml(html) {
  var txt = document.createElement("textarea");
  txt.innerHTML = html;
  return txt.value;
}
```

### 2. he 库

通过浏览器 HTMLDecode 在不同浏览器表现可能有差异。

可以使用这个符合 HTML 规范的库 [he](https://github.com/mathiasbynens/he)。
HTMLEncode/HTMLDecode

### 3. 根据转义规则简单实现替换中文

我们公司只需要替换中文部分，所以我使用下面函数就能实现。

```javascript
function decodeHtml(str) {
  return str
    .replace(/&#([xX][0-9a-fA-F]+);/g, function (match, dec) {
      return String.fromCharCode("0" + dec);
    })
    .replace(/&#(\d+);/g, function (match, dec) {
      return String.fromCharCode(dec);
    });
}
```

## 资料

- [What's the right way to decode a string that has special HTML entities in it](https://stackoverflow.com/questions/7394748/whats-the-right-way-to-decode-a-string-that-has-special-html-entities-in-it)

- [&#x 开头的是什么编码呢?](https://www.zhihu.com/question/21390312/answer/18091465)
