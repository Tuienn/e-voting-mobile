import { View } from 'react-native'
import { ChevronLeftIcon } from 'lucide-react-native'
import { Button } from '../ui/button'
import { Icon } from '../ui/icon'
import { router } from 'expo-router'
import { Text } from '../ui/text'

interface Props {
    title: string
    hasBackButton?: boolean
    disabledBackButton?: boolean
}

const ScreenHeader: React.FC<Props> = ({ title, hasBackButton = true, disabledBackButton }) => {
    return (
        <View className='relative h-10'>
            {hasBackButton && (
                <Button
                    disabled={disabledBackButton}
                    variant={'outline'}
                    size={'icon'}
                    className='absolute left-0 z-1 rounded-full'
                    onPress={router.back}
                >
                    <Icon as={ChevronLeftIcon} />
                </Button>
            )}
            <Text className='my-auto text-center' variant={'large'}>
                {title}
            </Text>
        </View>
    )
}

export default ScreenHeader
