---
title: CSS Footer固定到底部
date: 2016/06/09 15:30
description:
categories: 技术
---

## 你想要怎么放置你的 Footer？

### 风雨不动稳如狗

固定在可视窗口最底部，页面滚动也仍然固定在最底部。

### 能屈能伸

页面内容高度不确定，希望 Footer 放置在页面内容的最下方。
**[我是一个 demo](http://htmlpreview.github.io/?https://github.com/scarqin/footer-demo/blob/master/footer/method.html)**

_页面内容少，无法撑开，在可视窗口最底部_

![页面内容少](https://raw.githubusercontent.com/scarqin/imageshack/main/images/20220223224549.png)
_页面内容多，在页面最底部_
![页面内容多](https://raw.githubusercontent.com/scarqin/imageshack/main/images/20220223224606.png)

## 怎么做

你想要风雨不动稳如狗，使用下列代码：
```css
positon: fixed;
bottom: 0;
```

对于第二种能屈能伸的情况，你可以

### 1. 设置 min-height

```html
<div class="main"></div>
<footer class="footer">
  <p>© Scarqin</p>
  <a href="http://www.miitbeian.gov.cn/">粤ICP备15111480号-1</a>
</footer>
```

```css
html,
body {
  height: 100%;
}

.main {
  min-height: calc(100% - 58px); /*58px为footer的高度+margin*/
}
.footer {
  height: 58px;
}
```

### 2. .main[padding-bottom] 写法

```html
<div class="wrapper">
  <div class="main" id="main"></div>
</div>
<footer class="footer">
  <p>© Scarqin</p>
  <a href="http://www.miitbeian.gov.cn/">粤ICP备15111480号-1</a>
</footer>
```

```css
/*margin 写法*/
html,
body {
  height: 100%;
}

.main {
  min-height: 100%;
  margin: 0 auto -58px;
}

.main {
  padding-bottom: 58px;
}
```

### 3.wrapper：after 写法

```html
<div class="wrapper">
  <div class="main" id="main"></div>
</div>
<footer class="footer">
  <p>© Scarqin</p>
  <a href="http://www.miitbeian.gov.cn/">粤ICP备15111480号-1</a>
</footer>
```

```css
/*after 写法*/
html,
body {
  height: 100%;
}
.wrapper {
  min-height: 100%;
  margin-bottom: -58px;
}
.wrapper:after {
  content: "";
  display: block;
}
.footer,
.wrapper:after {
  height: 58px;
}
```

### 4. flex 布局

```html
<div class="main" id="main"></div>
<footer class="footer">
  <p>© Scarqin</p>
  <a href="http://www.miitbeian.gov.cn/">粤ICP备15111480号-1</a>
</footer>
```

```css
/*flex写法*/
body {
  display: flex;
  min-height: 100vh;
  flex-direction: column;
}

.main {
  flex: 1;
}
```

注意：vh 兼容性表，兼容性还不错，只是安卓 4.3 以下都不兼容。
![红色为不兼容 黄色为部分兼容 绿色为兼容](https://raw.githubusercontent.com/scarqin/imageshack/main/images/20220223224738.png)

### 5. Grid 布局

```html
<body class="body-grid">
  <div class="menu"></div>
  <div class="main" id="main"></div>
  <footer class="footer">
    <p>© Scarqin</p>
    <a href="http://www.miitbeian.gov.cn/">粤ICP备15111480号-1</a>
  </footer>
</body>
```

```css
.body-grid {
  display: grid;
  height: 100vh;
  grid-template-rows: auto 1fr auto;
  /*页面划分为三部分，menu 高度 auto,.main 占满整个高度,.footer 高度 auto。*/
}
```

兼容性不如 flex 布局，预计 95% 的用户能在遇到它时保证页面布局不出错。
![](https://raw.githubusercontent.com/scarqin/imageshack/main/images/20220223224754.png)

综上，如果内容多的话，不去捣鼓 footer 也行，当内容不确定的时候，上面方法可以一直保持在页面内容的最底部。

## 参考资料

- 设置 after （[**Sticky Footer**](https://css-tricks.com/snippets/css/sticky-footer/) 此插件实现原理）
- [用 CSS 固定 footer 在底部的疑问?](https://www.zhihu.com/question/23220983)
- [网页中的底部 foot 一般是如何定位的？](https://www.zhihu.com/question/35290742?f3fb8ead20=ade2a5e2273b54a8931defdc33010ec4)
- [caniuse -兼容性查询](http://caniuse.com/#info_about)
