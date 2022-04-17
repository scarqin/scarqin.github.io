---
title: Mock 能做什么
date: 2020/6/30 12:14:00
description: 
categories: 技术
---
## Mock 能做什么？

### 1.API 没开发好，使用 Mock 快速对接

在产品经理发布需求后，前后端同学先根据功能需求出一份 API 文档，然后再按照 API 文档并行开发。

不依赖后端提供数据的情况下，如何让前端独立于后端进行开发呢？

使用 Mock,你可以在开发环境代码内置 Mock，拦截请求，模拟真实 API 返回。如果公司使用了接口管理平台，文档发布的时候可以还通过平台生成 Mock API 直接对接。

### 2.为测试提供数据

使用Mock 假数据替代我们想控制但控制困难的部分

例如:

* 某些 API 依赖其他 API 的返回值，使用 Mock 方便的对返回值进行改变，测试不同场景下 API 的表现。
* 某个 API 特别慢，可以暂时用 Mock 代替它，快速调通整个场景测试流程。

### 3.方便快速建立功能原型

敏捷开发过程中，调整需求是很常见的。通过 Mock 可以快速建立功能原型，直观的看到业务逻辑，方便产品调整需求，还可以使用假数据对系统进行演示。

## Mock 部署

记录以下三种方案，各有千秋。

### 1.将 Mock 写到代码变量中，哪里需要写哪里

