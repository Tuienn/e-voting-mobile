export interface VoteCommittedEvent {
    electionId: string
    blockchainRef: string
    createdAt: string
}

export interface VoteRevealedEvent {
    electionId: string
    candidateId: string
    revealKey: string
    blockchainRef: string
    createdAt: string
    electionCompleted: boolean
}
