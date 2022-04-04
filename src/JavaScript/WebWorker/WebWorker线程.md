# web Worker
为 JS 创建多线程环境，允许主线程创建 Worker 线程。

> 一旦创建成功会始终运行。除非实例引用为0会自动关闭。

### 使用场景说明
> 使用 worker 只在若干个并行任务需要执行时，才具备优势。单个 worker 而 主线程任务 需等待它的执行，那就和放主线程无异。

异步任务额执行的时候会被放到浏览器的事件队列中，等到 JS 运行空闲后才会被执行。

当 promise / async 遇到复杂的运算如 加载引擎、图形识别、加密算法操作。

长时间运行 js 降低用户体验，应把复杂运算从业务抽离，让计算运行同时不阻塞用户界面。

### 限制
#### 限制条件
1. 同源限制。需要与主线程脚本同源
2. DOM 限制。无法获取DOM，只有 navigator 对象和 location 对象
3. 通信联系。与主线程不在同一个上下文，无法直接通讯
4. 文件限制。无法读取文件
5. 脚本限制。可以使用 XMLHttpRequest 对象但不能执行alert()方法和confirm()方法。

#### 运行环境
1. navigator 对象，包括 ``onLine``, ``appName``, ``appVersion``, ``userAgent`` 和 ``platform`` 属性
2. 只读的 location 对象
3. ``setTimeout()``, ``setInterval()``, ``clearTimeout()``, ``clearInterval()``
4. ``XMLHttpRequest`` 构造函数

### 模式
#### 传输模式
1. ``Copying the message`` 数据复制模式
需要对数据进行一系列的 序列化 - 复制 - 发送 - 接收 - 反序列化
2. ``Transferring the message`` 数据传递模式
可直接将数据进行传输，传输模式仅支持 ArrayBuffer(二进制)
> How fast are web workers?

**使用 ``Transferring the message``模式**。
1. ArrayBuffer
2. Three.js的库中发现除了Geometry还有一个BufferGeometry，那么我们只要简单的基于原有算法结合BufferGeometry中的fromGeometry方法实现一个纯数据的BufferGeometry再返回到主线程，既加速了Worker的效率，也加速了Geometry的生成效率，一举两得！

### 配置
webpack 4: ``worker-loader``
webpack 5: 直接使用 ``Web Workers``
vite: 直接使用 ``Web Workers``

#### webpack 4 + ts 配置
**worker-loader**
将 worker.ts 转化 blob 类型，同源的内嵌到我们的业务代码当中。
1. 防止浏览器提示下载
2. 防止不同源 worker 文件冲突
``yarn add worker-loader -D``
```
# webpack, module 下的 rules
# 要在 js 和 ts 的 rule 之前，否则无法解析
{
  test: /\.worker\.ts$/,
  use: {
      loader: 'worker-loader',
      options: {
          name: '[name]:[hash:8].js',// 打包后chunk的名称
          inline: true, // 开启内联模式(blob)
      }
  }
},
```
**devServer 模式下报错 "window is not defined"**
```
# webpack, output

globalObject: 'this'
```

#### webpack 5 / vite
```
const worker = new Worker(new URL('jsUrl', import.meta.url));

# import.meta.url 只提供 new URL 让 webpack / vite 获取代码路径
```

### API
> onFn 等同 .addEventListener('Fn', cb)


**# 主线程**
``const myWorker = new Worker(jsUrl, options);``

``Worker.onerror``
指定 error 事件的监听函数。

``Worker.onmessage``
指定 message 事件的监听函数，发送过来的数据在Event.data属性中。

``Worker.onmessageerror``
指定 messageerror 事件的监听函数。发送的数据无法序列化成字符串时，会触发这个事件。

``Worker.postMessage()``
向 Worker 线程发送消息。

``Worker.terminate()``
立即终止 Worker 线程。

**# worker 线程**
``self.name``
Worker 的名字。该属性只读，由构造函数指定。
``self.onmessage``
指定message事件的监听函数。
``self.onmessageerror``
指定 messageerror 事件的监听函数。发送的数据无法序列化成字符串时，会触发这个事件。
``self.close()``
关闭 Worker 线程。
``self.postMessage()``
向产生这个 Worker 线程发送消息。
``self.importScripts()``
加载 JS 脚本。
