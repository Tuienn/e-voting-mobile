import { type BottomTabBarProps } from '@react-navigation/bottom-tabs'
import { ScanQrCodeIcon, VoteIcon } from 'lucide-react-native'
import FloatingNavBar from './floating-nav-bar'
import { SharedValue } from 'react-native-reanimated'
import { NavItem } from './floating-nav-item'
import { THEME } from '@/lib/theme'
import { useUniwind } from 'uniwind'

interface Props extends BottomTabBarProps {
    navVisible: SharedValue<number>
}

const CustomTabBar: React.FC<Props> = ({ state, navigation, navVisible }) => {
    const { theme } = useUniwind()

    const ROUTE_ICONS: Record<string, { icon: React.ReactNode; label: string }> = {
        election: { icon: <VoteIcon color={THEME[theme].primary} />, label: 'Bỏ phiếu' },
        verify: { icon: <ScanQrCodeIcon color={THEME[theme].primary} />, label: 'Quét mã' }
    }

    const activeRoute = state.routes[state.index]

    const items: NavItem[] = state.routes.map((route) => {
        const meta = ROUTE_ICONS[route.name]

        return {
            key: route.key,
            label: meta?.label ?? route.name,
            icon: meta?.icon ?? null,
            onPress: () => {
                // Emit tabPress event chuẩn (hỗ trợ tab re-press to scroll-to-top)
                const event = navigation.emit({
                    type: 'tabPress',
                    target: route.key,
                    canPreventDefault: true
                })
                if (!event.defaultPrevented) {
                    navigation.navigate(route.name, route.params)
                }
            },
            isPrimary: route.key === activeRoute.key
        }
    })

    return <FloatingNavBar items={items} navVisible={navVisible} />
}

export default CustomTabBar
