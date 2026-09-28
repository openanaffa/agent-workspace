export type Ok<T>  = { readonly _tag: 'Ok';  readonly value: T }
export type Err<E> = { readonly _tag: 'Err'; readonly error: E }
export type Result<T, E = Error> = Ok<T> | Err<E>

export const ok    = <T>(value: T): Ok<T>   => ({ _tag: 'Ok',  value })
export const err   = <E>(error: E): Err<E>  => ({ _tag: 'Err', error })
export const isOk  = <T, E>(r: Result<T, E>): r is Ok<T>  => r._tag === 'Ok'
export const isErr = <T, E>(r: Result<T, E>): r is Err<E> => r._tag === 'Err'
