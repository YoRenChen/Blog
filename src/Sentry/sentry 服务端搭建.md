# sentry 服务器搭建
sentry 可从官网创建账号，也可本地搭建。
## 官网创建
通过 [sentry官网](https://sentry.io/) 进行注册，生成在线服务端。

## 本地搭建(MAC)
#### 安装 docker:
[Docker Desktop](https://hub.docker.com/editions/community/docker-ce-desktop-mac)

#### 安装 docker-compose
用于定义和运行多容器 Docker 应用程序的工具

[docker-compose](https://docs.docker.com/compose/install/)

*Mac 的 docker(Docker-Docker) 和 Docker Toolbox 已包括 Compose。Mac 不需要安装*

#### 安装 Sentry
[Sentry下载包](https://github.com/getsentry/onpremise/releases)

解压在目录下运行 ``./install.sh``

#### 安装中出现错误：
```
FAIL: Required minimum RAM available to Docker is 3800 MB, found 1986 MB

docker 分配内存过小，修改docker分配内存。
```

```
./install/_lib.sh: line 15: realpath: command not found

运行：brew install coreutils
```

#### 安装完成
出现下面执行提示 ``docker compose up -d``，运行 ``http://127.0.0.1:9000/``

#### 添加账号
在解压运行时可先不创建用户：``./install.sh --no-user-prompt``

如果安装时跳过账号创建，在终端进入 onpremise 目录执行下面命令，创建超级用户（管理员）：

```
docker-compose run --rm web createuser --superuser --force-update
```

``superuser``: 管理员

``force-update``: 覆盖存在的用户。
