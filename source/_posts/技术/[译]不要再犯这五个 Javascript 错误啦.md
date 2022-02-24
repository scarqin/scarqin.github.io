---
title: 【译】不要再犯这五个 Javascript 错误啦
date: 2020/09/27 08:39
description:
categories: 技术
---
> - [原文地址](https://medium.com/the-dev-caf%C3%A9/stop-making-these-5-javascript-style-mistakes-7b352e1b47e3)
> - 原文作者：Giuseppe Picciano
> - 译者：scarqin

下文将列出五个让你的代码更加可读和易于维护小窍门。

![Photo by Author](https://raw.githubusercontent.com/scarqin/imageshack/main/images/20220224232545.png)

在编辑旧项目的时候，有没有遇到过那种一加新逻辑就“粉碎”的迷惑代码？我们当然都遇到过。
为了让世界上不可读的 `Javascript` 代码更少，我得给你们看看以下的五个例子 -- 我的耻辱柱。

## 使用数组解构获取函数的多个返回值

如果我们有一个返回多个值的函数,可以使用数组解构实现取值。代码如下：

```javascript
const func = () => {
  const a = 1;
  const b = 2;
  const c = 3;
  const d = 4;
  return [a, b, c, d];
};
const [a, b, c, d] = func();
console.log(a, b, c, d); // Outputs: 1,2,3,4
```

虽然上面的方法能实现赋值，但是它有一些副作用。

调用函数得到返回值 `a,b,c,d` 时，我们需要注意返回值返回的顺序。这里的一个小错误很可能就是你 debug 路上的梦魇。

除了需要注意顺序，我们还不能只获取想要的其中几个返回值，假如我只想要 `c,d` 呢？

```javascript
const func = () => {
  const a = 1;
  const b = 2;
  const c = 3;
  const d = 4;
  return { a, b, c, d };
};
const { c, d } = func();
```

我们可以使用对象解构赋值来代替它。

```javascript
const func = () => {
  const a = 1;
  const b = 2;
  const c = 3;
  const d = 4;
  return { a, b, c, d };
};
const { c, d } = func();
```

现在我们可以自由地选择需要哪些函数返回值。

以后就算函数增加了更多的返回值，对象解构的代码也可以不做任何变更,使代码更加稳定。

## 没有在函数入参使用对象解构

假设我们有一个入参是对象的函数，函数内代码需要使用到这个对象的属性。
一个幼稚的实现如下：

```javascript
// bad
function getDaysRemaining(subscription) {
  const startDate = subscription.startDate;
  const endDate = subscription.endDate;
  return endDate - startDate;
}
```

这个方案虽然满足了我们的需要，但是声明了两个没什么必要的临时引用变量 `startDate` 和 `endDate`。

一个更好的方案是使用对象解构在一行里面获取入参 `startDate` 和 `endDate`。

```javascript
// better
function getDaysRemaining(subscription) {
  const { startDate, endDate } = subscription;
  return startDate - endDate;
}
```

我们甚至可以直接在入参使用对象解构定义这两个变量。

```javascript
// even better
function getDaysRemaining({ startDate, endDate }) {
  return startDate - endDate;
}
Much more elegant wouldn’t you agree?
```

你难道不觉得这样实现更优雅吗？

## 不使用展开语法(...)拷贝数组

使用 `for` 循环遍历元素再拷贝到新数组除了繁琐还很丑陋。

使用展开语法可以让实现更加清晰和简洁。

```javascript
const stuff = [1, 2, 3];
// bad
const stuffCopyBad = [];
for (let i = 0; i < stuff.length; i++) {
  stuffCopyBad[i] = stuff[i];
}
// good
const stuffCopyGood = [...stuff];
```

## 使用 `Var `

使用 `const` 保证一个变量不能重新赋值，能够减少 bug 以及提高代码可读性。

```javascript
// bad
var x = "badX";
var y = "baxY";
// good
const x = "goodX";
const y = "goodX";
```

If you really need to reassign a variable, always prefer let over var .
如果真的需要对一个变量重新赋值，使用 `let` 代替 `var`。

`let` 作用于块作用域，而 `var` 作用于函数作用域。

块作用域使变量仅在定义它的代码块中有效，在块作用域外访问变量将会提示 [ReferenceError](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/ReferenceError)。

```javascript
for (let i = 0; i < 10; i++) {
  //something
}
print(i); // ReferenceError: i is not defined
```

定义在函数作用域的变量可以在定义它的函数范围内使用。

```javascript
for (var i = 0; i < 10; i++) {
  //something
}
console.log(i); // Outputs 10
```

`let`和`const`定义都变量都可以在块作用域访问到。

## 不使用模板字符串

手动拼接字符串写起来非常复杂，读起来很困惑。看例子：

```javascript
// bad
function printStartAndEndDate({ startDate, endDate }) {
  console.log("StartDate:" + startDate + ",EndDate:" + endDate);
}
```

模板字符串提供清晰和易读的在字符串插入变量的方法。

```javascript
// good
function printStartAndEndDate({ startDate, endDate }) {
  console.log(`StartDate: ${startDate}, EndDate: ${endDate}`);
}
```

模板字符串提供了也简单的方法换行，你只需要在键盘按下 `enter` 键，像你平时（在系统）使用一样。

```javascript
// prints on two lines
function printStartAndEndDate({ startDate, endDate }) {
  console.log(`StartDate: ${startDate}
  EndDate: ${endDate}`);
}
```
