import { SWRConfig } from 'swr'

interface Props {
    children: React.ReactNode
}

const SwrProvider: React.FC<Props> = (props) => {
    return (
        <SWRConfig
            value={{
                loadingTimeout: 5000,
                shouldRetryOnError: false,
                revalidateOnFocus: false
            }}
        >
            {props.children}
        </SWRConfig>
    )
}

export default SwrProvider
