import { Text } from '@/components/ui/text'
import { useScrollDirection } from '@/hooks/use-scroll-direction'
import { StyleSheet, View } from 'react-native'
import Animated from 'react-native-reanimated'

const electionItems = Array.from({ length: 12 }, (_, index) => ({
    id: index + 1,
    title: `Cuộc bầu cử ${index + 1}`,
    description: index % 2 === 0 ? 'Đang mở bỏ phiếu' : 'Sắp diễn ra'
}))

const ElectionScreen: React.FC = () => {
    const { scrollHandler } = useScrollDirection()

    return (
        <Animated.ScrollView
            className='flex-1'
            style={styles.container}
            contentContainerStyle={{ padding: 20, paddingBottom: 120 }}
            onScroll={scrollHandler}
            scrollEventThrottle={16}
            showsVerticalScrollIndicator={false}
        >
            <View className='gap-4'>
                <View className='gap-2'>
                    <Text className='text-3xl font-bold'>Trang chủ</Text>
                    <Text className='text-muted-foreground'>Theo dõi các cuộc bầu cử và trạng thái bỏ phiếu.</Text>
                </View>

                {electionItems.map((item) => (
                    <View key={item.id} className='bg-card border-border gap-2 rounded-lg border p-4'>
                        <Text className='text-lg font-semibold'>{item.title}</Text>
                        <Text className='text-muted-foreground'>{item.description}</Text>
                    </View>
                ))}
            </View>
        </Animated.ScrollView>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1
    }
})

export default ElectionScreen
