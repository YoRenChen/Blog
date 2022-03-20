# vue3 - watchEffect
## watchEffect
> 立即执行传入的一个函数，同时响应式追踪其依赖，并在其依赖变更时重新运行该函数。

### watchEffect 是什么
1. 会在 setup 阶段收集 watchEffect 方法里的响应式属性的依赖
2. 在 setup 阶段和响应式收集的依赖被改变的时候触发 watchEffect 方法
3. 如果不设置显示注销，会在组件销毁的时候被注销
4. 里面有 onInvalidate 函数属性，用这个方法跳出 watchEffect 方法，一般用来清除 side effect。

#### watchEffect 使用
```
<script setup lang="ts">
const num = ref(0)
watchEffect(onInvalidate => {
    console.log('会自动收集这个响应式变量', num)
    onInvalidate(() => {
        console.log('当收集的变化时就会启动这个方法，初始化不执行')
    })
    console.log('结束')
)
</script>

# 当 num 变化时
// 当收集的变化时就会启动这个方法，初始化不执行
// 会自动收集这个响应式变量
// 结束
```
#### watchPostEffect
watchEffect 的别名，带有 flush: 'post' 选项。
在组件更新后触发，而不是在setup阶段，直到首次渲染完成。

#### watchSyncEffect
watchEffect 的别名，带有 flush: 'sync' 选项。

### watchEffect 特点
#### watchEffect 会在 setup 和 组件跟新前响应
####  被调用时会被链在该组件直到组件卸载才被停止，除非显示调用
```
const stop = watchEffect(() => {})
// later
stop()
```
#### 具备清除 side effect 作用使用onInvalidate()
```
watchEffect(onInvalidate => {
  const token = performAsyncOperation(id.value)
  onInvalidate(() => {
    token.cancel()
  })
})
```
实际上 sidEffect 很多是返回一个 Promise，就需要把 onInvalidate 注册提到 Promise 解析之前
```
const data = ref(null)
watchEffect(async onInvalidate => {
  onInvalidate(() => {
    /* ... */
  }) 
  // 我们在Promise解析之前注册清除函数
  data.value = await fetchData(props.id)
})
```

#### side effect
一个函数运行后产生了可以影响其外部或可以看到的效果，就叫副作用（log/alert/showModel）。

副作用就是执行某种操作，无副作用就是执行某种计算。

不可预知的接口请求就是一个 side effect。在使用响应式属性去请求接口时，在请求阶段响应式属性发生多次改变，这导致发起多次请求，浪费资源。
#### 与 watch 差异
1. watchEffect 只要引用到响应式属性``ref``，就会自动收集依赖，当这些属性被更改就会被就会执行。而 watch 只能监听指定属性；
2. watchEffect 拿不到像 watch 的新旧值;
3. 在 setup 阶段会执行一次以用依赖收集，收集之后依赖发生改变再执行。而 watch 一开始就指定依赖;

#### onInvalidate 使用和 React useEffect 对比
```
# onInvalidate
watchEffect((onInvalidate) => {
    window.addEventListener("click", handler)
    onInvalidate(() => { /* code */})
})

# React useEffect
useEffect(() => {
  window.addEventListener("click", handler)
    return () => {/* code */}
})
```
React useEffect 直观但不直接支持 async
useEffect 里只能是普通函数，需要 return 使用 IIEF 自调用一层 async

### 流程与原理
#### 流程
1. 判断 effect为函数和cb 为空进行依赖收集
2. 通过 callWithAsyncErrorHandling 注册 onInvalidate
3. 在 doWatch 中执行 run函数 和 返回一个 停止函数

#### 原理
watchEffect 和 watch 使用同一套API - ``doWatch``
```
# d.ts
type OnCleanup = (cleanupFn: () => void) => void

export type WatchEffect = (
    onCleanup: OnCleanup
) => void

export declare function watchEffect(
    effect: WatchEffect,
    options?: WatchOptionsBase
): WatchStopHandle;

// Simple effect.
export function watchEffect(
  effect: WatchEffect,
  options?: WatchOptionsBase
): WatchStopHandle {
  return doWatch(effect, null, options)
}
```

#### doWatch - watchEffect
```
function doWatch(
  source: WatchSource | WatchSource[] | WatchEffect | object,
  cb: WatchCallback | null,
  { immediate, deep, flush, onTrack, onTrigger }: WatchOptions = EMPTY_OBJ
): WatchStopHandle {}
```

依赖收集
```
getter = () => {
    if (instance && instance.isUnmounted) {
      return
    }
    if (cleanup) {
      cleanup()
    }
    return callWithAsyncErrorHandling(
      source,
      instance,
      ErrorCodes.WATCH_CALLBACK,
      [onCleanup]
    )
}
```
由于 watchEffect ``return doWatch(effect, null, options)``， cb 属性为不存在。

在 doWatch 中执行 run函数 和 返回一个 停止函数
```
effect.run()

return () => {
    effect.stop()
    if (instance && instance.scope) {
      remove(instance.scope.effects!, effect)
    }
}
```

#### onInvalidate
```
let cleanup: () => void
let onCleanup: OnCleanup = (fn: () => void) => {
    cleanup = effect.onStop = () => {
        callWithErrorHandling(fn, instance, ErrorCodes.WATCH_CLEANUP)
    }
  }
```
