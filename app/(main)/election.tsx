import LargeNotification from '@/components/common/large-notification'
import ElectionPill from '@/components/pages/election/election-pill'
import ElectionSkeleton from '@/components/pages/election/election-skeleton'
import FlatListHeader from '@/components/pages/election/flatlist-header'
import { Button } from '@/components/ui/button'
import { Icon } from '@/components/ui/icon'
import { Text } from '@/components/ui/text'
import { useScrollDirection } from '@/hooks/use-scroll-direction'
import ElectionService from '@/services/bff/election.service'
import { ElectionStatus } from '@/types/election'
import { ChartColumnIcon, ScanQrCodeIcon, Trash2Icon, VenetianMaskIcon, VoteIcon } from 'lucide-react-native'
import { useState } from 'react'
import { RefreshControl } from 'react-native'
import Animated from 'react-native-reanimated'
import useSWR from 'swr'

const ElectionScreen: React.FC = () => {
    const [statusTab, setStatusTab] = useState<ElectionStatus>('PENDING')
    const { scrollHandler } = useScrollDirection()

    const queryElectionCount = useSWR('election/count', () => ElectionService.getElectionCount())
    const queryElectionsByStatus = useSWR(`elections/${statusTab}`, () =>
        ElectionService.getElectionsByStatus(statusTab)
    )

    const getActionButtons = (status: ElectionStatus) => {
        switch (status) {
            case 'ACTIVE':
                return [
                    <Button key='view' variant={'outline'} size={'sm'} className='flex-1'>
                        <Icon as={ScanQrCodeIcon} />
                        <Text>Xác minh</Text>
                    </Button>,
                    <Button key='vote' size={'sm'} className='flex-1'>
                        <Icon as={VoteIcon} />
                        <Text>Bỏ phiếu</Text>
                    </Button>
                ]
            case 'CLOSED':
                return [
                    <Button key='view' variant={'outline'} size={'sm'} className='flex-1'>
                        <Icon as={ScanQrCodeIcon} />
                        <Text>Xác minh</Text>
                    </Button>,
                    <Button key='reveal' size={'sm'} className='flex-1'>
                        <Icon as={VenetianMaskIcon} />
                        <Text>Tiết lộ</Text>
                    </Button>
                ]
            case 'COMPLETED':
                return [
                    <Button key='view' variant={'outline'} size={'sm'} className='flex-1'>
                        <Icon as={ScanQrCodeIcon} />
                        <Text>Xác minh</Text>
                    </Button>,
                    <Button key='results' size={'sm'} className='flex-1'>
                        <Icon as={ChartColumnIcon} />
                        <Text>Kết quả</Text>
                    </Button>
                ]
            default:
                return []
        }
    }

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
                    refreshing={queryElectionCount.isLoading || queryElectionsByStatus.isLoading}
                    onRefresh={() => {
                        queryElectionCount.mutate()
                        queryElectionsByStatus.mutate()
                    }}
                />
            }
            renderItem={({ item }) => (
                <ElectionPill
                    startDate={item.startDate}
                    endDate={item.endDate}
                    name={item.name}
                    status={item.status}
                    candidateCount={item.candidateIds.length}
                    actions={getActionButtons(item.status)}
                />
            )}
            keyExtractor={(item) => item.id}
            ListEmptyComponent={
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
            }
        />
    )
}

export default ElectionScreen
