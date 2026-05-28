import { Skeleton } from '@/components/ui/skeleton'
import { View } from 'react-native'

const ElectionSkeleton = () => {
    return (
        <View className='bg-card gap-2 rounded-lg p-3'>
            <Skeleton className='h-5 w-1/5' />
            <Skeleton className='h-5 w-full' />
            <View className='flex flex-row gap-2'>
                <Skeleton className='h-7 w-1/3' />
                <Skeleton className='h-7 flex-1' />
            </View>
        </View>
    )
}

export default ElectionSkeleton
