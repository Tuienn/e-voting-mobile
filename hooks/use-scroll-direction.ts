import { useSharedValue } from 'react-native-reanimated'
import { useAnimatedScrollHandler } from 'react-native-reanimated'

const SCROLL_THRESHOLD = 5
const TOP_THRESHOLD = 10

export type ScrollDirection = 'up' | 'down' | 'idle'

export function useScrollDirection() {
    const navVisible = useSharedValue(1)
    const lastScrollY = useSharedValue(0)

    const scrollHandler = useAnimatedScrollHandler({
        onScroll: (event) => {
            const y = event.contentOffset.y
            const delta = y - lastScrollY.value

            if (y <= TOP_THRESHOLD) {
                navVisible.value = 1
            } else if (delta > SCROLL_THRESHOLD) {
                navVisible.value = 0
            } else if (delta < -SCROLL_THRESHOLD) {
                navVisible.value = 1
            }

            lastScrollY.value = y
        }
    })

    return { scrollHandler, navVisible }
}
