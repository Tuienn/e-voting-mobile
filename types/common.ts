export interface ApiResponse<T> {
    data: T
    message: string
    statusCode: number
    title?: string
}

export interface ApiEmptyResponse {
    data?: never
    message: string
    statusCode: number
    title?: string
}

export type QueryParams = Record<string, unknown>