例如
![](http://images.scar.site/20220222224109.png)

**优点**

* 成本低，使用简单，只需要学习 Mock.js 模板语法。
* 不受网络影响。
* 改动 Mock 能够快速看到效果。

**缺点**

* Mock 代码与业务代码耦合高，上线容易遗漏测试代码，为代码偷偷埋下一颗地雷。
* 无法快速响应文档改动，保持 Mock 返回数据与文档一致。
* 只有前端开发人员能用到 Mock，无法与其他部门人员协同工作。
* 没有 API 请求，不够真实。

### 2. [Mock.js 拦截请求](https://juejin.im/post/5b0becb96fb9a009d429b505#heading-14)

使用 Mock.mock 函数拦截请求

```javascript
var data = Mock.mock("https://www.baidu.com", {
    "string|1-10": "★", //随机生成 1-10 个字符串"★"
})
var request = new XMLHttpRequest();
request.open("GET", "https://www.baidu.com", true);
request.send();
request.onreadystatechange = function () {
    if (request.readyState === 4 && request.status === 200) {
        console.log(request.responseText)
    }
}
```

控制台输出

![](http://images.scar.site/20220222223833.png)

**优点**

* 成本低，使用简单，学习 Mock.js 模板语法、 Mock.mock 函数。
* 不受网络影响。
* 改动 Mock 能够快速看到效果。

**缺点**

* 对于 RESTful 风格的 API，需要写正则匹配请求地址。
* Mock 代码与业务代码仍存在耦合，可以独立一个 Mock 文件夹，上线构建时不打包进业务代码。
* 无法快速响应文档改动，保持 Mock返回数据与文档一致；
* API 请求被 Mock 拦截，没有实际发送，不够真实。
* 只有前端开发人员能用到 Mock，无法与其他部门人员协同工作。

### 3. Mock Server

和实际请求 HTTP API 没有区别，API 的响应值不是真实从数据库获取的数据，而是 Mock 生成的假数据。

> 一般是后端人员维护 Mock Server，他们改动 API 的时候同步改动 mock，前端不用考虑 Mock，只需要变更请求地址。

**优点**

* 维护文档的人员可以维护 Mock，文档改动同时改动 Mock，响应迅速！
* 协同方便，测试人员可以利用开发建立的 Mock 提前建立单元测试。
* 使用工具的话可以通过用户界面管理 Mock 数据。

**缺点**

* 需要花钱（部署服务器的钱或者 Sass 付费）
* 需要选择靠谱的工具，否则使用工具的提高的效率跟不上你帮工具找 Bug 的速率
* 额外管理 Mock Server，前端无法快速改变 Mock 值。

#### 自己搭建

针对各种语言的部署方案教程丰富，例子不举了，自个儿搜。

#### 平台部署

**[Eolinker](https://help.eolinker.com/#/tutorial/?groupID=c-441&productID=13)**

在线网站，无需部署。免费版本支持 3 人协作，超过 3 人需要开通付费版。

可以管理 API 文档，系统提供的 Mock 功能通过 API 文档返回值信息快速生成随机数据。支持设置触发条件（请求头、请求体），根据不同的触发条件得到不同的返回值。

**[Easy Mock](https://github.com/easy-mock/easy-mock/blob/dev/README.zh-CN.md)**

没使用过，支持在线（在线版本可能不够稳定），也支持本地部署。

## Mock 数据生成规范

可以通过两种方式告诉  Mock 如何生成数据，一种是自定义规则的数据模板，一种是占位符，提供一些常见的随机值，例如·**图片、邮箱、人名**等。

### 1.数据模板定义规范（Data Template Definition，DTD）

先看一个示例，Mock.mock 函数根据相应的数据模板生成相应 JSON。

```javascript
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

 生成结果

```json
 {
  "string": "★★",
  "string2": "★★★",
  "number": 202,
  "number2": 71.73566,
  "boolean":true,
  "regexp": "qS8",
  "absolutePath": "★★ demo",
  "object": {
    "310000": "上海市",
    "440000": "广东省"
  },
  "array": "AMD",
  "arrayRepeat": ["AMD","CMD", "AMD","CMD",AMD","CMD"],
  "date":"1980-12-19"
}
```

![](http://images.scar.site/20220222231633.png)
数据模板中的每个属性由 3 部分构成：属性名、生成规则、属性值：

```javascript
// '属性名|生成规则':属性值
'name|rule': value
```

针对不同的属性值，生成规则的意义也不一样，有的生成规则是概率（Boolean），有的生成规则是重复。具体的意义可以查阅 [Mock.js 官方文档](https://github.com/nuysoft/Mock/wiki/Syntax-Specification)

### 2.数据占位符定义规范（Data Placeholder Definition，DPD）

占位符是 mock 提供一些常用的随机数据例如随机生成的**图片、邮箱、人名**等。

#### 用法1: 直接使用

```javascript
Mock.mock('@date')//1982-10-15
Mock.Random.date()//1997-12-31
```

#### 用法2: 在数据模板中使用

```javascript
 Mock.mock({
  "date":"@date",//随机日期
  "float":"@float",//随机浮点数
  "name":"xxxx",//固定值
  "quoteStrin1": "@name",//引用其他属性
  "user": {
    "name": "demo"
  },//固定值
  "quoteString": "@user/name",//引用其他属性
 })
```

```json
{
    "date":"2020-06-29",
    "float":2202285915843574.5,
    "name":"xxxx",
    "quoteStrin1":"xxxx",
    "user ":{
       "name":"demo"
    },
    "quoteString":"demo"
}
```


> 需要注意，如果引用的属性名和 Mock 占位符名称一样（上面例子中的 quoteStrin1），引用值优先级比占位符高，所以最后 quoteStrin1 属性值与属性 name 的属性值一致,而不是占位符生成的值(Paul Miller)。

## Mock 函数

### 1.Mock.mock

拦截请求，生成模拟数据

```javascript
var data = Mock.mock("https://www.baidu.com", {
    "string|1-10": "★", //随机生成 1-10 个字符串"★"
})
var request = new XMLHttpRequest();
request.open("GET", "https://www.baidu.com", true);
request.send();
request.onreadystatechange = function () {
    if (request.readyState === 4 && request.status === 200) {
        console.log(request.responseText)
    }
}
```

直接生成模拟数据

```javascript
var data = Mock.mock("https://www.baidu.com", {
    "string|1-10": "★", //随机生成 1-10 个字符串"★"
})
//{"string":"★★"}
```

### 3.Mock.Random

Mock.Random 是一个工具类，用于生成各种随机数据。
Mock.Random 提供的完整方法如下:
|类型|方法|备注|
---|---|---|
Basic|    boolean, natural, integer, float, character, string, range
Date|date,time, datetime, now
Image|    image, dataImage|生成图片地址
Color|    color,hex,rgb,rgba,hsl
Text|    paragraph, sentence, word, title, cparagraph, csentence, cword, ctitle
Name|first, last, name, cfirst, clast, cname
Web|url, domain,protocol, email, ip, tld
Address| region,province,city,county,zip
Helper|capitalize, upper, lower, pick, shuffle|方法，Mock.mock('@lower("HELLO")')->hello
Miscellaneous|uuid,guid, id,increment

还可以使用 Random.extend 拓展占位符，官网示例：

```javascript
Random.extend({
    constellation: function(date) {
        var constellations = ['白羊座', '金牛座', '双子座', '巨蟹座', '狮子座', '处女座', '天秤座', '天蝎座', '射手座', '摩羯座', '水瓶座', '双鱼座']
        return this.pick(constellations)
    }
})
Random.constellation()
// => "水瓶座"
Mock.mock('@CONSTELLATION')
// => "天蝎座"
Mock.mock({
    constellation: '@CONSTELLATION'
})
// => { constellation: "射手座" }
```

## 参考资料

* [Mock.js 文档](http://mockjs.com/examples.html)
* [No API? No Problem! Rapid Development via Mock APIs-Cory House](https://medium.com/@housecor/rapid-development-via-mock-apis-e559087be066)
* [莫池宇-你是如何构建 Web 前端 Mock Server 的？](https://www.zhihu.com/question/35436669)
