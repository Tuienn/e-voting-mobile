import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { Text } from '@/components/ui/text'
import useVerifyReceipt from '@/hooks/use-verify-receipt'
import { encodeReceipt, Receipt } from '@/lib/receipt-qr'
import { AlertCircleIcon, CheckCircle2Icon, LoaderIcon, XCircleIcon } from 'lucide-react-native'
import { View } from 'react-native'
import QRCode from 'react-native-qrcode-svg'

interface Props {
    receipt: Receipt
}

const ReceiptResult: React.FC<Props> = ({ receipt }) => {
    const { valid, isLoading, error } = useVerifyReceipt(receipt)

    return (
        <View className='gap-3'>
            <View className='bg-card border-border items-center gap-2 rounded-lg border p-4'>
                <View className='rounded-lg bg-white p-3'>
                    <QRCode value={encodeReceipt(receipt)} size={220} />
                </View>
                <Text variant='muted' className='text-center text-sm'>
                    Mã QR biên lai phiếu bầu
                </Text>
            </View>

            {isLoading ? (
                <Alert icon={LoaderIcon} variant='info'>
                    <AlertTitle>Đang xác minh…</AlertTitle>
                    <AlertDescription>Đang đối chiếu biên lai với dữ liệu công khai.</AlertDescription>
                </Alert>
            ) : error ? (
                <Alert icon={AlertCircleIcon} variant='destructive'>
                    <AlertTitle>Không thể xác minh phiếu</AlertTitle>
                    <AlertDescription>{error.message}</AlertDescription>
                </Alert>
            ) : valid === true ? (
                <Alert icon={CheckCircle2Icon} variant='success'>
                    <AlertTitle>Khớp</AlertTitle>
                    <AlertDescription>Biên lai trùng khớp với dữ liệu công khai trên hệ thống.</AlertDescription>
                </Alert>
            ) : valid === false ? (
                <Alert icon={XCircleIcon} variant='destructive'>
                    <AlertTitle>Không khớp</AlertTitle>
                    <AlertDescription>Biên lai không khớp với dữ liệu công khai trên hệ thống.</AlertDescription>
                </Alert>
            ) : null}
        </View>
    )
}

export default ReceiptResult
