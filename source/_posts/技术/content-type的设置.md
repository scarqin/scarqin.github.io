---
title: content-type 的设置
date: 2017.03.22 19:03:48
description:
categories: 技术
---

![引用jquery ajax](https://raw.githubusercontent.com/scarqin/imageshack/main/images/20220223234403.png)
**他的作用是告诉服务器，浏览器发来了什么数据。**一般情况下，我们不需要设置它。默认值为'application/x-www-form-urlencoded; charset=UTF-8')；
上传文件时，使用 jquery 的同学知道，我们会将 content-type 设置成 flase

```
$.ajax({
...
  processData: false,
  contentType: false,
...
})
```

咦，请求一发送
![request headers1](https://raw.githubusercontent.com/scarqin/imageshack/main/images/20220223234419.png)

content-type 自动设置成了

```
Content-Type:multipart/form-data; boundary=----WebKitFormBoundarynXvTC1AHtFbVvKTL
// WebKitFormBoundarynXvTC1AHtFbVvKTL这是随机生成的分界符
//目的是防止上传文件中出现分界符导致服务器无法正确识别文件起始位置
```

如果不给 ajax 设置 contType，ajax 会自动发送什么 request headers 呢？

![request headers2](https://raw.githubusercontent.com/scarqin/imageshack/main/images/20220223234430.png)
发现这是默认的 request-headers，可知 jquery 的 ajax 的设置机制为若没有 content-type 属性，则默认设置为
`application/x-www-form-urlencoded; charset=UTF-8`
**contentType: false 设置的目的是让 ajax 不要操作 content-type**

参考资料

- [ajax](http://api.jquery.com/jquery.ajax/)
- [浅谈 contentType = false](https://segmentfault.com/a/1190000007207128)--fisecoco
