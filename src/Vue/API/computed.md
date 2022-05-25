# computed

在初始化阶段会生成一个观察者(watcher) - `computed watcher`

#### 目的

不仅仅是计算属性依赖的值发生变化，而当计算属性最终计算的值发生变化才会触发渲染。

#### 原理

`Lazy`: 生成 computed watcher 时候不执行 getter，当读取 computed 属性值执行

`dirty`: 是否更新视图

初始化时，lazy 和 dirty 都为 true，生成 `computed watcher` 和 `渲染 watcher`，并挂载到`Dep.target`

`dirty=true` 会执行 getter 赋值给 value 并设置为 false。

如果依赖没有变化的时候，下次取值直接获取 watcher 里保存的 `value`。

当依赖更新的时候会触发 `dep.notify`，触发`computed watcher.update()`，此时更新 `dirty = true`，后面触发`渲染 watcher`对模板计算的值重新计算。
