import { Skeleton } from '@/components/ui/skeleton'
import { Text } from '@/components/ui/text'
import ElectionService from '@/services/bff/election.service'
import { router } from 'expo-router'
import { Pressable, ScrollView, View } from 'react-native'
import useSWR from 'swr'

interface ReceiptListProps {
    enabled: boolean
    onClose: () => void
}

const ReceiptList: React.FC<ReceiptListProps> = ({ enabled, onClose }) => {
    const query = useSWR(enabled ? 'my-elections' : null, () => ElectionService.getMyElections())
    const voted = (query.data?.data ?? []).filter((election) => !!election.vote)

    const openReceipt = (vote: NonNullable<(typeof voted)[number]['vote']>) => {
        onClose()
        router.push({
            pathname: '/verify/receipt',
            params: {
                voteId: vote.id,
                electionId: vote.electionId,
                blindedCommitment: vote.blindedCommitment,
                blockchainRef: vote.blockchainRef
            }
        })
    }

    return (
        <View className='gap-4 p-4'>
            <Text className='text-center' variant={'large'}>
                Biên lai của tôi
            </Text>

            {query.isLoading ? (
                <Skeleton className='h-12 w-full' />
            ) : voted.length === 0 ? (
                <Text variant='muted' className='py-4 text-center'>
                    Bạn chưa có biên lai phiếu bầu nào.
                </Text>
            ) : (
                <ScrollView style={{ maxHeight: 360 }} showsVerticalScrollIndicator={false}>
                    <View className='gap-2'>
                        {voted.map((election) => (
                            <Pressable
                                key={election.id}
                                onPress={() => openReceipt(election.vote!)}
                                className='bg-card border-border gap-1 rounded-lg border p-4 active:opacity-70'
                            >
                                <Text numberOfLines={1} className='font-medium'>
                                    {election.name}
                                </Text>
                                <Text variant='muted' className='text-xs'>
                                    {election.vote!.blindedCommitment.slice(0, 12)}…
                                    {election.vote!.blindedCommitment.slice(-8)}
                                </Text>
                            </Pressable>
                        ))}
                    </View>
                </ScrollView>
            )}
        </View>
    )
}

export default ReceiptList
