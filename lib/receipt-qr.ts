import base64url from 'base64url'

//NOTE - Biên lai (receipt) tham khảo e-voting-app/src/utils/receiptQr.ts nhưng:
// - encode bằng base64url lib (thay cho @scure/base)
// - rút gọn payload chỉ còn {voteId, electionId, blindedCommitment, blockchainRef}
//   (kèm marker v/type để loại trừ QR lạ). Việc đối chiếu tính hợp lệ thật sự do server verify đảm nhiệm.

export interface Receipt {
    v: 1
    type: 'vote-receipt'
    voteId: string
    electionId: string
    blindedCommitment: string
    blockchainRef: string
}

type JsonValue = string | number | boolean | null | JsonValue[] | { [key: string]: JsonValue | undefined }

//NOTE - Canonical JSON: sort key + bỏ field undefined (giống bản web để 2 phía sinh chuỗi giống nhau)
export function canonicalJson(value: JsonValue): string {
    if (value === null || typeof value !== 'object') return JSON.stringify(value)
    if (Array.isArray(value)) return `[${value.map((item) => canonicalJson(item)).join(',')}]`

    const entries = Object.entries(value)
        .filter(([, item]) => item !== undefined)
        .sort(([a], [b]) => a.localeCompare(b))

    return `{${entries.map(([key, item]) => `${JSON.stringify(key)}:${canonicalJson(item as JsonValue)}`).join(',')}}`
}

export function buildReceipt(input: {
    voteId: string
    electionId: string
    blindedCommitment: string
    blockchainRef: string
}): Receipt {
    return {
        v: 1,
        type: 'vote-receipt',
        voteId: input.voteId,
        electionId: input.electionId,
        blindedCommitment: input.blindedCommitment.toLowerCase(),
        blockchainRef: input.blockchainRef
    }
}

export function encodeReceipt(receipt: Receipt): string {
    return base64url.encode(canonicalJson(receipt as unknown as JsonValue))
}

//NOTE - Hỗ trợ cả deep link (evote://verify?receipt=...) lẫn payload thô
export function extractReceiptParam(input: string): string {
    const trimmed = input.trim()
    if (!trimmed) throw new Error('Thiếu dữ liệu biên lai')

    try {
        if (trimmed.includes('://')) {
            const url = new URL(trimmed)
            const receipt = url.searchParams.get('receipt')
            if (!receipt) throw new Error('Deep link biên lai thiếu tham số receipt')
            return receipt
        }
    } catch {
        const match = trimmed.match(/[?&]receipt=([^&]+)/)
        if (match?.[1]) return decodeURIComponent(match[1])
        throw new Error('Mã QR không hợp lệ')
    }

    return trimmed
}

export function parseReceipt(input: string): Receipt {
    let parsed: Partial<Receipt>
    try {
        const receiptParam = extractReceiptParam(input)
        parsed = JSON.parse(base64url.decode(receiptParam)) as Partial<Receipt>
    } catch {
        throw new Error('Mã QR không hợp lệ')
    }

    if (
        parsed.v !== 1 ||
        parsed.type !== 'vote-receipt' ||
        typeof parsed.voteId !== 'string' ||
        typeof parsed.electionId !== 'string' ||
        typeof parsed.blindedCommitment !== 'string' ||
        typeof parsed.blockchainRef !== 'string'
    ) {
        throw new Error('Mã QR không hợp lệ')
    }

    return buildReceipt({
        voteId: parsed.voteId,
        electionId: parsed.electionId,
        blindedCommitment: parsed.blindedCommitment,
        blockchainRef: parsed.blockchainRef
    })
}
