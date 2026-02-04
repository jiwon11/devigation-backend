import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '../../prisma/prisma.service';

export interface OAuthProfile {
  provider: string;
  providerId: string;
  email: string;
  username: string;
  displayName?: string;
  avatarUrl?: string;
}

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
  ) {}

  async validateOAuthUser(profile: OAuthProfile) {
    let user = await this.prisma.user.findFirst({
      where: {
        OR: [
          { email: profile.email },
          { provider: profile.provider, providerId: profile.providerId },
        ],
      },
    });

    if (!user) {
      // Create new user
      user = await this.prisma.user.create({
        data: {
          email: profile.email,
          username: await this.generateUniqueUsername(profile.username),
          displayName: profile.displayName,
          avatarUrl: profile.avatarUrl,
          provider: profile.provider,
          providerId: profile.providerId,
        },
      });
    } else if (!user.provider) {
      // Link OAuth provider to existing user
      user = await this.prisma.user.update({
        where: { id: user.id },
        data: {
          provider: profile.provider,
          providerId: profile.providerId,
          avatarUrl: profile.avatarUrl || user.avatarUrl,
        },
      });
    }

    return user;
  }

  async generateTokens(userId: string) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      throw new Error('User not found');
    }

    const payload = {
      sub: user.id,
      email: user.email,
      username: user.username,
    };

    const accessToken = this.jwtService.sign(payload);

    return {
      accessToken,
      user: {
        id: user.id,
        email: user.email,
        username: user.username,
        displayName: user.displayName,
        avatarUrl: user.avatarUrl,
      },
    };
  }

  private async generateUniqueUsername(baseUsername: string): Promise<string> {
    let username = baseUsername.toLowerCase().replace(/[^a-z0-9]/g, '');
    let counter = 0;

    while (true) {
      const existingUser = await this.prisma.user.findUnique({
        where: { username: counter === 0 ? username : `${username}${counter}` },
      });

      if (!existingUser) {
        return counter === 0 ? username : `${username}${counter}`;
      }

      counter++;
    }
  }
}
