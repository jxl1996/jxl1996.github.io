import {defineConfig} from 'vitepress'

// https://vitepress.dev/reference/site-config
export default defineConfig({
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
            '/Golang-Interview/': [
                {
                    text: 'Golang面试',
                    items: [
                        {text: '口述题', link: '/Golang-Interview/Golang-Interview.md'},
                        {text: '交替打印奇偶数', link: '/Golang-Interview/交替打印奇偶数.md'}
                    ]
                }
            ]
        },

        // socialLinks: [
        //   { icon: 'github', link: 'https://github.com/vuejs/vitepress' }
        // ]
    }
})
