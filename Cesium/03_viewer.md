# Viewer查看器

## 一、基础配置



```vue
<template>
<div id="cesiumContainer" ></div>
</template>

<script setup>
import * as Cesium from "cesium";
import '@/CesiumWidgets/widgets.css'
import {onMounted} from "vue";

// 设置cesium静态资源的路径, 对应public下的路径
window.CESIUM_BASE_URL = '/plugins/cesium/'

// 设置cesium token
Cesium.Ion.defaultAccessToken="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqdGkiOiIyOTdmM2QyNi04OTcwLTQ5MTYtOTA4MS04NGY0NGYzYWY5MzEiLCJpZCI6NDU3NDA2LCJpc3MiOiJodHRwczovL2FwaS5jZXNpdW0uY29tIiwiYXVkIjoidW5kZWZpbmVkX2RlZmF1bHQiLCJpYXQiOjE3ODQyNjI0NjZ9.2r2DGNclwQcO8ajB8tH6L0rQZudoemzDxbvlRxp-QKI"

// 设置默认视角 设置视角默认为中国
Cesium.Camera.DEFAULT_VIEW_RECTANGLE = Cesium.Rectangle.fromDegrees(
    // 西边的经度
    89.5,
    // 南的纬度
    20.4,
    // 东边的经度
    110.4,
    // 北边的纬度
    61.2
)

onMounted(() => {
  var viewer = new Cesium.Viewer("cesiumContainer",{
    // 解决控制台报错：Blocked script execution in 'about:blank' because the document's frame is sandboxed and the 'allow-scripts' permission is not set.
    // 是否显示信息窗口
    infoBox:false,
    // 是否显示搜索框
    geocoder: false,
    // 是否显示Home按钮
    homeButton:false,
    // 是否显示场景模式选择器 (3d ,2d ,2.5d)
    sceneModePicker:false,
    // 是否显示图层选择器
    baseLayerPicker:false,
    // 是否显示帮助按钮
    navigationHelpButton:false,
    // 是否显示Animation 仪表盘
    animation:false,
    // 是否显示底部时间轴
    timeline:false,
    // 是否显示全屏按钮
    fullscreenButton:false,
  });

  // 隐藏logo
  viewer.cesiumWidget.creditContainer.style.display = "none";
})

</script>

<style scoped>
#cesiumContainer{
  width: 100vw;
  height: 100vh;
}
</style>
```

---



## 