import * as SecureStore from 'expo-secure-store'
import { Platform } from 'react-native'
import { VoteParamsSecret, VoteSecretBackupMap, VoteStatus } from '../types/backup'

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

export const clearAllSecureData = async () => {
    const ids = await getBackupVoteIds()
    for (const voteId of ids) {
        await removeDataStorage(`voteParamsSecret-${voteId}`)
        await removeDataStorage(`voteStatus-${voteId}`)
    }
    await removeDataStorage('voteSecretIndex')
}

export const getBackupVoteIds = async (): Promise<string[]> => {
    const data = await getDataStorage('voteSecretIndex')
    if (!data) return []
    try {
        const arr = JSON.parse(data)
        return Array.isArray(arr) ? arr : []
    } catch {
        return []
    }
}

const addVoteIdToIndex = async (voteId: string) => {
    const ids = await getBackupVoteIds()
    if (!ids.includes(voteId)) {
        await saveDataStorage('voteSecretIndex', JSON.stringify([...ids, voteId]))
    }
}

//NOTE - Vote params secret management
export const saveVoteParamsSecret = async (voteId: string, params: VoteParamsSecret) => {
    const data = JSON.stringify(params)
    await saveDataStorage(`voteParamsSecret-${voteId}`, data)
    await addVoteIdToIndex(voteId)
}

export const getVoteParamsSecret = async (voteId: string): Promise<VoteParamsSecret | null> => {
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

//NOTE - Vote status management (candidateId and revealed flag)
export const saveVoteStatus = async (voteId: string, status: VoteStatus) => {
    const data = JSON.stringify(status)
    await saveDataStorage(`voteStatus-${voteId}`, data)
    await addVoteIdToIndex(voteId)
}

export const getVoteStatus = async (voteId: string): Promise<VoteStatus | null> => {
    const data = await getDataStorage(`voteStatus-${voteId}`)
    if (!data) return null
    try {
        return JSON.parse(data)
    } catch {
        return null
    }
}

export const collectVoteSecretsForBackup = async (): Promise<VoteSecretBackupMap> => {
    const ids = await getBackupVoteIds()
    const result: VoteSecretBackupMap = {}

    for (const voteId of ids) {
        const [params, status] = await Promise.all([getVoteParamsSecret(voteId), getVoteStatus(voteId)])
        if (params || status) {
            result[voteId] = { params, status }
        }
    }

    return result
}

export const restoreVoteSecretsFromBackup = async (map: VoteSecretBackupMap) => {
    for (const [voteId, entry] of Object.entries(map)) {
        // saveVoteParamsSecret/saveVoteStatus tự cập nhật index
        if (entry?.params) await saveVoteParamsSecret(voteId, entry.params)
        if (entry?.status) await saveVoteStatus(voteId, entry.status)
    }
}
