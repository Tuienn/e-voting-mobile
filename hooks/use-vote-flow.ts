import {
    blind,
    buildVoteMessage,
    computeBlindedCommitment,
    hexToPoint,
    hexToScalar,
    scalarToHex,
    unblind,
    verify
} from '@/lib/ec-schnorr'
import { saveVoteParamsSecret, saveVoteStatus } from '@/lib/secure-store'
import VoteService from '@/services/bff/vote.service'
import { Vote, VoteStep } from '@/types/vote'
import { useCallback, useMemo, useState } from 'react'

const useVoteFlow = (electionId: string) => {
    const [step, setStep] = useState<VoteStep>('IDLE')
    const [error, setError] = useState<string | null>(null)
    const [receipt, setReceipt] = useState<Vote | null>(null)

    const isProcessing = useMemo(() => !receipt && !error, [receipt, error])

    const reset = useCallback(() => {
        setStep('IDLE')
        setError(null)
    }, [])

    const vote = useCallback(
        async (candidateId: string) => {
            try {
                reset()
                setStep('PREPARING')
                const session = await VoteService.startSession(electionId)

                const collectiveCommitment = hexToPoint(session.data.collectiveCommitment)
                const collectivePublicKey = hexToPoint(session.data.collectivePublicKey)
                const messageBytes = buildVoteMessage(electionId, candidateId)
                const blinded = blind(messageBytes, collectiveCommitment, collectivePublicKey)

                setStep('SIGNING')
                const signature = await VoteService.signBlindedVote(session.data.sessionId, scalarToHex(blinded.r))

                const unblinded = unblind(hexToScalar(signature.data.signatureHex), blinded.alpha, blinded.h)

                const localValidation = verify(messageBytes, unblinded.h, unblinded.sPrime, collectivePublicKey)
                if (!localValidation) {
                    throw new Error('Xác thực chữ ký thất bại')
                }

                setStep('SUBMITTING')
                const blindedCommitment = computeBlindedCommitment(blinded.Cprime).toLowerCase()
                const submitVoteRes = await VoteService.submitBlindedCommitment(electionId, {
                    sessionId: session.data.sessionId,
                    signatureHex: signature.data.signatureHex,
                    blindedCommitment
                })

                await saveVoteParamsSecret(submitVoteRes.data.id, {
                    h: scalarToHex(unblinded.h),
                    sPrime: scalarToHex(unblinded.sPrime)
                })
                await saveVoteStatus(submitVoteRes.data.id, {
                    candidateId: candidateId,
                    revealed: false
                })

                setReceipt(submitVoteRes.data)
            } catch (err: any) {
                console.error('Error starting vote session:', err)
                setError(err.message.message || err.message || 'Bỏ phiếu thất bại')
                return
            }
        },
        [electionId]
    )

    return {
        step,
        isProcessing,
        error,
        receipt,
        vote
    }
}

export default useVoteFlow
