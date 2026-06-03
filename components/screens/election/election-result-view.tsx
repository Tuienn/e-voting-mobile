import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import ElectionSkeleton from './election-skeleton'
import { AlertCircleIcon, AlertTriangleIcon } from 'lucide-react-native'
import CandidateResult from './candidate-result'
import useSWR from 'swr'
import useElectionSocket from '@/hooks/use-election-socket'
import RevealService from '@/services/reveal/reveal.service'
import { View } from 'react-native'
import ElectionPill from './election-pill'

interface Props {
    electionId: string
}

const ElectionResultView: React.FC<Props> = ({ electionId }) => {
    const queryTally = useSWR(`tally/${electionId}`, () => RevealService.getTally(electionId))

    useElectionSocket(electionId, ['revealed'])

    const tally = queryTally.data?.data

    return queryTally.error ? (
        <Alert variant='destructive' icon={AlertCircleIcon}>
            <AlertTitle>Lỗi</AlertTitle>
            <AlertDescription>{queryTally.error.message ?? 'Đã xảy ra lỗi khi tải kết quả'}</AlertDescription>
        </Alert>
    ) : tally ? (
        <View className='gap-3'>
            <ElectionPill
                name={tally.election.name}
                status={tally.election.status}
                candidateCount={tally.tallyResult.length}
                endDate={tally.election.endDate}
                startDate={tally.election.startDate}
            />

            {tally.chainError && (
                <Alert variant='warning' icon={AlertTriangleIcon}>
                    <AlertTitle>Không lấy được dữ liệu blockchain</AlertTitle>
                    <AlertDescription>{tally.chainError}</AlertDescription>
                </Alert>
            )}

            {tally.tallyResult.map((candidate) => (
                <CandidateResult
                    key={candidate.candidateId}
                    name={candidate.candidateName ?? 'Ứng viên'}
                    dbCount={candidate.dbRevealCount}
                    dbTotal={tally.dbTotalSelections}
                    chainCount={candidate.chainRevealCount}
                    chainTotal={tally.chainTotalSelections}
                />
            ))}
        </View>
    ) : (
        <ElectionSkeleton />
    )
}

export default ElectionResultView
