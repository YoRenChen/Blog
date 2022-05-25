# 自定义过滤器-filter

### 用法

```
// 注册
Vue.filter('my-filter', function (value) {
  // 返回处理后的值
})

// getter，返回已注册的过滤器
var myFilter = Vue.filter('my-filter')

<!-- 局部注册 -->
filters:{
    myFilter:function(value){
        value+='hello world'
        return value
    }
}
<!-- 使用 -->
{{message| myFilter | myFilter('arg1','arg2')}}
```

### 原理

1. 编译阶段
   把带有过滤器的模板编译成函数调用。
2. 执行阶段
   拿到编译后的模板，查询注册的过滤器，进行过滤器函数执行。
