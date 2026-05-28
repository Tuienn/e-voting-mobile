import BackScreenButton from '@/components/common/back-screen-button'
import FixedCustomTabBar from '@/components/common/fixed-custom-tab-bar'
import CandidateCheckbox from '@/components/screens/election/candidate-checkbox'
import ElectionPill from '@/components/screens/election/election-pill'
import ElectionSkeleton from '@/components/screens/election/election-skeleton'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { Text } from '@/components/ui/text'
import { THEME } from '@/lib/theme'
import ElectionService from '@/services/bff/election.service'
import { useLocalSearchParams } from 'expo-router'
import { AlertCircleIcon, TerminalIcon, VoteIcon } from 'lucide-react-native'
import { useState } from 'react'
import { RefreshControl, View } from 'react-native'
import Animated from 'react-native-reanimated'
import { SafeAreaView } from 'react-native-safe-area-context'
import useSWR from 'swr'
import { useUniwind } from 'uniwind'

const ElectionDetailScreen: React.FC = () => {
    const { id } = useLocalSearchParams<{ id: string }>()
    const [selectedCandidateId, setSelectedCandidateId] = useState<string | null>(null)
    const { theme } = useUniwind()

    const queryElectionById = useSWR(`election/${id}`, () => ElectionService.getElectionById(id))

    return (
        <SafeAreaView style={{ flex: 1 }}>
            <Animated.ScrollView
                showsVerticalScrollIndicator={false}
                className='bg-muted'
                style={{ flex: 1 }}
                contentContainerStyle={{ padding: 16, paddingBottom: 112 }}
                refreshControl={<RefreshControl refreshing={false} onRefresh={queryElectionById.mutate} />}
            >
                <View className='gap-3'>
                    <BackScreenButton />

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

                            <Alert icon={TerminalIcon} className='border-blue-300'>
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
                                    disabled={queryElectionById.data!.data.status !== 'ACTIVE'}
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
                            onPress: () => {},
                            disabled: !selectedCandidateId
                        }
                    ]}
                />
            )}
        </SafeAreaView>
    )
}

export default ElectionDetailScreen
