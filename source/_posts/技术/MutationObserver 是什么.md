---
title: MutationObserver 详解
date: 2020/5/9 20:46:25
description: 
categories: 技术
---
## MutationObserver 是什么

MutationObserver API 让我们能监听 DOM 树变化，该 API 设计用来替换掉在 DOM 3 事件规范中引入的 Mutation events。

Mutation events 是同步触发的，每次变动都会触发一次调用。MutationObserver API 是异步触发的， DOM 的变动并不会马上触发，而是要等到当前所有 DOM 操作都结束才触发。所以 MutationObserver 相比 Mutation events 性能要更高。

## 代码示例

```js
 // 某个需要被监控的 dom 元素。
var targetNode = document.getElementById('elem-id');

//配置 dom 的哪些改变会触发回调函数，详细见下文表格。
var mutationObserverInitConfig = { attributes: true, childList: true, subtree: true };

// dom 变化时触发的回调函数，传入 mutationsList：记录 dom 变化的对象数组。
var callback = function(mutationsList) {
    for(var mutation of mutationsList) {
            console.log( 'dom 变化啦！');
            youCoreFun();
    }
};

// 创建一个 MutationObserver 示例，传入回调函数
var observer = new MutationObserver(callback);

// 注册监控的节点、监控的事件
observer.observe(targetNode, mutationObserverInitConfig);

// 停止监控
observer.disconnect();
```

MutationObserver 允许我们订阅某个dom元素的某些事件变化：

## 初始化

```js
var callback = function(mutationsList) {
// mutationsList:数组类型的通知队列，其元素 MutationRecord 记录触发变化的详细信息。
// mutationsList：[MutationRecord,MutationRecord]
};
var observer = new MutationObserver(callback);
```

**MutationRecord**

每次 dom 变动都会触发通知，合理利用 MutationRecord 进行条件判断，避免执行不必要的 callback 操作。
| 属性 |  描述 |
|--- | --- |
|type|根据变动类型的不同，值可能性：attributes，characterData、childList
|target|触发通知的DOM节点
|addedNodes|被添加的节点
|removedNodes|被删除的节点
|previousSibling| 被添加或被删除的节点的前一个兄弟节点
|nextSibling|    被添加或被删除的节点的后一个兄弟节点
|attributeName|发生变更的属性的名称
|attributeNamespace|发生变更的属性的命名空间
|oldValue|果 type 为 characterData，则返回该节点变化之前的文本数据；如果 type为 childList，则返回 null

## 方法详解

### observe(dom,configObj)

```js
observer.observe(targetNode, {
    attributes: true,
    childList: true,
    subtree: true
});
```

调用 observe 后开始接收通知，触发初始化 MutationObserver 实例时传入的回调函数。

#### mutationObserverInit 字典

MutationObserver 配置信息，observe 函数的第二个入参，对象类型。

| 属性                    | 类型      | 描述                                        | 默认值   |
| --------------------- | ------- | ----------------------------------------- | ----- |
| childList             | Boolean | 观察子节点变动                                   | false |
| subtree               | Boolean | 观察所有后代节点的变动                               | false |
| attributes            | Boolean | 观察属性的变动                                   | false |
| attributeFilter       | Array   | 属性过滤器，例如：传入["status"]，仅在属性 status 变化时触发回调 | 无     |
| attributeOldValue     | Boolean | 是否记录 attributes 变动前的属性值                   | 无     |
| characterData         | Boolean | 观察字符数据的变化                                 | 无     |
| characterDataOldValue | Boolean | 是否记录 characterData 变动前的属性值                | 无     |

**注意**

* childList 和 subtree 指定了监视范围（子节点或者所有后代节点），attributes 和 characterData 配置是否在监视范围内监控目标节点属性、文本的变化。

* childList，attributes 或者 characterData 三个属性之中，至少有一个必须为 true，否则会抛出 TypeError 异常。

### disconnect()

```js
observer.disconnect();
```

告诉观察者停止观察变动。 可以通过调用其observe()方法来重用观察者。所有已经检测到但是尚未向观察者报告的变动都会被丢弃。

### takeRecords()

```js
observer.takeRecords();
```

除了被动等待变化事件通知，我们还可以使用 takeRecords 函数主动从 通知队列中拉取所有待处理的通知。

需要注意的是调用 takeRecords 函数后，通知队列为空，不会触发回调函数。

[takeRecords例子](https://gist.github.com/rufus2021/91c0443fa8bfee2a3cd5)

## 浏览器兼容性

![](https://raw.githubusercontent.com/scarqin/imageshack/main/images/20220222230235.png)
不兼容的浏览器可以使用旧 API [Mutation events](https://developer.mozilla.org/zh-CN/docs/Web/Guide/Events/Mutation_events) 作为替代方案。


## 参考资料

* [张鑫旭-聊聊JS DOM变化的监听检测与应用
  ](https://www.zhangxinxu.com/wordpress/2019/08/js-dom-mutation-observer/)
* [Santiago García da Rosa
  -JavaScript: MutationObserver](https://medium.com/better-programming/js-mutationobserver-1d7aed479da2)
* [MDN-MutationObserver](https://developer.mozilla.org/zh-CN/docs/Web/API/MutationObserver)
* [JavaScript 标准参考教程-Mutation Observer API](https://javascript.ruanyifeng.com/dom/mutationobserver.html#toc0)
* [逆葵-深入 MutationObserver](https://fecoding.cn/2016/09/08/learning-mutationobserver/)
