import { AggregateRoot } from '@domain/shared/aggregate-root';
import { UserId } from './user-id';
import { Email } from './email';
import { Username } from './username';
import { Profile } from './profile';
import { AuthProvider, UserRole, UserStatus } from './user.enum';

interface UserProps {
  email: Email;
  username: Username;
  profile: Profile;
  role: UserRole;
  status: UserStatus;
  providers: AuthProvider[];
  providerId: string | null;
  followerCount: number;
  followingCount: number;
  roadmapCount: number;
  postCount: number;
}

export class User extends AggregateRoot<UserProps, UserId> {
  private constructor(id: UserId, props: UserProps, createdAt?: Date) {
    super(id, props, createdAt);
  }

  // Getters
  get email(): Email {
    return this.props.email;
  }

  get username(): Username {
    return this.props.username;
  }

  get profile(): Profile {
    return this.props.profile;
  }

  get role(): UserRole {
    return this.props.role;
  }

  get status(): UserStatus {
    return this.props.status;
  }

  get providers(): readonly AuthProvider[] {
    return Object.freeze([...this.props.providers]);
  }

  get providerId(): string | null {
    return this.props.providerId;
  }

  get followerCount(): number {
    return this.props.followerCount;
  }

  get followingCount(): number {
    return this.props.followingCount;
  }

  get roadmapCount(): number {
    return this.props.roadmapCount;
  }

  get postCount(): number {
    return this.props.postCount;
  }

  // Factory method
  static create(params: {
    id?: UserId;
    email: string;
    username: string;
    provider: AuthProvider;
    providerId: string;
    profile?: Partial<{
      displayName: string;
      bio: string;
      avatarUrl: string;
      githubUrl: string;
      websiteUrl: string;
      location: string;
      company: string;
    }>;
  }): User {
    const id = params.id ?? UserId.generate();
    return new User(id, {
      email: Email.create(params.email),
      username: Username.create(params.username),
      profile: Profile.create(params.profile ?? {}),
      role: UserRole.USER,
      status: UserStatus.ACTIVE,
      providers: [params.provider],
      providerId: params.providerId,
      followerCount: 0,
      followingCount: 0,
      roadmapCount: 0,
      postCount: 0,
    });
  }

  // Reconstitute from persistence
  static reconstitute(
    id: UserId,
    props: UserProps,
    createdAt: Date,
  ): User {
    return new User(id, props, createdAt);
  }

  // Domain methods
  updateProfile(profile: Partial<{
    displayName: string | null;
    bio: string | null;
    avatarUrl: string | null;
    githubUrl: string | null;
    websiteUrl: string | null;
    location: string | null;
    company: string | null;
  }>): void {
    this.props.profile = this.props.profile.update(profile);
    this.markUpdated();
  }

  changeUsername(newUsername: string): void {
    this.props.username = Username.create(newUsername);
    this.markUpdated();
  }

  addProvider(provider: AuthProvider): void {
    if (!this.props.providers.includes(provider)) {
      this.props.providers.push(provider);
      this.markUpdated();
    }
  }

  activate(): void {
    this.props.status = UserStatus.ACTIVE;
    this.markUpdated();
  }

  deactivate(): void {
    this.props.status = UserStatus.INACTIVE;
    this.markUpdated();
  }

  ban(): void {
    this.props.status = UserStatus.BANNED;
    this.markUpdated();
  }

  promoteToAdmin(): void {
    this.props.role = UserRole.ADMIN;
    this.markUpdated();
  }

  incrementFollowerCount(): void {
    this.props.followerCount += 1;
  }

  decrementFollowerCount(): void {
    if (this.props.followerCount > 0) {
      this.props.followerCount -= 1;
    }
  }

  incrementFollowingCount(): void {
    this.props.followingCount += 1;
  }

  decrementFollowingCount(): void {
    if (this.props.followingCount > 0) {
      this.props.followingCount -= 1;
    }
  }

  incrementRoadmapCount(): void {
    this.props.roadmapCount += 1;
  }

  decrementRoadmapCount(): void {
    if (this.props.roadmapCount > 0) {
      this.props.roadmapCount -= 1;
    }
  }

  incrementPostCount(): void {
    this.props.postCount += 1;
  }

  decrementPostCount(): void {
    if (this.props.postCount > 0) {
      this.props.postCount -= 1;
    }
  }

  isActive(): boolean {
    return this.props.status === UserStatus.ACTIVE;
  }

  isAdmin(): boolean {
    return this.props.role === UserRole.ADMIN;
  }
}