根据当前页面内容布局，把当前内容切换为骨架容器，生成对应的html。

[👉🏻 直冲 代码实现demo](https://github.com/YoRenChen/skeleton-screen-demo) 
   _or_  
👉🏻 继续查看以下分析文 👇🏻👇🏻👇🏻
## 前言
本文涉及到主要插件有 ：
`Puppeteer`
`vue-server-renderer`
`rollup`
`page-skeleton-webpack-plugin`
`vue-skeleton-webpack-plugin`

CSR：客户端渲染。

📢📢📢：

本文涉及代码基于`page-skeleton-webpack-plugin`为前提所简化。
**本文目的是：让有兴趣的读者能更快了解内部实现。**
**实现目的是：达到页面的简单骨架屏时无需再写额外的代码。**

构建思路基于 [page-skeleton-webpack-plugin](https://github.com/ElemeFE/page-skeleton-webpack-plugin) 和 [vue-skeleton-webpack-plugin](https://github.com/lavas-project/vue-skeleton-webpack-plugin) 两个框架所做的学习简化版。

如有意可以前往观看其源码。

## 大致目录
- 生成流程
- 最终效果
- 使用场景
- 元素处理

## 生成流程
骨架屏生成的流程如下： 
1. 通过获取DOM节点，把元素解析成骨架页标签 
2. 添加自定义骨架屏class进行样式覆盖 
3. 填充到index.html并输出

![599a5c0a-5bbb-431a-82ee-b2709462ce5a](https://user-images.githubusercontent.com/30005394/120107134-617e8680-c192-11eb-8dfc-cf3de1764d79.png)

## 最终效果
把当前布局的页面转化为对应布局的骨架屏：
(页面一：)

![0f7e45df-effe-4b77-9985-ffee8241deee](https://user-images.githubusercontent.com/30005394/120107222-c5a14a80-c192-11eb-9590-7bb39225c99f.gif)

(页面二：)

![3d9b0fdc-1533-406d-97c3-a50c74cfb61d](https://user-images.githubusercontent.com/30005394/120107247-dea9fb80-c192-11eb-9933-1f82794573ee.gif)

## 快速开始
该章节用于快速了解和尝试运行。
```
git clone https://gitlab.ayla.com.cn/ccpg/application/fe-play/skeletondemo.git
yarn install / npm i
配置ske.js的routes
npm run serve
npm run start:serve
```
确保8080端口和8082端口闲置，否则需要改代码端口。
访问localhost:8082，使用开发者模式下Network 网络slow3G，刷新页面即可看到被渲染的骨架屏。
核心文件夹：
```
├── public
│   └── shell 存放生成骨架屏文件
├── nodeScript 启动服务端代码
├── skeletonjs 生成骨架核心代码
├── ske.js 启动生成骨架
```
下面是该程序的分析与实现讨论。
## 使用场景
本章节介绍骨架屏使用的三个场景分析和实现。
1. 首屏
2. 去缓存刷新，根据不同的页面地址展示不同骨架屏
3. 组件局部loading

### 首屏
对于首屏实现骨架屏，大致就是替换index.html页面的内容，在请求html的时候第一时间会渲染出骨架屏内容。

![image-20210419-094401](https://user-images.githubusercontent.com/30005394/120107365-66900580-c193-11eb-99c6-4d147d3003b1.png)

首屏生成大致流程：

![image-20210419-094421](https://user-images.githubusercontent.com/30005394/120107366-66900580-c193-11eb-9a2d-f0c721322ae0.png)

生成页面对应的骨架屏，需要获取到这些页面的Dom结构，但在生成页面之前先偷偷获取并生成骨架屏。这里使用到_Puppeteer(Headless Chrome Node.js API，模拟 Chrome 浏览器的运行)插件_。
#### Puppeteer
[👉🏻 Puppeteer知识点击就送](https://learnku.com/docs/puppeteer/3.1.0)

简单说一下 Puppeteer 执行与骨架屏生成大致流程：

![image-20210419-094741](https://user-images.githubusercontent.com/30005394/120107445-9d661b80-c193-11eb-9949-9c376943a730.png)

Puppeteer需要能访问到的链接，也就是说，在生成骨架屏之前要先启动服务，例如本地开发访问本地localhost:8080/index.html，那么就得先起8080的服务。

[👉🏻 点击查看 - 生成骨架屏主文件入口](https://github.com/YoRenChen/skeleton-screen-demo/tree/master/skeletonjs/index.memory.js)

[👉🏻 点击查看 - 通过Puppteer生成Html并转化为骨架代码](https://github.com/YoRenChen/skeleton-screen-demo/tree/master/skeletonjs/skeleton.js#L72-L250)

在转换过程中，涉及到 Puppteer 里需要把执行的页面 Js 注入到页面中：
```
# skeletonjs/skeleton.js

await page.addScriptTag({ content: this.scriptContent })
```

this.scriptContent 就是需要注入的js自运行代码，代码的地址为 skeletonjs/script/index.js，而这个文件是由下面目录通过 rollup 打包合成的一份文件：
```
# skeletonjs/script/rollup/index.js

const build = async function () {
  `rollup - input skeletonjs/script/main.js`
  `rollup - output skeletonjs/script/index.js`
}

# skeletonjs/util/index.js

async function genScriptContent() {
  rollup()
  ...
}

# filePath

├── script
│   ├── config.js
│   ├── handler
│   ├── index.js
│   ├── main.js
│   ├── rollup
└── util.js
```

page-skeleton-webpack-plugin是通过socket传动另一个端口生成骨架屏页面预览，这里把socket和生成页面预览去除，单纯用node跑生成骨架页面程序服务。

_（也尝试像page-skelrton那样做成个plugin，在生成端口地址之后运行puppeteer。按预期走非常不错，但是有一个致命的问题，就是每次热跟新的时候都会执行这个周期，那就导致每次都运行puppeteer生成骨架，可以是可以但没必要，所以干脆单独成为一个node服务[/dog]。）_

### 去缓存刷新，根据不同的页面地址展示不同骨架屏

很遗憾，在实现这个功能的时候发现`page-skeleton`目前只能生成首页的骨架屏，无法满足这个条件…
正苦恼的时候发现另一个骨架屏插件`vue-skeleton-webpack-plugin`。

#### vue-skeleton-webpack-plugin
简略vue-skeleton大致原理：

![image-20210419-101654](https://user-images.githubusercontent.com/30005394/120107651-72c89280-c194-11eb-9894-ba2d47462141.png)

这个插件里了解到通过skeleton 的Vue实例构建服务端webpack渲染对象，把生成的skeleton页面注入到index.html里。

_由于这个插件需要手动建立的是一个vue页面实例，那么页面内容是固定自然不适合于我们。但把替换处理交给在服务端渲染之后再返回的方法确实给了很好的思路。这时候我们把思路转到服务端渲染。_

#### vue-server-renderer
这里尝试的是vue-server-renderer，因为nuxt要改代码所以先鸽一边。

我们快速了解下`vue-server-renderer`大致原理：

![image-20210419-101953](https://user-images.githubusercontent.com/30005394/120107698-a1466d80-c194-11eb-901b-877241971f59.png)

说白了就是把原来访问的index.html，改为通过跑一个node应用监听这个端口，当用户访问这个端口的时候生成一个渲染好的html再返回内容。

_这里有个问题，就是服务端渲染返回的是已经渲染好的html页面，那么再放上个骨架屏就有点画蛇添足的感觉了，不过先想实现这个功能那就忽略这个细节 T.T_

续着vue-skeleton的服务端渲染想法，我可以把渲染的部分去掉，只是做服务端监听，不使用渲染。

直接浏览器请求的链接路由返回处理好index.html的spa应用方式。那么获取到的html由于要加载js生成vue实例，又会先渲染显示骨架屏，而且可以根据不同路径生成对应的骨架屏。

![image-20210419-102521](https://user-images.githubusercontent.com/30005394/120107710-af948980-c194-11eb-95da-ed03b121c9fa.png)

_hhh, 真就脱裤放屁了…_

这里注意一点。由于在服务端生成页面并解析成骨架屏会消耗大量时间，那么我们需要在打包的时候先有已经根据路由列表生成骨架屏的shell文件夹。
```
# ske.js

const path = require('path')
const T = require('./skeletonjs/index.memory')

new T({
  pathname: path.resolve(__dirname, './public/shell'),
  routes: ['/', '/about/index']
}).init()
```
之后把生成的文件放在public文件夹打包即可。所以这里推荐的做法是在开发的时候就生成好对应文件。
```
npm run serve
npm run start:serve
```
### 组件局部loading

这部分只有一个思路，尚未实现。观察到antd vue的骨架屏是通过，<a-skeleton />标签实现。
那么思路就是使用标签包裹。
通过获取包含内容的数据结构，解构生成骨架屏，在数据请求成功之后隐藏起来。
```
<skeleton show>
    ...dosomething
</skeleton>
```
## 元素处理
本章节介绍骨架屏根据页面内容生成方案，很大程度依赖的是已经被渲染过的页面，居于这个页面上进行筛选元素。
### 筛选元素
1. 深度遍历元素，获取html文档上所有元素
2. 屏幕宽高以内的元素
3. 筛选出特定设置元素

![image-20210419-073440](https://user-images.githubusercontent.com/30005394/120107901-5da03380-c195-11eb-8304-f230a7e5ec4f.png)
### 元素解析
#### 背景色
[👉🏻 点击查看 - 背景色转换代码](https://github.com/YoRenChen/skeleton-screen-demo/blob/master/skeletonjs/script/handler/background.js)

1. 将拥有除了白色之外的颜色默认置色为骨架屏背景色

![image-20210419-073924](https://user-images.githubusercontent.com/30005394/120107911-6bee4f80-c195-11eb-8634-de35762188c9.png)

2. 将所有拥有textChildNode 子元素的元素的文字颜色设置成背景色

![image-20210419-074012](https://user-images.githubusercontent.com/30005394/120107928-7c062f00-c195-11eb-91db-eaf00042f905.png)

#### svgs、buttons、image、inputs
[👉🏻 点击查看 - svgs、button、image、inputs转换代码](https://github.com/YoRenChen/skeleton-screen-demo/blob/master/skeletonjs/script/handler/elementReplace2Span.js)

以上元素不能在里面进行添加其他元素的操作，所以需要用其他元素今天替换，同时避免其他资源的加载。
1. 获取元素位置和position、display
2. 使用span元素替换该元素
3. 加入背景色
4. 加入loading效果

#### 伪类
[👉🏻 点击查看 - 伪类转换代码](https://github.com/YoRenChen/skeleton-screen-demo/blob/master/skeletonjs/script/handler/pseudos.js)
伪类的使用场景比较多而且复杂，在变换骨架的时候会较为有难度，但使用伪类多为脱离文档流，故想在生成骨架屏的时候选择屏蔽伪类。

#### 字体处理
[👉🏻 点击查看 - 字体转换代码](https://github.com/YoRenChen/skeleton-screen-demo/blob/master/skeletonjs/script/handler/text.js)
1. 获取文本内容
2. 根据实际高度和行高计算出文本的行数
   a. 行数大于1，将背景色填充所有行
   b. 文本的长度背景色填充
3. 文本背景色填充
   a. 绘制文本块中通过线性渐变来绘制灰色的文本条纹

下面简述如何处理文本和字体条纹颜色转换。

在判断文本行数时，会先获取文字填充到新建的内联元素，并继承fontsize，获取到的内联元素width和height就是字体的宽和高，再对比原元素的宽高即可知道是否为多行文本。

对单行文本进行颜色填充：
>摘自：CSS Secrets
“If a color stop has a position that is less than the specied position of any color stop before it in the list, set its position to be equal to the largest speci ed position of any color stop before it.”
— CSS Images Level 3 (http://w3.org/TR/css3-images)

我们可以根据文本块的lineHeight和fontsize得到文本距离块上下的距离，设置linear-gradient

```
字体大小和行高比例: textHeightRatio = fontSize/lineHeight
字体顶部离行高的距离比: headerProportion = ((1 - textHeightRatio) / 2 * 100)
字体底部离行高的距离比: footerProportion = (((1 - textHeightRatio) / 2 + textHeightRatio) * 100)
设置backgroundSize: backgroundSize = (字体宽度比元素总长, 字体fontSize)
设置linear-gradient: linear-gradient(transparent ${headerProportion}%, ${color} 0%, ${color} ${footerProportion}%, transparent 0%)
```
![image-20210419-075228](https://user-images.githubusercontent.com/30005394/120108124-65140c80-c196-11eb-863f-6fa227c35d4f.png)

#### loading
[👉🏻 点击查看 - loading代码](https://github.com/YoRenChen/skeleton-screen-demo/blob/master/skeletonjs/script/handler/loading.js)
[👉🏻 点击查看 - loading动画代码](https://github.com/YoRenChen/skeleton-screen-demo/blob/master/skeletonjs/script/handler/animation.js)

1. 新建元素加载到目标元素的childrenNode里
2. position为absolute
3. 继承父类的相对位置作为默认位置
4. 不同元素处理：
  - 非字体元素
  - 字体元素
     a. 高度设置：字体高度
     b. translate：`translate(-${{ 'left': 0, 'center': '50%', 'right':calc(100% - ${width})}[textAlign]}, 0)`
     c. top: 字体顶部离行高的距离比
     d. left: `{ 'left': 0, 'center': '50%', 'right':calc(100% - ${width})}[textAlign]`

![image-20210419-093357](https://user-images.githubusercontent.com/30005394/120108209-c63be000-c196-11eb-963b-e884679c218f.png)
### 参考
[ElemeFE/page-skeleton-webpack-plugin ](https://github.com/ElemeFE/page-skeleton-webpack-plugin)
[lavas-project/vue-skeleton-webpack-plugin ](https://github.com/lavas-project/vue-skeleton-webpack-plugin/)
[https://github.com/Jocs/jocs.github.io/issues/22 - Connect to preview ](https://github.com/Jocs/jocs.github.io/issues/22)
[第40题(2019-09-16)：如何实现骨架屏，说说你的思路  · Issue #42 · qappleh/Interview ](https://github.com/qappleh/Interview/issues/42)
[饿了么的 PWA 升级实践](https://huangxuan.me/2017/07/12/upgrading-eleme-to-pwa/#%E5%9C%A8%E6%9E%84%E5%BB%BA%E6%97%B6%E4%BD%BF%E7%94%A8-vue-%E9%A2%84%E6%B8%B2%E6%9F%93%E9%AA%A8%E6%9E%B6%E5%B1%8F)
