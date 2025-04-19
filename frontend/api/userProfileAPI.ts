import APIWrapper from './APIWrapper';

export class UserProfileAPI {
  public static async getUserProfile(userId: string): Promise<UserProfile> {
    const response = await APIWrapper.get(`/user-profile/${userId}`);
    return response.data;
  }

  public static async createUserProfile(profile: UserProfile): Promise<UserProfile> {
    const response = await APIWrapper.post('/user-profile', { ...profile });
    return response.data;
  }
}
