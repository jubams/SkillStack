import { Expose, Type } from 'class-transformer';

class SocialLinksDto {
  @Expose()
  github?: string;

  @Expose()
  linkedin?: string;

  @Expose()
  twitter?: string;

  @Expose()
  portfolio?: string;
}

export class FindUserDto {
  @Expose()
  firstName?: string;

  @Expose()
  lastName?: string;

  @Expose()
  jobTitle?: string;

  @Expose()
  profileImage?: string;

  @Expose()
  userBio?: string;

  @Expose()
  @Type(() => SocialLinksDto)
  socialLinks?: SocialLinksDto;
}
