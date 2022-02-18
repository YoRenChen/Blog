# type-challenges
## 原文
[type-challenges](https://github.com/type-challenges/type-challenges)

## Easy
### pick
```
type MyPick<T, U extends keyof T> = { [K in U]: T[K] }
```
### Readonly
```
type MyReadonly<T> = { readonly [K in keyof T]: T[K] }
```
### Tuple to Object
```
type TupleToObject<T extends readonly unknown[]> = {
  [P in T[number]]: P
}
```
### First of Array
```
type First<T extends unknown[]> = T extends [infer P, ...infer K] ? P : T
```
### Length of Tuple
```
type Length<T extends unknown[]> = T['length']
```
### Exclude
```
type ExcludeType<T, U> = T extends U ? never : T
```
### Awaited
```
type Awaited<T extends Promise<unknown>> = T extends Promise<infer R> ?
  R extends Promise<unknown> ? Awaited<R> : R
  : never
```
### If
```
type If<T extends boolean, U, K> T extends true ? U : K
```
### Concat
```
type Concat<U extends unknown[], K extends unknown[]> = [...U, ...K]
```

### Includes
```
type Includes<T extends unknown[], U extends string> = U extends T[number] ? true : false
```

### Push
```
type Push<T extends unknown[], U extends string> = [...T, U]
```
### Unshift
```
type Unshift<T extends number[], K extends number> = [K, ...T]
```
### Parameters
获取函数参数
```
type Parameters<T extends (...arg: unknown[]) => unknown > = T extends (...arg: infer U) => unknown ? [...arg] : never
```
## Medium
### Get Return Type
```
type MyReturnType<T extends (...arg: unknown[]) => unknown> = 
  T extends (...arg: unknown[]) => infer U ? U : never
```
### * Omit
```
type MyPick<T, U extends keyof T> = {[P in U]: T[P]}
type MyExclude<T, U extends T> = T extends U ? never : T
type MyOmit<T, U extends keyof T> = MyPick<T, MyExclude<keyof T, U>>
```
### * Readonly 2
```
type MyReadonly2<T, K = unknown> = K extends keyof T
  ? { readonly [P in K]: T[P] } & { [L in Exclude<keyof T, K>]: T[L] }
  : { readonly [A in keyof T]: T[A] }
```
### ! Deep Readonly
```
type List = string | number | boolean | undefined | null | Function;

type DeepReadonly<T> = {
  readonly [P in keyof T]: T[P] extends List ? T[P] : DeepReadonly<T[P]>;
}
```
### 
