## unplugin-auto-import插件的使用

### 一、环境准备

```
npm i -D unplugin-auto-import
```

### 二、View配置

在项目根目录找到或创建 `vite.config.js`或`vite.config.ts`：

```js
import { defineConfig } from 'vite'
import uni from '@dcloudio/vite-plugin-uni'
import AutoImport from 'unplugin-auto-import/vite'

export default defineConfig({
  plugins: [
    uni(),
    AutoImport({
      // 1. 设置需要自动导入的库
      imports: [
        'vue',
        'uni-app', // 重点：针对 uni-app 的特定 API 自动导入
        'pinia'
      ],
      
      // 2. 自动生成类型声明文件
      // 建议放在根目录或 src 下，这样 HBuilderX 或 VSCode 都能识别
      dts: 'src/auto-import.d.ts',

      // 3. 如果你的项目中使用了自定义的 hooks 文件夹
      dirs: [
        './src/hooks',
        './src/utils'
      ],

      // 4. 解决 ESLint 报错（如果你的项目开了 ESLint）
      eslintrc: {
        enabled: true
      }
    })
  ]
})
```

### 三、使用对比

配置前：

```vue
<script setup>
import { ref } from 'vue'
import { onLoad } from '@dcloudio/uni-app'

const title = ref('Hello')
onLoad(() => {
  console.log('页面加载了')
})
</script>
```

配置后：

```vue
<script setup>
// 直接使用，无需 import
const title = ref('Hello')
onLoad(() => {
  console.log('页面加载了')
})
</script>
```

