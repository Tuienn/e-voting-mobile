import 'react-native-get-random-values'
import { gcm } from '@noble/ciphers/aes.js'
import { bytesToUtf8, utf8ToBytes } from '@noble/ciphers/utils.js'
import { pbkdf2 } from '@noble/hashes/pbkdf2.js'
import { sha256 } from '@noble/hashes/sha2.js'
import { bytesToHex, hexToBytes, randomBytes } from '@noble/hashes/utils.js'

//NOTE - Mã hóa zero-knowledge: khóa dẫn từ PIN bằng PBKDF2-SHA256 (100000 vòng) → AES-256-GCM.
// Server chỉ lưu envelope dạng JSON string (mờ), KHÔNG biết PIN nên không thể giải.

const PBKDF2_ITERATIONS = 100000
const KEY_LENGTH = 32 // AES-256
const SALT_LENGTH = 16
const IV_LENGTH = 12 // GCM nonce

const BACKUP_ENVELOPE_VERSION = 1

interface BackupEnvelope {
    v: number
    kdf: { algo: 'PBKDF2-SHA256'; iter: number; salt: string } // salt hex
    enc: { algo: 'AES-256-GCM'; iv: string; ct: string } // iv + ciphertext(+tag) hex
}

const deriveKey = (pin: string, salt: Uint8Array): Uint8Array =>
    pbkdf2(sha256, utf8ToBytes(pin), salt, { c: PBKDF2_ITERATIONS, dkLen: KEY_LENGTH })

//NOTE - Mã hóa object plaintext thành envelope JSON string để đẩy lên server.
export const encryptBackup = (plaintextObj: unknown, pin: string): string => {
    const salt = randomBytes(SALT_LENGTH)
    const iv = randomBytes(IV_LENGTH)
    const key = deriveKey(pin, salt)
    const ct = gcm(key, iv).encrypt(utf8ToBytes(JSON.stringify(plaintextObj)))

    const envelope: BackupEnvelope = {
        v: BACKUP_ENVELOPE_VERSION,
        kdf: { algo: 'PBKDF2-SHA256', iter: PBKDF2_ITERATIONS, salt: bytesToHex(salt) },
        enc: { algo: 'AES-256-GCM', iv: bytesToHex(iv), ct: bytesToHex(ct) }
    }

    return JSON.stringify(envelope)
}

//NOTE - Giải mã envelope. PIN sai ⇒ GCM auth fail ⇒ ném 'Mã PIN không đúng'.
export const decryptBackup = <T = unknown>(payload: string, pin: string): T => {
    let envelope: BackupEnvelope
    try {
        envelope = JSON.parse(payload)
    } catch {
        throw new Error('Dữ liệu sao lưu không hợp lệ')
    }

    const key = deriveKey(pin, hexToBytes(envelope.kdf.salt))

    let plaintext: Uint8Array
    try {
        plaintext = gcm(key, hexToBytes(envelope.enc.iv)).decrypt(hexToBytes(envelope.enc.ct))
    } catch {
        throw new Error('Mã PIN không đúng')
    }

    return JSON.parse(bytesToUtf8(plaintext)) as T
}
