# Reflect
> MDN 对 Reflect的描述:
> Reflect 的所有属性和方法都是静态的(Math对象)
> Reflect 不是构造函数。不能 new，也不能作为函数调用。

### 优点
#### 1. 统一的命名空间
#### 2. 用法简单
```
# Object
try {
    Object.defineProperty(obj, name, desc);
} catch(e) {}

# Reflect
if (Reflect.defineProperty(obj, name, desc)) ...
```
#### 3. 在apply函数中的可读性
```
Function.prototype.apply.call(func, obj, arr);

Reflect.apply(func, obj, arr);
```

### 方法
```
Reflect.apply // Function.prototype.apply
Reflect.get
Reflect.has // in操作符
Reflect.set
Reflect.construct
Reflect.defineProperty
Reflect.deleteProperty // delete操作符
Reflect.getOwnPropertyDescriptor
Reflect.ownKeys // 返回由对象自身的属性键组成的数组
Reflect.isExtensible // 判断对象是否可扩展
Reflect.preventExtensions // 设置不可拓展
Reflect.setPrototypeOf // 设置对象原型
Reflect.getPrototypeOf // Object.getPrototypeOf
```

### Reflect 在 Proxy 的作用
#### 关于 receiver 参数
receiver 参数指向调用对应属性或方法的主体对象
```
const sup = {
    _com: 'sup',
    get com() {
        return this._com
    }
}
const supProxy = new Proxy(sup, {
    get(target, props, recevier) {
        return target[props]
    }
})
const sub = {
    __proto__: supProxy,
    _com: 'sub'
}
console.log(sub.com) // sup
```
```
# supProxy
get(target, props, recevier) {
    return Reflect.get(target, prop, receiver);
}

console.log(sub.com) // sub
```

### 为什么 Object 和通过对对象命令式去操作，还需要 Reflect ？
1. 使用 Metaprogramming(元编程)思想，用一个全局对象整合一些通过调用全局或通过调用原型方法，使代码整洁。
2. Reflect 不单只为 Object 设计(如 Reflect.apply)
3. 将一些命令式的操作如 delete，in 等使用函数来替代

Reflect 是通过【Introspection】来实现反射，主要用于获取底层原生的方法。
类似的 Introspection 方法有：``Object.keys``、``Object.getOwnPropertyNames``

### 什么是 Introspection ？
> 在元编程里，可以在运行时修改语言结构，这种现象被称为 反射编程 或 反射。

> 反射有三个分支：
> 1. 自省(Introspection)：指代码能够自我检查、访问内部属性，我们可以据此获得代码的底层信息。
> 2. 自我修改（Self-Modification）：顾名思义，代码可以修改自身。
> 3. 调解（Intercession）：包含包装（wrapping）、捕获（trapping）、拦截（intercepting）

