export interface RevealVoteResult {
    id: string
    electionId: string
    candidateId: string
    revealKey: string
    blockchainRef: string
    createdAt?: string
    electionCompleted?: boolean
}

export interface TallyCandidateResult {
    candidateId: string
    candidateName: string | null
    dbRevealCount: number
    chainRevealCount: number
}

export interface TallyResult {
    electionId: string
    electionName: string
    status: string
    tallyResult: TallyCandidateResult[]
    dbRevealTotal: number
    chainRevealTotal: number
    chainError: string | null
}
