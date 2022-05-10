# 实现一个 once 函数，记忆返回结果只执行一次
```
const f = (x) => x;

const onceF = _once(f);

onceF(3); // 3

onceF(4); // 3
```

```
const _once = (f) => {
    let result
    let revoked = false
    return (...arg) => {
        if (revoked) return result;
        const res = f(...arg)
        revoked = true
        result = res
        return res
    }
}
```
