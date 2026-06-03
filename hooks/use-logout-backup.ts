import { useCallback, useState } from 'react'
import { router } from 'expo-router'
import Toast from 'react-native-toast-message'
import { useAuth } from '@/hooks/use-auth'
import { clearAllSecureData, collectVoteSecretsForBackup } from '@/lib/secure-store'
import { encryptBackup } from '@/lib/backup-crypto'
import BackupService from '@/services/bff/backup.service'
import { runAfterIdle } from '@/lib/utils'

//NOTE - Mã hóa toàn bộ vote-secret bằng PIN rồi đẩy lên server, sau đó đăng xuất.
export const useLogoutBackup = () => {
    const { logout } = useAuth()
    const [processing, setProcessing] = useState(false)

    const finishLogout = useCallback(async () => {
        await logout()
        await clearAllSecureData()
        router.replace('/login')
    }, [logout])

    const runBackupAndLogout = useCallback(
        (pin: string) => {
            setProcessing(true)

            return runAfterIdle(async () => {
                try {
                    const secrets = await collectVoteSecretsForBackup()

                    if (Object.keys(secrets).length === 0) {
                        Toast.show({ type: 'info', text1: 'Không có dữ liệu phiếu để sao lưu' })
                        await finishLogout()
                        return
                    }

                    const payload = encryptBackup(secrets, pin)
                    await BackupService.saveVoteSecretBackup(payload)

                    Toast.show({ type: 'success', text1: 'Đã sao lưu dữ liệu & đăng xuất' })
                    await finishLogout()
                } catch (e) {
                    setProcessing(false)
                    Toast.show({
                        type: 'error',
                        text1: 'Sao lưu thất bại',
                        text2: e instanceof Error ? e.message : 'Vui lòng thử lại'
                    })
                }
            })
        },
        [finishLogout]
    )

    return { processing, runBackupAndLogout, forceLogout: finishLogout }
}
