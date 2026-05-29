import { ApiResponse } from '@/types/common'
import { bffApiService } from '.'
import { SignBlindedVoteResponse, StartSessionResponse, Vote } from '@/types/vote'
import { VerifyReceiptResult } from '@/types/verify'

export default class VoteService {
    private static readonly BASE_URL = '/coordinator/vote'

    static async startSession(electionId: string) {
        return await bffApiService<ApiResponse<StartSessionResponse>>(`${this.BASE_URL}/${electionId}/start-session`, {
            method: 'POST'
        })
    }

    static async signBlindedVote(sessionId: string, rHex: string) {
        return await bffApiService<ApiResponse<SignBlindedVoteResponse>>(`${this.BASE_URL}/sign`, {
            method: 'POST',
            body: JSON.stringify({ sessionId, rHex })
        })
    }

    static async submitBlindedCommitment(
        electionId: string,
        data: { sessionId: string; signatureHex: string; blindedCommitment: string }
    ) {
        return await bffApiService<ApiResponse<Vote>>(`${this.BASE_URL}/${electionId}/submit-blinded-commitment`, {
            method: 'POST',
            body: JSON.stringify(data)
        })
    }

    static async verifyReceipt(
        voteId: string,
        data: { electionId: string; blindedCommitment: string; blockchainRef: string }
    ) {
        return await bffApiService<ApiResponse<VerifyReceiptResult>>(`${this.BASE_URL}/${voteId}/verify`, {
            method: 'POST',
            body: JSON.stringify(data)
        })
    }
}
