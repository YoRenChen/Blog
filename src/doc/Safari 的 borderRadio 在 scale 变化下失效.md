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

得到结果
[]()
