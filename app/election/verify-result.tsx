import ScreenHeader from '@/components/common/screen-header'
import ReceiptResult from '@/components/screens/receipt/receipt-result'
import { buildReceipt } from '@/lib/receipt-qr'
import { useLocalSearchParams } from 'expo-router'
import { View } from 'react-native'
import Animated from 'react-native-reanimated'
import { SafeAreaView } from 'react-native-safe-area-context'

const VerifyResultScreen: React.FC = () => {
    const { voteId, electionId, blindedCommitment, blockchainRef } = useLocalSearchParams<{
        voteId: string
        electionId: string
        blindedCommitment: string
        blockchainRef: string
    }>()

    return (
        <SafeAreaView style={{ flex: 1 }}>
            <Animated.ScrollView
                showsVerticalScrollIndicator={false}
                className='bg-muted'
                style={{ flex: 1 }}
                contentContainerStyle={{ padding: 16, paddingBottom: 12 }}
            >
                <View className='gap-3'>
                    <ScreenHeader title='Kết quả xác minh' />
                    <ReceiptResult receipt={buildReceipt({ voteId, electionId, blindedCommitment, blockchainRef })} />
                </View>
            </Animated.ScrollView>
        </SafeAreaView>
    )
}

export default VerifyResultScreen
