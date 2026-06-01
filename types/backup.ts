export interface VoteParamsSecret {
    h: string
    sPrime: string
}

export interface VoteStatus {
    candidateIds: string[]
    revealed: boolean
}

export interface VoteSecretBackupEntry {
    params: VoteParamsSecret | null
    status: VoteStatus | null
}

export type VoteSecretBackupMap = Record<string, VoteSecretBackupEntry>
