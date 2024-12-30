import { Contest } from '../types/contest';
import { fetchWithRetry } from './fetchWithRetry';

const CODEFORCES_API = 'https://codeforces.com/api/contest.list';

export async function fetchCodeforcesContests(): Promise<Contest[]> {
  try {
    const data = await fetchWithRetry(CODEFORCES_API);

    // Validate API response structure
    if (!data?.result || !Array.isArray(data.result)) {
      throw new Error('Unexpected API response structure');
    }

    // Process and filter contests
    return data.result
      .filter((contest: any) => contest.phase === 'BEFORE') // Only upcoming contests
      .map((contest: any) => ({
        name: contest.name,
        url: `https://codeforces.com/contest/${contest.id}`,
        start_time: new Date(contest.startTimeSeconds * 1000).toISOString(),
        end_time: new Date(
          (contest.startTimeSeconds + contest.durationSeconds) * 1000
        ).toISOString(),
        duration: contest.durationSeconds.toString(),
        site: 'Codeforces',
        in_24_hours: 
          contest.relativeTimeSeconds !== undefined &&
          contest.relativeTimeSeconds <= 86400
            ? 'Yes'
            : 'No',
        status: 'BEFORE',
      }));
  } catch (error) {
    console.error('Error fetching Codeforces contests:', error);
    throw error; // Rethrow the error to handle it further upstream
  }
}



/*
* Codeforces API response structure
{
  "status": "OK",
  "result": [
    {
      "id": 2056,
      "name": "Codeforces Round (Div. 2)",
      "type": "CF",
      "phase": "BEFORE",
      "frozen": false,
      "durationSeconds": 7200,
      "startTimeSeconds": 1737124500,
      "relativeTimeSeconds": -1556827
    },
    {
      "id": 2055,
      "name": "Codeforces Round (Div. 2)",
      "type": "CF",
      "phase": "BEFORE",
      "frozen": false,
      "durationSeconds": 7200,
      "startTimeSeconds": 1736692500,
      "relativeTimeSeconds": -1124827
    },
*/