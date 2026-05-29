import { Receipt } from '@/lib/receipt-qr'
import VoteService from '@/services/bff/vote.service'
import Toast from 'react-native-toast-message'
import useSWR from 'swr'

const useVerifyReceipt = (receipt: Receipt | null) => {
    const { data, error, isLoading } = useSWR(
        receipt ? `verify/${receipt.voteId}/${receipt.blindedCommitment}` : null,
        () =>
            VoteService.verifyReceipt(receipt!.voteId, {
                electionId: receipt!.electionId,
                blindedCommitment: receipt!.blindedCommitment,
                blockchainRef: receipt!.blockchainRef
            }),
        {
            revalidateOnFocus: false,
            onError: (err: Error) => {
                Toast.show({
                    type: 'error',
                    text1: 'Xác minh thất bại',
                    text2: err.message
                })
            }
        }
    )

    return {
        valid: data?.data.valid as boolean | undefined,
        isLoading,
        error: error as Error | undefined
    }
}

export default useVerifyReceipt
