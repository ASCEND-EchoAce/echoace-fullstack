import APIWrapper from './APIWrapper';

export class UserAPI {
  public static async getUser(userId: string): Promise<User> {
    const response = await APIWrapper.get(`/user/${userId}`);

    return response.data;
  }

  public static async createUser(email: string): Promise<User> {
    const response = await APIWrapper.post('/user', { email });

    return response.data;
  }
}
