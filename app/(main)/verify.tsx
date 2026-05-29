import BottomSheetModal from '@/components/common/bottom-sheet-modal'
import FixedCustomTabBar, { FixedCustomTabBarItem } from '@/components/common/fixed-custom-tab-bar'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { Button } from '@/components/ui/button'
import { Text } from '@/components/ui/text'
import { useScrollDirection } from '@/hooks/use-scroll-direction'
import { parseReceipt } from '@/lib/receipt-qr'
import { THEME } from '@/lib/theme'
import ElectionService from '@/services/bff/election.service'
import { CameraView, scanFromURLAsync, useCameraPermissions } from 'expo-camera'
import * as ImagePicker from 'expo-image-picker'
import { router, useFocusEffect } from 'expo-router'
import { CameraIcon, ListIcon, UploadIcon, ZapIcon, ZapOffIcon } from 'lucide-react-native'
import { useCallback, useRef, useState } from 'react'
import { Linking, Platform, Pressable, ScrollView, StyleSheet, View } from 'react-native'
import { withTiming } from 'react-native-reanimated'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import Toast from 'react-native-toast-message'
import useSWR from 'swr'
import { useUniwind } from 'uniwind'

const VerifyScreen: React.FC = () => {
    const { theme } = useUniwind()
    const insets = useSafeAreaInsets()
    const { navVisible } = useScrollDirection()
    const [permission, requestPermission] = useCameraPermissions()
    const [torch, setTorch] = useState(false)
    const [listVisible, setListVisible] = useState(false)
    const lockRef = useRef(false)

    const color = THEME[theme].primary
    const isWeb = Platform.OS === 'web'
    const cameraReady = !isWeb && !!permission?.granted

    //NOTE - Ẩn floating nav chính khi vào màn quét để nhường chỗ cho tab bar thao tác
    useFocusEffect(
        useCallback(() => {
            navVisible.value = withTiming(0)
            lockRef.current = false
            return () => {
                navVisible.value = withTiming(1)
            }
        }, [navVisible])
    )

    const handleResult = useCallback((data: string) => {
        if (lockRef.current) return
        lockRef.current = true

        try {
            const receipt = parseReceipt(data)
            router.push({
                pathname: '/election/verify-result',
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
                      icon: torch ? <ZapOffIcon color={color} /> : <ZapIcon color={color} />,
                      onPress: () => setTorch((prev) => !prev)
                  } as FixedCustomTabBarItem
              ]
            : []),
        {
            key: 'upload',
            label: 'Tải ảnh',
            icon: <UploadIcon color={color} />,
            onPress: handleUpload
        },
        {
            key: 'list',
            label: 'Danh sách',
            icon: <ListIcon color={color} />,
            onPress: () => setListVisible(true)
        }
    ]

    return (
        <View style={styles.fill}>
            {cameraReady ? (
                <>
                    <CameraView
                        style={StyleSheet.absoluteFill}
                        facing='back'
                        enableTorch={torch}
                        barcodeScannerSettings={{ barcodeTypes: ['qr'] }}
                        onBarcodeScanned={({ data }) => handleResult(data)}
                    />
                    <View style={StyleSheet.absoluteFill} pointerEvents='box-none' className='items-center justify-center'>
                        <View className='border-primary-foreground/90 aspect-square w-64 rounded-3xl border-4' />
                        <Text className='mt-4 font-medium text-white'>Đưa mã QR vào khung để quét</Text>
                    </View>
                </>
            ) : (
                <View style={styles.fill} className='bg-background items-center justify-center gap-3 p-6'>
                    {isWeb ? (
                        <>
                            <Text variant='large'>Quét mã QR</Text>
                            <Text variant='muted' className='text-center'>
                                Tính năng camera khả dụng trên thiết bị di động. Bạn vẫn có thể tải ảnh hoặc chọn từ danh
                                sách biên lai.
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

            {/* Header */}
            <View pointerEvents='none' style={{ paddingTop: insets.top + 12 }} className='absolute left-0 right-0 px-5'>
                <Text className='text-3xl font-bold text-white'>Quét mã</Text>
                <Text className='text-white/80'>Xác minh phiếu bầu bằng mã QR trên biên nhận.</Text>
            </View>

            <FixedCustomTabBar items={tabBarItems} />

            <BottomSheetModal open={listVisible} onClose={() => setListVisible(false)}>
                <ReceiptList onClose={() => setListVisible(false)} enabled={listVisible} />
            </BottomSheetModal>
        </View>
    )
}

interface ReceiptListProps {
    enabled: boolean
    onClose: () => void
}

const ReceiptList: React.FC<ReceiptListProps> = ({ enabled, onClose }) => {
    const query = useSWR(enabled ? 'my-elections' : null, () => ElectionService.getMyElections())
    const voted = (query.data?.data ?? []).filter((election) => !!election.vote)

    const openReceipt = (vote: NonNullable<(typeof voted)[number]['vote']>) => {
        onClose()
        router.push({
            pathname: '/election/verify-result',
            params: {
                voteId: vote.id,
                electionId: vote.electionId,
                blindedCommitment: vote.blindedCommitment,
                blockchainRef: vote.blockchainRef
            }
        })
    }

    return (
        <View className='gap-3 p-4'>
            <Text className='text-center' variant={'large'}>
                Biên lai của tôi
            </Text>

            {query.isLoading ? (
                <Text variant='muted' className='py-4 text-center'>
                    Đang tải…
                </Text>
            ) : voted.length === 0 ? (
                <Text variant='muted' className='py-4 text-center'>
                    Bạn chưa có biên lai phiếu bầu nào.
                </Text>
            ) : (
                <ScrollView style={{ maxHeight: 360 }} showsVerticalScrollIndicator={false}>
                    <View className='gap-2'>
                        {voted.map((election) => (
                            <Pressable
                                key={election.id}
                                onPress={() => openReceipt(election.vote!)}
                                className='bg-card border-border gap-1 rounded-lg border p-4 active:opacity-70'
                            >
                                <Text numberOfLines={1} className='font-medium'>
                                    {election.name}
                                </Text>
                                <Text variant='muted' className='text-xs'>
                                    {election.vote!.blindedCommitment.slice(0, 12)}…
                                    {election.vote!.blindedCommitment.slice(-8)}
                                </Text>
                            </Pressable>
                        ))}
                    </View>
                </ScrollView>
            )}
        </View>
    )
}

const styles = StyleSheet.create({
    fill: {
        flex: 1
    }
})

export default VerifyScreen
