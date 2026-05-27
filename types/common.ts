export interface BffResponse<T> {
    data: T
    message: string
    statusCode: number
    title?: string
}

export interface BffEmptyResponse {
    data?: never
    message: string
    statusCode: number
    title?: string
}

export type QueryParams = Record<string, unknown>
