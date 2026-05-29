import * as SecureStore from 'expo-secure-store'
import { Platform } from 'react-native'

//NOTE - Xác định đang chạy web hay native
const isWeb = Platform.OS === 'web'

//NOTE - Web fallback using localStorage
const webStorage = {
    setItem: (key: string, value: string) => {
        if (typeof window !== 'undefined') {
            localStorage.setItem(key, value)
        }
    },
    getItem: (key: string): string | null => {
        if (typeof window !== 'undefined') {
            return localStorage.getItem(key)
        }
        return null
    },
    removeItem: (key: string) => {
        if (typeof window !== 'undefined') {
            localStorage.removeItem(key)
        }
    }
}

export const saveDataStorage = async (key: string, value: string) => {
    try {
        if (isWeb) {
            webStorage.setItem(key, value)
        } else {
            await SecureStore.setItemAsync(key, value)
        }
    } catch (error) {
        console.error(`Error saving data [${key}]:`, error)
        throw error
    }
}

export const getDataStorage = async (key: string): Promise<string | null> => {
    try {
        if (isWeb) {
            return webStorage.getItem(key)
        } else {
            return await SecureStore.getItemAsync(key)
        }
    } catch (error) {
        console.error(`Error getting data [${key}]:`, error)
        return null
    }
}

export const removeDataStorage = async (key: string) => {
    try {
        if (isWeb) {
            webStorage.removeItem(key)
        } else {
            await SecureStore.deleteItemAsync(key)
        }
    } catch (error) {
        console.error(`Error removing data [${key}]:`, error)
    }
}

//NOTE - Token management
export const saveAccessToken = (token: string) => saveDataStorage('accessToken', token)
export const getAccessToken = () => getDataStorage('accessToken')
export const saveRefreshToken = (token: string) => saveDataStorage('refreshToken', token)
export const getRefreshToken = () => getDataStorage('refreshToken')

export const clearAuthToken = async () => {
    await removeDataStorage('accessToken')
    await removeDataStorage('refreshToken')
}

//NOTE - Vote params secret management
export const saveVoteParamsSecret = async (voteId: string, h: string, sPrime: string) => {
    const data = JSON.stringify({ h, sPrime })
    await saveDataStorage(`voteParamsSecret-${voteId}`, data)
}

export const getVoteParamsSecret = async (voteId: string): Promise<{ h: string; sPrime: string } | null> => {
    const data = await getDataStorage(`voteParamsSecret-${voteId}`)
    if (!data) return null
    try {
        return JSON.parse(data)
    } catch {
        return null
    }
}

export const clearVoteParamsSecret = async (voteId: string) => {
    await removeDataStorage(`voteParamsSecret-${voteId}`)
}
