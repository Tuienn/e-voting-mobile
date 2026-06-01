import { clearAuthToken, getAccessToken, getRefreshToken, saveAccessToken, saveRefreshToken } from '@/lib/secure-store'
import React, { createContext, useState, useEffect, PropsWithChildren, useCallback } from 'react'
import { UserSession } from '@/types/auth'
import AuthService from '@/services/bff/auth.service'
import useSWRMutation from 'swr/mutation'

export interface AuthContextType {
    isAuth: boolean
    login: (accessToken: string, refreshToken: string, user: UserSession) => Promise<void>
    logout: () => Promise<any>
    user: UserSession | null
    isLoading: boolean
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined)

export const AuthProvider: React.FC<PropsWithChildren> = ({ children }) => {
    const [user, setUser] = useState<UserSession | null>(null)

    useEffect(() => {
        checkAuthOnStart()
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    const checkAuthOnStart = useCallback(async () => {
        const accessToken = await getAccessToken()
        if (accessToken) {
            // If we have an access token, try to fetch the current user
            queryCurrentUser.trigger()
        } else {
            const refreshToken = await getRefreshToken()
            if (!refreshToken) {
                await clearAuthToken()
                setUser(null)

                console.error('No refresh token available')
                return
            }

            mutateRefreshToken.trigger(refreshToken)
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    const queryCurrentUser = useSWRMutation('user', () => AuthService.getCurrentUser(), {
        onSuccess: (data) => {
            setUser({
                id: data.data.id,
                email: data.data.email,
                role: data.data.role
            })
        },
        onError: async (error) => {
            console.error('Failed to fetch current user:', error)
            setUser(null)

            const refreshToken = await getRefreshToken()
            if (!refreshToken) {
                await clearAuthToken()
                setUser(null)

                console.error('No refresh token available')
                return
            }

            mutateRefreshToken.trigger(refreshToken)
        }
    })

    const mutateRefreshToken = useSWRMutation(
        'refreshToken',
        (_, { arg }: { arg: string }) => AuthService.refreshToken(arg),
        {
            onSuccess: async (data) => {
                await saveAccessToken(data.data.accessToken)
                setUser({
                    id: data.data.id,
                    email: data.data.email,
                    role: data.data.role
                })
            },
            onError: async (error) => {
                console.error('Failed to refresh token:', error)
                await clearAuthToken()
                setUser(null)
            }
        }
    )

    const login = async (accessToken: string, refreshToken: string, user: UserSession) => {
        try {
            await saveAccessToken(accessToken)
            await saveRefreshToken(refreshToken)
            setUser({
                id: user.id,
                email: user.email,
                role: user.role
            })
        } catch (error) {
            console.error('Error during login:', error)
            throw error
        }
    }

    const logout = async () => {
        await clearAuthToken()
        setUser(null)
    }

    const contextValue: AuthContextType = {
        isAuth: !!user,
        login,
        logout,
        user,
        isLoading: queryCurrentUser.isMutating || mutateRefreshToken.isMutating
    }

    return <AuthContext.Provider value={contextValue}>{children}</AuthContext.Provider>
}
