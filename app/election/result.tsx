import ScreenHeader from '@/components/common/screen-header'
import ElectionResultView from '@/components/screens/election/election-result-view'
import { useLocalSearchParams } from 'expo-router'
import { RefreshControl } from 'react-native'
import Animated from 'react-native-reanimated'
import { SafeAreaView } from 'react-native-safe-area-context'
import { mutate } from 'swr'

const ElectionResultScreen: React.FC = () => {
    const { electionId } = useLocalSearchParams<{ electionId: string }>()

    return (
        <SafeAreaView style={{ flex: 1 }}>
            <Animated.ScrollView
                showsVerticalScrollIndicator={false}
                className='bg-muted'
                style={{ flex: 1 }}
                contentContainerStyle={{ padding: 16, paddingBottom: 12, gap: 12 }}
                refreshControl={<RefreshControl refreshing={false} onRefresh={() => mutate(`tally/${electionId}`)} />}
            >
                <ScreenHeader title='Kết quả cuộc bầu cử' />

                <ElectionResultView electionId={electionId} />
            </Animated.ScrollView>
        </SafeAreaView>
    )
}

export default ElectionResultScreen
