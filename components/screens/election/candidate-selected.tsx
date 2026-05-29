import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Text } from '@/components/ui/text'
import { randomAvatar } from '@/lib/utils'
import { useMemo } from 'react'
import { View } from 'react-native'

interface Props {
    name: string
    email: string
}

const CandidateSelected: React.FC<Props> = ({ name, email }) => {
    const randomAvatarUrl = useMemo(() => {
        return randomAvatar()
    }, [])

    return (
        <View className={'border-primary bg-primary/10 flex-row gap-3 rounded-lg border px-4 py-4'}>
            <Avatar alt={name} className='border-muted size-10 border-2'>
                <AvatarImage
                    source={{
                        uri: randomAvatarUrl
                    }}
                />

                <AvatarFallback>
                    <Text>
                        {name
                            .split(' ')
                            .map((n) => n[0])
                            .join('')}
                    </Text>
                </AvatarFallback>
            </Avatar>
            <View className='flex-1 justify-center'>
                <Text className='font-medium'>{name}</Text>
                <Text className='text-muted-foreground text-sm'>{email}</Text>
            </View>
        </View>
    )
}

export default CandidateSelected
