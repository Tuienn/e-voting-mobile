import { ApiResponse } from '@/types/common'
import { bffApiService } from '.'
import { Election, ElectionCount, ElectionStatus } from '@/types/election'

export default class ElectionService {
    private static readonly BASE_URL = '/coordinator/election'

    static async getElectionCount() {
        return await bffApiService<ApiResponse<ElectionCount>>(`${this.BASE_URL}/me/count`)
    }

    static async getElectionsByStatus(status: ElectionStatus) {
        return await bffApiService<ApiResponse<Election[]>>(`${this.BASE_URL}/me?status=${status}`)
    }

    static async getElectionById(id: string) {
        return await bffApiService<ApiResponse<Election>>(`${this.BASE_URL}/me/${id}`)
    }
}
