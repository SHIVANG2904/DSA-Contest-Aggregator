import { useState } from 'react';
import { Calendar, Clock, ExternalLink, Bell } from 'lucide-react';
import { formatDistanceToNow, parseISO } from 'date-fns';
import { Contest } from '../types/contest';
import { supabase } from '../lib/supabase';
import { subscribeToContestNotifications } from '../services/notifications';
import { toast } from 'react-hot-toast';

interface ContestCardProps {
  contest: Contest;
}

export function ContestCard({ contest }: ContestCardProps) {
  const [notificationSet, setNotificationSet] = useState(false);
  const startTime = parseISO(contest.start_time);
  const timeUntilStart = formatDistanceToNow(startTime, { addSuffix: true });

  async function handleNotificationToggle() {
    try {
      const { data: { user }, error } = await supabase.auth.getUser();
      if (error) {
        console.error('Supabase Auth Error:', error);
        toast.error('Authentication error. Please sign in again.');
        return;
      }

      if (!user) {
        toast.error('Please sign in to set notifications');
        return;
      }

      await subscribeToContestNotifications(user.id, contest, 24);
      setNotificationSet(true);
      toast.success('Notification set for 24 hours before contest');
    } catch (err) {
      console.error('Notification Error:', err);
      toast.error('Failed to set notification');
    }
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
      <div className="flex items-start justify-between">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
          {contest.name}
        </h3>
        <div className="flex items-center space-x-2">
          <span className="px-2 py-1 text-sm rounded-full bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200">
            {contest.site}
          </span>
          <button
            onClick={handleNotificationToggle}
            disabled={notificationSet}
            className={`p-1 rounded-full ${
              notificationSet 
                ? 'text-green-500 cursor-not-allowed' 
                : 'text-gray-500 hover:text-blue-500'
            }`}
          >
            <Bell className="w-4 h-4" />
          </button>
        </div>
      </div>
      
      <div className="mt-4 space-y-2">
        <div className="flex items-center text-gray-600 dark:text-gray-300">
          <Calendar className="w-4 h-4 mr-2" />
          <span>Starts {timeUntilStart}</span>
        </div>
        
        <div className="flex items-center text-gray-600 dark:text-gray-300">
          <Clock className="w-4 h-4 mr-2" />
          <span>Duration: {parseInt(contest.duration) / 3600} hours</span>
        </div>
      </div>
      
      <a
        href={contest.url}
        target="_blank"
        rel="noopener noreferrer"
        className="mt-4 inline-flex items-center text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300"
      >
        Visit Contest
        <ExternalLink className="w-4 h-4 ml-1" />
      </a>
    </div>
  );
}
