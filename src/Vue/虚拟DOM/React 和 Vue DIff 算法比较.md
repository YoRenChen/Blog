# React 和 Vue DIff 算法比较

### 总体

#### vue

vue Diff 通过维护新旧 Vnode 四个变量，从两边双向遍历比较 key、tag 和属性，使用静态节点标记来优化减少 Diff 对比，基于 snabbdom 库边对比边更新。

#### react

通过维护三个变量，以集合首位依次向右遍历，只需比较 key 和 tag(节点属性)，使用 diff 队列保存更新节点，生成 patch 树，一起更新。

#### 相同点

- 推荐使用 key 对比，为了可复用节点，不要用 index 作为 key
- 同层比较。复杂度都为 O(n)
- 操作虚拟 DOM，最小化操作 DOM。减少性能消耗

#### 差异点

- 当集合把最后一位移动到首位，vue 直接置换，react 需要把前面节点依次移动
- 当元素的 className 不同时，vue 认为是不同元素需重建，react 只改节点属性

### 变量

#### vue

通过维护新旧前后四个变量，从两边方向同时比较。
如果老的先走完，就添加；如果新的先走完，就删除

#### react

维护三个变量：

- nextIndex
  遍历 nextChildren 时候的 index，每遍历自增
- lastPlacedIndex
  上一次从 prevChildren 中取出来元素时，这个元素在 prevChildren 中的 index（新节点对应）
- oldIndex
  元素在数组中的位置（旧节点对应的位置）

### 算法对比方式

#### vue

从两端到中间的方式，除了比较 key 和节点类型(tag)，还要比较属性。

#### react

从左到右依次比较，只是比较 key 和节点类型。

### 算法遍历原理

#### vue

使用 静态标记减少 diff 次数 + 双向遍历方法

#### react

使用 首位除删除节点作为固定节点，从左到右遍历对比

### 跟新 DOM 逻辑

#### vue

基于 snabbdom 库，使用双向链表边对比边更新

#### react

diff 队列保存更新节点，生成 patch 树，再统一跟新 DOM
