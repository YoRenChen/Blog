# vue2 Vitual DOM

由于浏览器操作 DOM 代价昂贵且有性能损耗，虚拟 DOM 是一种 js 的数据结构，可以在每次数据变化时，通过对比前后虚拟 DOM，匹配尽可能少的需要更新真实 DOM，达到性能优化的目的。

### 流程

改变 DOM 的更新方式，通过新旧虚拟 DOM 树对比。

VNode 表示树节点，用 template 模板来描述状态与 DOM 的映射关系。

parse 编译 template 转为 Render，得到 VNode，渲染到视图上。

VDom 映射到真实的 DOM 经历 VNode 的 create、diff、patch。

### Vitual DOM 优点

减少真实 DOM 在多次计算操作重绘重排中性能损耗。

### Vitual DOM 如何解决问题

将真实 DOM 转为 JS 对象的计算。

### 浏览器渲染引擎工作流程

创建 DOM 树 → 创建 CSSOM 树 → 生成 render 树 → 布局 render 树 → 绘制 render 树 。

### key 的作用

提供给 DIFF 算法判断是否是同一个节点。
