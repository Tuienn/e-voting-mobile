import LargeNotification from '@/components/common/large-notification'
import ScreenHeader from '@/components/common/screen-header'
import ProgressSteps from '@/components/screens/election/progress-steps'
import ReceiptResult from '@/components/screens/receipt/receipt-result'
import { Alert, AlertTitle } from '@/components/ui/alert'
import useVoteFlow from '@/hooks/use-vote-flow'
import { buildReceipt } from '@/lib/receipt-qr'
import { VoteStep } from '@/types/vote'
import { useLocalSearchParams } from 'expo-router'
import { AlertCircleIcon, CheckIcon } from 'lucide-react-native'
import { useEffect } from 'react'
import { RefreshControl, View } from 'react-native'
import Animated from 'react-native-reanimated'
import { SafeAreaView } from 'react-native-safe-area-context'

const VOTE_STEPS_INDEX: Record<VoteStep, number> = {
    IDLE: 0,
    PREPARING: 1,
    SIGNING: 2,
    SUBMITTING: 3
}

const VoteFlowScreen: React.FC = () => {
    const { electionId, candidateId } = useLocalSearchParams<{ electionId: string; candidateId: string }>()

    const voteFlow = useVoteFlow(electionId)

    const handleVote = async () => {
        await voteFlow.vote(candidateId)
    }

    useEffect(() => {
        if (voteFlow.step === 'IDLE') {
            handleVote()
        }
    }, [candidateId])

    return (
        <SafeAreaView style={{ flex: 1 }}>
            <Animated.ScrollView
                showsVerticalScrollIndicator={false}
                className='bg-muted'
                style={{ flex: 1 }}
                contentContainerStyle={{ padding: 16, paddingBottom: 12 }}
                refreshControl={
                    <RefreshControl refreshing={false} onRefresh={!voteFlow.error ? undefined : handleVote} />
                }
            >
                <View className='gap-3'>
                    <ScreenHeader title='Quy trình bỏ phiếu' disabledBackButton={voteFlow.isProcessing} />
                    {!voteFlow.error && (
                        <LargeNotification
                            icon={CheckIcon}
                            variant='success'
                            title='Thành công'
                            description='Phiếu bầu của bạn đã được ghi nhận và sẽ được tính vào kết quả chung.'
                            hasBackground={false}
                        />
                    )}
                    <ProgressSteps
                        stepNames={['Chuẩn bị', 'Ký phiếu mù', 'Nộp phiếu']}
                        nowStep={!voteFlow.error ? 4 : VOTE_STEPS_INDEX[voteFlow.step]}
                        isError={!!voteFlow.error}
                    />

                    {voteFlow.error && (
                        <Alert variant='destructive' icon={AlertCircleIcon}>
                            <AlertTitle>{voteFlow.error}</AlertTitle>
                        </Alert>
                    )}

                    {voteFlow.receipt && (
                        <ReceiptResult
                            receipt={buildReceipt({
                                voteId: voteFlow.receipt.id,
                                electionId: voteFlow.receipt.electionId,
                                blindedCommitment: voteFlow.receipt.blindedCommitment,
                                blockchainRef: voteFlow.receipt.blockchainRef
                            })}
                        />
                    )}
                </View>
            </Animated.ScrollView>
        </SafeAreaView>
    )
}

export default VoteFlowScreen
