# Figma界面认识

## 一、界面滚动和缩放

+ 上下滚动： 使用鼠标滚轮
+ 左右滚动：Shift + 鼠标滚轮

+ 自由滚动：按住鼠标中键 ，然后进行拖动鼠标

+ 界面放大缩小：Crtl + 鼠标滚轮

---

## 二、File

### 2.1 Save local copy

![image-20260806134933156](./assets/image-20260806134933156.png)

作用：保存到本地：xxx.fig格式

### 2.2 Save to version history

![image-20260806135033965](./assets/image-20260806135033965.png)

作用：主动保存一个版本历史

### 2.3 Show version history

![image-20260806135140976](./assets/image-20260806135140976.png)

作用： 展示版本历史

---

## 三、Edit

### 3.1 Undo

![image-20260806140742619](./assets/image-20260806140742619.png)

作用：撤销上一次操作

快捷键：Ctrl + z

### 3.2 Redo 

![image-20260806140846489](./assets/image-20260806140846489.png)

作用：将上一次的撤销操作恢复

快捷键：Ctrl + y



### 3.3 Copy as png

作用：复制为png图片，可以Ctrl + v进行粘贴

快捷键： Ctrl + Shift + C

---

## 四、View

### 4.1 Pixel grid

![image-20260808110548093](./assets/image-20260808110548093.png)

作用：显示或隐藏像素网格

快捷键：Shift + 单引号

### 4.2 Rulers

![image-20260808110905335](./assets/image-20260808110905335.png)

作用：显示或隐藏标尺和参考线。 显示的时候可以在左侧或上方的标尺 拖出参考线

快捷键： Shift + R

### 4.3 Pixel preview

![image-20260808121331153](./assets/image-20260808121331153.png)

Figma 的 **Pixel Preview（像素预览）**，主要是用来查看设计在真实屏幕像素下会不会出现**模糊、半像素、边缘不清晰**的问题。

普通编辑模式下，Figma 使用矢量方式渲染，所以你把图形放在 `x=10.5px`、宽度设成 `100.5px`，看起来可能依然很平滑。但实际导出 PNG，或者最终显示到屏幕上时，某些边缘可能落在两个物理像素之间，于是就会出现发虚。

快捷键： Ctrl + Shift + P

### 4.4 Minimize UI

![image-20260808121737348](./assets/image-20260808121737348.png)

作用：最小化UI菜单

快捷键： Ctrl + Shift + \

### 4.5 Show/Hide UI

![image-20260808121952371](./assets/image-20260808121952371.png)

作用：显示或隐藏UI

快捷键：Ctrl + \

---

## 五、Arrange

### 5.1 Round to pixel

![image-20260808123010304](./assets/image-20260808123010304.png)

**Round to pixel 主要处理的是图层的 Position（X / Y）**，也就是让图层的位置落到整数像素坐标上

## 六、Preferences

![image-20260808131635002](./assets/image-20260808131635002.png)

### 6.1 Snap to geometry

作用：对齐到几何，对齐吸附效果

![image-20260808131815999](./assets/image-20260808131815999.png)

### 6.2 Snap to objects

![image-20260808132055837](./assets/image-20260808132055837.png)

作用: 对齐到对象，对齐吸附效果

![image-20260808132155744](./assets/image-20260808132155744.png)

### 6.3 Snap to pixel grid

![image-20260808132601770](./assets/image-20260808132601770.png)

作用：对齐到像素网格， 拖动和绘制的时候都会对齐到像素网格

> [!TIP]
>
> 建议这三项都保持开启：
>
> + Snap to geometry
> + Snap to objects
> + Snap to pixel grid

