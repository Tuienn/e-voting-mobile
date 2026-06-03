import BottomSheetModal from '@/components/common/bottom-sheet-modal'
import OtpInput from '@/components/common/otp-input'
import { Button } from '@/components/ui/button'
import { Text } from '@/components/ui/text'
import { useRestoreBackup } from '@/hooks/use-restore-backup'
import { DatabaseBackupIcon } from 'lucide-react-native'
import { useEffect, useState } from 'react'
import { View } from 'react-native'
import { Alert, AlertDescription, AlertTitle } from '../../ui/alert'
import { Icon } from '@/components/ui/icon'

const PIN_LENGTH = 6

interface Props {
    open: boolean
    onClose: () => void
}

const RestoreBackupSheet: React.FC<Props> = ({ open, onClose }) => {
    const [pin, setPin] = useState('')
    const { processing, restore } = useRestoreBackup(onClose)

    useEffect(() => {
        if (!open) setPin('')
    }, [open])

    return (
        <BottomSheetModal open={open} onClose={() => !processing && onClose()}>
            <View className='gap-4 p-4'>
                <Alert variant='warning' icon={DatabaseBackupIcon}>
                    <AlertTitle>Khôi phục dữ liệu phiếu bầu</AlertTitle>
                    <AlertDescription>
                        Nhập đúng mã PIN 6 số bạn đã đặt khi sao lưu để tải và giải mã dữ liệu phiếu bầu về thiết bị
                        này.
                    </AlertDescription>
                </Alert>

                <OtpInput value={pin} onChangeText={setPin} editable={!processing} autoFocus={false} />

                <Button size='lg' disabled={pin.length < PIN_LENGTH || processing} onPress={() => restore(pin)}>
                    <Icon as={DatabaseBackupIcon} />
                    <Text>{'Khôi phục'}</Text>
                </Button>
            </View>
        </BottomSheetModal>
    )
}

export default RestoreBackupSheet
