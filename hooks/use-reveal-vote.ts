import { getVoteParamsSecret, saveVoteRevealed } from '@/lib/secure-store'
import RevealService from '@/services/reveal/reveal.service'
import { router } from 'expo-router'
import { useCallback, useState } from 'react'
import Toast from 'react-native-toast-message'

type RevealableVote = {
    id: string
    electionId: string
    blindedCommitment: string
    blockchainRef: string
}

const useRevealVote = () => {
    const [isRevealing, setIsRevealing] = useState(false)

    const reveal = useCallback(async (vote: RevealableVote) => {
        try {
            setIsRevealing(true)

            const secret = await getVoteParamsSecret(vote.id)
            if (!secret) {
                Toast.show({
                    type: 'error',
                    text1: 'Không tìm thấy khoá bí mật',
                    text2: 'Thiết bị này không lưu khoá bí mật của lá phiếu nên không thể tiết lộ.'
                })
                return
            }

            await RevealService.revealVote(vote.electionId, {
                candidateId: secret.candidateId,
                h: secret.h,
                sPrime: secret.sPrime
            })

            await saveVoteRevealed(vote.id)

            router.replace({
                pathname: '/election/verify-result',
                params: {
                    voteId: vote.id,
                    electionId: vote.electionId,
                    blindedCommitment: vote.blindedCommitment,
                    blockchainRef: vote.blockchainRef
                }
            })
        } catch (err: any) {
            Toast.show({
                type: 'error',
                text1: 'Tiết lộ phiếu thất bại',
                text2: err?.message?.message || err?.message || 'Đã xảy ra lỗi khi tiết lộ phiếu'
            })
        } finally {
            setIsRevealing(false)
        }
    }, [])

    return { isRevealing, reveal }
}

export default useRevealVote
