---
title: require 和 import 的区别
date: 2020/03/10 23:49
description:
categories: 技术
---

当前端应用越来越复杂时，我们想要将代码分割成不同的模块，便于复用、按需加载等。

require 和 import 分别是不同模块化规范下引入模块的语句，下文将介绍这两种方式的不同之处。

### 1. 出现的时间、地点不同

|                 | 年份 | 出处                  |
| --------------- | ---- | --------------------- |
| require/exports | 2009 | CommonJS              |
| import/export   | 2015 | ECMAScript2015（ES6） |

### 2. 不同端(客户端/服务器)的使用限制

|         | require/exports | import/export                                                                                                                                                         |
| ------- | --------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Node.js | 所有版本        | Node 9.0+（启动需加上 flag --experimental-modules）<br>Node 13.2+（直接启动） [如何使用？](https://es6.ruanyifeng.com/#docs/module-loader#Node-js-%E5%8A%A0%E8%BD%BD) |
| Chrome  | 不支持          | 61+                                                                                                                                                                   |
| Firefox | 不支持          | 60+                                                                                                                                                                   |
| Safari  | 不支持          | 10.1+                                                                                                                                                                 |
| Edge    | 不支持          | 16+                                                                                                                                                                   |

`CommonJS` 模块化方案 `require/exports` 是为服务器端开发设计的。服务器模块系统**同步读取模块文件内容**，编译执行后得到模块接口。（`Node.js` 是 `CommonJS` 规范的实现）。

在浏览器端，因为其**异步加载脚本文件**的特性，`CommonJS` 规范无法正常加载。所以出现了 `RequireJS`、`SeaJS` 等（兼容 `CommonJS` ）为浏览器设计的模块化方案。

两种方案各有各的限制，需要注意以下几点：

- **原生浏览器不支持 require/imports**，可使用支持 CommonJS 模块规范的 `Browsersify`、`webpack` 等打包工具，它们会将 require/imports 转换成能在浏览器使用的代码。
- **import/export 在浏览器中无法直接使用**，我们需要在引入模块的 `<script\>` 元素上添加`type="module`属性。

- 即使 `Node.js` 13.2+ 可以通过修改文件后缀为 [.mjs](http://www.ruanyifeng.com/blog/2020/08/how-nodejs-use-es6-module.html) 来支持 `ES6` 模块 `import/export`，**但是 Node.js 官方不建议在正式环境使用**。目前可以使用 [babel](https://babeljs.io/) 将 `ES6` 的模块系统编译成 `CommonJS` 规范（注意：语法一样，但具体实现还是 require/exports）。

### 3. require/exports 是运行时动态加载，import/export 是静态编译

> `CommonJS` 加载的是一个对象（即 module.exports 属性），该对象只有在脚本运行完才会生成。而 ES6 模块不是对象，它的对外接口只是一种静态定义，在代码静态解析阶段就会生成。- 阮一峰

### 4. [require/exports 输出的是一个值的拷贝，import/export 模块输出的是值的引用](https://es6.ruanyifeng.com/#docs/module-loader#ES6-%E6%A8%A1%E5%9D%97%E4%B8%8E-CommonJS-%E6%A8%A1%E5%9D%97%E7%9A%84%E5%B7%AE%E5%BC%82)

`require/exports` 输出的是值的拷贝。也就是说，一旦输出一个值，模块内部的变化就影响不到这个值。

`import/export` 模块输出的是值的引用。JS 引擎对脚本静态分析的时候，遇到模块加载命令 import，就会生成一个只读引用。等到脚本真正执行时，再根据这个只读引用，到被加载的那个模块里面去取值。

若文件引用的模块值改变，require 引入的模块值不会改变，而 import 引入的模块值会改变。

### 5. 用法不一致

#### (1). require/exports 的用法

```
const fs = require('fs')
exports.fs = fs
module.exports = fs
```

exports 是对 `module.exports` 的引用，相当于

```
exports = module.exports = {};
```

在不改变 `exports` 指向的情况下，使用 `exports` 和 `module.exports` 没有区别；如果将 `exports` 指向了其他对象，`exports` 改变不会改变模块输出值。示例如下：

```
//utils.js
let a = 100;

exports.a = 200;
console.log(module.exports) //{a : 200}
exports = {a:300}; //exports 指向其他内存区

//test.js

var a = require('./utils');
console.log(a) // 打印为 {a : 200}
```

#### (2). import/export 的写法

import fs from 'fs'

```javascript
import {readFile} from 'fs' //从 fs 导入 readFile 模块
import {default as fs} from 'fs' //从 fs 中导入使用 export default 导出的模块
import * as fileSystem from 'fs' //从 fs 所有导出模块，引用对象名为 fileSystem
import {readFile as read} from 'fs' //从 fs 导入 readFile 模块，引用对象名为 read

export default fs
export const fs
export function readFile
export {readFile, read}
export * from 'fs'
```

> 建议 1：建议明确列出我们要引用的内容。，使用 \* 虽然很方便，但是不利于现代的构建工具检测未被使用的函数，影响代码优化。

同时需要注意

1. 引入 `export default` 导出的模块不用加 {},引入非 `export default` 导出的模块需要加 {}。

```
import fileSystem, {readFile} from 'fs'
```

2. 一个文件只能导出一个 `default` 模块。

3. 在验证代码的时候遇到如下报错

```
access to script from origin 'null' has been blocked by CORS policy
```

前面提到过，浏览器引入模块的 `<script>` 元素要添加 `type="module` 属性，但 **module 不支持 file:// 文件协议，只支持 HTTP 协议**，所以本地需要使用 http-server 等[本地网络服务器](https://juejin.im/post/6844903559851425805)打开网页文件。

#### (3). import/export 不能对引入模块重新赋值/定义

当我尝试给 import 的模块重新赋值时

```javascript
import { e1 } from "./webUtils.js";
e1 = 234;
```

浏览器显示

> Uncaught TypeError: Assignment to constant variable.

当我重新定义引用的模块

```javascript
import { e1 } from "./webUtils.js";
var e1 = 1;
```

浏览器显示

> (index):17 Uncaught SyntaxError: Identifier 'e1' has already been declared

#### (4). ES6 模块可以在 import 引用语句前使用模块，CommonJS 则需要先引用后使用

ES6 模块

```javascript
//webUtils.js
export var e = "export";
```

```javascript
console.log(e); //export
import { e } from "./webUtils.js";
console.log(e); //export
```

CommonJS

```javascript
//utils.js
exports.e = "export";
```

```javascript
console.log(a);
a = require("./utils");
console.log(a);
```

程序报错

> ReferenceError: a is not defined

#### (5). import/export 只能在模块顶层使用，不能在函数、判断语句等代码块之中引用；require/exports 可以。

```javascript
import fs from "./webUtils.js";
function a() {
  import { e1 } from "./webUtils.js";
  console.log(e1);
}
a();
console.log(fs());
```

程序报错

> Uncaught SyntaxError: Unexpected token '{'
> 前面提到过 import/export 在代码静态解析阶段就会生成，不会去分析代码块里面的 import/export，所以程序报语法错误，而不是运行时错误。

### 6. 是否采用严格模式

> 严格模式是采用具有限制性 JavaScript 变体的一种方式

`import/export` 导出的模块默认调用严格模式。

```javascript
var fun = () => {
  mistypedVaraible = 17; //报错，mistypedVaraible is not defined
};
export default fun;
```

`require/exports` 默认不使用严格模式，可以自定义是否使用严格模式。
例如

```javascript
exports.fun = () => {
  mistypedVaraible = 17; //没有调用严格模式，不会报错
};
```

### 7. 其他模块化方法

#### [动态导入](https://zh.javascript.info/modules-dynamic-imports)

import(modulePath) 表达式加载模块并返回一个 promise，该 promise resolve 为一个包含其所有导出的模块对象。

我们可以在代码中的任意位置动态地使用它。例如：

```
import('/modules/my-module.js') //动态导入
  .then((module) => {
    // Do something with the module.
});
```

> 建议: 请不要滥用动态导入 import()（只有在必要情况下采用）。静态框架能更好的初始化依赖，而且更有利于静态分析工具和 tree shaking 发挥作用

### 8. 参考资料

- [阮一峰-ECMAScript 6 入门](https://es6.ruanyifeng.com/#docs/module-loader#ES6-%E6%A8%A1%E5%9D%97%E4%B8%8E-CommonJS-%E6%A8%A1%E5%9D%97%E7%9A%84%E5%B7%AE%E5%BC%82)

* [寸志-知乎回答-require，import 区别](https://www.zhihu.com/question/56820346)
* [从 CommonJS 到 Sea.js](https://github.com/seajs/seajs/issues/269)
* [sunshine-前端模块化（AMD、CommonJS、UMD）总结](https://zhuanlan.zhihu.com/p/75980415)
* [橡树上-JavaScript 模块化总结](https://juejin.im/post/6844903826600755214#1999---2009)
* [张鑫旭-万岁，浏览器原生支持 ES6 export 和 import 模块啦！](https://www.zhangxinxu.com/wordpress/2018/08/browser-native-es6-export-import-module/)
* [城南-exports、module.exports 和 export、export default 到底是咋回事](https://juejin.im/post/6844903489257095181)
* [lvcq617-ES6 export && export default 差异总结](https://juejin.im/post/6844903585805762573)
* [JAVASCRIPT.INFO-导入和导出](https://zh.javascript.info/import-export)
