import { Pressable, Text, View } from 'react-native'
import { cn } from '@/lib/utils'
import { Icon } from '../ui/icon'
import { LucideIcon } from 'lucide-react-native'
import { Skeleton } from '../ui/skeleton'

type Props = {
    count: number | undefined
    label: string
    active?: boolean
    onPress?: () => void
    icon: LucideIcon
}

const StatusPill: React.FC<Props> = ({ count, label, active, onPress, icon }) => {
    return (
        <Pressable
            onPress={onPress}
            className={cn(
                'min-w-32 flex-1 rounded-2xl border-[0.5px] p-4',
                active ? 'bg-primary' : 'bg-primary-foreground'
            )}
        >
            <View className='flex flex-row items-center justify-between'>
                {count !== undefined ? (
                    <Text className={cn('text-2xl font-bold', active ? 'text-primary-foreground' : 'text-primary')}>
                        {count}
                    </Text>
                ) : (
                    <Skeleton className='size-8' />
                )}

                <Icon as={icon} className={cn(active ? 'text-primary-foreground' : 'text-primary')} />
            </View>
            <Text
                numberOfLines={1}
                className={cn('mt-1 text-sm font-medium', active ? 'text-primary-foreground' : 'text-primary')}
            >
                {label}
            </Text>
        </Pressable>
    )
}

export default StatusPill
