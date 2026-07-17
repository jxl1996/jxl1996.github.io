# 修改时间格式

在 Cesium 中，默认左下角的时间刻度盘（Animation 仪表盘）以及底部的时间轴（Timeline）显示的都是 UTC 国际标准时间（即 0 时区）。

要想把它们改成东八区（北京时间/中国当地时间）或者浏览器本地时区，官方并没有提供一个直接类似 timezone: "Asia/Shanghai" 的简单配置项。我们需要重写（Override）这两个组件格式化时间的底层函数。

下面是实现将左下角时钟和底部时间轴设置为本地时间（如北京时间）的完整解决方案：

使用`day.js`来进行格式化时间：

安装day.js：

```cmd
npm i dayjs
```

实现代码：

```vue
<template>
<div id="cesiumContainer" ></div>
</template>

<script setup>
import * as Cesium from "cesium";
import '@/CesiumWidgets/widgets.css'
import { onMounted } from "vue";

import dayjs from 'dayjs';
import 'dayjs/locale/zh-cn';
dayjs.locale('zh-cn'); // 全局使用中文

// 设置cesium静态资源的路径, 对应public下的路径
window.CESIUM_BASE_URL = '/plugins/cesium/'
// 设置cesium token
Cesium.Ion.defaultAccessToken="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqdGkiOiIyOTdmM2QyNi04OTcwLTQ5MTYtOTA4MS04NGY0NGYzYWY5MzEiLCJpZCI6NDU3NDA2LCJpc3MiOiJodHRwczovL2FwaS5jZXNpdW0uY29tIiwiYXVkIjoidW5kZWZpbmVkX2RlZmF1bHQiLCJpYXQiOjE3ODQyNjI0NjZ9.2r2DGNclwQcO8ajB8tH6L0rQZudoemzDxbvlRxp-QKI"

onMounted(() => {
  const viewer = new Cesium.Viewer("cesiumContainer");

  // ==================== 1. 修改底部【时间轴】====================
  viewer.timeline.makeLabel = function (time) {
    const date = Cesium.JulianDate.toDate(time);
    return dayjs(date).format('M月D日 HH:mm');
  };

  // 核心：让 Timeline 立即应用新的 makeLabel 格式化函数
  viewer.timeline.updateFromClock();
  viewer.timeline.zoomTo(viewer.clock.startTime, viewer.clock.stopTime);

  // ==================== 2. 修改左下角【时钟表盘】====================
  const animationViewModel = viewer.animation.viewModel;

  // 2.1 格式化日期（如：2026年07月17日 星期五）
  animationViewModel.dateFormatter = function (privateDate, viewModel) {
    const date = Cesium.JulianDate.toDate(privateDate);
    return dayjs(date).format('YYYY年MM月DD日 dddd');
  };

  // 2.2 格式化时间（如：13:15:30）
  animationViewModel.timeFormatter = function (privateDate, viewModel) {
    const date = Cesium.JulianDate.toDate(privateDate);
    return dayjs(date).format('HH:mm:ss');
  };

  // ==================== 3. 强制刷新 ====================
  viewer.clock.currentTime = Cesium.JulianDate.clone(viewer.clock.currentTime);
});
</script>

<style scoped>
#cesiumContainer{
  width: 100vw;
  height: 100vh;
}
</style>
```