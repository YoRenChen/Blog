# a.b.c 转换成对象 {a:{b:{c:{}}}}}

#### 解法 1
```
'a,b,c'.split(',').reverse().reduce((r,e)=>({[e]:r}),{});
```

#### 解法 2
```
function change(arr) {
  if (arr.length === 1) return {[arr[0]]: {}}
  const pointKey = arr.shift()
  return { [pointKey]: a(arr) }
}
const str = 'a.b.c'
change(str.split('.'))
```

## 进阶
### 把 entry 转换成如下对象
```
var entry = {
  'a.b.c.dd': 'abcdd',
  'a.d.xx': 'adxx',
  'a.e': 'ae'
}

// 要求转换成如下对象
var output = {
  a: {
   b: {
     c: {
       dd: 'abcdd'
     }
   },
   d: {
     xx: 'adxx'
   },
   e: 'ae'
  }
}
```
