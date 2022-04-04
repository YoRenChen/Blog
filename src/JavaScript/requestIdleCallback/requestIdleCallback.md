# requestIdleCallback 空闲时间算法
> 插入一个函数，这个函数将在浏览器空闲时期被调用。
```
const handle = window.requestIdleCallback(callback[, options])

options
    - timeout: 在 timeout 正值毫秒过后还没有被调用，会主动放入事件队列中执行。
```

### 页面流畅与FPS
最低流畅度每秒绘制的帧数（FPS）为 60，每一帧分到的时间是 1000/60 ≈ 16 ms。

### Frame 每一帧完成的工作
1. 处理用户的交互
2. JS 解析执行
3. 窗口事件。window.resize/scroll/media-query
4. requestAnimationFrame(rAF)
5. 布局改变
6. 重绘
7. **requestIdleCallback**

当以上在16.6ms都执行完 1-6 仍有剩余时间，就会执行 requestIdleCallback。

## requestIdleCallback 参数说明
```
// 接受回调任务
type RequestIdleCallback = (cb: (deadline: Deadline) => void, options?: Options) => number
// 回调函数接受的参数
type Deadline = {
 timeRemaining: () => number // 当前剩余的可用时间。即该帧剩余时间。
 didTimeout: boolean // 是否超时。
}
```
### 注意
- ``requestIdleCallback`` 用于渲染一帧的空闲时执行，从而不阻塞渲染、UI交互，但<u>不是每一帧都执行</u>（如一帧有16.6ms，那么执行完这一帧数还有剩余时间才会执行该函数）。
- *IE 和火狐浏览器不支持。*
- 不建议里面 DOM 操作，会引起重绘
- 不建议 Promise，其回调在 EventLoop 是优先比高微任务，会在 requestIdleCallback 结束后立即执行，一帧的时间会超过16ms

### 如何使用
- 对非高优先级的任务使用空闲回调；
- 空闲回调应尽可能不超支分配到的时间；
- 避免在空闲回调中改变 DOM；
- 避免运行时间无法预测的任务；
- 需要用 timeout，但记得只在需要的时候才用。

### 应用
```
// 一万个任务，这里使用 ES2021 数值分隔符
const unit = 10_000;
// 单个任务需要处理如下
const onOneUnit = () => {
    for (let i = 0; i <= 500_000; i++) {}
}
// 每个任务预留执行时间 1ms
const FREE_TIME = 1;
// 执行到第几个任务
let _u = 0;

function cb(deadline) {
// 当任务还没有被处理完 & 一帧还有的空闲时间 > 1ms
    while (_u < unit && deadline.timeRemaining() >FREE_TIME) {
        onOneUnit();
        _u ++;
    }
    // 任务完成
    if (_u >= unit) return;
    // 任务没完成, 继续等空闲执行
    window.requestIdleCallback(cb)
}

window.requestIdleCallback(cb)
```

## React Fiber 实现 requestIdleCallback 原理
- 使用 requestAnimationFrame 计算当前帧数剩余时间；
- 使用 performance.now() 实现微秒级高精度时间戳，用于计算当前帧剩余时间；
- 使用 MessageChannel 零延迟宏任务实现任务调度，如使用 setTimeout() 则有一个最小的时间阈值，一般是 4ms；
```
let frameDeadline // 当前帧的结束时间
let penddingCallback // requestIdleCallback的回调方法
let channel = new MessageChannel()

// 当执行此方法时，说明requestAnimationFrame的回调已经执行完毕，此时就能算出当前帧的剩余时间了，直接调用timeRemaining()即可。
// 因为MessageChannel是宏任务，需要等主线程任务执行完后才会执行。我们可以理解requestAnimationFrame的回调执行是在当前的主线程中，只有回调执行完毕onmessage这个方法才会执行。
// 这里可以根据setTimeout思考一下，setTimeout也是需要等主线程任务执行完毕后才会执行。
channel.port2.onmessage = function() {
  // 判断当前帧是否结束
  // timeRemaining()计算的是当前帧的剩余时间 如果大于0 说明当前帧还有剩余时间
  let timeRema = timeRemaining()
	if(timeRema > 0){
    	// 执行回调并把参数传给回调
		penddingCallback && penddingCallback({
      		// 当前帧是否完成
      		didTimeout: timeRema < 0,
      		// 计算剩余时间的方法
			timeRemaining
		})
	}
}
// 计算当前帧的剩余时间
function timeRemaining() {
    // 当前帧结束时间 - 当前时间
	// 如果结果 > 0 说明当前帧还有剩余时间
	return frameDeadline - performance.now()
}
window.requestIdleCallback = function(callback) {
	requestAnimationFrame(rafTime => {
      // 算出当前帧的结束时间 这里就先按照16.66ms一帧来计算
      frameDeadline = rafTime + 16.66
      // 存储回调
      penddingCallback = callback
      // 这里发送消息，MessageChannel是一个宏任务，也就是说上面onmessage方法会在当前帧执行完成后才执行
      // 这样就可以计算出当前帧的剩余时间了
      channel.port1.postMessage('haha') // 发送内容随便写了
	})
}
```

https://juejin.cn/post/6861590253434585096
