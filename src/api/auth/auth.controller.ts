import {
  Controller,
  Post,
  Body,
  HttpCode,
  HttpStatus,
  UseGuards,
  Get,
  Req,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { LoginCommand } from '@core/auth/commands/login.command';
import { RefreshTokenCommand } from '@core/auth/commands/refresh-token.command';
import { LogoutCommand } from '@core/auth/commands/logout.command';
import { CreateUserCommand } from '@core/user/commands/create-user.command';
import {
  LoginDto,
  SocialLoginDto,
  RefreshTokenDto,
  RegisterDto,
  AuthResponseDto,
  TokenResponseDto,
} from './dto';
import { JwtAuthGuard } from '@infrastructure/auth/guards/jwt-auth.guard';
import { CurrentUser } from '@common/decorators/current-user.decorator';
import { Public } from '@common/decorators/public.decorator';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(
    private readonly commandBus: CommandBus,
    private readonly queryBus: QueryBus,
  ) {}

  @Public()
  @Post('register')
  @ApiOperation({ summary: 'Register a new user' })
  @ApiResponse({ status: 201, type: AuthResponseDto })
  async register(@Body() dto: RegisterDto): Promise<AuthResponseDto> {
    const command = new CreateUserCommand(
      dto.email,
      dto.password,
      dto.username,
      dto.displayName,
    );
    const result = await this.commandBus.execute(command);

    if (result.isFailure()) {
      throw result.getError();
    }

    return result.getValue();
  }

  @Public()
  @Post('login')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Login with email and password' })
  @ApiResponse({ status: 200, type: AuthResponseDto })
  async login(@Body() dto: LoginDto): Promise<AuthResponseDto> {
    const command = new LoginCommand(dto.email, dto.password);
    const result = await this.commandBus.execute(command);

    if (result.isFailure()) {
      throw result.getError();
    }

    return result.getValue();
  }

  @Public()
  @Post('social-login')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Login with social provider' })
  @ApiResponse({ status: 200, type: AuthResponseDto })
  async socialLogin(@Body() dto: SocialLoginDto): Promise<AuthResponseDto> {
    const command = new LoginCommand(
      dto.provider,
      dto.accessToken,
      dto.refreshToken,
    );
    const result = await this.commandBus.execute(command);

    if (result.isFailure()) {
      throw result.getError();
    }

    return result.getValue();
  }

  @Public()
  @Post('refresh')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Refresh access token' })
  @ApiResponse({ status: 200, type: TokenResponseDto })
  async refresh(@Body() dto: RefreshTokenDto): Promise<TokenResponseDto> {
    const command = new RefreshTokenCommand(dto.refreshToken);
    const result = await this.commandBus.execute(command);

    if (result.isFailure()) {
      throw result.getError();
    }

    return result.getValue();
  }

  @UseGuards(JwtAuthGuard)
  @Post('logout')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Logout current user' })
  @ApiResponse({ status: 204 })
  async logout(@CurrentUser('id') userId: string): Promise<void> {
    const command = new LogoutCommand(userId);
    await this.commandBus.execute(command);
  }

  @UseGuards(JwtAuthGuard)
  @Get('me')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get current user info' })
  async me(@CurrentUser() user: any) {
    return user;
  }
}
