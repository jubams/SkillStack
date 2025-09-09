import { SocialLinks } from "../interfaces/socialLink.model";

export interface FindUserDto {
  firstName?: string;
  lastName?: string;
  jobTitle?: string;
  profileImage?: string;
  userBio?: string;
  socialLinks?: SocialLinks;
}