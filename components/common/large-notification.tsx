import { Text } from '@/components/ui/text'
import { View } from 'react-native'
import { Icon } from '../ui/icon'
import { LucideIcon } from 'lucide-react-native'
import { cn } from '@/lib/utils'

interface Props {
    title: string
    description?: string
    icon: LucideIcon
    variant?: 'default' | 'error' | 'success' | 'warning'
    hasBackground?: boolean
}

const VARIANT_COLORS: Record<NonNullable<Props['variant']>, string> = {
    default: 'bg-muted',
    error: 'bg-red-500 dark:bg-red-600',
    success: 'bg-green-500 dark:bg-green-600',
    warning: 'bg-yellow-500 dark:bg-yellow-600'
}

const LargeNotification: React.FC<Props> = ({
    title,
    description,
    icon,
    variant = 'default',
    hasBackground = true
}) => {
    return (
        <View className={cn('items-center gap-2 rounded-lg p-3', hasBackground && 'bg-card shadow-sm shadow-black/5')}>
            <View className={cn('rounded-full p-4', VARIANT_COLORS[variant])}>
                <Icon as={icon} size={25} className='text-white' />
            </View>

            <Text variant='h4' className='text-center'>
                {title}
            </Text>

            {description && <Text className='text-muted-foreground text-center'>{description}</Text>}
        </View>
    )
}

export default LargeNotification
