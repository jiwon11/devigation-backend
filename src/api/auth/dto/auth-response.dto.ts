import { ApiProperty } from '@nestjs/swagger';

export class TokenResponseDto {
  @ApiProperty()
  accessToken!: string;

  @ApiProperty()
  refreshToken!: string;

  @ApiProperty()
  expiresIn!: number;

  @ApiProperty()
  tokenType!: string;
}

export class AuthUserDto {
  @ApiProperty()
  id!: string;

  @ApiProperty()
  email!: string;

  @ApiProperty()
  username!: string;

  @ApiProperty({ nullable: true })
  displayName!: string | null;

  @ApiProperty({ nullable: true })
  avatarUrl!: string | null;

  @ApiProperty()
  isEmailVerified!: boolean;
}

export class AuthResponseDto {
  @ApiProperty({ type: TokenResponseDto })
  tokens!: TokenResponseDto;

  @ApiProperty({ type: AuthUserDto })
  user!: AuthUserDto;
}
