export interface AuthResponse {
    accessToken: string;
    user: {
      id: number;
      email: string;
      firstName: string;
      lastName: string;
      jobTitle?: string;
      profileImage?: string;
      userBio?: string;
      socialLinks?: {
        github?: string;
        linkedin?: string;
        twitter?: string;
        portfolio?: string;
      };
    };
  }