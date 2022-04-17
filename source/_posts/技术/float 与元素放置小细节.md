---
title: float 与元素放置小细节
date: 2015/12/29 00:48:00
description:
categories: 技术
---

今日队友问我一问题，浮动的位置关系。具体如下图

## 浮动元素放置问题

<!--more-->

![浮动问题图1](https://images.scar.site/20220223000617.png)

```html
<div class="box1"></div>
//深灰色
<div class="box2">
  <div class="left"></div>
  //浅灰色
  <div class="no-float"></div>
  //被left覆盖
  <div class="right"></div>
  //米黄色
</div>
```

.right 的盒子已经被挤压到下一行了，明显不是宽度问题。经过调试发现。是．no-float 是块级元素，占了一整行。在给 no-float 添加 inline-block 后发现
![浮动问题图2](https://images.scar.site/20220223000717.png)

此时的.right 到了浮动层
[浮动就是个带有方位的 display:inline-block 属性--张鑫旭](http://www.zhangxinxu.com/wordpress/2010/01/css-float浮动的深入研究、详解及拓展一)
似乎在 html 中放在前面的浮动元素才会脱离文档流继而覆盖其他未浮动元素

解决方案
浮动块和浮动块放在一起，才可以浮动在同一个文档流上。

## 清除浮动

设置浮动元素时，父元素不能随着浮动元素的增大而增大
![错误图](https://images.scar.site/20220223000733.png)
![html](https://images.scar.site/20220223000750.png)

背景颜色为是灰色，可以看出右边浮动的元素超出了 main 盒子
我想要的效果
![](https://images.scar.site/20220223000825.png)
所以此刻就要清除浮动啦~

[清除浮动最好方法](http://stackoverflow.com/questions/211383/which-method-of-clearfix-is-best)

- \<br clear="all"/>
- overflow:auto
- overflow:hidden

在上文基础上添加一个方法

- 在浮动元素后加伪类 ::after

```css
.container::after {
  content: "";
  display: block;
  clear: both;
}
```

最终使用了

```
<br clear="all">
```

br 标签会产生换行，默认有个最小高度。如果要改变 br 的高度
写法如下。google 中最小高度为 25px。

```html
<br clear="all" style="display:inline;line-height=25px" />
```
