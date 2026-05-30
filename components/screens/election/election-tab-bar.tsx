import FixedCustomTabBar, { FixedCustomTabBarItem } from '@/components/common/fixed-custom-tab-bar'
import { THEME } from '@/lib/theme'
import { Election } from '@/types/election'
import { ChartColumnBigIcon, EyeIcon, ScanQrCodeIcon, VoteIcon } from 'lucide-react-native'
import { useUniwind } from 'uniwind'

interface Props {
    election: Election
    revealed: boolean
    hasSecret: boolean
    voteDisabled?: boolean
    onVote: () => void
    onVerify: () => void
    onReveal: () => void
    onViewResult: () => void
}

const ElectionTabBar: React.FC<Props> = ({
    election,
    revealed,
    hasSecret,
    voteDisabled,
    onVote,
    onVerify,
    onReveal,
    onViewResult
}) => {
    const { theme } = useUniwind()
    const color = THEME[theme].primary

    const vote = election.vote

    const verifyItem: FixedCustomTabBarItem = {
        key: 'verify',
        label: 'Xác minh',
        icon: <ScanQrCodeIcon color={color} />,
        onPress: onVerify
    }
    const resultsItem: FixedCustomTabBarItem = {
        key: 'results',
        label: 'Kết quả',
        icon: <ChartColumnBigIcon color={color} />,
        onPress: onViewResult
    }
    const revealItem: FixedCustomTabBarItem = {
        key: 'reveal',
        label: 'Tiết lộ',
        icon: <EyeIcon color={color} />,
        onPress: onReveal
    }

    let items: FixedCustomTabBarItem[] = []

    switch (election.status) {
        case 'PENDING':
            items = []
            break
        case 'ACTIVE':
            items = vote
                ? [verifyItem]
                : [
                      {
                          key: 'vote',
                          label: 'Bỏ phiếu',
                          icon: <VoteIcon color={color} />,
                          onPress: onVote,
                          disabled: voteDisabled
                      }
                  ]
            break
        case 'CLOSED':
            items = vote ? [verifyItem, ...(!revealed && hasSecret ? [revealItem] : []), resultsItem] : [resultsItem]
            break
        case 'COMPLETED':
            items = vote ? [verifyItem, resultsItem] : [resultsItem]
            break
    }

    if (items.length === 0) return null

    return <FixedCustomTabBar items={items} />
}

export default ElectionTabBar
