# Ts 基础 
### Ts 与 Js 区别
增加了静态类型，可以在开发人员编写脚本时检测错误，使得代码质量更好，更健壮。
1. 杜绝手误导致的变量名写错;
2. 类型可以一定程度上充当文档;
3. IDE自动填充，自动联想;
### 基础类型
布尔、数字、字符串、数组、元组 Tuple、枚举、Any、Void、Null 和 Undefined、Never、Object、
### any 和 never 区别
any：表示赋值任意值
never：表示永不存在的值的类型
```
const errStr: any = ''
const errFn = (): nerve => throw new Error(errStr)
```

### any 和 unknow 区别
unknow 不会放弃静态检测
any 放弃检测

### void 和 undefined 区别
 undefined 是 void 的一个子集

### 数组类型和泛型数组的区别
数组类型: number[]
泛型数组: Array<number>

### 类型断言和类型守卫的区别
类型断言：<string>val / val as string
类型守卫：in / typeof / instanceof / is

### 联合类型和交叉类型
联合类型: A | B
交叉类型: A & B

### for..of 和 for..in
for..of: 对象的键对应的值
for..in: 对象的键，提供查看属性对象的方法。

### 模块
export

### 解决单个命名空间过大的问题
命名空间使用 namespace X {}
分割文件。不同文件但同一个命名空间
```
# a.ts
namespace a {
    export interface StringA {}
}

# b.ts
/// <reference path="a.ts" />
namespace a {
     export interface StringB {}
}
```
加载多文件。
1. ``tsc --outFile xxx.ts``
2. TS文件都编译

### 相对和非相对模块导入
相对：通过 ``/ ./`` 开头，不能解析为外部模块声明

### classic 解析策略
解析 ts 策略，使用 --module AMD|System|ES2015

1. 相对导入模块，'from ./A' 查找 'path/A.ts' 和 'path/A.d.ts'
2. 非相对导入是依照路径层层搜索

### node 模块解析策略
使用require，在非相对导入时查找node_module

### 说加载机制(导入模块)
假设有一个导入语句 import { a } from "moduleA";
 1. 首先，编译器会尝试定位需要导入的模块文件，通过绝对或者相对的路径查找方式；
 2. 如果上面的解析失败了，没有查找到对应的模块，编译器会尝试定位一个外部模块声明（.d.ts）；
 3. 最后，如果编译器还是不能解析这个模块，则会抛出一个错误 error TS2307: Cannot find module 'moduleA'.
