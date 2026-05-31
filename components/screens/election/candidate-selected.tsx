import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Text } from '@/components/ui/text'
import { randomAvatar } from '@/lib/utils'
import { useMemo } from 'react'
import { View } from 'react-native'

interface Candidate {
    id: string
    name: string
    email: string
}

interface Props {
    candidates: Candidate[]
}

const CandidateSelectedItem: React.FC<Candidate> = ({ name, email }) => {
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

const CandidateSelected: React.FC<Props> = ({ candidates }) => {
    if (candidates.length === 0) return null

    return (
        <View className='gap-2'>
            {candidates.map((candidate) => (
                <CandidateSelectedItem
                    key={candidate.id}
                    id={candidate.id}
                    name={candidate.name}
                    email={candidate.email}
                />
            ))}
        </View>
    )
}

export default CandidateSelected
