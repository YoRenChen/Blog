# git rebase
> 用于将更改从一个分支集成到另一个分支, 将一系列提交移动或组合到新的基础提交的过程

## 危险操作
### 多人同分支开始使用 rebase 会覆盖其他的 commit 历史记录 .
不要对一个共享的、已在公共库上的分支进行 rebase 操作。只有私有分支才适用 rebase 。

## 合并其他分支
### git rebase

## 合并自身分支
### git rebase -i HEAD~(n)