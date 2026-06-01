import { useEffect, useState } from 'react'
import { useAuth } from '@/hooks/use-auth'
import { getBackupVoteIds } from '@/lib/secure-store'
import BackupService from '@/services/bff/backup.service'

//NOTE - Chỉ nhắc 1 lần mỗi phiên app (reset khi reload). Tránh nhắc lại liên tục nếu user bỏ qua.
let promptedThisSession = false

//NOTE - Sau khi đăng nhập: nếu máy chưa có secret (SecureStore trống) nhưng server có backup
// → gợi ý mở sheet nhập PIN để khôi phục.
export const useRestorePrompt = () => {
    const { isAuth } = useAuth()
    const [shouldPrompt, setShouldPrompt] = useState(false)

    useEffect(() => {
        if (!isAuth || promptedThisSession) return

        let active = true
        ;(async () => {
            const localIds = await getBackupVoteIds()
            if (localIds.length > 0) return // máy đã có dữ liệu → không cần khôi phục

            const res = await BackupService.getVoteSecretBackup().catch(() => null)
            if (active && res?.data?.payload) {
                promptedThisSession = true
                setShouldPrompt(true)
            }
        })()

        return () => {
            active = false
        }
    }, [isAuth])

    return { shouldPrompt, clearPrompt: () => setShouldPrompt(false) }
}
