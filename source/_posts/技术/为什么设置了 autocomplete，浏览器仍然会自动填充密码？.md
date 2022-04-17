---
title: 为什么设置了 autocomplete，浏览器仍然会自动填充密码？
date: 2021/06/14 19:06:00
description:
categories: 技术
---
> HTML autocomplete 属性可用于以文本或数字值作为输入的 \<input> 元素 ， \<textarea> 元素, \<select> 元素, 和\<form> 元素。

账号密码提示框：

![](http://images.scar.site/20220222234840.png)

平时我们使用 `autocomplete="off"` 取消浏览器自动填充的是文本提示，如图：

![](http://images.scar.site/20220222234557.png)

但是大多数浏览器中,设置了也无法阻止 `input[type=password]` 自动填充密码以及询问是否保存密码，如果对为何这样设定感兴趣可以看看 [the autocomplete attribute and login fields](https://developer.mozilla.org/zh-CN/docs/Web/Security/Securing_your_site/Turning_off_form_autocompletion#%E8%87%AA%E5%8A%A8%E5%A1%AB%E5%85%85%E5%B1%9E%E6%80%A7%E5%92%8C%E7%99%BB%E5%BD%95)。

除了让用户手动修改浏览器设置，我们应该如何从代码层面取消自动提示或隐藏密码提示框呢?

首先看看浏览器填充表单密码的机制（各浏览器机制有些许不同），以 Chrome 为例，机制如下：
* 此域名下保存过用户信息。
* 找到第一个 `input[type=password]`元素，填充密码； 再找到其上一个 `input[type=text]` 元素，填充用户名。

> 如果 input 元素 `display:none`，不填充信息，浏览器会继续往上找 `input[type=text]` 元素，`visibility:hidden` 会填充信息。

符合上面条件的 `input[type=text]` 元素在获得焦点（focus）时显示密码弹框。


## 取消自动填充密码，聚焦显示密码弹框

![自动填充密码](http://images.scar.site/20220222235051.png)

我们如果想取消进入页面自动填充的效果，但又想保留记住密码的功能，可以通过在 `inptu[type=password]` 的元素上设置属性 `autocomplete="new-password"`。
```html
<form>
    <div>
      <input type="text"  name="test"></input>
    </div>
    <div>
      <input type="password" autocomplete="new-password" name="password"></input>
    </div>
    <button>save</button>
  </form>
```

## 取消自动填充密码，聚焦不显示密码弹框
![](http://images.scar.site/20220222235340.png)

按照密码提示填充的逻辑，放两个不显示的输入框骗过浏览器，就可以不显示弹框了。
```html
<form>
  <input style="opacity: 0;position:absolute;width:0;height:0;">
  <input type="password" style="opacity: 0;position:absolute;width:0;height:0;">
  <div>
    <input type="text" autocomplete="off" name="test"></input>
  </div>
  <div>
    <input type="password" autocomplete="off" name="password"></input>
  </div>
  <button>save</button>
</form>
```

> 注意：如果用户已经在当前域名保存了账户信息，那么即使将原代码后续改为上面的代码，聚焦密码弹框仍可以自动填充。

## 资料
* [浏览器保存密码后自动填充问题](https://segmentfault.com/a/1190000016253795)
* [The HTML 自动完成属性](https://developer.mozilla.org/zh-CN/docs/Web/HTML/Attributes/autocomplete)
