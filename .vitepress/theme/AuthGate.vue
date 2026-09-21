<script setup lang="ts">
import DefaultTheme from 'vitepress/theme'
import {useRoute, useRouter} from 'vitepress'
import {computed, h, nextTick, onBeforeUnmount, onMounted, ref, watch} from 'vue'
import {clearAuth, createAuthRecord, readAuthRecord, saveAuth, verifyPassword} from './auth'

const route = useRoute()
const router = useRouter()
const ready = ref(false)
const authorized = ref(false)
const password = ref('')
const error = ref('')
const retryAt = ref(0)
const now = ref(Date.now())
let timer: number | undefined

const isAuthRoute = computed(() => route.path === '/auth' || route.path === '/auth.html')
function redirectToAuth() {
    if (!isAuthRoute.value) {
        sessionStorage.setItem('siriabc-docs-return-path', route.path + route.query)
        router.go('/auth', {replace: true})
    }
}

function redirectAfterAuth() {
    const target = sessionStorage.getItem('siriabc-docs-return-path') || '/'
    sessionStorage.removeItem('siriabc-docs-return-path')
    router.go(target, {replace: true})
}

async function submit() {
    if (Date.now() < retryAt.value || !password.value) return
    error.value = ''
    if (!(await verifyPassword(password.value))) {
        error.value = '密码不正确，请重试。'
        retryAt.value = Date.now() + 3000
        password.value = ''
        return
    }
    saveAuth(createAuthRecord())
    authorized.value = true
    redirectAfterAuth()
}

function logout() {
    clearAuth()
    authorized.value = false
    redirectToAuth()
}

onMounted(() => {
    authorized.value = Boolean(readAuthRecord())
    ready.value = true
    timer = window.setInterval(() => {
        now.value = Date.now()
        if (authorized.value && !readAuthRecord()) {
            authorized.value = false
            redirectToAuth()
        }
    }, 1000)
    nextTick(() => {
        if (authorized.value && isAuthRoute.value) redirectAfterAuth()
        if (!authorized.value) redirectToAuth()
    })
})

watch(() => route.path, () => {
    if (ready.value && !isAuthRoute.value && !readAuthRecord()) {
        authorized.value = false
        redirectToAuth()
    }
})

onBeforeUnmount(() => {
    if (timer) window.clearInterval(timer)
})

function renderAuthPage() {
    const seconds = Math.max(0, Math.ceil((retryAt.value - now.value) / 1000))
    return h('main', {class: 'docs-auth-page'}, [
        h('section', {class: 'docs-auth-card'}, [
            h('p', {class: 'docs-auth-kicker'}, 'SIRIABC DOCUMENTS'),
            h('h1', '输入访问密码'),
            h('p', {class: 'docs-auth-description'}, '验证通过后，当前浏览器 30 天内无需重复输入。'),
            h('form', {onSubmit: (event: Event) => { event.preventDefault(); void submit() }}, [
                h('label', {for: 'docs-password'}, '访问密码'),
                h('input', {id: 'docs-password', type: 'password', autocomplete: 'current-password', value: password.value, onInput: (event: Event) => { password.value = (event.target as HTMLInputElement).value }}),
                h('button', {type: 'submit', disabled: seconds > 0}, seconds > 0 ? `请等待 ${seconds} 秒` : '进入文档'),
                error.value ? h('p', {class: 'docs-auth-error', role: 'alert'}, error.value) : null
            ])
        ])
    ])
}

function renderLogout() {
    return h('button', {class: 'docs-auth-logout', type: 'button', onClick: logout}, '清除授权')
}

const Layout = DefaultTheme.Layout
</script>

<template>
    <div v-if="!ready" class="docs-auth-loading" aria-live="polite">正在检查授权…</div>
    <component v-else-if="isAuthRoute" :is="{render: renderAuthPage}" />
    <component v-else-if="authorized" :is="Layout">
        <template v-if="authorized && !isAuthRoute" #nav-bar-content-after>
            <component :is="{render: renderLogout}" />
        </template>
    </component>
    <div v-else class="docs-auth-loading" aria-live="polite">正在跳转到验证页…</div>
</template>
