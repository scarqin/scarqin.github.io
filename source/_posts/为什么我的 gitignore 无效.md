---
title: 为什么我的 gitignore 无效
date: 2020/10/30 08:44:25
description: 
---
![](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/e192f485b19e471e97e135596c01764b~tplv-k3u1fbpfcp-watermark.image)

# 问题背景

![](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/e8a4b3f92c0046fcb314424895303b8d~tplv-k3u1fbpfcp-watermark.image)

项目有一些开发时用的配置文件，需要用到所以不能删，但是却不想提交改动。

理所当然地想到将它加入 `.gitignore` 规则中，但是我的改动还是被 `git` 被捕捉到了，为啥呢？

> gitignore - Specifies intentionally untracked files to ignore

官方文档给出了标准答案，原来 `.gitignore` 只对**未跟踪的文件**起作用！

> 已跟踪的文件是指那些被纳入了版本控制的文件，在上一次提交中有它们的记录。那么未跟踪文件就是指那些从没提交过的文件。

因为我之前已经使用提交过了，所以`.gitignore`也救不了我 。

那我现在已经覆水难收的情况下，想要忽略 index.scss 该怎么做？

# 解决方案

## 我与 git 的对话

【我】：我的目的是在仓库里面**保留 index.scss**，但是要**所有人忽略它的改动**。你能做到吗？

【git】：**我做不到**，我是个版本控制的仓库，我要为所有文件的版本负责，而不是你存储文件的中转站！但是你可以这样：

* 别让我管理你的 index.scss，踢出我的版本控制，存在自个儿的电脑里。
* 暂时只忽略你的文件改动，别人已加到版本库的文件改动，你可管不着。

让我们来看看根据 git 提供的思路，如何实践。

## 取消跟踪,删除远程文件（推荐）

### 你要做的

* 先将 src/index.scss 加入 `.gitignore` 文件。
* 再执行以下命令：
  
  ```
  git rm --cached src/index.scss 
  git add src/index.scss
  git commit -m "ignore index.scss"
  ```

在你的电脑进行以上操作后，index.scss 正式脱离了版本管理的管制。`git rm --cached` 会保留你本机的文件，但是会从版本库里面删除。

### 其他电脑要做的

* `git pull`
* 将 index.scss 加回来

因为其他主机（您同事的电脑等等）在 `git pull` 你以上的改动时，index.scss 会被删除，所以 index.scss 需要加回来。

可以手动加回来，也可以使用构建工具初始化自动生成  index.scss 文件。

## 暂时忽略已跟踪文件的变更，不删除远程文件（不推荐）

### 你要做的

> git update-index --assume-unchanged src/index.scss

### 其他电脑要做的

> git update-index --assume-unchanged src/index.scss

`git update-index` 为一个单独文件创建暂存区，`--assume-unchanged` 通知 git 不要再监控这个文件的改动了。

合起来的意思是：我单独把你拎出来，暂时先跟踪你。因为命令只对当前工作区生效，同理其他主机也要进行同样的操作。

## 为什么推荐方案（1）不推荐方案（2）?

方案（2）非常纯粹，一招鲜吃遍天。

但是它容易出错，如果某个同事忘记执行这条指令，将 index.scss 提交到了版本库，
那么**其他人都需要一起——重新执行命令**，再次让版本库忽略 index.scss。

过来人告诉你，这方法真的不好维护。

使用方案（1），因为文件已经删了，且已经将其加入到了 `.gitignore`，后续的提交都不会跟踪这份新的 index.scss 文件。同事忘不忘记操作也只是影响他自己，而且只需一次操作，无后顾之忧。

### 资料

* [n͛i͛g͛h͛t͛i͛r͛e͛-git忽略已经被提交的文件](https://segmentfault.com/q/1010000000430426)
* [gitignore 解释](https://git-scm.com/docs/gitignore)
* [Git 使用札记（二）](http://kuanghy.github.io/2019/03/31/git-notes2)
