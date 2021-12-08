# Safari 的 borderRadio 在 scale 变化下失效
## 介绍 clip-path: content-box;
我们提供结构：
```
<div class="sup">
  <div class="sub"></div>
</div>

.sup {
  width: 100%;
  overflow: hidden;
  border-radius: 8px;
}
.sub {
  width: 100%;
  height: 233px;
  
  transform-origin: center;
  background-image: url(xxx.png);

  border-radius: 8px;
  transition: transform 0.3s;
}

.sub:hover {
  transform: scale(1.3);
}

```

得到结果：

<img width="350" height="300" href="https://github.com/YoRenChen/Blog/blob/main/src/doc/Safari%20%E7%9A%84%20borderRadio%20%E5%9C%A8%20scale%20%E5%8F%98%E5%8C%96%E4%B8%8B%E5%A4%B1%E6%95%88/index.gif"/>

**Safari 的 scale 过程中，border-radius 是失效的，直到 scale 执行完毕**
