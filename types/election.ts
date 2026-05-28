export type ElectionStatus = 'PENDING' | 'ACTIVE' | 'CLOSED' | 'COMPLETED'

export interface ElectionCount {
    pending: number
    active: number
    closed: number
    completed: number
}

export interface Election {
    id: string
    name: string
    status: ElectionStatus
    candidateIds: string[]
    merkleRoot?: string
    blockchainRef?: string
    collectivePublicKey?: string
    startDate?: string
    endDate?: string
    candidates: {
        id: string
        email: string
        name: string
    }[]

    vote?: {
        id: string
        electionId: string
        voterId: string
        blindCommitment: string
        blockchainRef: string
    }
}
