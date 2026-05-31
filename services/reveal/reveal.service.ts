import { ApiResponse } from '@/types/common'
import { RevealVoteResult, TallyResult } from '@/types/reveal'
import { revealApiService } from '.'

export default class RevealService {
    private static readonly BASE_URL = '/reveal-vote'

    static async revealVote(electionId: string, data: { candidateIds: string[]; h: string; sPrime: string }) {
        return await revealApiService<ApiResponse<RevealVoteResult>>(`${this.BASE_URL}/${electionId}/reveal`, {
            method: 'POST',
            body: JSON.stringify(data)
        })
    }

    static async getTally(electionId: string) {
        return await revealApiService<ApiResponse<TallyResult>>(`${this.BASE_URL}/${electionId}/tally`)
    }
}
