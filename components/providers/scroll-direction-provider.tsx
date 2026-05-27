import { createContext, PropsWithChildren } from 'react'
import {
    SharedValue,
    useAnimatedScrollHandler,
    useSharedValue,
    type ScrollHandlerProcessed
} from 'react-native-reanimated'
const SCROLL_THRESHOLD = 5
const TOP_THRESHOLD = 10

export interface ScrollDirectionType {
    scrollHandler: ScrollHandlerProcessed
    navVisible: SharedValue<number>
}

export const ScrollDirectionContext = createContext<ScrollDirectionType | undefined>(undefined)

export const ScrollDirectionProvider: React.FC<PropsWithChildren> = ({ children }) => {
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
    return (
        <ScrollDirectionContext.Provider value={{ scrollHandler, navVisible }}>
            {children}
        </ScrollDirectionContext.Provider>
    )
}
