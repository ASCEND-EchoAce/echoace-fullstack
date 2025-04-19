import APIWrapper from './APIWrapper';

export class interviewAPI {
  public static async getInterview(userId: string): Promise<Interview> {
    const response = await APIWrapper.get(`/interview/user/${userId}`);
    return response.data;
  }

  public static async createInterview(interview: Interview): Promise<Interview> {
    const response = await APIWrapper.post('/interview', { ...interview });
    return response.data;
  }
}
