import '@/global.css'
import { Buffer } from 'buffer'
import { AuthProvider } from '@/components/providers/auth-provider'
import { NAV_THEME } from '@/lib/theme'
import { ThemeProvider } from '@react-navigation/native'
import { PortalHost } from '@rn-primitives/portal'
import { Stack } from 'expo-router'
import { StatusBar } from 'expo-status-bar'
import { useUniwind } from 'uniwind'
import Toast from 'react-native-toast-message'
import * as SplashScreen from 'expo-splash-screen'
import { useAuth } from '@/hooks/use-auth'
import { useEffect } from 'react'
import SwrProvider from '@/components/providers/swr-provider'

// NOTE - Polyfill Buffer cho base64url (dùng khi build/parse QR biên lai)
globalThis.Buffer = globalThis.Buffer ?? Buffer

// Set the animation options. This is optional.
SplashScreen.setOptions({
    fade: true
})

SplashScreen.preventAutoHideAsync()

export {
    // Catch any errors thrown by the Layout component.
    ErrorBoundary
} from 'expo-router'

function RootLayoutContent() {
    const { theme } = useUniwind()
    const { isLoading } = useAuth()

    useEffect(() => {
        const handleSplash = async () => {
            if (!isLoading) {
                // Khi auth đã load xong → ẩn splash
                await SplashScreen.hideAsync()
            }
        }
        handleSplash()
    }, [isLoading])

    if (isLoading) return null

    return (
        <ThemeProvider value={NAV_THEME[theme ?? 'light']}>
            <StatusBar style={theme === 'dark' ? 'light' : 'dark'} />
            <Stack screenOptions={{ headerShown: false }} />
            <PortalHost />
            <Toast />
        </ThemeProvider>
    )
}
export default function RootLayout() {
    return (
        <SwrProvider>
            <AuthProvider>
                <RootLayoutContent />
            </AuthProvider>
        </SwrProvider>
    )
}
