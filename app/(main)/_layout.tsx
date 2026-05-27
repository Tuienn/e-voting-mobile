import CustomTabBar from '@/components/pages/(main)/custom-tab-bar'
import { useScrollDirection } from '@/hooks/use-scroll-direction'
import { Tabs } from 'expo-router'
import { SafeAreaView } from 'react-native-safe-area-context'

const MainLayout: React.FC = () => {
    const { scrollHandler, navVisible } = useScrollDirection()

    return (
        <SafeAreaView className='bg-muted flex-1'>
            <Tabs
                screenOptions={{ headerShown: false }}
                tabBar={(props) => <CustomTabBar {...props} navVisible={navVisible} />}
            >
                <Tabs.Screen name='election' />
                <Tabs.Screen name='verify' />
            </Tabs>
        </SafeAreaView>
    )
}

export default MainLayout
