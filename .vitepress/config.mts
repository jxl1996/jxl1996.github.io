import {defineConfig} from 'vitepress'

// https://vitepress.dev/reference/site-config
export default defineConfig({
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
            provider: 'local'
        },


        nav: [
            {text: 'Home', link: '/'},
            // { text: 'Examples', link: '/markdown-examples' },
        ],

        // 侧边栏(多种配置方式)
        // 方式1: sidebar可以是一个数组
        // 方式2: sidebar是一个对象, 然后对象的字段可以是对象或数组
        sidebar: {
            '/PostgreSQL/': [
                {
                    text: 'PostgreSQL',
                    items: [
                        {text: 'pgsql20260208', link: '/PostgreSQL/pgsql20260208.md'},
                        {text: 'demo1', link: '/PostgreSQL/demo1.md'}
                    ]
                }
            ],
            '/Interview/': [
                {
                    text: '面试',
                    items: [
                        {text: 'Golang', link: '/Interview/Golang-Interview.md'},
                        {text: 'Redis', link: '/Interview/Redis-Interview.md'},
                        {text: 'Mysql', link: '/Interview/Mysql-Interview.md'},
                        {text: 'Git', link: '/Interview/Git-Interview.md'},
                        {text: '秒杀系统设计', link: '/Interview/秒杀系统设计.md'},
                        {text: '交替打印奇偶数', link: '/Interview/交替打印奇偶数.md'},
                        {text: '手撕协程池', link: '/Interview/手撕协程池.md'},
                        {text: '奇安信秋招Golang方向试卷3', link: '/Interview/奇安信秋招Golang方向试卷3.md'},
                    ]
                }
            ]
        },

        // socialLinks: [
        //   { icon: 'github', link: 'https://github.com/vuejs/vitepress' }
        // ]
    }
})
