// @flow

export type User = {
  firstname: string,
  lastname: string,
  username: string,
  password: string,
  authentication: {
    sessionId: string,
    expiresAt: string,
  }
}