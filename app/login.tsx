import { KeyboardAvoidingView, Platform, Pressable, ScrollView, View, Image } from 'react-native'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Icon } from '@/components/ui/icon'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Text } from '@/components/ui/text'
import { ChevronLeftIcon, LogInIcon, ScanQrCodeIcon, ShieldIcon } from 'lucide-react-native'
import { useState } from 'react'
import useSWRMutation from 'swr/mutation'
import AuthService from '@/services/bff/auth.service'
import { useAuth } from '@/hooks/use-auth'
import Toast from 'react-native-toast-message'
import { router } from 'expo-router'
import VerifyCameraView from '../components/common/verify-camera-view'

const LoginScreen: React.FC = () => {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const { login } = useAuth()
    const [verifyViewVisible, setVerifyViewVisible] = useState(false)

    const handleValidate = () => {
        if (!email.trim() || !password.trim()) {
            Toast.show({
                type: 'error',
                text1: 'Vui lòng điền đầy đủ thông tin',
                text2: 'Email và mật khẩu không được để trống'
            })
            return false
        }

        if (!/\S+@\S+\.\S+/.test(email)) {
            Toast.show({
                type: 'error',
                text1: 'Email không hợp lệ',
                text2: 'Vui lòng nhập một địa chỉ email hợp lệ'
            })
            return false
        }

        if (password.length < 6) {
            Toast.show({
                type: 'error',
                text1: 'Mật khẩu quá ngắn',
                text2: 'Mật khẩu phải có ít nhất 6 ký tự'
            })
            return false
        }
        return true
    }

    const mutateLogin = useSWRMutation(
        'login',
        (
            _,
            {
                arg
            }: {
                arg: {
                    email: string
                    password: string
                }
            }
        ) => AuthService.login(arg.email, arg.password),
        {
            onSuccess: async (data) => {
                await login(data.data.accessToken, data.data.refreshToken, {
                    id: data.data.id,
                    email: data.data.email,
                    role: data.data.role
                })
                Toast.show({
                    type: 'success',
                    text1: 'Đăng nhập thành công'
                })
                router.replace('/')
            },
            onError: (error) => {
                Toast.show({
                    type: 'error',
                    text1: 'Đăng nhập thất bại',
                    text2: error.message.message || error.message || 'Vui lòng thử lại sau'
                })
            }
        }
    )

    return verifyViewVisible ? (
        <View className={'flex-1'}>
            <Button
                variant={'outline'}
                size={'icon'}
                className='absolute top-4 left-4 z-10 rounded-full'
                onPress={() => setVerifyViewVisible(false)}
            >
                <Icon as={ChevronLeftIcon} />
            </Button>
            <VerifyCameraView />
        </View>
    ) : (
        <KeyboardAvoidingView className={'flex-1'} behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
            <ScrollView contentContainerStyle={{ flexGrow: 1 }} keyboardShouldPersistTaps='handled'>
                <View className='bg-muted flex-1 justify-center gap-4 px-4'>
                    <Pressable onPress={() => router.push('/')}>
                        <Image
                            source={require('@/assets/images/icon.png')}
                            className='size-14 rounded-md'
                            resizeMode='contain'
                        />
                    </Pressable>
                    <Text variant={'h2'}>Chào mừng trở lại</Text>
                    <Text variant={'lead'}>Đăng nhập để xem các kỳ bỏ phiếu sắp diễn ra</Text>

                    <Card>
                        <CardContent>
                            <Label htmlFor='email'>Email *</Label>
                            <Input
                                id='email'
                                placeholder='Nhập email'
                                keyboardType='email-address'
                                autoCapitalize='none'
                                value={email}
                                onChangeText={setEmail}
                            />

                            <Label htmlFor='password' className='mt-4'>
                                Mật khẩu *
                            </Label>
                            <Input
                                id='password'
                                placeholder='Nhập mật khẩu'
                                secureTextEntry
                                value={password}
                                onChangeText={setPassword}
                            />
                        </CardContent>
                    </Card>

                    <Button
                        className='block'
                        onPress={() => handleValidate() && mutateLogin.trigger({ email, password })}
                        disabled={mutateLogin.isMutating}
                        size={'lg'}
                    >
                        <Text>Đăng nhập</Text>
                        <Icon as={LogInIcon} />
                    </Button>

                    <View className='flex-row items-center gap-4'>
                        <View className='bg-border h-px flex-1' />
                        <Text className='text-muted-foreground text-sm'>Thao tác khác</Text>
                        <View className='bg-border h-px flex-1' />
                    </View>

                    <Button variant='outline' className='block' size={'lg'} onPress={() => setVerifyViewVisible(true)}>
                        <Icon as={ScanQrCodeIcon} />
                        <Text>Xác minh</Text>
                    </Button>

                    <View className='flex-row items-center justify-center gap-1'>
                        <Icon as={ShieldIcon} size={16} />
                        <Text variant={'muted'}>Mã hoá đầu cuối · Verified by Tuienn</Text>
                    </View>
                </View>
            </ScrollView>
        </KeyboardAvoidingView>
    )
}

export default LoginScreen
