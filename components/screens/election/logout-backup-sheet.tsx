import BottomSheetModal from '@/components/common/bottom-sheet-modal'
import OtpInput from '@/components/common/otp-input'
import { Button } from '@/components/ui/button'
import { Text } from '@/components/ui/text'
import { useLogoutBackup } from '@/hooks/use-logout-backup'
import { KeyRoundIcon, LogOutIcon } from 'lucide-react-native'
import { useEffect, useState } from 'react'
import { View } from 'react-native'
import { Alert, AlertDescription, AlertTitle } from '../../ui/alert'
import { Icon } from '@/components/ui/icon'

const PIN_LENGTH = 6

interface Props {
    open: boolean
    onClose: () => void
}

const LogoutBackupSheet: React.FC<Props> = ({ open, onClose }) => {
    const [pin, setPin] = useState('')
    const { processing, runBackupAndLogout, forceLogout } = useLogoutBackup()

    useEffect(() => {
        if (!open) setPin('')
    }, [open])

    return (
        <BottomSheetModal open={open} onClose={() => !processing && onClose()}>
            <View className='gap-4 px-4'>
                <Alert icon={KeyRoundIcon} variant='warning'>
                    <AlertTitle>Sao lưu trước khi đăng xuất</AlertTitle>
                    <AlertDescription>
                        Đặt mã PIN 6 số để mã hóa dữ liệu phiếu bầu của bạn. Cần đúng mã này để khôi phục trên thiết bị
                        khác — hãy ghi nhớ kỹ.
                    </AlertDescription>
                </Alert>

                <OtpInput
                    value={pin}
                    onChangeText={setPin}
                    length={PIN_LENGTH}
                    editable={!processing}
                    autoFocus={false}
                />

                <Button
                    size='lg'
                    disabled={pin.length < PIN_LENGTH || processing}
                    onPress={() => runBackupAndLogout(pin)}
                >
                    <Icon as={KeyRoundIcon} />
                    <Text>{'Mã hóa & Đăng xuất'}</Text>
                </Button>

                <View className='flex-row items-center gap-4'>
                    <View className='bg-border h-px flex-1' />
                    <Text className='text-muted-foreground text-sm'>Thao tác khác</Text>
                    <View className='bg-border h-px flex-1' />
                </View>

                <Button variant='outline' size='lg' onPress={forceLogout} disabled={processing}>
                    <Icon as={LogOutIcon} />
                    <Text>Đăng xuất không sao lưu</Text>
                </Button>
            </View>
        </BottomSheetModal>
    )
}

export default LogoutBackupSheet
