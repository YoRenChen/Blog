# webapck 环境变量添加与使用

## 前言
vue3.0 + webpack
本文有一定局限性，如有更好的解决方法可以在文本下面提出。
## 添加环境变量
我们添加变量的方式主要有：
1. 命令行传入变量
2. .env 文件预存变量
3. webpack.DefinePlugin 添加变量
4. chainWebpack 添加变量
5. 变量读取的方式也有两种：

打包前在 vue.config.js 里的自定义变量
1. 打包后模块里的变量
2. 那就从 读取变量方式 来展开说说 添加变量。

### vue.config.js 获取变量
在我们运行 vue.config.js 时就能获取到的 process.env ：
```
# vue.config.js

process.env.NODE_ENV
```
我们设置变量可通过 cross-env 命令行 / .env 文件进行：

### 命令行传入变量
```
# Linux
"serve": "NODE_ENV=development webpack..."

# Windows
"serve": "set NODE_ENV=development webpack..."
```
通过 cross-env 配置 npm scripts 命令行载入变量，解决多端环境运行系统写法差异。
```
# package.json
"dev": "cross-env NODE_ENV=development webpack..."
```
### env 文件预存变量
1. 在 vue 项目根目录中创建 .env 文件
2. vue 项目启动时执行 cli，通过 @vue/cli-service/lib/Service.js 的loadEnv() 获取当前目录下的 .evn文件，执行 dotenv (这个库是将环境变量从 .env 文件加载到 process.env 中)
3. 根据 mode 加载对应的 .env.mode 的环境变量
4. VUE_APP_ 开头变量名
```
# package.json
"dev": "webpack... --mode='prod'"

或
# webpack.prod.config.js
module.exports = {
  mode: 'prod'
};

# package.json
"build": "webpack --config webpack.prod.js"

# Tree
├── .env
├── .env.prod
├── package.json
├── webpack.prod.config.js
```
```
# .env / .env.prod

VUE_APP_key=value
```
**注意：命令行的优先级会大于.env里设置的变量**

### 打包后模块里的变量

我们可以通过 webpack 的 ``webpack.DefinePlugin`` / ``chainWebpack`` 设置变量，以便我们运行项目的时能访问到变量。

#### configureWebpack 使用 webpack.DefinePlugin 添加变量

> configureWebpack 的底层是 webpack-merge，通过编写一个配置子集快速合并到最终的完整配置中。

webpack 允许我们使用 configureWebpack 做一些简单的 loader 配置。

我们使用 ``webpack.DefinePlugin`` 来维护一个全局的配置文件。
```
configureWebpack: {
  plugins: {
    new webpack.DefinePlugin({
      APP_VERSION: `"${require('./package.json').version}"`,
      'process.env.NODE_ENV': JSON.stringify(xxx)
    }),
  }
}
```
在模块里直接使用无需额外声明
```
# mian.js
Vue.prototype.$node = process.env.NODE_ENV
```
插一嘴：``process.env.NODE_ENV`` 的配置在往前是
```
process: {
    env: {
        NODE_ENV: "xxx"
    }
}
```
这种方式配置每次运行会重写 process 对象，如果我们单修改的是NODE_ENV 的话就会破坏整个 process。我们可以在 DefinePlugin 里 配置'process.env.NODE_ENV': JSON.stringify(XXX) 对process 的值进行插入的方式处理新增的 NODE_ENV 。

#### chainWebpack 添加变量

> chainWebpack 的底层是 webpack-chain，基Webpack Config 的规范提供上层 API 进行命令式配置。

``chainWebpack`` 后期提供更细的颗粒度控制内部配置。我们对 process.env 添加配置。
```
chainWebpack: (config) => {
  config.plugin('define').tap((args) => {
    Object.assign(args[0]['process.env'], {
      NODE_ENV: JSON.stringify(xxx)
    })
    return args
  })
}
```
#### 模块中使用 EJS 访问

举个例子，我们会在 HTML 引入资源文件
```
# Webpack
const assetsCDN = {
  js: [
    '//cdn.jsdelivr.net/npm/axios@0.19.0/dist/axios.min.js'
    ...
  ]
}
chainWebpack: (config) => {
  config.plugin('html').tap((args) => {
    args[0].cdn = assetsCDN
    return args
  })
}

# Html
<!DOCTYPE html>
<html>
<body>
  <% for (var i in htmlWebpackPlugin.options.cdn && htmlWebpackPlugin.options.cdn.js) { %>
    <script type="text/javascript" src="<%= htmlWebpackPlugin.options.cdn.js[i] %>"></script>
  <% } %>
</body>
</html>
```
#### 模块中使用 process.env 引用

在vue 的 src 文件里使用 ``process.env``
```
# webpack
configureWebpack: {
  plugins: {
    new webpack.DefinePlugin({
      APP_VERSION: `"${require('./package.json').version}"`,
      'process.env.VUE_URL': JSON.stringify(xxx)
    }),
  }
}

# mian.js
// eslint-disable-next-line no-undef
const version = APP_VERSION

Vue.prototype.$url = process.env.VUE_URL
```
#### configureWebpack 与 chainWebpack 的区别

执行次序：chainWebpack > configureWebpack
```
# vue.config.js
plugins: {
  new webpack.DefinePlugin({
    'process.env.VUE_APP_TEST': JSON.stringify('DefinePlugin'),
  })
}
chainWebpack: (config) => {
  config.plugin('define').tap((args) => {
    Object.assign(args[0]['process.env'], {
      VUE_APP_TEST: JSON.stringify('chainWebpack')
    })
    return args
  })
}

# main.js
console.log(process.env.VUE_APP_TEST) // chainWebpack
```
## 实例

### 根据分支执行对应的 script

根据不同的分支传递对应的变量，执行打包的时候执行对应的 script。
```
# File
|- .env
|- .env.beta
|- .env.development
|- .env.production
|- .env.local
```
```
# package.json
{
  "script": {
    "build:dev": "vue-cli-service build --mode local",
    "build:development": "vue-cli-service build --mode development",
    "build:beta": "vue-cli-service build --mode beta",
    "build:production": "vue-cli-service build --mode production"
  }
}
```
```
# gitlab-ci.yml

build:docker-image:
  stage: build
  only:
    - master
  variables:
    BUILD_ENV: "development"   
  script:
    - >
      docker image build
      ... ...

# Dockerfile
RUN yarn run build:${BUILD_ENV}
```
### 根据环境变量改变 webpack config 打包策略

在 webpack 打包时，CI注入变量，通过``process.env``获取到对应变量的值做对应的打包策略。
```
# gitlab-ci.yml
(CI_COMMIT_REF_NAME: 正在构建的项目的分支或者标签名,CI自动配置)
build:docker-image:
  script:
    - >
      docker image build \
      --build-arg TAGNAME=$CI_COMMIT_REF_NAME \
      ... ...

# Dockerfile
ENV TAG_NAME=${TAGNAME}
```
```
# vue.config.js
switch(process.env.TAG_NAME)
  case 'master':
    (...)
    break;
  case 'prod':
    (...)
    break;
  default:
    break;
```
