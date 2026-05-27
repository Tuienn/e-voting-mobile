import { useAuth } from '@/hooks/use-auth'
import { Redirect } from 'expo-router'

const HomeScreen = () => {
    const { isAuth, isLoading } = useAuth()

    if (isLoading || !isAuth) {
        return <Redirect href='/login' />
    }

    return <Redirect href='/election' />
}

export default HomeScreen
