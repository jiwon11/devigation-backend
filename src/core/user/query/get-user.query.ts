export class GetUserQuery {
  constructor(public readonly userId: string) {}
}

export class GetUserByUsernameQuery {
  constructor(public readonly username: string) {}
}

export class GetUserByEmailQuery {
  constructor(public readonly email: string) {}
}