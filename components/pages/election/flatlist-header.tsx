import StatusPill from '@/components/common/status-pill'
import ThemeToggle from '@/components/common/theme-toggle'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Text } from '@/components/ui/text'
import { BffResponse } from '@/types/common'
import { Election, ElectionCount, ElectionStatus } from '@/types/election'
import { ActivityIcon, AlertCircleIcon, CalendarCheckIcon, ClipboardClockIcon, CopyXIcon } from 'lucide-react-native'
import { ScrollView, View } from 'react-native'
import { SWRResponse } from 'swr'

interface Props {
    statusTab: ElectionStatus
    onChangeStatusTab: (status: ElectionStatus) => void
    queryElectionCount: SWRResponse<BffResponse<ElectionCount>, any, any>
    queryElectionsByStatus: SWRResponse<BffResponse<Election[]>, any, any>
}

const FlatListHeader: React.FC<Props> = ({
    statusTab,
    onChangeStatusTab,
    queryElectionCount,
    queryElectionsByStatus
}) => {
    return (
        <View className='mb-3 gap-3'>
            <View className='flex flex-row items-center'>
                <View className='flex-1'>
                    <Text variant={'lead'} className='font-semibold uppercase'>
                        Bầu cử
                    </Text>
                </View>

                <View className='flex-row items-center gap-2'>
                    <ThemeToggle />
                    <Avatar alt='@shadcn'>
                        <AvatarImage source={{ uri: 'https://github.com/shadcn.png' }} />
                        <AvatarFallback>
                            <Text>CN</Text>
                        </AvatarFallback>
                    </Avatar>
                </View>
            </View>

            <Text variant={'h2'} className='border-b-0 pb-0 text-start'>
                {'Các cuộc bầu cử\ntuần này.'}
            </Text>

            {queryElectionCount.error ? (
                <Alert variant='destructive' icon={AlertCircleIcon}>
                    <AlertTitle>Lỗi</AlertTitle>
                    <AlertDescription>
                        {queryElectionCount.error.message ?? 'Đã xảy ra lỗi khi tải số lượng cuộc bầu cử'}
                    </AlertDescription>
                </Alert>
            ) : (
                <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerClassName='gap-2'>
                    <StatusPill
                        count={queryElectionCount.data?.data.pending}
                        label='Đang chờ'
                        active={statusTab === 'PENDING'}
                        icon={ClipboardClockIcon}
                        onPress={() => onChangeStatusTab('PENDING')}
                    />
                    <StatusPill
                        count={queryElectionCount.data?.data.active}
                        label='Hoạt động'
                        active={statusTab === 'ACTIVE'}
                        icon={ActivityIcon}
                        onPress={() => onChangeStatusTab('ACTIVE')}
                    />
                    <StatusPill
                        count={queryElectionCount.data?.data.closed}
                        label='Đã đóng'
                        active={statusTab === 'CLOSED'}
                        icon={CopyXIcon}
                        onPress={() => onChangeStatusTab('CLOSED')}
                    />
                    <StatusPill
                        count={queryElectionCount.data?.data.completed}
                        label='Hoàn thành'
                        active={statusTab === 'COMPLETED'}
                        icon={CalendarCheckIcon}
                        onPress={() => onChangeStatusTab('COMPLETED')}
                    />
                </ScrollView>
            )}

            {queryElectionsByStatus.error && (
                <Alert variant='destructive' icon={AlertCircleIcon}>
                    <AlertTitle>Lỗi</AlertTitle>
                    <AlertDescription>
                        {queryElectionsByStatus.error.message ?? 'Đã xảy ra lỗi khi tải danh sách cuộc bầu cử'}
                    </AlertDescription>
                </Alert>
            )}
        </View>
    )
}

export default FlatListHeader
