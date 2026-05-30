import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion'
import { Icon } from '@/components/ui/icon'
import { Text } from '@/components/ui/text'
import { encodeReceipt, Receipt } from '@/lib/receipt-qr'
import { cn } from '@/lib/utils'
import VoteService from '@/services/bff/vote.service'
import { VerifyReceiptResult } from '@/types/verify'
import { AlertCircleIcon, CheckCircle2Icon, LoaderIcon, XCircleIcon } from 'lucide-react-native'
import { View } from 'react-native'
import QRCode from 'react-native-qrcode-svg'
import useSWR from 'swr'

interface Props {
    receipt: Receipt
}

function DetailRow({ label, value }: { label: string; value: boolean }) {
    return (
        <View className='flex-row items-center gap-2 pt-0.5'>
            <Icon
                as={value ? CheckCircle2Icon : XCircleIcon}
                size={13}
                className={value ? 'text-green-600 dark:text-green-400' : 'text-destructive'}
            />
            <Text className='text-muted-foreground text-sm'>{label}</Text>
        </View>
    )
}

function SectionItem({
    value,
    valid,
    title,
    description,
    children
}: {
    value: string
    valid: boolean
    title: string
    description: string
    children: React.ReactNode
}) {
    return (
        <AccordionItem
            value={value}
            className={cn(
                'mb-2 rounded-lg border',
                valid
                    ? 'border-green-300 bg-green-50 dark:border-green-700 dark:bg-green-900/20'
                    : 'border-destructive/50 bg-destructive/10 dark:bg-destructive/20'
            )}
        >
            <AccordionTrigger className='px-4'>
                <View className='flex-1 flex-row items-center gap-2'>
                    <Icon
                        as={valid ? CheckCircle2Icon : XCircleIcon}
                        size={16}
                        className={valid ? 'text-green-600 dark:text-green-400' : 'text-destructive'}
                    />
                    <Text
                        className={cn(
                            'text-sm leading-none font-medium tracking-tight',
                            valid ? 'text-green-600 dark:text-green-400' : 'text-destructive'
                        )}
                    >
                        {title} - {description}
                    </Text>
                </View>
            </AccordionTrigger>
            <AccordionContent className='px-4'>{children}</AccordionContent>
        </AccordionItem>
    )
}

const ReceiptResult: React.FC<Props> = ({ receipt }) => {
    const { data, error, isLoading } = useSWR(
        `verify/${receipt.voteId}/${receipt.blindedCommitment}`,
        () =>
            VoteService.verifyReceipt(receipt.voteId, {
                electionId: receipt.electionId,
                blindedCommitment: receipt.blindedCommitment,
                blockchainRef: receipt.blockchainRef
            }),
        { revalidateOnFocus: false }
    )

    const result: VerifyReceiptResult | undefined = data?.data

    return (
        <View className='gap-3'>
            <View className='bg-card border-border items-center gap-2 rounded-lg border p-4'>
                <View className='rounded-lg bg-white p-3'>
                    <QRCode value={encodeReceipt(receipt)} size={220} />
                </View>
                <Text variant='muted' className='text-center text-sm'>
                    Mã QR biên lai phiếu bầu
                </Text>
            </View>

            {isLoading ? (
                <Alert icon={LoaderIcon} variant='info'>
                    <AlertTitle>Đang xác minh…</AlertTitle>
                    <AlertDescription>Đang đối chiếu biên lai với dữ liệu công khai.</AlertDescription>
                </Alert>
            ) : error ? (
                <Alert icon={AlertCircleIcon} variant='destructive'>
                    <AlertTitle>Không thể xác minh phiếu</AlertTitle>
                    <AlertDescription>{(error as Error).message}</AlertDescription>
                </Alert>
            ) : result ? (
                <Accordion type='multiple' defaultValue={[]}>
                    <SectionItem
                        value='db'
                        valid={result.db.valid}
                        title='Cơ sở dữ liệu'
                        description={result.db.valid ? 'Khớp' : 'Không khớp'}
                    >
                        <DetailRow label='Tồn tại' value={result.db.exist} />
                        <DetailRow label='Phiếu bầu khớp' value={result.db.voteIdMatch} />
                        <DetailRow label='Cam kết khớp' value={result.db.commitmentMatch} />
                        <DetailRow label='Tham chiếu blockchain khớp' value={result.db.blockchainRefMatch} />
                    </SectionItem>

                    <SectionItem
                        value='chain'
                        valid={result.chain.valid}
                        title='Blockchain'
                        description={result.chain.valid ? 'Khớp' : 'Không khớp'}
                    >
                        <DetailRow label='Tồn tại trên blockchain' value={result.chain.exist} />
                        <DetailRow label='Tham chiếu blockchain khớp' value={result.chain.txIdMatch} />
                        <DetailRow label='Cam kết khớp' value={result.chain.commitmentMatch} />
                        {result.chain.error && (
                            <Text className='text-destructive mt-1 text-xs'>{result.chain.error}</Text>
                        )}
                    </SectionItem>

                    <SectionItem
                        value='merkle'
                        valid={result.merkle.valid}
                        title='Merkle Tree'
                        description={
                            result.merkle.valid ? 'Khớp' : result.merkle.applicable ? 'Không khớp' : 'Không áp dụng'
                        }
                    >
                        <DetailRow label='Tham chiếu cơ sở dữ liệu khớp' value={result.merkle.rootMatchesDB} />
                        <DetailRow label='Tham chiếu blockchain khớp' value={result.merkle.rootMatchesChain} />
                        <DetailRow
                            label='Phiếu bầu thuộc Merkle Tree từ cơ sở dữ liệu'
                            value={result.merkle.proofValid}
                        />
                        <DetailRow
                            label='Phiếu bầu thuộc Merkle Tree từ blockchain'
                            value={result.merkle.chainProofValid}
                        />
                        {result.merkle.getMerkleRootChainError && (
                            <Text className='text-destructive mt-1 text-xs'>
                                {result.merkle.getMerkleRootChainError}
                            </Text>
                        )}
                        {result.merkle.verifyProofChainError && (
                            <Text className='text-destructive mt-1 text-xs'>{result.merkle.verifyProofChainError}</Text>
                        )}
                    </SectionItem>
                </Accordion>
            ) : null}
        </View>
    )
}

export default ReceiptResult
