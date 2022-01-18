```
 /**
  * 数值累加 requestAnimationFrame
  * 固定时间执行完成、固定速度执行完成
  */
 class NumberAccumulation {
  constructor(props) {
    this.start = props.start || 0
    this.end = props.end || 0
    this.space = props.space || 0 // 间隔, 使用间隔增长
    this.duration = props.duration || 0 // 总时长, 使用时长增长
    this.callback = props.callback
    this.nodeNumer = 0 // 每次跟新最小数
    this.animationEngine = 0
    this.startTime = 0
    this.startTime = +new Date()
    this.fpsTime = 1000 / 60 // 假设是60帧，如果减帧情况直接到指定时间就到 end
    this.isReverseSort = false // 是否倒叙
  }
  init() {
    const bit = this.getBit(this.end)
    this.isReverseSort = this.start > this.end
    // 判断是 指定时间 还是 指定速度，指定时间最大
    if (this.space && !this.duration) {
      this.nodeNumer = Math.round(((this.end - this.start) / this.fpsTime) * Math.pow(10, bit)) / Math.pow(10, bit)
      console.log(this.nodeNumer);
      this.spaceAddNumber()
    }
    if (this.duration) {
      this.nodeNumer = Math.round(((this.end - this.start) / Math.ceil(this.duration / this.fpsTime)) * Math.pow(10, bit)) / Math.pow(10, bit)
      this.durationAddNumber()
    }
  }
  // 计算小数点后位数
  getBit(number) {
    if (typeof number !== 'number') return 0
    const str = `${this.end}`.split('.')[1]
    return str ? str.length : 0
  }
  // 比较是否到达最大值
  getCompare(val) {
    return this.isReverseSort ? val <= this.end : val >= this.end
  }
  // 指定动画速度
  spaceAddNumber() {
    const val = this.start + this.nodeNumer
    if (this.getCompare(val) || !this.nodeNumer) {
      this.callback && this.callback(this.end)
      this.clearAnimation()
      return
    }

    const currentTime = +new Date()
    if (currentTime - this.startTime >= this.space) {
      this.startTime = currentTime
      this.start = val
      this.callback(val)
    }
    this.clearAnimation()
    this.setAnimation(this.spaceAddNumber)
  }
  // 时间区间内执行完成
  durationAddNumber() {
    const diffTime = (+new Date() - this.startTime) || 1
    const diffNum = Math.abs(this.end - this.start)

    // 对比进度值
    const val = this.isReverseSort
      ? Math.round(this.start - (diffNum * diffTime / this.duration))
      : Math.round(diffNum * diffTime / this.duration)

    if (this.getCompare(val)) {
      this.callback && this.callback(this.end)
      this.clearAnimation()
      return
    }
    this.callback(val)
    this.clearAnimation()
    this.setAnimation(this.durationAddNumber)
  }
  setAnimation(fn) {
    const animation = window.requestAnimationFrame
    this.animationEngine = animation(fn.bind(this))
  }
  clearAnimation() {
    const animation = window.cancelAnimationFrame
    this.animationEngine && animation(this.animationEngine)
  }  
}
new NumberAccumulation({
    start: 0,
    end: 100,
    // space: 50,
    duration: 1000,
    callback: (res) => console.log(res)
  }).init()
```
