import { View, StyleSheet } from 'react-native'
import Animated, { SharedValue, useAnimatedStyle, withTiming } from 'react-native-reanimated'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import FloatingNavItem, { NavItem, TIMING_CONFIG } from './floating-nav-item'

type Props = {
    navVisible: SharedValue<number>
    items: NavItem[]
}

const FloatingNavBar: React.FC<Props> = ({ navVisible, items }) => {
    const insets = useSafeAreaInsets()

    const animStyle = useAnimatedStyle(() => {
        const translateY = withTiming(navVisible.value === 0 ? 120 : 0, TIMING_CONFIG)
        const opacity = withTiming(navVisible.value, { duration: 280 })
        return { transform: [{ translateY }], opacity }
    })

    return (
        <Animated.View
            style={[styles.wrapper, { bottom: Math.max(insets.bottom, 16) + 8 }, animStyle]}
            pointerEvents='box-none'
        >
            <View className='bg-foreground/70 flex-row items-center gap-2 rounded-full p-2 shadow-lg backdrop-blur-sm'>
                {items.map((item) => (
                    <FloatingNavItem key={item.key} item={item} />
                ))}
            </View>
        </Animated.View>
    )
}

const styles = StyleSheet.create({
    wrapper: {
        position: 'absolute',
        left: 0,
        right: 0,
        alignItems: 'center',
        zIndex: 100
    }
})

export default FloatingNavBar
