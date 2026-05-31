import { getSocket } from '@/lib/socket'
import { VoteCommittedEvent, VoteRevealedEvent } from '@/types/socket'
import { useEffect } from 'react'
import { mutate } from 'swr'

type ElectionSocketEvent = 'committed' | 'revealed'

const useElectionSocket = (electionId?: string, events: ElectionSocketEvent[] = ['committed', 'revealed']) => {
    useEffect(() => {
        if (!electionId) {
            return
        }

        const socket = getSocket()

        const handleVoteCommitted = (event: VoteCommittedEvent) => {
            if (event.electionId !== electionId) {
                return
            }
            mutate(`election/${electionId}`)
        }

        const handleVoteRevealed = (event: VoteRevealedEvent) => {
            if (event.electionId !== electionId) {
                return
            }
            mutate(`tally/${electionId}`)
        }

        socket.emit('election:subscribe', { electionId })

        if (events.includes('committed')) socket.on('vote:committed', handleVoteCommitted)
        if (events.includes('revealed')) socket.on('vote:revealed', handleVoteRevealed)

        return () => {
            socket.emit('election:unsubscribe', { electionId })
            if (events.includes('committed')) socket.off('vote:committed', handleVoteCommitted)
            if (events.includes('revealed')) socket.off('vote:revealed', handleVoteRevealed)
        }
    }, [electionId, events])
}

export default useElectionSocket
