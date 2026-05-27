import CustomTabBar from '@/components/pages/(main)/custom-tab-bar'
import { ScrollDirectionProvider } from '@/components/providers/scroll-direction-provider'

import { useScrollDirection } from '@/hooks/use-scroll-direction'
import { Tabs } from 'expo-router'
import { StyleSheet } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'

const MainLayout: React.FC = () => {
    return (
        <SafeAreaView className='bg-muted relative' style={styles.container}>
            <ScrollDirectionProvider>
                <TabsLayout />
            </ScrollDirectionProvider>
        </SafeAreaView>
    )
}

const TabsLayout: React.FC = () => {
    const { navVisible } = useScrollDirection()

    return (
        <Tabs
            initialRouteName='election'
            screenOptions={{
                headerShown: false,
                sceneStyle: styles.scene,
                tabBarStyle: styles.transparentTabBar
            }}
            tabBar={(props) => <CustomTabBar {...props} navVisible={navVisible} />}
        >
            <Tabs.Screen name='election' />
            <Tabs.Screen name='verify' />
        </Tabs>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1
    },
    scene: {
        backgroundColor: 'transparent'
    },
    transparentTabBar: {
        position: 'absolute',
        backgroundColor: 'transparent',
        elevation: 0,
        shadowOpacity: 0
    }
})

export default MainLayout
