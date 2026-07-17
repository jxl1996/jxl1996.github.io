import {defineConfig} from 'vitepress'
import sidebars from "./sidebars";

// https://vitepress.dev/reference/site-config
export default defineConfig({
    head: [
        ['meta', {name: 'algolia-site-verification', content: 'BC07CB2534C4E288'}],
    ],
    sitemap: {
        hostname: 'https://jxl1996.github.io',
    },
    vite: {
        server: {
            port: 9527, // 你想要的端口
            host: '0.0.0.0' // 可选：允许局域网访问
        }
    },
    base: "/",
    title: "Siriabc",
    description: "A VitePress Site",
    lastUpdated: true,
    appearance: "dark",
    themeConfig: {
        // https://vitepress.dev/reference/default-theme-config
        lastUpdated: {
            text: '最后更新时间',
            formatOptions: {
                dateStyle: 'short',
                timeStyle: 'medium'
            }
        },
        outline: {
            level: [2, 3], // 显示 h2 和 h3
            label: '大纲'
        },

        search: {
            provider: 'local',
        },

        nav: [
            {text: 'Home', link: '/'},
            // { text: 'Examples', link: '/markdown-examples' },
        ],

        // 侧边栏(多种配置方式)
        // 方式1: sidebar可以是一个数组
        // 方式2: sidebar是一个对象, 然后对象的字段可以是对象或数组
        sidebar: sidebars,
    }
})
