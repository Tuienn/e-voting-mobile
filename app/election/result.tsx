import ScreenHeader from '@/components/common/screen-header'
import CandidateResult from '@/components/screens/receipt/candidate-result'
import ElectionSkeleton from '@/components/screens/election/election-skeleton'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { Text } from '@/components/ui/text'
import useElectionSocket from '@/hooks/use-election-socket'
import RevealService from '@/services/reveal/reveal.service'
import { useLocalSearchParams } from 'expo-router'
import { AlertCircleIcon, AlertTriangleIcon } from 'lucide-react-native'
import { RefreshControl, View } from 'react-native'
import Animated from 'react-native-reanimated'
import { SafeAreaView } from 'react-native-safe-area-context'
import useSWR from 'swr'

const ElectionResultScreen: React.FC = () => {
    const { electionId } = useLocalSearchParams<{ electionId: string }>()

    const queryTally = useSWR(electionId ? `tally/${electionId}` : null, () => RevealService.getTally(electionId))

    useElectionSocket(electionId, ['revealed'])

    const tally = queryTally.data?.data

    return (
        <SafeAreaView style={{ flex: 1 }}>
            <Animated.ScrollView
                showsVerticalScrollIndicator={false}
                className='bg-muted'
                style={{ flex: 1 }}
                contentContainerStyle={{ padding: 16, paddingBottom: 12 }}
                refreshControl={<RefreshControl refreshing={false} onRefresh={queryTally.mutate} />}
            >
                <View className='gap-3'>
                    <ScreenHeader title='Kết quả cuộc bầu cử' />

                    {queryTally.error ? (
                        <Alert variant='destructive' icon={AlertCircleIcon}>
                            <AlertTitle>Lỗi</AlertTitle>
                            <AlertDescription>
                                {queryTally.error.message ?? 'Đã xảy ra lỗi khi tải kết quả'}
                            </AlertDescription>
                        </Alert>
                    ) : tally ? (
                        <>
                            <Text variant='large'>{tally.electionName}</Text>

                            {tally.chainError && (
                                <Alert variant='warning' icon={AlertTriangleIcon}>
                                    <AlertTitle>Không lấy được dữ liệu blockchain</AlertTitle>
                                    <AlertDescription>{tally.chainError}</AlertDescription>
                                </Alert>
                            )}

                            {tally.tallyResult.map((candidate) => (
                                <CandidateResult
                                    key={candidate.candidateId}
                                    name={candidate.candidateName ?? 'Ứng viên'}
                                    dbCount={candidate.dbRevealCount}
                                    dbTotal={tally.dbTotalSelections}
                                    chainCount={candidate.chainRevealCount}
                                    chainTotal={tally.chainTotalSelections}
                                />
                            ))}
                        </>
                    ) : (
                        <ElectionSkeleton />
                    )}
                </View>
            </Animated.ScrollView>
        </SafeAreaView>
    )
}

export default ElectionResultScreen
