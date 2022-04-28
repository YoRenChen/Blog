/*
* # Promise实现请求并发控制
* 1. 最大并发数 maxNum
* 2. 每次请求返回留下空位可以增加新请求
* 3. 所有请求完成之后，按照urls顺序依次打印
*/
const mockPromise = new Array(10).fill().map((el, index) => index)

function multiRequest(urls = [], maxNum) {
  const len = urls.length
  const result = new Array(len).fill(false)
  let count = 0
  return new Promise((resolve, reject) => {
    function nextP() {
      const current = count++
      if (current >= len) {
        !result.includes(false) && resolve(result)
        return
      }
      const url = urls[current]
      new Promise(resolve => {
        setTimeout(() => {
          resolve(url)
        }, 2000)
      }).then(res => {
        console.log(res)
        if (current < len) nextP()
      })
    }
    while (count < maxNum) {
      nextP()
    }
  })
}
multiRequest(mockPromise, 3)
