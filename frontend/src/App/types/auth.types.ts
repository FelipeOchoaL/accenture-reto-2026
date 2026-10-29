export interface AsesorModule {
  code: string
  name: string
  window: string
  floor: string
}

export interface Asesor {
  id: string
  name: string
  email: string
  desk: string
  shift: string
  module: AsesorModule
}

export interface AuthSession {
  token: string
  user: Asesor
}

export interface LoginCredentials {
  email: string
  password: string
}
