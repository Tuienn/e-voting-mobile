import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { Button } from '@/components/ui/button'
import { Icon } from '@/components/ui/icon'
import { Text } from '@/components/ui/text'
import { AlertTriangleIcon, EyeIcon } from 'lucide-react-native'
import { View } from 'react-native'

interface Props {
    onConfirm: () => void
    loading?: boolean
}

const RevealConfirmSheet: React.FC<Props> = ({ onConfirm, loading }) => {
    return (
        <View className='gap-3 p-4'>
            <Text className='text-center' variant={'large'}>
                Tiết lộ lá phiếu
            </Text>
            <Text className='text-center' variant={'muted'}>
                Khoá bí mật trên thiết bị này sẽ được dùng để xác nhận lựa chọn — ẩn danh, không liên kết với danh tính
            </Text>

            <Alert icon={AlertTriangleIcon} variant='warning'>
                <AlertTitle>Không thể hoàn tác</AlertTitle>
                <AlertDescription>Tiến hành tiết lộ sẽ tính phiếu của bạn vào kết quả công khai.</AlertDescription>
            </Alert>

            <Button onPress={onConfirm} disabled={loading}>
                <Icon as={EyeIcon} />
                <Text>Tiết lộ lá phiếu</Text>
            </Button>
        </View>
    )
}

export default RevealConfirmSheet
