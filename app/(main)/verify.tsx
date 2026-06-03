import BottomSheetModal from '@/components/common/bottom-sheet-modal'
import ReceiptList from '@/components/screens/verify/receipt-list'
import { useCallback, useRef, useState } from 'react'
import VerifyCameraView, { VerifyCameraViewRef } from '@/components/common/verify-camera-view'
import { useScrollDirection } from '@/hooks/use-scroll-direction'
import { router, useFocusEffect } from 'expo-router'
import { withTiming } from 'react-native-reanimated'
import { Button } from '@/components/ui/button'
import { Icon } from '@/components/ui/icon'
import { ChevronLeftIcon } from 'lucide-react-native'

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
            <Button
                variant={'outline'}
                size={'icon'}
                className='absolute top-4 left-4 z-10 rounded-full'
                onPress={() => router.back()}
            >
                <Icon as={ChevronLeftIcon} />
            </Button>
            <VerifyCameraView onChangeListVisible={setListVisible} ref={cameraRef} />
            <BottomSheetModal open={listVisible} onClose={() => setListVisible(false)}>
                <ReceiptList onClose={() => setListVisible(false)} enabled={listVisible} />
            </BottomSheetModal>
        </>
    )
}

export default VerifyScreen
