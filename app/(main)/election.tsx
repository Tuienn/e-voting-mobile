import LargeNotification from '@/components/common/large-notification'
import ElectionPill from '@/components/screens/election/election-pill'
import ElectionSkeleton from '@/components/screens/election/election-skeleton'
import FlatListHeader from '@/components/screens/election/flatlist-header'
import { useScrollDirection } from '@/hooks/use-scroll-direction'
import ElectionService from '@/services/bff/election.service'
import { ElectionStatus } from '@/types/election'
import { router } from 'expo-router'
import { Trash2Icon } from 'lucide-react-native'
import { useState } from 'react'
import { Pressable, RefreshControl } from 'react-native'
import Animated from 'react-native-reanimated'
import useSWR from 'swr'

const ElectionScreen: React.FC = () => {
    const [statusTab, setStatusTab] = useState<ElectionStatus>('PENDING')
    const { scrollHandler } = useScrollDirection()

    const queryElectionCount = useSWR('election/count', () => ElectionService.getElectionCount())
    const queryElectionsByStatus = useSWR(`elections/${statusTab}`, () =>
        ElectionService.getElectionsByStatus(statusTab)
    )

    return (
        <Animated.FlatList
            style={{ flex: 1 }}
            contentContainerStyle={{ padding: 16 }}
            onScroll={scrollHandler}
            scrollEventThrottle={16}
            showsVerticalScrollIndicator={false}
            className='bg-muted'
            ListHeaderComponent={
                <FlatListHeader
                    statusTab={statusTab}
                    onChangeStatusTab={setStatusTab}
                    queryElectionCount={queryElectionCount}
                    queryElectionsByStatus={queryElectionsByStatus}
                />
            }
            data={
                queryElectionsByStatus.isLoading || queryElectionsByStatus.error
                    ? []
                    : (queryElectionsByStatus.data?.data ?? [])
            }
            refreshControl={
                <RefreshControl
                    refreshing={false}
                    onRefresh={() => {
                        queryElectionCount.mutate()
                        queryElectionsByStatus.mutate()
                    }}
                />
            }
            renderItem={({ item }) => (
                <Pressable onPress={() => router.push(`/election/${item.id}`)} className='mb-3'>
                    <ElectionPill
                        startDate={item.startDate}
                        endDate={item.endDate}
                        name={item.name}
                        status={item.status}
                        candidateCount={item.candidateIds.length}
                    />
                </Pressable>
            )}
            keyExtractor={(item) => item.id}
            ListEmptyComponent={
                !queryElectionsByStatus.error ? (
                    queryElectionsByStatus.isLoading ? (
                        <ElectionSkeleton />
                    ) : (
                        <LargeNotification
                            title='Chưa có cuộc bầu cử'
                            description='Không tìm thấy cuộc bầu cử nào ở trạng thái này.'
                            icon={Trash2Icon}
                            variant='error'
                        />
                    )
                ) : null
            }
        />
    )
}

export default ElectionScreen
