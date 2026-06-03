import BottomSheetModal from '@/components/common/bottom-sheet-modal'
import ScreenHeader from '@/components/common/screen-header'
import CandidateCheckbox from '@/components/screens/election/candidate-checkbox'
import CandidateSelected from '@/components/screens/election/candidate-selected'
import ElectionPill from '@/components/screens/election/election-pill'
import ElectionSkeleton from '@/components/screens/election/election-skeleton'
import ElectionTabBar from '@/components/screens/election/election-tab-bar'
import RevealConfirmSheet from '@/components/screens/election/reveal-confirm-sheet'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { Button } from '@/components/ui/button'
import { Icon } from '@/components/ui/icon'
import { Text } from '@/components/ui/text'
import useElectionSocket from '@/hooks/use-election-socket'
import useRevealVote from '@/hooks/use-reveal-vote'
import { getVoteParamsSecret, getVoteStatus } from '@/lib/secure-store'
import ElectionService from '@/services/bff/election.service'
import { router, useLocalSearchParams } from 'expo-router'
import { AlertCircleIcon, AlertTriangleIcon, ShieldCheckIcon, TerminalIcon, VoteIcon } from 'lucide-react-native'
import { useEffect, useMemo, useState } from 'react'
import { RefreshControl, View } from 'react-native'
import Animated from 'react-native-reanimated'
import { SafeAreaView } from 'react-native-safe-area-context'
import useSWR from 'swr'
import { VoteParamsSecret, VoteStatus } from '@/types/backup'

