import ScreenHeader from '@/components/common/screen-header'
import ElectionResultView from '@/components/screens/election/election-result-view'
import ReceiptResult from '@/components/screens/verify/receipt-result'
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible'
import { Icon } from '@/components/ui/icon'
import { Text } from '@/components/ui/text'
import { buildReceipt } from '@/lib/receipt-qr'
import { useLocalSearchParams } from 'expo-router'
import { ChevronsUpDown, TerminalIcon } from 'lucide-react-native'
import { Pressable, View } from 'react-native'
import Animated from 'react-native-reanimated'
import { SafeAreaView } from 'react-native-safe-area-context'

const VerifyReceiptScreen: React.FC = () => {
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
                <View className='gap-4'>
                    <ScreenHeader title='Kết quả xác minh' />
                    <ReceiptResult receipt={buildReceipt({ voteId, electionId, blindedCommitment, blockchainRef })} />

                    <Collapsible>
                        <CollapsibleTrigger asChild>
                            <Pressable>
                                <View className='bg-card border-border flex-row items-center justify-between rounded-lg border p-4'>
                                    <Icon as={TerminalIcon} size={16} />
                                    <Text className='text-foreground ml-2 flex-1 text-sm font-semibold'>
                                        Chi tiết kết quả bầu cử
                                    </Text>

                                    <Icon as={ChevronsUpDown} className='text-foreground' size={16} />
                                </View>
                            </Pressable>
                        </CollapsibleTrigger>
                        <CollapsibleContent className='mt-3'>
                            <ElectionResultView electionId={electionId} />
                        </CollapsibleContent>
                    </Collapsible>
                </View>
            </Animated.ScrollView>
        </SafeAreaView>
    )
}

export default VerifyReceiptScreen
