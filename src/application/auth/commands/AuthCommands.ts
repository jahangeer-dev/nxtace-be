export class LoginCommand {
  constructor(
    public readonly email: string,
    public readonly password: string
  ) {}
}

export class RegisterCommand {
  constructor(
    public readonly email: string,
    public readonly password: string,
    public readonly name?: string
  ) {}
}

export class RefreshTokenCommand {
  constructor(
    public readonly refreshToken: string,
    public readonly userId: string
  ) {}
}

export class LogoutCommand {
  constructor(
    public readonly userId: string
  ) {}
}

export class GoogleAuthCommand {
  constructor(
    public readonly profile: any
  ) {}
}
