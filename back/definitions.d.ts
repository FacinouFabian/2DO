interface UserPayload {
  id: number
  firstname: string
}

declare namespace Express {
  export interface Request {
    user?: UserPayload
  }
}
