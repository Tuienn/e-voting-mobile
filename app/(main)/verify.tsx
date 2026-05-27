import { Text } from '@/components/ui/text'
import { useScrollDirection } from '@/hooks/use-scroll-direction'
import { StyleSheet, View } from 'react-native'
import Animated from 'react-native-reanimated'

const verifySteps = [
    'Quét mã QR trên phiếu xác nhận.',
    'Đối chiếu dữ liệu công khai trên hệ thống.',
    'Hiển thị kết quả xác minh cho cử tri.',
    'Lưu lịch sử xác minh cục bộ nếu cần.'
]

const VerifyScreen: React.FC = () => {
    const { scrollHandler } = useScrollDirection()

    return (
        <Animated.ScrollView
            style={styles.container}
            contentContainerStyle={{ padding: 20, paddingBottom: 120 }}
            onScroll={scrollHandler}
            scrollEventThrottle={16}
            showsVerticalScrollIndicator={false}
        >
            <View className='gap-4'>
                <View className='gap-2'>
                    <Text className='text-3xl font-bold'>Quét mã</Text>
                    <Text className='text-muted-foreground'>Xác minh phiếu bầu bằng mã QR trên biên nhận.</Text>
                </View>

                <View className='bg-card border-border items-center justify-center rounded-lg border p-10'>
                    <Text className='text-muted-foreground'>Khu vực camera / QR scanner</Text>
                </View>

                {verifySteps.map((step, index) => (
                    <View key={step} className='bg-card border-border gap-2 rounded-lg border p-4'>
                        <Text className='text-lg font-semibold'>Bước {index + 1}</Text>
                        <Text className='text-muted-foreground'>{step}</Text>
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

export default VerifyScreen
