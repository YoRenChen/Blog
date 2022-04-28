# Promise练习 - 求返回值
```
Promise.resolve().then(() => {
    // mt1
    console.log(0);
    return Promise.resolve(4); // mt8
}).then((res) => {
    console.log(res) // mt2
})

Promise.resolve().then(() => {
    console.log(1); // mt3
}).then(() => {
    console.log(2); // mt4
}).then(() => {
    console.log(3); // mt5
}).then(() => {
    console.log(5); // mt6
}).then(() =>{
    console.log(6); // mt7
})

// 0123456
```
1. 同步执行，创建 7 个微任务 mt1~7
2. 此时 execution context stack 为空，mt1 和 mt3 状态变 runnable
3. JS 引擎安排 mt1 和 mt3 进入微任务队列执行(HostEnqueuePromiseJob)
4. Perform a microtask checkpoint，同一次 JS call 变为 runnable 的依次执行
5. 执行完 mt1 输出 0 ，并返回 ``Promise.resolve(4)``，由于返回值是 fulfilled 状态的 Promise，JS生成 mt8， mt1 出队列（此时 mt2 状态为 fulfilled）
6. 执行完 mt3 ，输出1，mt4 变 runnable，mt3 出队
7. 此时 execution context stack 为空，安排为 runnable 的 mt4 和 mt8 进入队列
8. mt4 执行完出队 mt5 变为 runnable
9. mt8 执行完出队 mt2 变为 runnable
10. 此时 execution context stack 为空，安排为 runnable 的 mt5 和 mt2 进入队列
11. 后序依次进行...
