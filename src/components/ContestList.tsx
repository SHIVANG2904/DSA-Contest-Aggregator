import  { useEffect, useState } from 'react';
import { Contest } from '../types/contest';
import { ContestCard } from './ContestCard';
import { fetchAllContests } from '../services/api';
import { getErrorMessage } from '../utils/errorHandling';
import { API_CONFIG } from '../config/api';
import { AlertCircle } from 'lucide-react';

export function ContestList() {
  const [contests, setContests] = useState<Contest[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadContests = async () => {
      try {
        const data = await fetchAllContests();
        setContests(data);
        setError(null);
      } catch (err) {
        setError(getErrorMessage(err));
        console.error('Contest loading error:', err);
      } finally {
        setLoading(false);
      }
    };

    loadContests();
    const interval = setInterval(loadContests, API_CONFIG.REFRESH_INTERVAL);
    return () => clearInterval(interval);
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] text-red-600">
        <div className="flex items-center mb-4">
          <AlertCircle className="w-6 h-6 mr-2" />
          <span>{error}</span>
        </div>
        <button 
          onClick={() => window.location.reload()}
          className="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
        >
          Try Again
        </button>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {contests.map((contest, index) => (
        <ContestCard key={`${contest.name}-${index}`} contest={contest} />
      ))}
    </div>
  );
}