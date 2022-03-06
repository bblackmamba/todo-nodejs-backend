export interface SignUpPayload {name: string; login: string; password: string}
export interface UserRecordPayload {id: number, name: string, login: string, password_hash: string, salt: string}
export interface UserJwtPayload {id: number, name: string; login: string}
