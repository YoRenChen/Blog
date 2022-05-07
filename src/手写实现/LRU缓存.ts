/*
* hashMap + LinkedList(双向链表)
* 利用 Map 实现链表
*/
class LRUcache {
  capacity: number
  cache: Map<number, number | null>
  constructor(capacity: number) {
    this.capacity = capacity
    this.cache = new Map()
  }

  get(key: number): number {
    if (this.cache.has(key)) {
      const node = this.cache.get(key) as number
      this.cache.delete(key)
      this.cache.set(key, node)
      return node
    }
    return -1
  }

  put(key: number, value: number): void {
    if (this.cache.has(key)) {
      this.cache.delete(key)
    } else if (this.cache.size >= this.capacity) {
      // 迭代器获取下一个 next().value，置空存
      this.cache.delete(this.cache.keys().next().value)
    }
    this.cache.set(key, value)
  }
}
