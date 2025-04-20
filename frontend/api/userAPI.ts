import APIWrapper from './APIWrapper';

export class UserAPI {
  public static async getUser(userId: string): Promise<DBUser> {
    const response = await APIWrapper.get(`/users/${userId}`);
    return response;
  }

  public static async createUser(email: string, userId: string): Promise<DBUser> {
    const response = await APIWrapper.post('/users', { email, userId });

    return response.data;
  }
}
