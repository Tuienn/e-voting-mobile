import BottomSheetModal from '@/components/common/bottom-sheet-modal'
import ReceiptList from '@/components/screens/receipt/receipt-list'
import { useCallback, useRef, useState } from 'react'
import VerifyCameraView, { VerifyCameraViewRef } from '@/components/common/verify-camera-view'
import { useScrollDirection } from '@/hooks/use-scroll-direction'
import { useFocusEffect } from 'expo-router'
import { withTiming } from 'react-native-reanimated'
import { View } from 'react-native'
import { Text } from '@/components/ui/text'

const VerifyScreen: React.FC = () => {
    const [listVisible, setListVisible] = useState(false)
    const cameraRef = useRef<VerifyCameraViewRef>(null)

    const { navVisible } = useScrollDirection()

    //NOTE - Ẩn floating nav chính khi vào màn quét để nhường chỗ cho tab bar thao tác
    useFocusEffect(
        useCallback(() => {
            navVisible.value = withTiming(0)
            cameraRef.current?.unlock()
            return () => {
                navVisible.value = withTiming(1)
            }
        }, [navVisible])
    )

    return (
        <>
            {/* Header */}
            <View pointerEvents='none' className='absolute right-0 left-0 px-4 pt-4'>
                <Text className='text-2xl font-bold text-white'>Quét mã</Text>

                <Text className='text-white/80'>Xác minh phiếu bầu bằng mã QR trên biên nhận.</Text>
            </View>
            <VerifyCameraView onChangeListVisible={setListVisible} ref={cameraRef} />

            <BottomSheetModal open={listVisible} onClose={() => setListVisible(false)}>
                <ReceiptList onClose={() => setListVisible(false)} enabled={listVisible} />
            </BottomSheetModal>
        </>
    )
}

export default VerifyScreen
