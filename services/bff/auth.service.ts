import { AuthSession, User } from '@/types/auth'
import { bffApiService } from '.'
import { BffEmptyResponse, BffResponse } from '@/types/common'

export default class AuthService {
    private static readonly BASE_URL = '/identity/auth'

    static login = async (email: string, password: string) => {
        return await bffApiService<BffResponse<AuthSession>>(`${this.BASE_URL}/sign-in`, {
            method: 'POST',
            body: JSON.stringify({ email, password })
        })
    }

    static register = async (email: string, password: string) => {
        return await bffApiService<BffResponse<AuthSession>>(`${this.BASE_URL}/register`, {
            method: 'POST',
            body: JSON.stringify({ email, password })
        })
    }

    static signOut = async (refreshToken: string) => {
        return await bffApiService<BffEmptyResponse>(`${this.BASE_URL}/sign-out`, {
            method: 'POST',
            body: JSON.stringify({ refreshToken })
        })
    }

    static getCurrentUser = async () => {
        return await bffApiService<BffResponse<User>>(`${this.BASE_URL}/me`)
    }

    static refreshToken = async (refreshToken: string) => {
        return await bffApiService<BffResponse<AuthSession>>(`${this.BASE_URL}/refresh-token`, {
            method: 'POST',
            body: JSON.stringify({ refreshToken })
        })
    }
}
