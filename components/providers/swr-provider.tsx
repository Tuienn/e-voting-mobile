import { PropsWithChildren } from 'react'
import { SWRConfig } from 'swr'

const SwrProvider: React.FC<PropsWithChildren> = ({ children }) => {
    return (
        <SWRConfig
            value={{
                loadingTimeout: 5000,
                shouldRetryOnError: false
            }}
        >
            {children}
        </SWRConfig>
    )
}

export default SwrProvider
