# Proxy
## 说明
### 参数说明
```
const handler = {
  get(...) { return ... },
  set(...) { return ...}
  ...
}
const proxy = new Proxy(object, handler)

handler:  对proxy进行操作时，handler对象执行相应的捕捉器函数，如果不存在则直接对target进行处理。
```
#### handler
js 对象中存在很多内部方法，我们无法直接使用，可以通过proxy 定义的 [捕捉器函数](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Proxy/Proxy#handler_functions) 进行代理。

- handler.get
- handler.set
- handler.has
- handler.apply
- handler.construct
- handler.ownKeys
- handler.deleteProperty
- handler.defineProperty
- handler.isExtensible
- handler.preventExtensions
- handler.getPrototypeOf
- handler.setPrototypeOf
- handler.getOwnPropertyDescriptor


### 注意

### 使用
#### 设置默认值
Javascript 中未设置属性的默认值是 undefined。
proxy 改变这一点:
1. 不用额外初始化
2. 不用创建
```
const withZeroValue = (target, zeroValue) => new Proxy(target, {
  get: (obj, prop) => (prop in obj)
    ? obj[prop]
    : zeroValue
})
```
#### this 指向问题
**使用bind**
无法保证与目标对象的行为一致。
主要原因就是在 Proxy 代理的情况下，目标对象内部的this关键字会指向 Proxy 代理。
```
const target = {
    getThis: function() {
        return this
    },
    getProxyThis: function() {
        return this
    },
}
const handle = {
    get(target, prop) {
        return prop === 'getThis'
            ? target.getThis.bind(target)
            : Reflect.get(target, prop)
    }
}
const thisProxy = new Proxy(target, handle)

// thisProxy.getThis() >>> target
// thisProxy.getProxyThis() >>> Proxy
```
#### Proxy 代理具有私有属性的对象（闭包）
```
function fn() {
    const num = 10
    this.numFn = function() {
        console.log(num)
    }
}
const fnProxy = new Proxy(fn, {
    get(target, key, recevier) {
        const val = target[key]
        return typeof val === 'function'
            ? val.bind(target)
            : val
    },
    set(target, key, value, recevier) {
    target[key] = value
  }
})
```
