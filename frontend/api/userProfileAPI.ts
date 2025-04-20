import APIWrapper from './APIWrapper';

export class UserProfileAPI {
  public static async getUserProfile(userId: string): Promise<UserProfile> {
    const response = await APIWrapper.get(`/user-profiles/${userId}`);
    return response;
  }

  public static async createUserProfile(profile: Partial<UserProfile>): Promise<UserProfile> {
    const response = await APIWrapper.post('/user-profiles', profile);
    return response;
  }

  public static async updateUserProfile(profile: Partial<UserProfile>): Promise<UserProfile> {
    const response = await APIWrapper.put(`/user-profiles/${profile.user_fid}`, profile);
    return response;
  }
}
