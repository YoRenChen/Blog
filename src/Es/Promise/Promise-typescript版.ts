enum Status {
  PENDING = 'pending',
  FULFILLED = 'fulfilled',
  REJECTED = 'rejected'
}

interface MyPromiseConstructor {
  readonly prototype: MyPromise<any>;
  new <T>(executor: (resolve: (value?: T | MyPromiseLike<T>) => void, reject: (reason?: any) => void) => void): MyPromise<T>;
  resolve(): MyPromise<void>;
  resolve<T>(value: T | PromiseLike<T>): MyPromise<T>;
  reject<T = never>(reason?: any): MyPromise<T>;
  all<T>(values: Iterable<T | PromiseLike<T>>): MyPromise<T[]>;
  race<T>(values: Iterable<T>): MyPromise<T extends MyPromiseLike<infer U> ? U : T>;
  allSettled<T>(values: Iterable<T>): MyPromise<PromiseSettledResult<T extends MyPromiseLike<infer U> ? U : T>[]>;
  any<T>(values: (T | MyPromiseLike<T>)[] | Iterable<T | MyPromiseLike<T>>): MyPromise<T>;
}
// 实例方法定义
interface MyPromise<T> {
  then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | MyPromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): MyPromise<TResult1 | TResult2>;
  catch<TResult = never>(onrejected?: ((reason: any) => TResult | MyPromiseLike<TResult>) | undefined | null): MyPromiseLike<T | TResult>;
  finally(cb?: (() => void) | undefined | null): MyPromise<T>;
}
// 一个拥有then()方法的对象（官方的叫法是 thenable），只要有then()方法就会将其当做一个Promise实例看待
interface MyPromiseLike<T> {
  then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): PromiseLike<TResult1 | TResult2>;
}

type Resolve<T> = (value: T | MyPromiseLike<T>) => void
type Reject = (reason?: void | any) => void
type Executor<T> = (resolve: Resolve<T>, reject: Reject) => void
type onFulfilled<T, TResult1> =
  | ((value: T) => TResult1 | MyPromiseLike<TResult1>)
  | undefined
  | null
type onRejected<TResult2> =
  | ((reason: void | any) => TResult2 | MyPromiseLike<TResult2>)
  | undefined
  | null

function isPromise(value: any): value is PromiseLike<any> {
  return (
    ((typeof value === 'object' && value !== null) ||
      typeof value === 'function') &&
    typeof value.then === 'function'
  )
}

// 检查当前的 Promise 是否是
function resolvePromise<T>(
  promise2: MyPromise<T>,
  res: T | MyPromiseLike<T>,
  resolve: Resolve<T>,
  reject: Reject
) {
  // 不能引用同一个对象，不然会无限循环的
  if (res === promise2) {
    return reject(new TypeError('Chaining cycle detected for promise #<Promise>'))
  }

  // let called = false // 防止多次调用

  // 这里实际是 res instanceof MyPromise，为符合 Promise A+ 拓展写
  if (typeof res === 'object' || typeof res === 'function') {
    if (res === null) return resolve(res)

    let then
    try {
      // 存储了一个指向 x.then 的引用，然后测试并调用该引用，以避免多次访问 x.then 属性。
      then = (res as MyPromiseLike<T>).then
    } catch (error) {
      return reject(error)
    }

    if (typeof res === 'function') {
      let called = false // 防止多次调用
      try {
        // 这里其实就是调用传入的 Promise 的 then 方法，下面代码就是执行了 x.then(()=>{},()=>{})
        then.call(
          res, // this 指向 res
          x => {
            // 如果 resolvePromise 和 rejectPromise 均被调用，
            // 或者被同一参数调用了多次，则优先采用首次调用并忽略剩下的调用
            // 实现这条需要前面加一个变量 called
            // 如多次 resovle 只取第一次 resovle 的结果
            if (called) return
            called = true
            resolvePromise(promise2, x, resolve, reject)
          },
          y => {
            // 如果 rejectPromise 以据因 r 为参数被调用，则以据因 r 拒绝 promise
            if (called) return
            called = true
            // 如果传入的 Promise 被拒绝，直接抛出到最外层
            reject(y)
          }
        )
      } catch (error) {
        // 如果调用 then 方法抛出了异常 error：
        // 如果 resolvePromise 或 rejectPromise 已经被调用，直接返回
        if (called) return

        // 否则以 error 为据因拒绝 promise
        reject(error)
      }
    } else {
      // 如果 then 不是函数，以 x 为参数执行 promise
      resolve(res)
    }
    (res as MyPromiseLike<T>).then(resolve, reject)
  } else {
    resolve(res)
  }
}

