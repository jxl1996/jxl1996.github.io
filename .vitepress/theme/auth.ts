import {inBrowser} from 'vitepress'

const STORAGE_KEY = 'siriabc-docs-auth'
const AUTH_DAYS = 30

export type AuthRecord = {
    version: string
    expiresAt: number
    proof: string
}

function getConfig() {
    return {
        passwordHash: import.meta.env.VITE_DOCS_PASSWORD_HASH as string,
        version: (import.meta.env.VITE_DOCS_AUTH_VERSION as string | undefined) || '1'
    }
}

async function sha256(value: string) {
    const data = new TextEncoder().encode(value)
    const digest = await crypto.subtle.digest('SHA-256', data)
    return Array.from(new Uint8Array(digest), (byte) => byte.toString(16).padStart(2, '0')).join('')
}

export async function verifyPassword(password: string) {
    const {passwordHash} = getConfig()
    return (await sha256(password)) === passwordHash
}

export function createAuthRecord(): AuthRecord {
    const {passwordHash, version} = getConfig()
    return {
        version,
        expiresAt: Date.now() + AUTH_DAYS * 24 * 60 * 60 * 1000,
        // 记录可由当前构建配置复核，避免仅凭 localStorage 字段形状放行。
        proof: `${version}:${passwordHash}`
    }
}

export function readAuthRecord(): AuthRecord | null {
    if (!inBrowser) return null

    try {
        const raw = localStorage.getItem(STORAGE_KEY)
        if (!raw) return null
        const record = JSON.parse(raw) as AuthRecord
        const {version} = getConfig()
        const expectedProof = `${version}:${getConfig().passwordHash}`
        if (record.version !== version || record.expiresAt <= Date.now() || record.proof !== expectedProof) {
            clearAuth()
            return null
        }
        return record
    } catch {
        clearAuth()
        return null
    }
}

export function saveAuth(record: AuthRecord) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(record))
}

export function clearAuth() {
    if (inBrowser) localStorage.removeItem(STORAGE_KEY)
}

export const AUTH_STORAGE_KEY = STORAGE_KEY
