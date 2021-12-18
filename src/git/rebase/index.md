# git rebase
> git-rebase: Forward-port local commits to the updated upstream head
> 
> 将一个分支集成到另一个分支, 将一系列提交组合到新的提交的过程。

## 目录
1. 我工作中的使用步骤
2. 各种使用细节
3. 原理分析
4. 对外如何介绍

## 1. 工作的使用步骤
已知远程分支 master，本地默认分支 master。
远程分支 master 和本地分支 feat 的操作。
```
# master
- git fetch origin master // 拉取远程 master 分支
- git checkout -b feat // 查找并切换到分支 feat (-b 在查找过程中没有就新建)

# feat
... do soming edit
- git add . // 文件添加到暂存区
- git commit -m 'feat edit' // 将暂存区内容添加到本地仓库中
- git checkout master

# main
- git pull origin master // 拉取最新远程 master 分支
- git checkout feat

# feat
- git rebase master // rebase
... 解决冲突
- git push origin feat
```

## 2. rebase 使用细节
### git rebase 解决了什么
让分支变得整洁，减少使用 merge 产生的合并记录。

#### 本地分支 feat-01 新增内容后，在当前分支使用 ``git pull`` 拉取 origin master，解决冲突后再提交：
![image](https://user-images.githubusercontent.com/30005394/146636918-827df08d-fefe-49d7-b39e-40133aaa498c.png)

这个时候我们做了一次提交会提交2个 commit (主内容 feat-01 和 merge 信息): 

![image](https://user-images.githubusercontent.com/30005394/146637343-8650fa96-8412-4b4f-afaf-36098f4b49cb.png)

#### 本地分支 feat-01 新增内容后，在 master 分支使用 ``git pull`` 拉取 origin master，再切回 feat-01 解决冲突后再提交：
![image](https://user-images.githubusercontent.com/30005394/146637244-7629d010-f39c-4542-9956-9c800b803f45.png)

这时我们得到的提交 commit 只有一个，而且也跟分支 master 在同一条线上：
![image](https://user-images.githubusercontent.com/30005394/146637277-08b21a38-32bb-4a55-8609-416f4a3780b8.png)

### 当执行 git rebase 时做了什么
拿分支 feat-01 为例：

1. git 会把 feat-01 分支里面的每个 commit 取消掉
2. 把上面的操作临时保存成 patch 文件，存在 .git/rebase 目录下
3. 把 feature1 分支更新到最新的 master 分支
4. 把上面保存的 patch 文件应用到 feature1 分支上

### 123
如上 在 feat 分支 执行 git rebase main 时，我们的当地分支变成了 main，而外来分支变成了 feat

### 


## 危险操作
### 多人同分支开始使用 rebase 会覆盖其他的 commit 历史记录 .
不要对一个共享的、已在公共库上的分支进行 rebase 操作。只有私有分支才适用 rebase 。

## 合并其他分支
### git rebase

## 合并自身分支
### git rebase -i HEAD~(n)
