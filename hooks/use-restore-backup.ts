import Toast from 'react-native-toast-message'
import { useCallback, useState } from 'react'
import { decryptBackup } from '@/lib/backup-crypto'
import { restoreVoteSecretsFromBackup } from '@/lib/secure-store'
import BackupService from '@/services/bff/backup.service'
import { runAfterIdle } from '@/lib/utils'
import { VoteSecretBackupMap } from '@/types/backup'

//NOTE - Tải envelope từ server, giải mã bằng PIN (sai PIN → GCM fail) rồi ghi lại vào SecureStore
export const useRestoreBackup = (onDone?: () => void) => {
    const [processing, setProcessing] = useState(false)

    const restore = useCallback(
        (pin: string) => {
            setProcessing(true)

            return runAfterIdle(async () => {
                try {
                    const res = await BackupService.getVoteSecretBackup()
                    const payload = res.data?.payload

                    if (!payload) {
                        setProcessing(false)
                        Toast.show({ type: 'info', text1: 'Chưa có dữ liệu sao lưu trên máy chủ' })
                        return
                    }

                    const secrets = decryptBackup<VoteSecretBackupMap>(payload, pin)
                    await restoreVoteSecretsFromBackup(secrets)

                    setProcessing(false)
                    Toast.show({ type: 'success', text1: 'Khôi phục dữ liệu thành công' })
                    onDone?.()
                } catch (e) {
                    setProcessing(false)
                    Toast.show({
                        type: 'error',
                        text1: 'Khôi phục thất bại',
                        text2: e instanceof Error ? e.message : 'Vui lòng thử lại'
                    })
                }
            })
        },
        [onDone]
    )

    return { processing, restore }
}
