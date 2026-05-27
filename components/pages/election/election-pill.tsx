import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { ElectionStatus } from '@/types/election'
import { Text } from '@/components/ui/text'
import { Badge } from '@/components/ui/badge'
import { View } from 'react-native'
import { formatDateTime } from '@/lib/utils'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import React from 'react'

interface Props {
    startDate?: string
    endDate?: string
    name: string
    status: ElectionStatus
    candidateCount: number
    actions?: React.ReactNode[]
}

const STATUS_MAP: Record<
    ElectionStatus,
    {
        className: string
        label: string
    }
> = {
    PENDING: { className: 'bg-yellow-500 dark:bg-yellow-600', label: 'Đang chờ' },
    ACTIVE: { className: 'bg-green-500 dark:bg-green-600', label: 'Hoạt động' },
    CLOSED: { className: 'bg-red-500 dark:bg-red-600', label: 'Đã đóng' },
    COMPLETED: { className: 'bg-blue-500 dark:bg-blue-600', label: 'Hoàn thành' }
}

const ElectionPill: React.FC<Props> = ({ startDate, endDate, name, status, candidateCount, actions }) => {
    return (
        <Card className='mb-3 gap-2 py-4 shadow-md'>
            <CardHeader className='px-4'>
                <View className='flex-row items-center justify-between gap-2'>
                    <Badge variant={'default'} className={`${STATUS_MAP[status].className}`}>
                        <Text>{STATUS_MAP[status].label}</Text>
                    </Badge>
                    <View className='flex-row'>
                        <Avatar
                            alt='@mrzachnugent'
                            className='border-background web:border-0 web:ring-2 web:ring-background -mr-2 border-2'
                        >
                            <AvatarImage source={{ uri: 'https://github.com/mrzachnugent.png' }} />
                            <AvatarFallback>
                                <Text>ZN</Text>
                            </AvatarFallback>
                        </Avatar>

                        <Avatar
                            alt='@evilrabbit'
                            className='border-background web:border-0 web:ring-2 web:ring-background -mr-2 border-2'
                        >
                            <AvatarImage source={{ uri: 'https://github.com/evilrabbit.png' }} />
                            <AvatarFallback>
                                <Text>ER</Text>
                            </AvatarFallback>
                        </Avatar>
                        <Avatar
                            alt='@evilrabbit'
                            className='border-background web:border-0 web:ring-2 web:ring-background -mr-2 border-2'
                        >
                            <AvatarFallback>
                                <Text>+{candidateCount - 2}</Text>
                            </AvatarFallback>
                        </Avatar>
                    </View>
                </View>
                <CardTitle numberOfLines={1} ellipsizeMode='tail' className='flex-1' variant={'h4'}>
                    {name}
                </CardTitle>
            </CardHeader>

            <CardContent className='px-4'>
                <View className='flex-row gap-2'>
                    <View className='flex-1'>
                        <Text className='text-muted-foreground text-xs'>BẮT ĐẦU</Text>
                        {startDate ? (
                            <Text className='text-sm font-semibold'>{formatDateTime(startDate)}</Text>
                        ) : (
                            <Text className='text-muted-foreground text-sm italic'>Chưa xác định</Text>
                        )}
                    </View>

                    <View className='flex-1'>
                        <Text className='text-muted-foreground text-xs'>KẾT THÚC</Text>
                        {endDate ? (
                            <Text className='text-sm font-semibold'>{formatDateTime(endDate)}</Text>
                        ) : (
                            <Text className='text-muted-foreground text-sm italic'>Chưa xác định</Text>
                        )}
                    </View>
                </View>
            </CardContent>
            {actions && <CardFooter className='px-4'>{actions.map((action) => action)}</CardFooter>}
        </Card>
    )
}

export default ElectionPill
