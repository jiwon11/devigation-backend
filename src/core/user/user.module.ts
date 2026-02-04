import { Module } from '@nestjs/common';
import { CreateUserUseCase } from './command/create-user.usecase';
import { UpdateProfileUseCase } from './command/update-profile.usecase';
import { FollowUserUseCase } from './command/follow-user.usecase';
import { GetUserUseCase } from './query/get-user.usecase';
import { GetFollowersUseCase } from './query/get-followers.usecase';
import { UserService } from './service/user.service';

@Module({
  providers: [
    CreateUserUseCase,
    UpdateProfileUseCase,
    FollowUserUseCase,
    GetUserUseCase,
    GetFollowersUseCase,
    UserService,
  ],
  exports: [
    CreateUserUseCase,
    UpdateProfileUseCase,
    FollowUserUseCase,
    GetUserUseCase,
    GetFollowersUseCase,
    UserService,
  ],
})
export class UserModule {}