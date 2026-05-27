export type UserRole = 'ADMIN' | 'VOTER' | 'CANDIDATE'

export interface User {
    id: string
    email: string
    name: string
    role: UserRole
    isActive: boolean
    createdAt?: string
    updatedAt?: string
}

export interface UserSession {
    id: string
    email: string
    role: UserRole
}

export interface AuthSession extends UserSession {
    accessToken: string
    refreshToken: string
}
