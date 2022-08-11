---
title: JavaScript 日期操作我不知道的事情
date: 2020/9/18 08:53:25
description:
categories: 技术
---

平时对 Date 很多内容都一知半解，每次一用到 Date 就需要查资料，着实恼火。
故此文记录关于 JS 日期操作那些我不知道的事。

<!--more-->

# 基础问题

## **Date.prototype.getTime()** 返回的数字是什么？

官方对getTime 函数对定义是

> The getTime() method returns the number of milliseconds* since the Unix Epoch

getTime() 函数返回从 Unix Epoch 开始到当前 Date 所指时间经过的毫秒数。

Unix Epoch 是什么呢？

> 1970年1月1日（UTC/GMT的午夜）

所以 getTime() 返回的数字是**从 1970年1月1日0时0分0秒开始到当前 Date 对象所指时间所经过的毫秒数**。

例如：
![20220222232110](https://images.scar.site/20220222232110.png)
getTime() 和你所在的时区也有关系，我国的标准时间是北京时间，在东八区，所以比英国格林威治时间（GMT）的 0 时区晚 8 个小时。所以我定义的 1970年1月1日使用 getTime 函数得到 -2880000,即 8 小时。

## GMT 和 UTC 是什么，有什么区别？

GMT（格林尼治标准时间） 和 UTC（协调世界时） 是计算世界时间的两种标准。

GMT 根据地球的自转和公转来计算时间，也就是太阳每天经过位于英国伦敦郊区的皇家格林威治天文台的时间就是中午12点。UTC是根据原子钟来计算时间，目前世界上最精确的原子钟50亿年才会误差1秒。因为地球的自传正在缓速变慢，会导致 GMT 计算有误差，所以 UTC 比 GMT 更加精确。UTC 时间被认为能与GMT 时间互换，但 GMT 时间已不再被科学界所确定。

PS:两个都是 0 时区的时间，例如：UTC +8 = 北京时间。

## **Date.getMonth()** 为什么要从 0 开始

谁能想到这是 Java 埋的坑，因为 Javascript 的 Date 实现方案是 JDK1.0 的方案，所以坑也一样。
Javascript 之父用一句 Make It Look Like Java 调侃了这个坑也告诉了我们答![20220222232120](https://images.scar.site/20220222232120.png)案。

问题来了，Java 获取月份为什么要从 0 开始呢？

* 说法 1: 可能是因为旧的 C 语言日期 API 是这样的，那么旧的 C 语言日期 API 为什么是这样呢？...不套娃了。
* 说法 2:计算机里面所有东西都从 0 开始
* 说法 3:从 0 开始做月份计算更加容易

例如 12 月的下一个月份是 1 月，不过为了计算出 1 月你会做以下计算：

```javascript
12 + 1 = 13 // 13 月是哪个月?
```

我们可以用 12 取余快速修复上面的问题

```javascript
(12 + 1) % 12 = 1
```

但是当遇到 11 月的时候...

```javascript
(11 + 1) % 12 = 0 // 0 月是哪个月?
```

您可以在添加月份之前先减去1，然后再进行取余运算，最后再加1，就可以修复上面的问题...也可以解决这个“基本问题”。

```javascript
((11 - 1 + 1) % 12) + 1 = 12 // 许多神奇的数字！
```

现在我们来看看如果月份的数字是 0 - 11，会有什么问题？

```javascript
(0 + 1) % 12 = 1 // February
(1 + 1) % 12 = 2 // March
(2 + 1) % 12 = 3 // April
(3 + 1) % 12 = 4 // May
(4 + 1) % 12 = 5 // June
(5 + 1) % 12 = 6 // July
(6 + 1) % 12 = 7 // August
(7 + 1) % 12 = 8 // September
(8 + 1) % 12 = 9 // October
(9 + 1) % 12 = 10 // November
(10 + 1) % 12 = 11 // December
(11 + 1) % 12 = 0 // January
```

所有月份的表现一致，无需较复杂的解决方案。

## 时间戳是什么？

常指 unix 时间戳，上文提到过：从1970年1月1日（UTC/GMT的午夜）开始所经过的秒数。
获取时间戳的代码：

```javascript
Math.round(new Date().getTime()/1000)
```

# 常用方法

## 定义时间的方法

### 传入时间格式的字符串

```javascript
new Date('September 11, 1995 03:24:00')
new Date('1995-09-11T03:24:00')
new Date('Mon Sep 11 1995')
```

> 不同的浏览器实现有差异，强烈不建议使用字符串初始化/解析日期。建议使用传入数字初始化日期对象。相同的浏览器针对不同的定义方式也有些许差异。

例子1：

```javascript
new Date(Date.parse("Jul 8, 2005"));//Fri Jul 08 2005 00:00:00 GMT+0800 (China Standard Time)
new Date(Date.parse("2005-07-08"));//Fri Jul 08 2005 08:00:00 GMT+0800 (China Standard Time)
```

例子2:在 2020年以前的，Firefox 和 Chrome 针对以下代码实现有差异。

```javascript
Date.parse('1970-01-01T00:00:00Z');       // Chrome: 0         FF: 0
Date.parse('1970-01-01T00:00:00-0500');   // Chrome:18000000  FF: 18000000
Date.parse('1970-01-01T00:00:00');        // Chrome: 0 FF: -28800000
```

![](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/460e12b0d69a4c9aab4bd42294d7c045~tplv-k3u1fbpfcp-zoom-1.image)

### 传入多个时间单位的数字

```javascript
new Date(1995, 8, 11)//注意，月份需要减 1，例如定义 9 月，第二个月份参数需要传 8
new Date(1995, 8, 11, 3, 24, 0)
```

### 传入 Unix 时间戳

```javascript
new Date(810761040000) //Mon Sep 11 1995 03:24:00 GMT+0800 (China Standard Time)
```

## 时间的加减法

### 减法

首先，需要将你的日期转化为 Date 对象，然后直接使用加减符号计算差。得到的结果是和或差的毫秒数，再将毫秒转化成你需要的格式。例如 2020-01-01 和 2020-01-02 差多久？

```javascript
new Date(2020,0,2)-new Date(2020,0,1)//86400000[ms]
```

如果结果是要计算差多少天，即是 86400000 除以 1000得到秒数，再除以 60 得到分钟数，以此类推。

```javascript
86400000/1000/60/60/24 //1
```

### 加法

两个 Date 相减能得到毫秒，那理所当然地某个 Date 加上毫秒数就可以等于另一个日期了。例如 2020-01-01 加上 86400000 毫秒，就等于 2020-01-02
No！No！No！

```javascript
new Date(2020,0,1)+86400000 
//Wed Jan 01 2020 00:00:00 GMT+0800 (China Standard Time)86400000
```

我还是太年轻了，跨类型的两个对象，强行加在一起，不甜。

#### 1.转换成数字相加

将 new Date(2020,0,1) 转换成毫秒，来到整形的世界，快乐地计算。

```javascript
(new Date(2020,0,1).getTime()+86400000) 
//Thu Jan 02 2020 00:00:00 GMT+0800 (China Standard Time)
```

#### 2.使用 JS 内置方法

加减年、月、日、时、分、秒。例如：

```javascript
var date=new Date(2020,0,1);
date.setDate(date.getDate()+1)
//date:Thu Jan 02 2020 00:00:00 GMT+0800 (China Standard Time)
```

不同的时间单位的加法使用的方法不同，可以根据下表选择对应的方法。

单位|获取时间|设置时间|例子|
|---|---|---|---|
|秒|getSeconds|setSeconds|date.setSeconds(date.getSeconds()+1)|
|分|getMinutes|setMinutes|date.setMinutes(date.getMinutes()+1)|
|时|getHours|setHours|date.setHours(date.getHours()+1)|
|日|getDate|setDate|date.setDate(date.getDate()+1)|
|周|setFullYear|getFullYear|date.setFullYear(date.getFullYear() + x)|
|月|getMonth|setMonth|date.setMonth(date.getMonth()+1)|
|年|setFullYear|getFullYear|date.setFullYear(date.getFullYear() + x)|

## 比较时间的大小

获取毫秒数，进行数字大小的比较。

```javascript
new Date(2020,0,1).getTime()>=new Date(2020,0,1).getTime() //true
```

## 获取不同格式的当前时间

### toString()

```javascript
new Date().toString();
//Fri Sep 18 2020 00:18:59 GMT+0800 (China Standard Time)"
```

### toLocaleString()

```javascript
new Date().toLocaleString();
// 9/18/2020, 12:18:16 AM
```

### toUTCString()/toGMTString()

```javascript
new Date().toUTCString();
new Date().toGMTString();
//Thu, 17 Sep 2020 16:10:04 GMT
```

> GMT 已经不被推荐使用了，原因在上文提到过：UTC 比 GMT 精确。

### toISOString()

```javascript
new Date().toISOString();
//2020-09-17T16:20:06.419Z
```

返回 ISO 格式 ([ISO 8601](https://zh.wikipedia.org/wiki/ISO_8601))的日期。

ISO 格式日期的规则是生成格式为 **YYYY-MM-DDTHH:mm:ss.sssZ** 或者 **±YYYYYY-MM-DDTHH:mm:ss.sssZ** 的**24 位到 27 位**字符串。

YYYY-MM-DD**T**HH:mm:ss.sssZ 里面的 T  是分隔日期和时间的符号。

YYYY-MM-DDTHH:mm:ss.sss**Z** 里面的 Z 是时区的占位符，可以不写时区用 Z 代替是 0 时区，也可以使用 2020-09-17T00:20:06+08:00 代表东八区。

## 资料

* [MDN-Date](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Date/toGMTString)
* [知乎-UTC和GMT什么关系？](https://www.zhihu.com/question/27052407)
* [知乎-JavaScript中的Date对象取值month为什么是从0开始的？](https://www.zhihu.com/question/263804983)
* [stackoverflow-why-is-january-month-0-in-java-calendar](https://stackoverflow.com/questions/344380/why-is-january-month-0-in-java-calendar)
