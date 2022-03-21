# Proxy
## 说明
### 参数说明
```
const target = {}
const handler = {
  get(target, key, recevier) {
    return target[key]
  },
  set(target, key, val, recevier) {
    target[key] = val
    return true
  }
  ...
}
const proxy = new Proxy(target, handler)

target: 包装的对象
handler:  对proxy进行操作时，handler对象执行相应的捕捉器函数，如果不存在则直接对target进行处理。
```
#### handler
js 对象中存在很多内部方法，我们无法直接使用，可以通过proxy 定义的 [捕捉器函数](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Proxy/Proxy#handler_functions) 进行代理。

### 使用
#### recevier 代理 this
```

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
