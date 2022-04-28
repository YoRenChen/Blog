# Promise
## 目的
promise 解决 回调地狱，使用链式调用方式。

## 创建 Promise
```
new Promise((resolve, reject) => {
    if ... resolve()
    else ... reject()
})
```

## 特性
1. 异步操作、promise 为宏任务，then 为微任务。
2. promise 状态：
- Pending：初始状态，异步操作仍在进行中。
- Fulfilled：操作成功，它调用.then回调，例如.then(onSuccess)。
- Rejected: 操作失败，它调用.catch或.then的第二个参数。 
    - 例如.catch(onError)或.then(..., onError)。
- Settled：这是 promise 的最终状态。
    - promise 已经死亡了，没有别的办法可以解决或拒绝了。 .finally方法被调用。
、rejected（已失败）。
3. 状态一旦改变就无法修改，并且状态只能从 pending 到 fulfilled 或者是 pending 到 reject。
4. Promise 一旦创建就会立即执行，不能中途取消。

## Promise 方法
Promise 构造函数接受一个函数作为参数，该函数的两个参数分别是 resolve 和 reject，两个返回都是新的 Promise 对象。

### Promise.prototype.then()
``Promise.prototype.then(resovle, reject)``

then 成功后如果返回一个 promise 回调，当这个回调发生变化的时候才可以执行下一个then。

接受两个参数，分别是当前 Promise 的【成功回调-resovle】和【失败回调-reject】，并且这两个函数会自动返回一个新的 Promise 对象。

### Promise.prototype.catch()
``Promise.prototype.catch()``
``.then(null | undefined, rejection)``的别名

用于指定发生错误时的回调函数。

**catch 只是捕获异常，catch 并不能终止当前 Promise 的链式调用。**
### Promise.prototype.finally()
不管 Promise 最终变成了什么状态，都会执行这个方法，同时 finally 不接收任何参数。

finally 并不是链式调用的终点，它也会自动返回一个新的 Promise 对象。

### Promise.all()
1. 参数为 Promise 数组。

2. 全部元素成功状态是 fulfilled，有一个失败就会是 rejected。

3. 结果按顺序返回新的 Promise 数组形态

### Promise.race()
1. 参数是promise数组，返回新 Promise。

2. 元素状态先改变结果先返回。

3. 会因为元素失败状态转 rejected 而结束。

### Promise.allSettled()
解决 Promise.all 报错直接抛出错误，而不管请求是否执行完成，所以提供 allSettled 方法。
1. 参数和返回值同 Promise.all 一样
2. 返回值不论元素是否成功，只要执行结束，则返回最终执行的结果。

```
promise.allSettled().then(res)

// 异步操作成功时
res = {status: 'fulfilled', value: value}

// 异步操作失败时
res = {status: 'rejected', reason: reason}
```
### Promise.any()
1. 只要有一个参数状态变为 fulfilled，包装实例就会是 fulfilled 状态

2. 所有参数实例都变成 rejected 状态，包装实例就会变成 rejected 状态。


## promise A+
### promise A+ 核心点
#### 关系链路
关于 .then 方法在调用过程中返回 新的Promise实例，
#### nextTick
#### 状态转移

### promise A+ 测试
检验一份手写 Promise 靠不靠谱，通过 Promise A+ 规范自然是基本要求。

可以借助 promises-aplus-tests 来检测我们的代码是否符合规范。
```
npm install promises-aplus-tests -D
代码加入 deferred
启动命令

class MyPromise {...}

MyPromise.deferred = function () {
  var result = {};
  result.promise = new MyPromise(function (resolve, reject) {
    result.resolve = resolve;
    result.reject = reject;
  });

  return result;
}

"scripts": {
  "test": "promises-aplus-tests MyPromise"
}
```
