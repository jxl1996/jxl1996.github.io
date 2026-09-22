<script setup lang="ts">
import {withBase} from 'vitepress'
import {computed, nextTick, onBeforeUnmount, onMounted, ref, watch} from 'vue'

type ViewerEvent = {
    message?: string
}

type ViewerEventBus = {
    on: (name: string, listener: (event?: ViewerEvent) => void) => void
    off: (name: string, listener: (event?: ViewerEvent) => void) => void
    dispatch: (name: string, data: {mode: number}) => void
}

type PdfJsApplication = {
    eventBus?: ViewerEventBus
    pdfDocument?: unknown
    pdfViewer?: {
        scrollMode: number
    }
}

type PdfJsWindow = Window & typeof globalThis & {
    PDFViewerApplication?: PdfJsApplication
}

const props = withDefaults(defineProps<{
    src: string
    title: string
    height?: string
}>(), {
    height: '75vh'
})

const root = ref<HTMLElement | null>(null)
const frame = ref<HTMLIFrameElement | null>(null)
const shouldLoad = ref(false)
const loading = ref(true)
const error = ref('')

// PDF.js 的 ScrollMode 枚举值没有随预构建阅读器导出，在这里用具名常量保留其语义。
const VERTICAL_SCROLL_MODE = 0
const PAGE_SCROLL_MODE = 3
const VIEWER_CONNECT_INTERVAL_MS = 100
const VIEWER_CONNECT_MAX_ATTEMPTS = 100

let intersectionObserver: IntersectionObserver | null = null
let themeObserver: MutationObserver | null = null
let appTimer: number | undefined
let detachViewerEvents: (() => void) | undefined

const downloadName = computed(() => {
    const title = props.title.trim() || 'document'
    return title.toLowerCase().endsWith('.pdf') ? title : `${title}.pdf`
})

const viewerUrl = computed(() => {
    const params = new URLSearchParams({file: props.src, locale: 'zh-CN'})
    return `${withBase('/pdfjs/web/viewer.html')}?${params.toString()}#zoom=page-width`
})

function isLocalPdf() {
    try {
        return new URL(props.src, window.location.href).origin === window.location.origin
    } catch {
        return false
    }
}

function syncViewerTheme() {
    const documentElement = frame.value?.contentDocument?.documentElement
    if (!documentElement) return

    documentElement.style.colorScheme = document.documentElement.classList.contains('dark') ? 'dark' : 'light'
}

function setDefaultScrollMode(application: PdfJsApplication) {
    const mode = window.matchMedia('(max-width: 767px)').matches ? PAGE_SCROLL_MODE : VERTICAL_SCROLL_MODE
    if (application.pdfViewer) {
        application.pdfViewer.scrollMode = mode
        return
    }
    application.eventBus?.dispatch('switchscrollmode', {mode})
}

function attachViewerEvents() {
    window.clearTimeout(appTimer)
    detachViewerEvents?.()
    detachViewerEvents = undefined

    // 通用版 PDF.js 会异步创建全局应用对象；同源 iframe 允许通过事件总线取得准确的加载结果。
    let attempts = 0
    const connect = () => {
        const application = (frame.value?.contentWindow as PdfJsWindow | null)?.PDFViewerApplication
        const eventBus = application?.eventBus

        if (!application || !eventBus) {
            attempts += 1
            if (attempts < VIEWER_CONNECT_MAX_ATTEMPTS) {
                appTimer = window.setTimeout(connect, VIEWER_CONNECT_INTERVAL_MS)
            } else {
                loading.value = false
                error.value = 'PDF 阅读器初始化失败，请尝试在新窗口中打开文档。'
            }
            return
        }

        const handleLoaded = () => {
            loading.value = false
            error.value = ''
        }
        const handleError = (event?: ViewerEvent) => {
            loading.value = false
            error.value = event?.message || 'PDF 加载失败，请检查文档是否完整。'
        }
        const handlePagesInit = () => setDefaultScrollMode(application)

        eventBus.on('documentloaded', handleLoaded)
        eventBus.on('documenterror', handleError)
        eventBus.on('pagesinit', handlePagesInit)

        if (application.pdfDocument) {
            handleLoaded()
            setDefaultScrollMode(application)
        }

        detachViewerEvents = () => {
            eventBus.off('documentloaded', handleLoaded)
            eventBus.off('documenterror', handleError)
            eventBus.off('pagesinit', handlePagesInit)
        }
    }

    connect()
}

function handleFrameLoad() {
    syncViewerTheme()
    attachViewerEvents()
}

function resetViewer() {
    loading.value = true
    error.value = ''
    detachViewerEvents?.()
    detachViewerEvents = undefined
    window.clearTimeout(appTimer)

    if (!isLocalPdf()) {
        intersectionObserver?.disconnect()
        intersectionObserver = null
        loading.value = false
        error.value = '仅支持展示当前站点构建的 PDF 文档。'
    }
}