// res instanceof MyPromise 简单处理
// function resolvePromise<T>(
//   promise2: MyPromise<T>,
//   res: T | MyPromiseLike<T>,
//   resolve: Resolve<T>,
//   reject: Reject
// ) {
//   if (promise2 === res) {
//     return reject(new TypeError('Chaining cycle detected for promise #<Promise>'))
//   }
//   if (res instanceof MyPromise) {
//     res.then(resolve, reject)
//   } else {
//     resolve(res)
//   }
// }

class MyPromise<T> {
  status = Status.PENDING
  successValue!: T
  failReason?: any
  onFulfilledCallback: (() => void)[] = [] // 成功的回调
  onRejectedCallback: (() => void)[] = [] // 失败的回调

  constructor(executor: Executor<T>) {
    try {
      executor(this._resolve, this._reject)
    } catch (error) {
      this._reject(error)
    }
  }

  _resolve = (value: T | PromiseLike<T>) => {
    if (isPromise(value)) {
      // 再次将内部的 resolve 和 reject 函数传入
      value.then(this._resolve.bind(this), this._reject.bind(this))
      return
    }

    // 如果是 pending 状态就变为 fulfilled
    if (this.status === Status.PENDING) {
      this.status = Status.FULFILLED
      // 这里的 value 类型只会是 T
      this.successValue = value
      // resolve 后执行 .then 时传入的回调
      this.onFulfilledCallback.forEach((fn) => fn())
    }
  }

  _reject = (reason) => {
    if (this.status === Status.PENDING) {
      this.status = Status.REJECTED
      this.failReason = reason
      this.onRejectedCallback.forEach((fn) => fn())
    }
  }

  then<TResult1 = T, TResult2 = never>
    (
      onFulfilled?: onFulfilled<T, TResult1>,
      onRejected?: onRejected<TResult2>
    ): MyPromise<TResult1 | TResult2> {
    // 这里确保空链式调用的时候可延续 (.then().then()...)
    onFulfilled = typeof onFulfilled === 'function' ? onFulfilled : (value: T | TResult1) => value as TResult1
    onRejected = typeof onRejected === 'function' ? onRejected : err => { throw (err) }

    const promise2 = new MyPromise<TResult1 | TResult2>((resolve, reject) => {
      if (this.status === Status.PENDING) {
        // 如果为 pending，都需要存，状态确定后再依次执行
        // 执行回调的时候有 setTimeout，这里就不加了
        this.onFulfilledCallback.push(() => {
          try {
            const res = onFulfilled!(this.successValue)
            resolvePromise(promise2, res, resolve, reject)
          } catch (error) {
            reject(error)
          }
        })
        try {
          this.onRejectedCallback.push(() => {
            const res = onRejected!(this.failReason)
            resolvePromise(promise2, res, resolve, reject)
          })
        } catch (error) {
          reject(error)
        }
      } else if (this.status === Status.FULFILLED) {
        queueMicrotask(() => {
          try {
            const res = onFulfilled!(this.successValue)
            resolvePromise(promise2, res, resolve, reject)
          } catch (error) {
            reject(error)
          }
        })
      } else if (this.status === Status.REJECTED) {
        queueMicrotask(() => {
          try {
            const res = onRejected!(this.failReason)
            resolvePromise(promise2, res, resolve, reject)
          } catch (error) {
            reject(error)
          }
        })
      }
    })
    return promise2
  }

  catch<TResult = never>(
    onrejected?: onRejected<TResult>
  ): MyPromise<T | TResult> {
    return this.then(null, onrejected)
  }

  finally(cb): MyPromise<T> {
    // cb 为异步函数，所以需要 MyPromise.resolve().then()
    function rCb() {
      return typeof cb === 'function' ? cb() : cb
    }
    return this.then(
      val => MyPromise.resolve(rCb()).then(() => val),
      reason => MyPromise.reject(rCb()).then(() => reason)
    )
  }

  // 构建静态方法: Promise.resolve()
  static resolve(): MyPromise<void>
  static resolve<T>(val: T | PromiseLike<T>): MyPromise<T>
  // 最后的函数实体需要同时支持上面两种函数重载的类型，所以我们变成可选值
  static resolve<T>(val?: T | PromiseLike<T>): MyPromise<T> {
    // 如果是 MyPromise 方法直接返回
    // 构建新的 MyPromise 只执行 resolve
    if (val instanceof MyPromise) {
      return val
    } else {
      return new MyPromise((resolve) => resolve(val))
    }
  }

  static reject<T = never>(val?: any): MyPromise<T> {
    return new MyPromise((_, reject) => reject(val))
  }

