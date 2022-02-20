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
### ! [Deep Readonly](https://github.com/type-challenges/type-challenges/blob/master/questions/9-medium-deep-readonly/README.md)
```
type List = string | number | boolean | undefined | null | Function;

type DeepReadonly<T> = {
  readonly [P in keyof T]: T[P] extends List ? T[P] : DeepReadonly<T[P]>;
}
```
### Tuple to Union
```
type TupleToUnion<T extends unknown[]> =  T[number]
```
### Tuple to Union
```
type TupleToUnion<T extends unknown[]> =  T[number]
```
### ! [Chainable Options](https://github.com/type-challenges/type-challenges/blob/master/questions/12-medium-chainable-options/README.md)
```
type Chainable<T = {}> = {
  option<K extends string, V>(key: K, value: V): Chainable<T & { [k in K]: V }>
  get(): { [K in keyof T]: T[K]}
}

OR

class Chainable<T = {}> {
  result: { [K in keyof T]: T[K]}
  option<K extends string, V>(key: K, value: V): Chainable<T & { [k in K]: V }> {
    this.result[key] = value
    return this
  }

  get(): { [K in keyof T]: T[K]} {
    return this.result
  }
}
```
### Last of Array
```
(typeScript >= 4.0)
type Last<T extends unknown[]> = T extends [...infer _, infer K] ? K : never
```
### Pop
```
type Pop<T extends unknown[]> = T extends [...infer U, _] ? U : never
```
### ! [Promise.all ](https://github.com/type-challenges/type-challenges/blob/master/questions/20-medium-promise-all/README.md)
```
declare function PromiseAll<T extends unknown[]>(values: readonly [...T]): Promise<{
  [K in keyof T]: T[K] extends Promise<infer R> ? R :T[K]
}>
```
### Type Lookup 
```
type LookUp<T, U extends string> = T extends { type: U } ? T : never
```
### Trim Left
```
type TrimLeft<T extends string> = T extends `${' '}${infer B}` ? TrimLeft<B> : T
```
### * Trim
```
type Trim<T extends string> = T extends `${' '}${infer A}` ? Trim<A> : T extends `${infer B}${' '}` ? Trim<B> : T
```
### Capitalize
```
type myCapitalize<T extends string> = T extends `${infer A}${infer B}` ? `${Uppercase<A>}${B}` : never
```
### Replace
```
type Replace<S extends string, From extends string, To extends string> = S extends `${infer L}${From}${infer R}` ? Replace<`${L}${To}${R}`, From, To> : S
```
### ReplaceAll
```
type ReplaceAll<S extends string, From extends string, To extends string> = S extends `${infer L}${From}${infer R}` ? Replace<`${L}${To}${R}`, From, To> : S
```
### * Append Argument
```
type AppendArgument<T extends (...arg: any[]) => any, U> = T extends (...arg: infer R) => number ? (...arg: [...R, U]) => number : never
```
### 
