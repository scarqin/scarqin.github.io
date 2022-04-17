---
title: Jquery ContentType的设置
date: 2017/03/22 19:03:48
description:
categories: 技术
---

### content-type 的作用

他的作用是告诉服务器，浏览器发来了什么数据。
![引用jquery ajax](http://images.scar.site/20220223234403.png)
一般情况下，我们不需要设置它。默认值为`application/x-www-form-urlencoded; charset=UTF-8')`

上传文件时，使用 Jquery 的同学知道，我们会将 contentType 设置成 flase

```
$.ajax({
...
  processData: false,
  contentType: false,
...
})
```

咦，请求一发送
![request headers1](http://images.scar.site/20220223234419.png)

content-type 自动设置成了

```
Content-Type:multipart/form-data; boundary=----WebKitFormBoundarynXvTC1AHtFbVvKTL
```

WebKitFormBoundarynXvTC1AHtFbVvKTL 这是随机生成的分界符

目的是防止上传文件中出现分界符导致服务器无法正确识别文件起始位置
如果不给 Ajax 设置 contentType，Ajax 会自动发送什么 content-type 呢？

![request headers2](http://images.scar.site/20220223234430.png)

发现这是默认的 content-type，可知 Jquery 的 ajax 的设置机制为若没有 content-type 属性，则默认设置为
`application/x-www-form-urlencoded; charset=UTF-8`

设置`contentType: false`的目的是让 Ajax 不要操作 content-type

### 参考资料

- [ajax](http://api.jquery.com/jquery.ajax/)
- [fisecoco--浅谈 contentType = false](https://segmentfault.com/a/1190000007207128)