  /**
   * 接收一个iterable对象，返回一个 Promise 实例;
   * 全部 thenable 状态是 fulfilled，实例状态 fulfilled;
   * 有一个 thenable 失败 rejected，实例状态就会是 rejected。
   * 如果有 thenable 的状态为pending，此实例的状态也为pending。
   * @param values Iterable
   * @returns MyPromise
   */
  static all<T>(values: Iterable<T | PromiseLike<T>>): MyPromise<T[]> {
    return new MyPromise((resolve, reject) => {
      const resultArr: T[] = []
      const doneArr: boolean[] = [] //  判断是否已经全部完成了
      const iter = values[Symbol.iterator]() // 获取迭代器对象
      let cur = iter.next() // 获取值 {value:xxx, done: false}

      // 判断迭代器是否迭代完毕同时将最后得到的值放入结果数组中
      const resolveResult = (value: T, index: number, done?: boolean) => {
        resultArr[index] = value
        doneArr[index] = true
        if (done && doneArr.every((item) => item)) {
          resolve(resultArr)
        }
      }
      for (let i = 0; !cur.done; i++) {
        const value = cur.value
        doneArr.push(false)
        cur = iter.next()
        if (isPromise(value)) {
          value.then((value: T) => {
            resolveResult(value, i, cur.done)
          }, reject)
        } else {
          resolveResult(value, i, cur.done)
        }
      }
    })
  }

  /**
   * 接收一个iterable对象，返回一个 Promise;
   * 一旦迭代器中的某个 thenable 的状态变为 fulfiled 或 rejected，
   * 该实例的状态就会变成 fulfiled 或 rejected。
   * @param values Iterable
   * @returns MyPromise
   */
  static race<T>(values: Iterable<T>): MyPromise<T extends MyPromiseLike<infer U> ? U : T> {
    return new MyPromise((resolve, reject) => {
      const iter = values[Symbol.iterator]()
      let cur = iter.next() // 获取值 {value:xxx, done: false}
      while (!cur.done) {
        const value = cur.value
        cur = iter.next()
        if (isPromise(value)) {
          value.then(resolve, reject)
        } else {
          // 普通值,这时的值为 T，但是 Typescript 无法再深度判断了，需要自己手动转换
          resolve(value as T extends PromiseLike<infer U> ? U : T)
        }
      }
    })
  }

  static allSettled<T>(values: Iterable<T>): MyPromise<any> {
    return new MyPromise((reslove) => {
      const resultArr: any[] = []
      const doneArr: boolean[] = []
      const iter = values[Symbol.iterator]()
      // 当前值
      let cur = iter.next()
      const resolveResult = (value: any, index: number, done?: boolean) => {
        resultArr[index] = {
          status: Status.FULFILLED,
          value
        }
        doneArr[index] = true
        if (done && doneArr.every((item) => item)) {
          reslove(resultArr)
        }
      }
      for (let i = 0; !cur.done; i++) {
        const value = cur.value
        doneArr.push(false)
        cur = iter.next()
        if (isPromise(value)) {
          value.then(
            (value) => {
              resolveResult(value, i, cur.done)
            },
            (reason) => {
              // 这里和 resolve 基本也没什么区别，修改一下状态和属性就ok了
              resultArr[i] = {
                status: Status.REJECTED,
                reason
              }
              doneArr[i] = true
              if (cur.done && doneArr.every((item) => item)) {
                reslove(resultArr)
              }
            }
          )
          // 不是 thenable 直接存储
        } else {
          resolveResult(value, i, cur.done)
        }
      }
    })
  }

  static any<T>(
    values: (T | PromiseLike<T>)[] | Iterable<T | PromiseLike<T>>
  ): MyPromise<T> {
    return new MyPromise((resolve, reject) => {
      // 接收迭代器
      const iter = values[Symbol.iterator]()
      let cur = iter.next()
      const doneArr: boolean[] = []
      for (let i = 0; !cur.done; i++) {
        const value = cur.value
        cur = iter.next()
        doneArr.push(false)
        if (isPromise(value)) {
          // 如果为 thenable，根据该 thenable 的状态进行判断
          value.then(resolve, () => {
            doneArr[i] = true
            // 只有传入迭代器的值全是 thenable 并且 thenable 的状态全部为 rejected 才会触发
            if (cur.done && doneArr.every((item) => item)) {
              // 应该抛出 AggregateError 的错误类型，但是因为 AggregateError 因为是实验版本，所有只有最新版浏览器才会有，我这里就用 Error 代替了
              const e = new Error('All promises were rejected')
              e.stack = ''
              reject(e)
            }
          })
        } else {
          resolve(value)
        }
      }
    })
  }
}
