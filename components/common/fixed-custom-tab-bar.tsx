import { StyleSheet, View } from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { Button } from '../ui/button'
import { Text } from '../ui/text'

export type FixedCustomTabBarItem = {
    key: string
    label: string
    icon: React.ReactNode
    onPress: () => void
    disabled?: boolean
}

interface Props {
    items: FixedCustomTabBarItem[]
}

const FixedCustomTabBar: React.FC<Props> = ({ items }) => {
    const insets = useSafeAreaInsets()

    return (
        <View pointerEvents='box-none' style={[styles.wrapper, { bottom: insets.bottom + 8 }]}>
            <View
                pointerEvents='box-none'
                className='bg-foreground/70 flex-row items-center gap-2 rounded-full p-2 shadow-lg backdrop-blur-sm'
            >
                {items.map((item) => {
                    return (
                        <Button
                            key={item.key}
                            variant='default'
                            size='default'
                            onPress={item.onPress}
                            className='bg-primary-foreground active:bg-primary-foreground/90 rounded-full'
                            disabled={item.disabled}
                        >
                            <View pointerEvents='none'>{item.icon}</View>
                            <Text numberOfLines={1} className='text-primary'>
                                {item.label}
                            </Text>
                        </Button>
                    )
                })}
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    wrapper: {
        position: 'absolute',
        left: 0,
        right: 0,
        zIndex: 10,
        elevation: 100,
        alignItems: 'center'
    }
})

export default FixedCustomTabBar
