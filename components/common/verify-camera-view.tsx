import FixedCustomTabBar, { FixedCustomTabBarItem } from '@/components/common/fixed-custom-tab-bar'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { Button } from '@/components/ui/button'
import { Icon } from '@/components/ui/icon'
import { Text } from '@/components/ui/text'
import { parseReceipt } from '@/lib/receipt-qr'
import { THEME } from '@/lib/theme'
import { CameraView, scanFromURLAsync, useCameraPermissions } from 'expo-camera'
import * as ImagePicker from 'expo-image-picker'
import { router } from 'expo-router'
import { CameraIcon, ListIcon, UploadIcon, ZapIcon, ZapOffIcon } from 'lucide-react-native'
import { forwardRef, useCallback, useImperativeHandle, useRef, useState } from 'react'
import { Linking, Platform, StyleSheet, View } from 'react-native'
import Toast from 'react-native-toast-message'
import { useUniwind } from 'uniwind'

interface Props {
    onChangeListVisible?: (visible: boolean) => void
}

export interface VerifyCameraViewRef {
    unlock: () => void
}

const VerifyCameraView = forwardRef<VerifyCameraViewRef, Props>(({ onChangeListVisible }, ref) => {
    const { theme } = useUniwind()

    // Truy cập từ màn đăng nhập/landing khi chưa đăng nhập → ẩn "Danh sách" (biên lai cá nhân)
    const [permission, requestPermission] = useCameraPermissions()
    const [torch, setTorch] = useState(false)
    const lockRef = useRef(false)

    useImperativeHandle(ref, () => ({
        unlock: () => {
            lockRef.current = false
        }
    }))

    const color = THEME[theme].primary
    const isWeb = Platform.OS === 'web'
    const cameraReady = !isWeb && !!permission?.granted

    const handleResult = useCallback((data: string) => {
        if (lockRef.current) return
        lockRef.current = true

        try {
            const receipt = parseReceipt(data)
            router.push({
                pathname: '/verify/receipt',
                params: {
                    voteId: receipt.voteId,
                    electionId: receipt.electionId,
                    blindedCommitment: receipt.blindedCommitment,
                    blockchainRef: receipt.blockchainRef
                }
            })
        } catch (err: any) {
            Toast.show({ type: 'error', text1: 'Mã QR không hợp lệ', text2: err?.message })
            setTimeout(() => {
                lockRef.current = false
            }, 1500)
        }
    }, [])

    const handleRequestPermission = useCallback(() => {
        if (permission && !permission.canAskAgain) {
            Linking.openSettings()
        } else {
            requestPermission()
        }
    }, [permission, requestPermission])

    const handleUpload = useCallback(async () => {
        const perm = await ImagePicker.requestMediaLibraryPermissionsAsync()
        if (!perm.granted) {
            Toast.show({ type: 'error', text1: 'Cần quyền truy cập thư viện ảnh' })
            return
        }

        const result = await ImagePicker.launchImageLibraryAsync({ mediaTypes: ['images'], quality: 1 })
        if (result.canceled || !result.assets?.length) return

        try {
            const scanned = await scanFromURLAsync(result.assets[0].uri, ['qr'])
            if (scanned.length) {
                lockRef.current = false
                handleResult(scanned[0].data)
            } else {
                Toast.show({ type: 'error', text1: 'Không tìm thấy mã QR trong ảnh' })
            }
        } catch (err: any) {
            Toast.show({ type: 'error', text1: 'Không thể đọc ảnh', text2: err?.message })
        }
    }, [handleResult])

    const tabBarItems: FixedCustomTabBarItem[] = [
        ...(cameraReady
            ? [
                  {
                      key: 'torch',
                      label: torch ? 'Tắt đèn' : 'Bật đèn',
                      icon: torch ? <Icon as={ZapOffIcon} color={color} /> : <Icon as={ZapIcon} color={color} />,
                      onPress: () => setTorch((prev) => !prev)
                  }
              ]
            : []),
        {
            key: 'upload',
            label: 'Tải ảnh',
            icon: <Icon as={UploadIcon} color={color} />,
            onPress: handleUpload
        },
        ...(onChangeListVisible
            ? [
                  {
                      key: 'list',
                      label: 'Danh sách',
                      icon: <Icon as={ListIcon} color={color} />,
                      onPress: () => onChangeListVisible(true)
                  }
              ]
            : [])
    ]

    return (
        <>
            <View className='flex-1'>
                {cameraReady ? (
                    <>
                        <CameraView
                            style={StyleSheet.absoluteFill}
                            facing='back'
                            enableTorch={torch}
                            barcodeScannerSettings={{ barcodeTypes: ['qr'] }}
                            onBarcodeScanned={({ data }) => handleResult(data)}
                        />
                        <View
                            style={StyleSheet.absoluteFill}
                            pointerEvents='box-none'
                            className='items-center justify-center'
                        >
                            <View className='border-primary-foreground/90 aspect-square w-64 rounded-3xl border-4' />
                            <Text className='mt-4 font-medium text-white'>Đưa mã QR vào khung để quét</Text>
                        </View>
                    </>
                ) : (
                    <View className='bg-background flex-1 items-center justify-center gap-4 p-6'>
                        {isWeb ? (
                            <>
                                <Text variant='large'>Quét mã QR</Text>
                                <Text variant='muted' className='text-center'>
                                    Tính năng camera khả dụng trên thiết bị di động. Bạn vẫn có thể tải ảnh hoặc chọn từ
                                    danh sách biên lai.
                                </Text>
                            </>
                        ) : (
                            <>
                                <Alert icon={CameraIcon} variant='warning'>
                                    <AlertTitle>Cần quyền camera</AlertTitle>
                                    <AlertDescription>Cấp quyền camera để quét mã QR biên lai.</AlertDescription>
                                </Alert>
                                <Button onPress={handleRequestPermission}>
                                    <Text>Cấp quyền camera</Text>
                                </Button>
                            </>
                        )}
                    </View>
                )}
            </View>
            <FixedCustomTabBar items={tabBarItems} />
        </>
    )
})

VerifyCameraView.displayName = 'VerifyCameraView'

export default VerifyCameraView
