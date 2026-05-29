export interface VerifyReceiptResult {
    electionId: string
    voteId: string
    db: {
        exist: boolean
        voteIdMatch: boolean
        commitmentMatch: boolean
        blockchainRefMatch: boolean
        valid: boolean
    }
    chain: {
        exist: boolean
        txIdMatch: boolean
        commitmentMatch: boolean
        error: string | null
        valid: boolean
    }
    merkle: {
        applicable: boolean
        proof: string[] | null
        root: string | null
        rootMatchesChain: boolean
        rootMatchesDB: boolean
        proofValid: boolean
        chainProofValid: boolean
        getMerkleRootChainError: string | null
        verifyProofChainError: string | null
        valid: boolean
    }
    valid: boolean
}
