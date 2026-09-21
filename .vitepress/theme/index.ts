import DefaultTheme from 'vitepress/theme'
import { inBrowser, useRoute } from 'vitepress'
import { nextTick, onMounted, watch } from 'vue'
import mediumZoom from 'medium-zoom'
import './custom.css'
import AuthGate from './AuthGate.vue'

let zoom: ReturnType<typeof mediumZoom> | null = null

function initZoom() {
    if (!inBrowser) return

    if (zoom) {
        zoom.detach()
    }

    zoom = mediumZoom('.vp-doc img:not(.no-zoom)', {
        background: 'rgba(0, 0, 0, 0.85)',
        margin: 24
    })
}

export default {
    extends: DefaultTheme,
    Layout: AuthGate,
    setup() {
        const route = useRoute()

        onMounted(() => {
            nextTick(initZoom)
        })

        watch(
            () => route.path,
            () => {
                nextTick(initZoom)
            }
        )
    }
}
