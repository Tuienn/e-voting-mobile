import { useCallback, useEffect, useRef, useState, ReactNode } from 'react'
import {
    Animated,
    Dimensions,
    Easing,
    LayoutChangeEvent,
    Modal,
    PanResponder,
    Pressable,
    StyleSheet,
    View
} from 'react-native'

const { height: SCREEN_HEIGHT } = Dimensions.get('window')
const DISMISS_THRESHOLD = 80
const DRAG_INDICATOR_HEIGHT = 24

interface Props {
    open: boolean
    onClose: () => void
    children: ReactNode
}

const BottomSheetModal: React.FC<Props> = ({ open: visible, onClose, children }) => {
    const [contentHeight, setContentHeight] = useState(0)

    const translateY = useRef(new Animated.Value(SCREEN_HEIGHT)).current
    const backdropOpacity = useRef(new Animated.Value(0)).current
    // opacity của sheet: ẩn trong lúc đo để không thấy nó "nhảy"
    const sheetOpacity = useRef(new Animated.Value(0)).current
    const lastY = useRef(0)
    const currentY = useRef(SCREEN_HEIGHT)
    const didAnimateIn = useRef(false)

    useEffect(() => {
        const id = translateY.addListener(({ value }) => {
            currentY.current = value
        })
        return () => translateY.removeListener(id)
    }, [translateY])

    const handleLayout = useCallback(
        (e: LayoutChangeEvent) => {
            const h = e.nativeEvent.layout.height
            if (h > 0 && h !== contentHeight) {
                setContentHeight(h)
            }
        },
        [contentHeight]
    )

    const animateIn = useCallback(() => {
        // đặt sheet đúng vị trí ẩn dựa trên chiều cao đã đo, rồi mới hiện + trượt lên
        translateY.setValue(contentHeight || SCREEN_HEIGHT)
        sheetOpacity.setValue(1)
        Animated.parallel([
            Animated.timing(translateY, {
                toValue: 0,
                duration: 320,
                easing: Easing.out(Easing.cubic),
                useNativeDriver: true
            }),
            Animated.timing(backdropOpacity, {
                toValue: 1,
                duration: 300,
                useNativeDriver: true
            })
        ]).start()
    }, [translateY, backdropOpacity, sheetOpacity, contentHeight])

    const animateOut = useCallback(
        (cb?: () => void) => {
            Animated.parallel([
                Animated.timing(translateY, {
                    toValue: contentHeight || SCREEN_HEIGHT,
                    duration: 280,
                    easing: Easing.in(Easing.cubic),
                    useNativeDriver: true
                }),
                Animated.timing(backdropOpacity, {
                    toValue: 0,
                    duration: 260,
                    useNativeDriver: true
                })
            ]).start(({ finished }) => {
                if (finished) {
                    sheetOpacity.setValue(0)
                    cb?.()
                }
            })
        },
        [translateY, backdropOpacity, sheetOpacity, contentHeight]
    )

    // Chỉ animate-in MỘT lần, sau khi đã đo xong chiều cao
    useEffect(() => {
        if (visible && contentHeight > 0 && !didAnimateIn.current) {
            didAnimateIn.current = true
            animateIn()
        }
        if (!visible) {
            didAnimateIn.current = false
        }
    }, [visible, contentHeight, animateIn])

    const handleClose = useCallback(() => {
        animateOut(onClose)
    }, [animateOut, onClose])

    const panResponder = useRef(
        PanResponder.create({
            onStartShouldSetPanResponder: () => true,
            onMoveShouldSetPanResponder: (_, g) => Math.abs(g.dy) > 4,
            onPanResponderGrant: () => {
                lastY.current = currentY.current
            },
            onPanResponderMove: (_, g) => {
                const next = lastY.current + g.dy
                translateY.setValue(Math.max(0, next))
            },
            onPanResponderRelease: (_, g) => {
                if (g.dy > DISMISS_THRESHOLD || g.vy > 0.5) {
                    animateOut(onClose)
                } else {
                    Animated.spring(translateY, {
                        toValue: 0,
                        useNativeDriver: true,
                        damping: 20,
                        stiffness: 200
                    }).start()
                }
            }
        })
    ).current

    if (!visible) return null

    return (
        <Modal transparent visible={visible} animationType='none' statusBarTranslucent onRequestClose={handleClose}>
            <Animated.View style={[styles.backdrop, { backgroundColor: 'rgba(0,0,0,0.45)', opacity: backdropOpacity }]}>
                <Pressable style={StyleSheet.absoluteFill} onPress={handleClose} />
            </Animated.View>

            <Animated.View
                style={[styles.sheet, { opacity: sheetOpacity, transform: [{ translateY }] }]}
                className='bg-background'
            >
                <View style={styles.handleArea} {...panResponder.panHandlers}>
                    <View style={styles.handle} />
                </View>

                <View onLayout={handleLayout}>{children}</View>
            </Animated.View>
        </Modal>
    )
}

const styles = StyleSheet.create({
    backdrop: {
        ...StyleSheet.absoluteFill
    },
    sheet: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: -3 },
        shadowOpacity: 0.12,
        shadowRadius: 12,
        elevation: 24
    },
    handleArea: {
        height: DRAG_INDICATOR_HEIGHT,
        alignItems: 'center',
        justifyContent: 'center'
    },
    handle: {
        width: 36,
        height: 4,
        borderRadius: 2,
        backgroundColor: '#D1D5DB'
    }
})

export default BottomSheetModal
