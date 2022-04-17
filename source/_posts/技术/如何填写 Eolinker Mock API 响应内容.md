---
title: 如何填写 Eolinker  Mock API 响应内容
date: 2020/07/21 12:18
description:
categories: 技术
---

上篇文档-[如何使用 Mock](https://juejin.im/post/6844904202607525896) 提到我们公司使用 Eolinker 管理 Mock，本文详细说明 Eolinker Mock 写法以及每种方式的适用场景。
![](http://images.scar.site/20220224233050.png)
首先让我们来看看如下示例在 Eolinker 三种格式里面分别需要怎么写。

```
Mock.mock({
 "string|1-10": "★",//随机生成 1-10 个字符串"★"
 "string2|3": "★",//固定生成 3 个字符串"★"
 "number|+1": 202,//每次请求自增 1,初始值为 202
 "number2|1-100.1-10": 1,//生成一个浮点数，整数部分1-100，小数部分保留1-10 位。。
 "boolean|1-2": true,//值为 true 的概率是 1/(1+2)，值为 false 的概率同样是 2/3。
 "regexp": /[a-z][A-Z][0-9]/,//随机生成满足正则的字符串
 "object|2": {
   "310000": "上海市",
   "320000": "江苏省",
   "440000":"广东省"
 },//对象中随机选取 2 个属性，生成对象
 "array|1": [ "AMD","CMD"],//数组中随机选取 1 个元素，最终生成值
 "arrayRepeat|3": ["AMD","CMD"],//重复数组元素 3 次，最终生成数组
 "date":"@date"//生成随机日期
})
```

![](http://images.scar.site/20220222231633.png)
上文提到过，Mock 数据模板定义规范由属性名，生成规则以及属性值组成，其中属性值可以是不同类型的值，也可以是 Mock 官方提供生成常见格式（例如日期）的占位符。

### JSON 编辑器

JSON 编辑器，快速生成随机值，可以导入文档的返回参数结构。我们只需要把 Mock 规则相应位置的值填入表单，如下图：
![](http://images.scar.site/20220224233301.png)
预览生成值
![](http://images.scar.site/20220224233253.png)

需要注意的是，Eolinker 的 Mock 比我们平时写的 Mock.mock 多了一个类型，他指的是什么类型呢？

例如 "array|1": [ "AMD","CMD"]，生成的值为 "AMD" 或者
"CMD"，我们在表单里选择的是 [array],所以类型指 Mock 规则中属性值的类型。

### raw

raw 类型每次请求都返回 **Raw 编辑器填写的内容**，如果不要求随机数据，可以使用 Raw。
![](https://p1-jj.byteimg.com/tos-cn-i-t2oaga2asx/gold-user-assets/2020/7/21/1736ed1c239de619~tplv-t2oaga2asx-image.image)

### Javascript

JavaScript 内置 Mock 语法 1.可以生成复杂的数据，例如多个数据之间有数据关联：属性 c=属性 a+属性 b， 2.可以生成与 API 请求有关的数据，Eolinker 内置 url、请求头部、请求体参数等对象。
最后使用 return 语句返回生成的对象。
![](http://images.scar.site/20220224233326.png)

![](http://images.scar.site/20220224233344.png)
