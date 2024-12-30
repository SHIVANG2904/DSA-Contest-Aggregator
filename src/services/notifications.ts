import { supabase } from '../lib/supabase';
import { Contest } from '../types/contest';

export async function subscribeToContestNotifications(
  userId: string,
  contest: Contest,
  notificationTime: number // hours before contest
): Promise<void> {
  // Fetch the notification_time from the user_preferences table
  const { data: userPreferences, error: preferencesError } = await supabase
    .from('user_preferences')
    .select('notification_time')
    .eq('user_id', userId)
    .single(); // Get a single row

  if (preferencesError) {
    console.error('Error fetching user preferences:', preferencesError);
    throw preferencesError;
  }

  // If no specific notification_time found, use the provided parameter or default
  const notificationInterval = userPreferences?.notification_time || `${notificationTime} hours`;

  // Insert into contest_reminders table
  const { error } = await supabase
    .from('contest_reminders')
    .insert({
      user_id: userId,
      contest_id: `${contest.site}-${contest.name}`,
      contest_name: contest.name,
      contest_start: contest.start_time,
      notification_time: notificationInterval // Store the notification time
    });

  if (error) throw error;
}
