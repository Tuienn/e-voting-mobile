import 'react-native-get-random-values'
import { secp256k1 } from '@noble/curves/secp256k1.js'
import { sha256 } from '@noble/hashes/sha2.js'
import { bytesToHex, randomBytes } from '@noble/hashes/utils.js'

const SCALAR_BYTES = 32

const VOTE_DOMAIN = 'ev-vote-v2'

type EcPoint = ReturnType<typeof secp256k1.Point.fromHex>

interface BlindResult {
    r: bigint
    alpha: bigint
    beta: bigint
    h: bigint
    Cprime: EcPoint
}

export function getParams() {
    return {
        n: secp256k1.Point.CURVE().n,
        G: secp256k1.Point.BASE,
        Point: secp256k1.Point
    }
}

export function modN(a: bigint, n: bigint): bigint {
    const r = a % n
    return r < 0n ? r + n : r
}

export function bytesToBigInt(bytes: Uint8Array): bigint {
    let n = 0n
    for (const b of bytes) n = (n << 8n) | BigInt(b)
    return n
}

export function bigIntToBytes(value: bigint, byteLen: number): Uint8Array {
    if (value < 0n) throw new Error('Negative bigint is not valid')
    const out = new Uint8Array(byteLen)
    let v = value

    for (let i = byteLen - 1; i >= 0; i--) {
        out[i] = Number(v & 0xffn)
        v >>= 8n
    }

    if (v !== 0n) throw new Error('Bigint exceeds target byte length')
    return out
}

export function randomScalar(n: bigint): bigint {
    while (true) {
        const candidate = modN(bytesToBigInt(randomBytes(SCALAR_BYTES + 8)), n)
        if (candidate !== 0n) return candidate
    }
}

export function scalarToHex(scalar: bigint): string {
    return bytesToHex(bigIntToBytes(scalar, SCALAR_BYTES))
}

export function hexToScalar(hex: string): bigint {
    const clean = hex.startsWith('0x') ? hex.slice(2) : hex
    return BigInt(`0x${clean}`)
}

export function scalarToBuffer(scalar: bigint): Uint8Array {
    return bigIntToBytes(scalar, SCALAR_BYTES)
}

export function pointToBuffer(point: EcPoint): Uint8Array {
    return point.toBytes(true)
}

export function hexToPoint(hex: string): EcPoint {
    const params = getParams()
    const point = params.Point.fromHex(hex)
    point.assertValidity()

    if (point.equals(params.Point.ZERO)) {
        throw new Error('Point is identity element')
    }

    return point
}

export function hashToScalar(buffers: Uint8Array[], n: bigint): bigint {
    const total = buffers.reduce((acc, item) => acc + item.length, 0)
    const input = new Uint8Array(total)
    let offset = 0

    for (const item of buffers) {
        input.set(item, offset)
        offset += item.length
    }

    return modN(bytesToBigInt(sha256(input)), n)
}

export function canonicalizeCandidateIds(ids: string[]): string[] {
    return [...new Set(ids)].sort()
}

export function canonicalCandidateIdsPayload(ids: string[]): string {
    return JSON.stringify(canonicalizeCandidateIds(ids))
}

export function buildVoteMessage(electionId: string, candidateIds: string[]): Uint8Array {
    const enc = new TextEncoder()
    const sep = new Uint8Array([0])
    const payload = canonicalCandidateIdsPayload(candidateIds)
    const parts = [enc.encode(VOTE_DOMAIN), sep, enc.encode(electionId), sep, enc.encode(payload)]
    const total = parts.reduce((acc, item) => acc + item.length, 0)
    const buf = new Uint8Array(total)
    let offset = 0

    for (const part of parts) {
        buf.set(part, offset)
        offset += part.length
    }

    return sha256(buf)
}

export function blind(message: Uint8Array, C: EcPoint, Pagg: EcPoint): BlindResult {
    const params = getParams()
    const alpha = randomScalar(params.n)
    const beta = randomScalar(params.n)
    const Cprime = C.add(params.G.multiply(alpha)).add(Pagg.multiply(beta))
    const h = hashToScalar([message, pointToBuffer(Cprime)], params.n)
    const r = modN(h - beta, params.n)

    return { r, alpha, beta, h, Cprime }
}

export function unblind(s: bigint, alpha: bigint, h: bigint) {
    const params = getParams()
    return { h, sPrime: modN(s + alpha, params.n) }
}

export function verify(message: Uint8Array, h: bigint, sPrime: bigint, Pagg: EcPoint): boolean {
    const params = getParams()
    const cCheck = params.G.multiply(sPrime).add(Pagg.multiply(h))
    const hCheck = hashToScalar([message, pointToBuffer(cCheck)], params.n)

    return h === hCheck
}

export function computeBlindedCommitment(Cprime: EcPoint): string {
    return bytesToHex(sha256(pointToBuffer(Cprime)))
}

export function computeRevealKey(h: bigint, sPrime: bigint): string {
    const buf = new Uint8Array(SCALAR_BYTES * 2)
    buf.set(scalarToBuffer(h), 0)
    buf.set(scalarToBuffer(sPrime), SCALAR_BYTES)
    return bytesToHex(sha256(buf))
}

export function sha256Hex(input: Uint8Array): string {
    return bytesToHex(sha256(input))
}
