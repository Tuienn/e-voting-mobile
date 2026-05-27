import { BffResponse } from '@/types/common'
import { bffApiService } from '.'
import { Election, ElectionCount, ElectionStatus } from '@/types/election'

export default class ElectionService {
    private static readonly BASE_URL = '/coordinator/election'

    static getElectionCount = async () => {
        return await bffApiService<BffResponse<ElectionCount>>(`${this.BASE_URL}/me/count`)
    }

    static getElectionsByStatus = async (status: ElectionStatus) => {
        return await bffApiService<BffResponse<Election[]>>(`${this.BASE_URL}/me?status=${status}`)
    }
}
