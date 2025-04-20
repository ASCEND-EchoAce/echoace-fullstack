import APIWrapper from './APIWrapper';

export class interviewAPI {
  public static async getInterview(userId: string): Promise<Interview[]> {
    const response = await APIWrapper.get(`/interviews/user/${userId}`);
    return response;
  }

  public static async createInterview(interview: Interview): Promise<Interview> {
    const response = await APIWrapper.post('/interviews', { ...interview });
    return response;
  }
}
