export interface RevealVoteResult {
    id: string
    electionId: string
    candidateIds: string[]
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
    // Số phiếu đã reveal (mỗi lá phiếu đếm đúng 1 lần)
    dbRevealedBallots: number
    chainRevealedBallots: number
    // Tổng lượt chọn (mỗi lượt chọn ứng viên đếm 1 lần; >= số phiếu khi bầu nhiều ứng viên)
    dbTotalSelections: number
    chainTotalSelections: number
    chainError: string | null
}
