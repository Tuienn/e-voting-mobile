import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Progress } from '@/components/ui/progress'
import { Text } from '@/components/ui/text'
import { randomAvatar } from '@/lib/utils'
import { useMemo } from 'react'
import { View } from 'react-native'

interface Props {
    name: string
    dbCount: number
    dbTotal: number
    chainCount: number
    chainTotal: number
}

const percent = (count: number, total: number) => (total > 0 ? Math.round((count / total) * 100) : 0)

const CandidateResult: React.FC<Props> = ({ name, dbCount, dbTotal, chainCount, chainTotal }) => {
    const avatarUrl = useMemo(() => randomAvatar(), [])

    return (
        <View className='bg-card border-border gap-4 rounded-lg border p-4'>
            <View className='flex-row items-center gap-4'>
                <Avatar alt={name} className='border-muted size-10 border-2'>
                    <AvatarImage source={{ uri: avatarUrl }} />
                    <AvatarFallback>
                        <Text>
                            {name
                                .split(' ')
                                .map((n) => n[0])
                                .join('')}
                        </Text>
                    </AvatarFallback>
                </Avatar>
                <Text className='flex-1 font-medium'>{name}</Text>
            </View>

            <View className='gap-1'>
                <View className='flex-row justify-between'>
                    <Text variant='muted' className='text-xs uppercase'>
                        Cơ sở dữ liệu
                    </Text>
                    <Text className='text-xs font-semibold'>
                        {dbCount} lượt chọn · {percent(dbCount, dbTotal)}%
                    </Text>
                </View>
                <Progress value={percent(dbCount, dbTotal)} />
            </View>

            <View className='gap-1'>
                <View className='flex-row justify-between'>
                    <Text variant='muted' className='text-xs uppercase'>
                        Blockchain
                    </Text>
                    <Text className='text-xs font-semibold'>
                        {chainCount} lượt chọn · {percent(chainCount, chainTotal)}%
                    </Text>
                </View>
                <Progress value={percent(chainCount, chainTotal)} />
            </View>
        </View>
    )
}

export default CandidateResult
