import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Checkbox } from '@/components/ui/checkbox'
import { Label } from '@/components/ui/label'
import { Text } from '@/components/ui/text'
import { cn, randomAvatar } from '@/lib/utils'
import { useMemo } from 'react'
import { Platform, View } from 'react-native'

interface Props {
    candidateId: string
    name: string
    email: string
    isSelected: boolean
    onSelect: (candidateId: string) => void
    disabled?: boolean
}

const CandidateCheckbox: React.FC<Props> = ({ candidateId, name, email, isSelected, onSelect, disabled }) => {
    const randomAvatarUrl = useMemo(() => {
        return randomAvatar()
    }, [])

    return (
        <Label
            htmlFor={`candidate-checkbox-${candidateId}`}
            onPress={Platform.select({
                native: disabled ? undefined : () => onSelect(candidateId)
            })}
        >
            <View
                className={cn(
                    'flex-row gap-4 rounded-lg border p-4',
                    isSelected ? 'border-primary bg-primary/10' : 'border-border bg-card',
                    disabled && 'opacity-50'
                )}
            >
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
                <Checkbox
                    checked={isSelected}
                    onCheckedChange={() => onSelect(candidateId)}
                    id={`candidate-checkbox-${candidateId}`}
                    className='my-auto'
                    disabled={disabled}
                />
            </View>
        </Label>
    )
}

export default CandidateCheckbox
