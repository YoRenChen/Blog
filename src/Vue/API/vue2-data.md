# vue2-data

实例时候的 data 是对象或函数，进行 options 合并。

组件内的 data 是一个函数，返回一个对象。

#### 为什么组件中的 data 必须为一个函数

组件通过 `Vue.extend` 构造器生成 `VueComponent` 类型的实例。

组件有可能被实例化多次。
如果 data 使用对象就多个实例之间共享引用地址导致重复。
如果使用 function + return，那么每个实例都是返回新的引用地址。

#### 组件内部使用对象会怎么样

会报错，提示`the data option is not a funciton that return`
