
### 案例
#### 轮询
Worker 轮询数据，跟缓存做比较。如果不一致，就说明服务端有了新的变化，因此就要通知主线程。
```
const createWorker = (f) => {
  const blob = new Blob(['(' + f.toString() + ')()'])
  const url = window.URL.createObjectURL(blob)
  return new Worker(url)
}

const messageFn = (e) => {
  let cache
  // 数据对比
  const compare = (newVal, oldVal) => {
      ...
      self.postMessage(newVal)
  }

  setInterval(() => {
    request.then(res => {
      compare(res, cache)  
    })
  }, 1000)
}

const pollingWorker = createWorker(messageFn)
pollingWorker.postMessage('init')
// 跟新数据
pollingWorker.onmessage = (e) => {}

// 清除 worker
onBeforeUnmount(() => pollingWorker.terminate())
```

#### 封装 webWoker 线程池
https://idler.me/web-worker/

https://zhuanlan.zhihu.com/p/360857516

https://github.com/BiosSun/web-worker-pool/blob/master/index.js
```
type WorkerObj = {
  tasks: number
  clean: NodeJS.Timeout | null
  worker: Worker | null
}
class WorkerLoader {
  private workerPool: WorkerObj[] = []
  constructor(
    private concurrency: number = window.navigator.hardwareConcurrency || 2
  ) {
    this.concurrency = concurrency
  }
  public load(url: string): Mesh {
    const worker = this.getWorker()
    worker.tasks++
    // return worker.load(url).then(data => {
    //   worker.tasks--
    //   this.clearIdleWorker(worker)
    //   return this.parseData(data)
    // })
  }
  private getWorker() {
    if (this.workerPool.length < this.concurrency) {
      const worker: WorkerObj = {
        tasks: 0,
        clean: null,
        worker: new Worker()
      }
      this.workerPool.push(worker)
      return worker
    }
    return this.getIdleWorker()
  }
  private getIdleWorker() {
    return this.workerPool.sort((a, b) => a.tasks - b.tasks)[0]
  }
  private parseData(data): Mesh {
    // ...
  }
  private clearIdleWorker(workerItem: WorkerObj) {
    workerItem.clean && clearTimeout(workerItem.clean)
    workerItem.clean = setTimeout(() => {
      if (!workerItem.tasks) {
        workerItem.worker && workerItem.worker.terminate()
        workerItem.worker = null
        this.workerPool = this.workerPool.filter(e => e !== workerItem)
      }
    }, 5000)
  }
}
```
多线程会一瞬间把结果都抛回主线程，导致主线程调用回调函数被阻塞。
做一个简单的事件回调队列，加入一个callbackQueneIndex以标识当前正在并发处理中的模型个数, 并且在执行加载函数的时候把该值传递进去。
包装一个Promise以进行回调时的延迟处理
```
export async function load(url: string, delay: number) {
    const now = +new Date();
    return get(url).then(res => res.parse)
        .then(data => 
            new Promise(resolve => 
                const remainTime = +new Date() - now - (delay * 60);
                  if (remainTime > 0) {
                    return new Promise(resolve => {
                      setTimeout(() => resolve(data), remainTime);
                    });
                  }
                  return Promise.resolve(data);
            )
        )
}
```
