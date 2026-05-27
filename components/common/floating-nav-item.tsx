import { useEffect } from 'react'
import { StyleSheet, View, type LayoutChangeEvent } from 'react-native'
import Animated, { useAnimatedStyle, withTiming, Easing, useSharedValue, interpolate } from 'react-native-reanimated'
import { Button } from '../ui/button'
import { Text } from '../ui/text'

export type NavItem = {
    key: string
    label: string
    icon: React.ReactNode
    onPress: () => void
    isPrimary?: boolean
}

export const TIMING_CONFIG = {
    duration: 320,
    easing: Easing.bezier(0.4, 0, 0.2, 1)
}

const ICON_BUTTON_WIDTH = 40
const EXPANDED_BUTTON_EXTRA_WIDTH = 64

type FloatingNavItemProps = {
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

const styles = StyleSheet.create({
    buttonFrame: {
        position: 'relative',
        height: ICON_BUTTON_WIDTH,
        overflow: 'hidden'
    }
})

export default FloatingNavItem
