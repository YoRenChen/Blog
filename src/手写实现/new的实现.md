# new的实现
### 步骤
1. 新建一个对象
2. 新建对象的 __proto__ 指向 构造方法 prototype
3. 重新绑定this，使构造函数的this指向新对象
    (Machine.call(A), Machine的this变成了A并执行Machine)
4. 返回this

### 实现
```
const New = (fn) => {
  const obj = {}
  if (fn.prototype !== null) {
    obj.__proto__ = fn.prototype
  }
  const res = fn.apply(obj, Array.prototype.slice.call(arguments, 1))
  if ((typeof res === 'function' || typeof res === 'object') && ret !== null) {
    return res
  }
  return obj
} 
```