const ElectionDetailScreen: React.FC = () => {
    const { id } = useLocalSearchParams<{ id: string }>()
    const [selectedCandidateIds, setSelectedCandidateIds] = useState<string[]>([])
    const [voteSheetVisible, setVoteSheetVisible] = useState(false)
    const [revealSheetVisible, setRevealSheetVisible] = useState(false)
    const [voteParamsSecret, setVoteParamsSecret] = useState<VoteParamsSecret | null>(null)
    const [voteStatus, setVoteStatus] = useState<VoteStatus | null>(null)
    const queryElectionById = useSWR(`election/${id}`, () => ElectionService.getElectionById(id))

    useElectionSocket(id, ['committed'])

    const election = queryElectionById.data?.data
    const vote = election?.vote

    //NOTE - Nếu đã bỏ phiếu: lấy candidateId từ khoá bí mật để tick sẵn + xác định trạng thái reveal
    useEffect(() => {
        if (!vote?.id) {
            setVoteParamsSecret(null)
            setVoteStatus(null)
            return
        }
        let active = true
        ;(async () => {
            const [secret, voteStatus] = await Promise.all([getVoteParamsSecret(vote.id), getVoteStatus(vote.id)])
            if (!active) return
            setVoteParamsSecret(secret)
            setVoteStatus(voteStatus)
            if (voteStatus?.candidateIds) setSelectedCandidateIds(voteStatus.candidateIds)
        })()
        return () => {
            active = false
        }
    }, [vote?.id])

    const maxSelectable = election?.maxSelectableCandidates ?? 1

    const candidatesSelected = useMemo(() => {
        if (!election) return []
        return election.candidates.filter((c) => selectedCandidateIds.includes(c.id))
    }, [selectedCandidateIds, election])

    const toggleCandidate = (candidateId: string) => {
        setSelectedCandidateIds((prev) =>
            prev.includes(candidateId) ? prev.filter((cId) => cId !== candidateId) : [...prev, candidateId]
        )
    }

    const { isRevealing, reveal } = useRevealVote({
        h: voteParamsSecret?.h,
        sPrime: voteParamsSecret?.sPrime,
        candidateIds: voteStatus?.candidateIds
    })

    const handleVerify = () => {
        if (!vote) return
        router.push({
            pathname: '/verify/receipt',
            params: {
                voteId: vote.id,
                electionId: id,
                blindedCommitment: vote.blindedCommitment,
                blockchainRef: vote.blockchainRef
            }
        })
    }

    const handleViewResult = () => {
        router.push({ pathname: '/election/result', params: { electionId: id } })
    }

    const handleReveal = async () => {
        if (!vote) return
        await reveal({
            id: vote.id,
            electionId: id,
            blindedCommitment: vote.blindedCommitment,
            blockchainRef: vote.blockchainRef
        })
        setRevealSheetVisible(false)
    }

    return (
        <SafeAreaView style={{ flex: 1 }}>
            <Animated.ScrollView
                showsVerticalScrollIndicator={false}
                className='bg-muted'
                style={{ flex: 1 }}
                contentContainerStyle={{ padding: 16, paddingBottom: 12 }}
                refreshControl={<RefreshControl refreshing={false} onRefresh={queryElectionById.mutate} />}
            >
                <View className='gap-3'>
                    <ScreenHeader title='Chi tiết cuộc bầu cử' />

                    {queryElectionById.error ? (
                        <Alert variant='destructive' icon={AlertCircleIcon}>
                            <AlertTitle>Lỗi</AlertTitle>
                            <AlertDescription>
                                {queryElectionById.error.message ?? 'Đã xảy ra lỗi khi tải thông tin cuộc bầu cử'}
                            </AlertDescription>
                        </Alert>
                    ) : election ? (
                        <>
                            <ElectionPill
                                candidateCount={election.candidateIds.length}
                                name={election.name}
                                status={election.status}
                                startDate={election.startDate}
                                endDate={election.endDate}
                            />
                            <View className='flex-row justify-between'>
                                <Text variant={'muted'} className='font-semibold uppercase'>
                                    Ứng viên
                                </Text>

                                <Text variant={'muted'}>
                                    Đã chọn {selectedCandidateIds.length} / tối đa {maxSelectable}
                                </Text>
                            </View>

                            {vote ? (
                                <Alert icon={AlertTriangleIcon} variant='warning'>
                                    <AlertTitle>Bạn đã bỏ phiếu cho cuộc bầu cử này</AlertTitle>
                                </Alert>
                            ) : election.status === 'ACTIVE' ? (
                                <Alert icon={TerminalIcon} variant='info'>
                                    <AlertTitle>Chọn tối đa {maxSelectable} ứng cử viên</AlertTitle>
                                </Alert>
                            ) : (
                                <Alert icon={AlertTriangleIcon} variant='warning'>
                                    <AlertTitle>Bạn chưa bỏ phiếu cho cuộc bầu cử này</AlertTitle>
                                </Alert>
                            )}

                            {election.candidates.map((candidate) => {
                                const isSelected = selectedCandidateIds.includes(candidate.id)
                                const reachedMax = selectedCandidateIds.length >= maxSelectable
                                return (
                                    <CandidateCheckbox
                                        key={candidate.id}
                                        candidateId={candidate.id}
                                        name={candidate.name}
                                        email={candidate.email}
                                        isSelected={isSelected}
                                        onSelect={toggleCandidate}
                                        disabled={election.status !== 'ACTIVE' || !!vote || (!isSelected && reachedMax)}
                                    />
                                )
                            })}
                        </>
                    ) : (
                        <ElectionSkeleton />
                    )}
                </View>
            </Animated.ScrollView>

            {election && (
                <ElectionTabBar
                    election={election}
                    revealed={!!voteStatus?.revealed}
                    hasSecret={!!voteParamsSecret}
                    voteDisabled={selectedCandidateIds.length === 0}
                    onVote={() => setVoteSheetVisible(true)}
                    onVerify={handleVerify}
                    onReveal={() => setRevealSheetVisible(true)}
                    onViewResult={handleViewResult}
                />
            )}

            <BottomSheetModal open={voteSheetVisible} onClose={() => setVoteSheetVisible(false)}>
                <View className='gap-3 p-4'>
                    <Text className='text-center' variant={'large'}>
                        Xác nhận bỏ phiếu
                    </Text>
                    <Text className='text-center' variant={'muted'}>
                        Sau khi gửi phiếu bạn sẽ nhận lại biên lai để xác minh phiếu bầu
                    </Text>
                    {candidatesSelected.length > 0 && <CandidateSelected candidates={candidatesSelected} />}
                    <Alert icon={ShieldCheckIcon} variant='success'>
                        <AlertTitle>Lá phiếu sẽ được mã hoá và ghi lên blockchain.</AlertTitle>
                    </Alert>

                    <Button
                        onPress={() =>
                            router.replace({
                                pathname: '/election/vote-flow',
                                params: {
                                    electionId: id,
                                    candidateIds: JSON.stringify(selectedCandidateIds)
                                }
                            })
                        }
                    >
                        <Icon as={VoteIcon} />
                        <Text>Xác nhận bỏ phiếu</Text>
                    </Button>
                </View>
            </BottomSheetModal>

            <BottomSheetModal open={revealSheetVisible} onClose={() => setRevealSheetVisible(false)}>
                <RevealConfirmSheet onConfirm={handleReveal} loading={isRevealing} />
            </BottomSheetModal>
        </SafeAreaView>
    )
}

export default ElectionDetailScreen
