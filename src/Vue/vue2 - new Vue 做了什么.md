# new Vue 做了什么
> new Vue()之后调用了``_init``方法，合并配置，初始化生命周期，初始化事件中心，初始化渲染，初始化 data、props、computed、watcher 

1. 初始化全局属性和方法
2. 初始化实例方法和属性(init)
3. 选项合并【用户选项(自定义组件)】和【系统默认选项(keepAlive)】
4. 初始化生命周期、事件监听、createElement 创建 VNode
【``beforeCreated``】
5. 初始化 data/ props/ methods/ computed/ watch / provide inject
【``created``】
6. template 或 el 编译成 render
7. 执行 mountComponent 生成未挂载的 VM.$el
【``beforeMount``】
8. 生命组件更新函数、执行 render 获得 VDom、VDom转Dom、一个组件创建对应的 Render Watcher
【``mounted``】


- ``initLifecycle(vm)``: 组件声明属性($parent/$children)
- ``initEvent(vm)``: 自定义组件事件监听
- ``initRender(vm)``: 插槽处理、createdElement(render中的 h)
- ``callHook(vm, 'beforeCreate')``: 调用生命周期钩子

- ``initInjections(vm)``: inject 单项数据流注入(在props、data之前)
- ``initState(vm)``: 初始化 data/ props/ methods/ computed/ watch
- ``initProvide(vm)``: provide
- ``callHook(vm, 'created')``
