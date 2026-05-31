import { clearVoteParamsSecret, saveVoteStatus } from '@/lib/secure-store'
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

type RevealVoteParams = {
    h?: string
    sPrime?: string
    candidateIds?: string[]
}

const useRevealVote = (params: RevealVoteParams) => {
    const [isRevealing, setIsRevealing] = useState(false)

    const reveal = useCallback(
        async (vote: RevealableVote) => {
            try {
                setIsRevealing(true)

                if (!params.h || !params.sPrime) {
                    Toast.show({
                        type: 'error',
                        text1: 'Không tìm thấy khoá bí mật',
                        text2: 'Thiết bị này không lưu khoá bí mật của lá phiếu nên không thể tiết lộ.'
                    })
                    return
                }

                if (!params.candidateIds || params.candidateIds.length === 0) {
                    Toast.show({
                        type: 'error',
                        text1: 'Không xác định được các ứng cử viên đã chọn',
                        text2: 'Thông tin các ứng cử viên đã chọn không hợp lệ, không thể tiết lộ.'
                    })
                    return
                }

                //SECTION - Tiết lộ phiếu
                await RevealService.revealVote(vote.electionId, {
                    candidateIds: params.candidateIds,
                    h: params.h,
                    sPrime: params.sPrime
                })

                //SECTION - Sau khi tiết lộ thành công: xoá khoá bí mật + đánh dấu đã reveal
                await clearVoteParamsSecret(vote.id)

                await saveVoteStatus(vote.id, {
                    candidateIds: params.candidateIds,
                    revealed: true
                })

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
        },
        // eslint-disable-next-line react-hooks/exhaustive-deps
        [params.h, params.sPrime, JSON.stringify(params.candidateIds)]
    )

    return { isRevealing, reveal }
}

export default useRevealVote
