### Required
```
# 将一个定义中的属性全部变成必选参数
type Required<T> = {
  [P in keyof T]-?: T[P];
}
```
### Partial
```
# 一个定义中的所有属性都变成可选参数
type Partial<T> = {
  [P in keyof T]?: T[P];
};
```
### Pick
```
# 从一个已声明的类型中抽取出一个新的子类型
type Pick<T, K extends keyof T> = {
  [P in K]: T[P];
};
type PickType = Pick<A, 'a' | 'b'>
```
### Exclude
从 T 选出排除 U 的键值

``type Exclude<T, U> = T extends U ? never : T``

```
type User = {
  id: string;
  name: string;
};
type UserWithoutName = Exclude<keyof User, "name">;
// type UserWithoutName = "id"
```
### Record
``type Record<K extends string | number | symbol, T> = { [P in K]: T; }``
```
type Prop = 'prop1' | 'prop2' | 'prop3'
type StringType = 'string'
type ThreeProps = Record<Prop, StringType>
// type ThreeProps = { prop1: string; prop2: string; prop3: string; }
```
### Omit
忽略 T 中的 K 属性的值。

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
### Parameters
拿到函数的参数类型

``type Parameters<T extends (...args: any) => any> = T extends (...args: infer P) =>  any ? P : never``
### ReturnType
获取返回类型

``type ReturnType<T extends (...args: any[]) => any> = T extends (...args: any[]) => infer R ? R : any``

