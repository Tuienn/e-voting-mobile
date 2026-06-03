import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs))
}

export function formatDateTime(dateTime: string) {
    return new Date(dateTime).toLocaleString('vi-VN', {
        timeZone: 'Asia/Ho_Chi_Minh'
    })
}

const AVATARS = [
    'https://github.com/mrzachnugent.png',
    'https://github.com/shadcn.png',
    'https://github.com/Tuienn.png',
    'https://github.com/torvalds.png',
    'https://github.com/sindresorhus.png',
    'https://github.com/yyx990803.png',
    'https://github.com/antfu.png',
    'https://github.com/rauchg.png',
    'https://github.com/evilrabbit.png',
    'https://github.com/facebook.png',
    'https://github.com/google.png',
    'https://github.com/anthropics.png',
    'https://github.com/openai.png'
]

export const randomAvatar = () => AVATARS[Math.floor(Math.random() * AVATARS.length)]

export const runAfterIdle = (callback: () => void): (() => void) => {
    if (typeof requestIdleCallback !== 'undefined') {
        const id = requestIdleCallback(callback)
        return () => cancelIdleCallback(id)
    }
    const id = setTimeout(callback, 0)
    return () => clearTimeout(id)
}
