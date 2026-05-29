import { AuthSession, User } from '@/types/auth'
import { bffApiService } from '.'
import { ApiEmptyResponse, ApiResponse } from '@/types/common'

export default class AuthService {
    private static readonly BASE_URL = '/identity/auth'

    static async login(email: string, password: string) {
        return await bffApiService<ApiResponse<AuthSession>>(`${this.BASE_URL}/sign-in`, {
            method: 'POST',
            body: JSON.stringify({ email, password })
        })
    }

    static async register(email: string, password: string) {
        return await bffApiService<ApiResponse<AuthSession>>(`${this.BASE_URL}/register`, {
            method: 'POST',
            body: JSON.stringify({ email, password })
        })
    }

    static async signOut(refreshToken: string) {
        return await bffApiService<ApiEmptyResponse>(`${this.BASE_URL}/sign-out`, {
            method: 'POST',
            body: JSON.stringify({ refreshToken })
        })
    }

    static async getCurrentUser() {
        return await bffApiService<ApiResponse<User>>(`${this.BASE_URL}/me`)
    }

    static async refreshToken(refreshToken: string) {
        return await bffApiService<ApiResponse<AuthSession>>(`${this.BASE_URL}/refresh-token`, {
            method: 'POST',
            body: JSON.stringify({ refreshToken })
        })
    }
}
