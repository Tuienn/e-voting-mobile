import { ChevronLeftIcon } from 'lucide-react-native'
import { Button } from '../ui/button'
import { Icon } from '../ui/icon'
import { router } from 'expo-router'

const BackScreenButton = () => {
    return (
        <Button variant={'outline'} size={'icon'} className='rounded-full' onPress={router.back}>
            <Icon as={ChevronLeftIcon} />
        </Button>
    )
}

export default BackScreenButton
