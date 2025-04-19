const BASE_URL = 'http://localhost:8080/api';

export class APIWrapper {
  public static async get(path: string): Promise<any> {
    const response = await fetch(`${BASE_URL}${path}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
      }
    });

    return response.json();
  }

  public static async post(path: string, body: any): Promise<any> {
    const response = await fetch(`${BASE_URL}${path}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(body)
    });

    return response.json();
  }
  public static async put(path: string, body: any): Promise<any> {
    const response = await fetch(`${BASE_URL}${path}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(body)
    });

    return response.json();
  }
  public static async delete(path: string): Promise<any> {
    const response = await fetch(`${BASE_URL}${path}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json'
      }
    });

    return response.json();
  }
}
export default APIWrapper;
