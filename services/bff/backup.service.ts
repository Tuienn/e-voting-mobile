import { bffApiService } from '.'
import { ApiResponse } from '@/types/common'

export interface VoteSecretBackupData {
    payload: string
}

export default class BackupService {
    private static readonly BASE_URL = '/identity/me/vote-secret-backup'

    //NOTE - Đẩy envelope (đã mã hóa zero-knowledge) lên server
    static async saveVoteSecretBackup(payload: string) {
        return await bffApiService<ApiResponse<{ updatedAt: string }>>(this.BASE_URL, {
            method: 'POST',
            body: JSON.stringify({ payload })
        })
    }

    //NOTE - Tải envelope về để giải mã bằng PIN ở client. data = null nếu chưa có backup
    static async getVoteSecretBackup() {
        return await bffApiService<ApiResponse<VoteSecretBackupData | null>>(this.BASE_URL, {
            method: 'GET'
        })
    }
}
