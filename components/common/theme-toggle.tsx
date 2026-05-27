import { Uniwind, useUniwind } from 'uniwind'
import { Button } from '../ui/button'
import { Icon } from '../ui/icon'
import { MoonStarIcon, SunIcon } from 'lucide-react-native'

const THEME_ICONS = {
    light: SunIcon,
    dark: MoonStarIcon
}

const ThemeToggle = () => {
    const { theme } = useUniwind()

    function toggleTheme() {
        const newTheme = theme === 'dark' ? 'light' : 'dark'
        Uniwind.setTheme(newTheme)
    }

    return (
        <Button onPressIn={toggleTheme} size='icon' variant='ghost' className='rounded-full'>
            <Icon as={THEME_ICONS[theme ?? 'light']} />
        </Button>
    )
}

export default ThemeToggle
