# TypeScript
## 基础
- 类型
- 分布条件类型
- interface 和 type
- 类型断言和类型守卫

#### 协变与逆变
> 计算机里是描述具有父/子的关系类型，构造出的多个复杂类型之间是否有父/子关系类型。

##### 协变(Covariance)
- ``Animal 兼容 Cat``，那么 ``Array<Cat> <= Array<Animal>`` 也兼容
- ``type SetArr<T> = T[]``，返回值 T[] 也是协变
##### 逆变(Contravariance)
- ``Animal 兼容 Cat``，但函数的参数 ``Cat 兼容 Animal`` 是逆变的。
