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

## Reflect
> ES6 中将 Object 的一些明显属于语言内部的方法移植到了 Reflect 对象上，未来的新方法会只部署在 Reflect 对象上。

优点：
1. 对某些方法的返回结果进行了修改，使其更合理。
2. 使用函数的方式实现了 Object 的命令式操作。

### 重点
#### name in obj 指令的函数化
`` Reflect.has(obj, 'name') ``
#### 设置目标对象的 prototype
``Reflect.setPrototypeOf(obj, Array.prototype)``
#### Function.prototype.apply.call(func, thisArg, args) 
``Reflect.apply(func, thisArg, args)``
```
Reflect.apply(Math.max, Math, [1, 3, 5, 3, 1]); // 5
```

#### 用于判断 target 对象是否可扩展
``Reflect.isExtensible(target)``

## 组合使用
#### 实现观察者模式
```
// 定义 Set 集合
const queuedObservers = new Set();
// 把观察者函数都放入 Set 集合中
const observe = fn => queuedObservers.add(fn);
// observable 返回原始对象的代理，拦截赋值操作
const observable = obj => new Proxy(obj, {set});
function set(target, key, value, receiver) {
  // 获取对象的赋值操作
  const result = Reflect.set(target, key, value, receiver);
  // 执行所有观察者
  queuedObservers.forEach(observer => observer());
  // 执行赋值操作
  return result;
}
```
