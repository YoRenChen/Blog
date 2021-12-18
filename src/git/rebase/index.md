# git rebase
> 用于将更改从一个分支集成到另一个分支, 将一系列提交移动或组合到新的基础提交的过程

## 目录
1. 我工作中的使用步骤
2. 各种使用细节
3. 原理分析
4. 对外如何介绍

## 1. 我工作的使用步骤
```
已知远程分支 main，本地默认分支 master

# master
- git fetch origin main // 拉取远程 main 分支
- git checkout -b feat // 查找并切换到分支 feat (-b 在查找过程中没有就新建)

# feat
... do soming edit
- git add . // 文件添加到暂存区
- git commit -m 'feat edit' // 将暂存区内容添加到本地仓库中
- git checkout main

# main
- git pull origin main // 拉取最新远程 main 分支
- git checkout feat

# feat
- git rebase main // rebase
... 解决冲突
- git push origin feat
```

## 2. rebase 使用细节
如上 在 feat 分支 执行 git rebase main 时，我们的当地分支变成了 main，而外来分支变成了 feat


## 危险操作
### 多人同分支开始使用 rebase 会覆盖其他的 commit 历史记录 .
不要对一个共享的、已在公共库上的分支进行 rebase 操作。只有私有分支才适用 rebase 。

## 合并其他分支
### git rebase

## 合并自身分支
### git rebase -i HEAD~(n)
