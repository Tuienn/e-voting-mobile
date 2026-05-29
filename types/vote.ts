export interface StartSessionResponse {
    sessionId: string
    collectiveCommitment: string
    collectivePublicKey: string
}

export interface SignBlindedVoteResponse {
    signatureHex: string
}

export interface Vote {
    id: string
    electionId: string
    voterId: string
    blindedCommitment: string
    blockchainRef: string
    createdAt: string
}

export type VoteStep = 'IDLE' | 'PREPARING' | 'SIGNING' | 'SUBMITTING'
