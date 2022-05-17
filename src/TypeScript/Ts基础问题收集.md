# Ts 基础问题收集
### 1. Ts 与 Js 区别
增加了静态类型，可以在开发人员编写脚本时检测错误，使得代码质量更好，更健壮。
1. 杜绝手误导致的变量名写错;
2. 类型可以一定程度上充当文档;
3. IDE自动填充，自动联想;
### 2. 基础类型
布尔、数字、字符串、数组、元组 Tuple、枚举、Any、Void、Null 和 Undefined、Never、Object、
### 3. any 和 never 区别
any：表示赋值任意值
never：表示永不存在的值的类型
```
const errStr: any = ''
const errFn = (): nerve => throw new Error(errStr)
```

### 4. any 和 unknow 区别
unknow 不会放弃静态检测
any 放弃检测

### 5. void 和 undefined 区别
 undefined 是 void 的一个子集

### 6. 数组类型和泛型数组的区别
数组类型: number[]
泛型数组: Array<number>

### 6. 类型断言和类型守卫的区别
类型断言：<string>val / val as string
类型守卫：in / typeof / instanceof / is

### 7. 联合类型和交叉类型
联合类型: A | B
交叉类型: A & B

### 8. for..of 和 for..in
for..of: 对象的键对应的值
for..in: 对象的键，提供查看属性对象的方法。

### 9. 模块
export

### 10. 解决单个命名空间过大的问题
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

### 11. 相对和非相对模块导入
相对：通过 ``/ ./`` 开头，不能解析为外部模块声明

### 12. classic 解析策略
解析 ts 策略，使用 --module AMD|System|ES2015

1. 相对导入模块，'from ./A' 查找 'path/A.ts' 和 'path/A.d.ts'
2. 非相对导入是依照路径层层搜索

### 13. node 模块解析策略
使用require，在非相对导入时查找node_module

### 14. 说加载机制(导入模块)
假设有一个导入语句 import { a } from "moduleA";
 1. 首先，编译器会尝试定位需要导入的模块文件，通过绝对或者相对的路径查找方式；
 2. 如果上面的解析失败了，没有查找到对应的模块，编译器会尝试定位一个外部模块声明（.d.ts）；
 3. 最后，如果编译器还是不能解析这个模块，则会抛出一个错误 error TS2307: Cannot find module 'moduleA'.

### 15. T extendso onlyRead any[], T[number] 是什么意思
T[number] 将返回 T 数组元素的类型。
[K in T[number]] 对数组里每个index进行循环将index转换成key
```
type tuple = ['a', 'b', 'c']
type obj<T extends any[]> = T[number]
type name = obj<tuple> // "a" | "b" | "c"
```
### 17. TypeScript 中的 this 和 JavaScript 中的 this 有什么差异？
1. TypeScript：noImplicitThis: true 的情况下，必须去声明 this 的类型，才能在函数或者对象中使用this。

2. Typescript 中箭头函数的 this 和 ES6 中箭头函数中的 this 是一致的。
 
### 18. VS Code Tips & Typescript Command
使用 tsc 编译时产生的问题与 vs code 提示的问题不一致
1. 找到项目右下角的 Typescript 字样，右侧显示它的版本号，可以点击选择 Use Workspace Version，它表示与项目依赖的 typescript 版本一致。
2. 编辑 .vs-code/settings.json
```
{
  "typescript.tsdk": "node_modules/typescript/lib"
}
```
### 19. 使用 const enum 维护常量表
enum 枚举
```
const enum TODO_STATUS {
  TODO = 'TODO',
  DONE = 'DONE',
  DOING = 'DOING'
}
```
### 20. interface & type 区别
1. 写法区别
    interface A {}
    type A = {}
2. interface 可以如下合并多个，而 type 只能使用 & 类进行连接
3. type 可以使用 typeof 获取实例的类型进行赋值，声明基本类型，联合类型，元组
 
### 21. 使用 is 来规避强制转类型 as
```
# 使用 as
if ((err as AxiosError).isAxiosError) {
  code = (err as AxiosError).code
}

# 使用 is
function isAxiosError (error: any): error is AxiosError {
  return error.isAxiosError
}

if (isAxiosError(err)) {
  code = err.code
}
```
在 GraphQL 的源码中，有很多诸如此类的用法，用以标识类型
```
export function isType(type: any): type is GraphQLType;

export function isScalarType(type: any): type is GraphQLScalarType;
```
### 22. 什么是分布条件类型
``type UnionType<T, U = T> = T extends U...``

- 被检查类型（即上述的T）是裸类型参数的条件类型称分布条件类型。
- 在实例化期间，分布条件类型会自动分布在联合类型上，即条件类型应用于联合类型的每个成员，结果是所有结果的联合。
```
UnionType<string|number>
T extends U === 
(string extends string | number) | (number extends string |number)? ===
T有两种类型：string、number

被分布式的T: [T] === [string] | [number]
未被分布式的T1: [T1] === [string | number]
[T] !== [T1]
```

### 23. 什么是裸类型参数
类型参数没有被包装到另一种类型中，例如：数组、元组、函数、或任意其他泛型类型。
 
### 24. interface 和 type 区别
interface：只能描述对象，能继承可重命名，适合于【库类对外保留方法】。
 
type：能使用计算属性(in)，不能继承只能合并(&)，支持原始属性，更适合于【作用组件内部】
```
 interface Person {
  name: string
 }
 
 interface Person {
  age: number
 }
 => type Person =  { name: string } & { age: number }
 === 
 interface IPerson {
  name: string
  age: number
}
```
### 25. ``T = keyof U`` 和 ``T extends keyof U`` 区别
- ``T = keyof Obj``：T 为 Obj对象的 key
- ``T extends keyof U``: T 为 Obj对象的 key 的子集
