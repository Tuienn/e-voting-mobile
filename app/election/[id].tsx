import BottomSheetModal from '@/components/common/bottom-sheet-modal'
import FixedCustomTabBar from '@/components/common/fixed-custom-tab-bar'
import ScreenHeader from '@/components/common/screen-header'
import CandidateCheckbox from '@/components/screens/election/candidate-checkbox'
import CandidateSelected from '@/components/screens/election/candidate-selected'
import ElectionPill from '@/components/screens/election/election-pill'
import ElectionSkeleton from '@/components/screens/election/election-skeleton'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { Button } from '@/components/ui/button'
import { Icon } from '@/components/ui/icon'
import { Text } from '@/components/ui/text'
import { THEME } from '@/lib/theme'
import ElectionService from '@/services/bff/election.service'
import { router } from 'expo-router'
import { useLocalSearchParams } from 'expo-router'
import { AlertCircleIcon, ShieldCheckIcon, TerminalIcon, VoteIcon } from 'lucide-react-native'
import { useMemo, useState } from 'react'
import { RefreshControl, View } from 'react-native'
import Animated from 'react-native-reanimated'
import { SafeAreaView } from 'react-native-safe-area-context'
import useSWR from 'swr'
import { useUniwind } from 'uniwind'

const ElectionDetailScreen: React.FC = () => {
    const { id } = useLocalSearchParams<{ id: string }>()
    const { theme } = useUniwind()
    const [selectedCandidateId, setSelectedCandidateId] = useState<string | null>(null)
    const [bottomSheetVisible, setBottomSheetVisible] = useState(false)

    const queryElectionById = useSWR(`election/${id}`, () => ElectionService.getElectionById(id))

    const candidateSelected = useMemo(() => {
        if (!selectedCandidateId) return null
        const candidate = queryElectionById.data?.data.candidates.find((c) => c.id === selectedCandidateId)
        if (!candidate) return null
        return {
            name: candidate.name,
            email: candidate.email,
            id: candidate.id
        }
    }, [selectedCandidateId, queryElectionById.data])

    return (
        <SafeAreaView style={{ flex: 1 }}>
            <Animated.ScrollView
                showsVerticalScrollIndicator={false}
                className='bg-muted'
                style={{ flex: 1 }}
                contentContainerStyle={{ padding: 16, paddingBottom: 12 }}
                refreshControl={<RefreshControl refreshing={false} onRefresh={queryElectionById.mutate} />}
            >
                <View className='gap-3'>
                    <ScreenHeader title='Chi tiết cuộc bầu cử' />

                    {queryElectionById.error ? (
                        <Alert variant='destructive' icon={AlertCircleIcon}>
                            <AlertTitle>Lỗi</AlertTitle>
                            <AlertDescription>
                                {queryElectionById.error.message ?? 'Đã xảy ra lỗi khi tải thông tin cuộc bầu cử'}
                            </AlertDescription>
                        </Alert>
                    ) : queryElectionById.data ? (
                        <>
                            <ElectionPill
                                candidateCount={queryElectionById.data.data.candidateIds.length}
                                name={queryElectionById.data.data.name}
                                status={queryElectionById.data.data.status}
                                startDate={queryElectionById.data.data.startDate}
                                endDate={queryElectionById.data.data.endDate}
                            />
                            <View className='flex-row justify-between'>
                                <Text variant={'muted'} className='font-semibold uppercase'>
                                    Ứng viên
                                </Text>

                                <Text variant={'muted'}>
                                    Đã chọn {selectedCandidateId ? 1 : 0} trên{' '}
                                    {queryElectionById.data.data.candidateIds.length}
                                </Text>
                            </View>

                            <Alert icon={TerminalIcon} variant='info'>
                                <AlertTitle>Chọn tối đa 1 ứng cử viên</AlertTitle>
                            </Alert>

                            {queryElectionById.data.data.candidates.map((candidate) => (
                                <CandidateCheckbox
                                    key={candidate.id}
                                    candidateId={candidate.id}
                                    name={candidate.name}
                                    email={candidate.email}
                                    isSelected={selectedCandidateId === candidate.id}
                                    onSelect={setSelectedCandidateId}
                                    disabled={
                                        queryElectionById.data!.data.status !== 'ACTIVE' ||
                                        !!queryElectionById.data?.data.vote
                                    }
                                />
                            ))}
                        </>
                    ) : (
                        <ElectionSkeleton />
                    )}
                </View>
            </Animated.ScrollView>

            {queryElectionById.data && queryElectionById.data.data.status !== 'ACTIVE' ? null : (
                <FixedCustomTabBar
                    items={[
                        {
                            key: 'vote',
                            label: 'Bỏ phiếu',
                            icon: <VoteIcon color={THEME[theme].primary} />,
                            onPress: () => setBottomSheetVisible(true),
                            disabled: !selectedCandidateId || !!queryElectionById.data?.data.vote
                        }
                    ]}
                />
            )}

            <BottomSheetModal open={bottomSheetVisible} onClose={() => setBottomSheetVisible(false)}>
                <View className='gap-3 p-4'>
                    <Text className='text-center' variant={'large'}>
                        Xác nhận bỏ phiếu
                    </Text>
                    <Text className='text-center' variant={'muted'}>
                        Sau khi gửi phiếu bạn sẽ nhận lại biên lai để xác minh phiếu bầu
                    </Text>
                    {candidateSelected && (
                        <CandidateSelected name={candidateSelected.name} email={candidateSelected.email} />
                    )}
                    <Alert icon={ShieldCheckIcon} variant='success'>
                        <AlertTitle>Lá phiếu sẽ được mã hoá và ghi lên blockchain.</AlertTitle>
                    </Alert>

                    <Button
                        onPress={() =>
                            router.replace({
                                pathname: '/election/vote-flow',
                                params: {
                                    electionId: id,
                                    candidateId: selectedCandidateId
                                }
                            })
                        }
                    >
                        <Icon as={VoteIcon} />
                        <Text>Xác nhận bỏ phiếu</Text>
                    </Button>
                </View>
            </BottomSheetModal>
        </SafeAreaView>
    )
}

export default ElectionDetailScreen
