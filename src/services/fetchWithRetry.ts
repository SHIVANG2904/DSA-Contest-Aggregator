import { API_CONFIG } from '../config/api';
import { delay } from '../utils/delay';
import { APIError } from '../utils/errorHandling';

export async function fetchWithRetry(url: string, retries = API_CONFIG.MAX_RETRIES): Promise<any> {
  try {
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
      },
      mode: 'cors',
    });

    if (!response.ok) {
      if (response.status === 429 && retries > 0) {
        await delay(API_CONFIG.RETRY_DELAY * 2);
        return fetchWithRetry(url, retries- 1);
      }
      throw new APIError(`Failed to fetch contests (Status: ${response.status})`, response.status);
    }

    return await response.json();
  } catch (error) {
    if (error instanceof APIError) {
      throw error;
    }
    
    if (retries > 0) {
      await delay(API_CONFIG.RETRY_DELAY);
      return fetchWithRetry(url, retries - 1);
    }

    throw new APIError(
      'Failed to fetch contests. Please check your internet connection.',
      undefined,
      API_CONFIG.MAX_RETRIES
    );
  }
}