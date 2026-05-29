import { REVEAL_BASE_URL } from '@/constants/env.config'

//NOTE - Reveal-vote service là public API (không đính kèm token, không refresh)
export const revealApiService = async <T = any>(url: string, options?: RequestInit): Promise<T> => {
    const defaultHeaders = {
        Accept: 'application/json'
    }

    const mergedHeaders = new Headers({
        ...(options?.body instanceof FormData
            ? { ...defaultHeaders }
            : {
                  ...defaultHeaders,
                  'Content-Type': 'application/json'
              }),
        ...(options?.headers as Record<string, string> | undefined)
    })

    const res = await fetch(`${REVEAL_BASE_URL}/api/v1${url}`, {
        ...options,
        headers: mergedHeaders
    })

    const data = await res.json()

    if (res.ok) {
        return (data ?? (undefined as unknown)) as T
    }

    const message = data?.message || `HTTP ${res.status} ${res.statusText || ''}`.trim()
    throw new Error(message)
}
