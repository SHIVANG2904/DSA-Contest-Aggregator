import { Contest } from '../types/contest';
import { fetchCodeforcesContests } from './codeforces';
// import { fetchCodechefContests } from './codechef';

export async function fetchAllContests(): Promise<Contest[]> {
  try {
    const [codeforcesContests] = await Promise.allSettled([
      fetchCodeforcesContests(),
      // fetchCodechefContests()
   
    ]);

    const allContests: Contest[] = [];

    if (codeforcesContests.status === 'fulfilled') {
      allContests.push(...codeforcesContests.value);
    }
    // if (codechefContests.status === 'fulfilled') {
    //   allContests.push(...codechefContests.value);
    // }

    return allContests.sort((a, b) => 
      new Date(a.start_time).getTime() - new Date(b.start_time).getTime()
    );
  } catch (error) {
    console.error('Error fetching contests:', error);
    throw error;
  }
}