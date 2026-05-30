import { type BottomTabBarProps } from '@react-navigation/bottom-tabs'
import { useEffect } from 'react'
import { StyleSheet, View, type LayoutChangeEvent } from 'react-native'
import Animated, {
    Easing,
    interpolate,
    type SharedValue,
    useAnimatedStyle,
    useSharedValue,
    withTiming
} from 'react-native-reanimated'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { ScanQrCodeIcon, VoteIcon } from 'lucide-react-native'
import { THEME } from '@/lib/theme'
import { useUniwind } from 'uniwind'
import { Button } from '../ui/button'
import { Text } from '../ui/text'

interface Props extends BottomTabBarProps {
    navVisible: SharedValue<number>
}

type NavItem = {
    key: string
    label: string
    icon: React.ReactNode
    onPress: () => void
    isPrimary?: boolean
}

const TIMING_CONFIG = {
    duration: 320,
    easing: Easing.bezier(0.4, 0, 0.2, 1)
}

const ICON_BUTTON_WIDTH = 40
const EXPANDED_BUTTON_EXTRA_WIDTH = 64

interface FloatingNavBarProps {
    navVisible: SharedValue<number>
    items: NavItem[]
}

interface FloatingNavItemProps {
    item: NavItem
}

const FloatingNavItem: React.FC<FloatingNavItemProps> = ({ item }) => {
    const progress = useSharedValue(item.isPrimary ? 1 : 0)
    const labelWidth = useSharedValue(0)

    useEffect(() => {
        progress.value = withTiming(item.isPrimary ? 1 : 0, TIMING_CONFIG)
    }, [item.isPrimary, progress])

    const buttonStyle = useAnimatedStyle(() => {
        const expandedWidth = labelWidth.value + EXPANDED_BUTTON_EXTRA_WIDTH

        return {
            width: interpolate(progress.value, [0, 1], [ICON_BUTTON_WIDTH, expandedWidth]),
            transform: [{ scale: interpolate(progress.value, [0, 1], [0.96, 1]) }]
        }
    })

    const labelStyle = useAnimatedStyle(() => ({
        width: interpolate(progress.value, [0, 1], [0, labelWidth.value]),
        marginLeft: interpolate(progress.value, [0, 1], [0, 8]),
        opacity: progress.value,
        transform: [{ translateX: interpolate(progress.value, [0, 1], [-6, 0]) }]
    }))

    const handleLabelLayout = (event: LayoutChangeEvent) => {
        labelWidth.value = event.nativeEvent.layout.width
    }

    return (
        <Animated.View style={[styles.buttonFrame, buttonStyle]}>
            <Button
                variant='default'
                size='default'
                onPress={item.onPress}
                className='bg-primary-foreground active:bg-primary-foreground/90 absolute inset-0 gap-0 overflow-hidden rounded-full px-0'
            >
                <View pointerEvents='none'>{item.icon}</View>
                <Animated.View style={[labelStyle]} className='overflow-hidden'>
                    <Text numberOfLines={1} className='text-primary'>
                        {item.label}
                    </Text>
                </Animated.View>
            </Button>
            <View pointerEvents='none' className='absolute opacity-0' onLayout={handleLabelLayout}>
                <Text numberOfLines={1}>{item.label}</Text>
            </View>
        </Animated.View>
    )
}

const FloatingNavBar: React.FC<FloatingNavBarProps> = ({ navVisible, items }) => {
    const insets = useSafeAreaInsets()

    const animStyle = useAnimatedStyle(() => {
        const translateY = withTiming(navVisible.value === 0 ? 120 : 0, TIMING_CONFIG)
        const opacity = withTiming(navVisible.value, { duration: 280 })
        return { transform: [{ translateY }], opacity }
    })

    return (
        <Animated.View
            pointerEvents='box-none'
            style={[styles.wrapper, { paddingBottom: Math.max(insets.bottom, 16) }, animStyle]}
        >
            <View
                pointerEvents='box-none'
                className='bg-foreground/70 flex-row items-center gap-2 rounded-full p-2 shadow-lg backdrop-blur-sm'
            >
                {items.map((item) => (
                    <FloatingNavItem key={item.key} item={item} />
                ))}
            </View>
        </Animated.View>
    )
}

const CustomTabBar: React.FC<Props> = ({ state, navigation, navVisible }) => {
    const { theme } = useUniwind()

    const ROUTE_ICONS: Record<string, { icon: React.ReactNode; label: string }> = {
        election: { icon: <VoteIcon color={THEME[theme].primary} />, label: 'Bầu cử' },
        verify: { icon: <ScanQrCodeIcon color={THEME[theme].primary} />, label: 'Quét mã' }
    }

    const activeRoute = state.routes[state.index]

    const items: NavItem[] = state.routes.map((route) => {
        const meta = ROUTE_ICONS[route.name]

        return {
            key: route.key,
            label: meta?.label ?? route.name,
            icon: meta?.icon ?? null,
            onPress: () => {
                // Emit tabPress event chuẩn (hỗ trợ tab re-press to scroll-to-top)
                const event = navigation.emit({
                    type: 'tabPress',
                    target: route.key,
                    canPreventDefault: true
                })
                if (!event.defaultPrevented) {
                    navigation.navigate(route.name, route.params)
                }
            },
            isPrimary: route.key === activeRoute.key
        }
    })

    return <FloatingNavBar items={items} navVisible={navVisible} />
}

const styles = StyleSheet.create({
    wrapper: {
        position: 'absolute',
        left: 0,
        right: 0,
        bottom: -20,
        zIndex: 100,
        elevation: 100,
        alignItems: 'center'
    },
    buttonFrame: {
        position: 'relative',
        height: ICON_BUTTON_WIDTH,
        overflow: 'hidden'
    }
})

export default CustomTabBar
