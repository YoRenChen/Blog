### Ts Utility Types 地址
[Utility Types](https://www.typescriptlang.org/docs/handbook/utility-types.html)

### [Partial](https://www.typescriptlang.org/docs/handbook/utility-types.html#partialtype)
```
# 一个定义中的所有属性都变成可选参数
type Partial<T> = {
  [P in keyof T]?: T[P];
};
```
### [Required](https://www.typescriptlang.org/docs/handbook/utility-types.html#requiredtype)
```
# 将一个定义中的属性全部变成必选参数
type Required<T> = {
  [P in keyof T]-?: T[P];
}
```
### [readonly](https://www.typescriptlang.org/docs/handbook/utility-types.html#readonlytype)
转只读形式
```
type Todo = {
  title: string;
}

type ReadOnly<T> = {
  readonly [P in keyof T]: T[P]
}

const aaa: ReadOnly<Todo> = {
  title: '123';
}
aaa.title = '345' // Cannot assign to 'title' because it is a constant or a read-only property.
```
### [Record](https://www.typescriptlang.org/docs/handbook/utility-types.html#recordkeys-type)
从联合类型 K 中组成类型为 T 的对象类型。

``type Record<K extends string | number | symbol, T> = { [P in K]: T }``

```
type ThreeProps = Record<'prop1' | 'prop2' | 'prop3', 'string'> // type ThreeProps = { prop1: string; prop2: string; prop3: string; }
```
### [Pick](https://www.typescriptlang.org/docs/handbook/utility-types.html#picktype-keys)
从 T 类型中抽取出 k 元素组成新的子类型。

``type Pick<T, K extends keyof T> = { [P in K]: T[P] }``
```
type Todo = {
  a: string;
  b: string;
  c: string;
}
type PickType = Pick<Todo, 'a' | 'b'> // type PickType = { a: string; b: string; }
```
### [Omit](https://www.typescriptlang.org/docs/handbook/utility-types.html#omittype-keys)
忽略 T 类型中的 K 属性的值。

``type Omit<T, K extends keyof any> = Pick<T, Exclude<keyof T, K>>``
```
type User = {
  id: string;
  name: string;
  email: string;
};

type Omit<T, K extends keyof any> = Pick<T, Exclude<keyof T, K>>
type UserWithoutEmail = Omit<User, "name">;

// type UserWithoutEmail = { id: string; email: string; }
```
### [Exclude](https://www.typescriptlang.org/docs/handbook/utility-types.html#excludeuniontype-excludedmembers)
从对象类型 T 选出已排除 U 的键

``type Exclude<T, U> = T extends U ? never : T``

```
type User = {
  id: string;
  name: string;
};
type UserWithoutName = Exclude<keyof User, "name">; // type UserWithoutName = "id"
```

### [Extract](https://www.typescriptlang.org/docs/handbook/utility-types.html#extracttype-union)
从类型 T 中提取出与 U 相交的类型
`` type Extract<T, U> = T extends U ? T : never``

```
type T01 = Extract<"a" | "b" | "c", "a" | "f">; // type T01 = "a"
```
### [NonNullable](https://www.typescriptlang.org/docs/handbook/utility-types.html#nonnullabletype)
返回剔除含有 null and undefined 的值.

``type NonNullable<T> = T extends null | undefined ? T : never``
```
type T1 = NonNullable<string[] | null | undefined>; // type T1 = string[]
```

### [Parameters](https://www.typescriptlang.org/docs/handbook/utility-types.html#parameterstype)
拿 T 类型函数的参数类型组成 元祖类型

``type Parameters<T extends (...arg: unknow) => unknow> = T extends (...arg: infer R) => unknow ? R : never``
```
type T1 = Parameters<(s: string) => void>; // type T1 = [string]
```
### [ConstructorParameters](https://www.typescriptlang.org/docs/handbook/utility-types.html#constructorparameterstype)
提取构造器函数类型的所有参数。

``type ConstructorParameters<T extends new (...arg: unknow) => unknow> = T extends new (...arg: infer R) => unknow ? R : never``

```
type T0 = ConstructorParameters<ErrorConstructor>; // type T0 = [message?: string]
```
### [ReturnType](https://www.typescriptlang.org/docs/handbook/utility-types.html#returntypetype)
获取返回类型

``type ReturnType<T extends (...args: unknow[]) => any> = T extends (...args: unknow[]) => infer R ? R : any``
```
type T0 = ReturnType<() => string>; // string
type T1 = ReturnType<string>; // Type 'string' does not satisfy the constraint '(...args: unknown[]) => any'.
```

### [InstanceType](https://www.typescriptlang.org/docs/handbook/utility-types.html#instancetypetype)
提取构造器函数类型的返回类型，它相当于是构造器函数的 ReturnType<T> 类型。

``type InstanceType1<T extends new (...args: unknown[]) => unknown> = T extends new (...args: unknown[]) => infer R ? R : any``
```
class C {
  x = 0;
  y = 0;
}
 
type T0 = InstanceType<typeof C>; // type T0 = C
```