function observeVisibility() {
    if (shouldLoad.value || intersectionObserver || !root.value) return

    if ('IntersectionObserver' in window) {
        intersectionObserver = new IntersectionObserver((entries) => {
            if (!entries.some((entry) => entry.isIntersecting)) return
            shouldLoad.value = true
            intersectionObserver?.disconnect()
            intersectionObserver = null
        }, {rootMargin: '400px 0px'})
        intersectionObserver.observe(root.value)
        return
    }

    shouldLoad.value = true
}

onMounted(() => {
    resetViewer()
    if (!error.value) observeVisibility()

    themeObserver = new MutationObserver(syncViewerTheme)
    themeObserver.observe(document.documentElement, {attributes: true, attributeFilter: ['class']})
})

watch(() => props.src, () => {
    resetViewer()
    if (error.value) return

    if (shouldLoad.value) {
        nextTick(syncViewerTheme)
        return
    }

    nextTick(observeVisibility)
})

onBeforeUnmount(() => {
    intersectionObserver?.disconnect()
    themeObserver?.disconnect()
    detachViewerEvents?.()
    window.clearTimeout(appTimer)
})
</script>

<template>
    <section ref="root" class="pdf-viewer" :aria-label="`${title} PDF 阅读器`">
        <header class="pdf-viewer__header">
            <strong class="pdf-viewer__title">{{ title }}</strong>
            <nav class="pdf-viewer__actions" aria-label="PDF 文档操作">
                <a :href="src" target="_blank" rel="noopener noreferrer">新窗口打开</a>
                <a :href="src" :download="downloadName">下载</a>
            </nav>
        </header>

        <div class="pdf-viewer__stage" :style="{height}">
            <iframe
                v-if="shouldLoad && !error"
                ref="frame"
                class="pdf-viewer__frame"
                :src="viewerUrl"
                :title="`${title} PDF 阅读器`"
                @load="handleFrameLoad"
            />

            <div v-if="loading && !error" class="pdf-viewer__status" role="status" aria-live="polite">
                正在加载 PDF 阅读器…
            </div>

            <div v-if="error" class="pdf-viewer__status pdf-viewer__status--error" role="alert">
                <p>{{ error }}</p>
                <div class="pdf-viewer__fallback-actions">
                    <a :href="src" target="_blank" rel="noopener noreferrer">在新窗口中打开</a>
                    <a :href="src" :download="downloadName">下载文档</a>
                </div>
            </div>
        </div>
    </section>
</template>

<style scoped>
.pdf-viewer {
    margin: 24px 0;
    overflow: hidden;
    border: 1px solid var(--vp-c-divider);
    border-radius: 12px;
    background: var(--vp-c-bg-soft);
}

.pdf-viewer__header {
    min-height: 44px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 16px;
    padding: 8px 12px;
    border-bottom: 1px solid var(--vp-c-divider);
}

.pdf-viewer__title {
    min-width: 0;
    overflow: hidden;
    color: var(--vp-c-text-1);
    font-size: 14px;
    text-overflow: ellipsis;
    white-space: nowrap;
}

.pdf-viewer__actions,
.pdf-viewer__fallback-actions {
    display: flex;
    align-items: center;
    gap: 12px;
    flex-shrink: 0;
}

.pdf-viewer__actions a,
.pdf-viewer__fallback-actions a {
    color: var(--vp-c-brand-1);
    font-size: 13px;
    font-weight: 600;
    text-decoration: none;
}

.pdf-viewer__actions a:hover,
.pdf-viewer__fallback-actions a:hover {
    color: var(--vp-c-brand-2);
}

.pdf-viewer__stage {
    position: relative;
    min-height: 360px;
    background: var(--vp-c-bg-alt);
}

.pdf-viewer__frame {
    width: 100%;
    height: 100%;
    display: block;
    border: 0;
}

.pdf-viewer__status {
    position: absolute;
    inset: 0;
    display: grid;
    place-content: center;
    padding: 24px;
    color: var(--vp-c-text-2);
    background: var(--vp-c-bg-alt);
    text-align: center;
}

.pdf-viewer__status--error {
    gap: 16px;
    color: var(--vp-c-danger-1);
}

.pdf-viewer__status p {
    margin: 0;
}

@media (max-width: 640px) {
    .pdf-viewer__header {
        align-items: flex-start;
        flex-direction: column;
        gap: 6px;
    }

    .pdf-viewer__actions {
        width: 100%;
        justify-content: flex-end;
    }

    .pdf-viewer__stage {
        min-height: 480px;
    }
}
</style>
