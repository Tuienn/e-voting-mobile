import { ScrollDirectionContext, ScrollDirectionType } from '@/components/providers/scroll-direction-provider'
import { useContext } from 'react'

export function useScrollDirection(): ScrollDirectionType {
    const context = useContext(ScrollDirectionContext)
    if (context === undefined) {
        throw new Error('useScrollDirection must be used within a ScrollDirectionProvider')
    }
    return context
}
