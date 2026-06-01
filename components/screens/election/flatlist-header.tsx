import StatusPill from '@/components/common/status-pill'
import ThemeToggle from '@/components/common/theme-toggle'
import LogoutBackupSheet from '@/components/screens/election/logout-backup-sheet'
import RestoreBackupSheet from '@/components/screens/election/restore-backup-sheet'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuShortcut,
    DropdownMenuTrigger
} from '@/components/ui/dropdown-menu'
import { Icon } from '@/components/ui/icon'
import { Text } from '@/components/ui/text'
import { useAuth } from '@/hooks/use-auth'
import { useRestorePrompt } from '@/hooks/use-restore-prompt'
import { ApiResponse } from '@/types/common'
import { Election, ElectionCount, ElectionStatus } from '@/types/election'
import {
    ActivityIcon,
    AlertCircleIcon,
    CalendarCheckIcon,
    ClipboardClockIcon,
    CloudDownloadIcon,
    CopyXIcon,
    LogOutIcon
} from 'lucide-react-native'
import { useEffect, useState } from 'react'
import { ScrollView, View } from 'react-native'
import { SWRResponse } from 'swr'

interface Props {
    statusTab: ElectionStatus
    onChangeStatusTab: (status: ElectionStatus) => void
    queryElectionCount: SWRResponse<ApiResponse<ElectionCount>, any, any>
    queryElectionsByStatus: SWRResponse<ApiResponse<Election[]>, any, any>
}

const FlatListHeader: React.FC<Props> = ({
    statusTab,
    onChangeStatusTab,
    queryElectionCount,
    queryElectionsByStatus
}) => {
    const { user } = useAuth()
    const [logoutOpen, setLogoutOpen] = useState(false)
    const [restoreOpen, setRestoreOpen] = useState(false)
    const { shouldPrompt, clearPrompt } = useRestorePrompt()

    //NOTE - Tự mở sheet khôi phục khi máy trống nhưng server có backup
    useEffect(() => {
        if (shouldPrompt) setRestoreOpen(true)
    }, [shouldPrompt])

    //NOTE - Mở sheet sau khi dropdown đóng để tránh xung đột overlay/portal
    const openLater = (open: () => void) => setTimeout(open, 150)

    return (
        <View className='mb-3 gap-3'>
            <View className='flex flex-row items-center'>
                <View className='flex-1'>
                    <Text className='text-2xl font-semibold'>Bầu cử</Text>
                </View>

                <View className='flex-row items-center gap-2'>
                    <ThemeToggle />

                    <DropdownMenu>
                        <DropdownMenuTrigger>
                            <Avatar alt='Tài khoản'>
                                <AvatarImage source={{ uri: 'https://github.com/shadcn.png' }} />
                                <AvatarFallback>
                                    <Text>{user?.email?.[0]?.toUpperCase() ?? 'U'}</Text>
                                </AvatarFallback>
                            </Avatar>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align='end'>
                            <DropdownMenuLabel numberOfLines={1}>{user?.email ?? 'Tài khoản'}</DropdownMenuLabel>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem onPress={() => openLater(() => setRestoreOpen(true))}>
                                <DropdownMenuShortcut className='ml-0'>
                                    <Icon as={CloudDownloadIcon} className='size-4' />
                                </DropdownMenuShortcut>
                                <Text>Khôi phục dữ liệu</Text>
                            </DropdownMenuItem>
                            <DropdownMenuItem
                                variant='destructive'
                                onPress={() => openLater(() => setLogoutOpen(true))}
                            >
                                <DropdownMenuShortcut className='ml-0'>
                                    <Icon as={LogOutIcon} className='text-destructive size-4' />
                                </DropdownMenuShortcut>
                                <Text>Đăng xuất</Text>
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </View>
            </View>

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

            <LogoutBackupSheet open={logoutOpen} onClose={() => setLogoutOpen(false)} />
            <RestoreBackupSheet
                open={restoreOpen}
                onClose={() => {
                    setRestoreOpen(false)
                    clearPrompt()
                }}
            />
        </View>
    )
}

export default FlatListHeader
