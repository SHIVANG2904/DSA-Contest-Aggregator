import { Bell, BellOff } from 'lucide-react';
import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { toast } from 'react-hot-toast';

export function NotificationToggle() {
  const [notificationsEnabled, setNotificationsEnabled] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadPreferences() {
      const { data: { user }, error } = await supabase.auth.getUser();
      if (error || !user) {
        setLoading(false);
        return;
      }

      const { data, error: fetchError } = await supabase
        .from('user_preferences')
        .select('email_notifications')
        .eq('user_id', user.id)
        .single();

      if (fetchError) {
        console.error('Failed to fetch preferences:', fetchError);
        toast.error('Failed to load preferences');
      } else {
        setNotificationsEnabled(data?.email_notifications ?? false);
      }

      setLoading(false);
    }

    loadPreferences();
  }, []);

  async function toggleNotifications() {
    const { data: { user }, error } = await supabase.auth.getUser();
    if (error || !user) {
      toast.error('Please sign in to enable notifications');
      return;
    }

    try {
      const newValue = !notificationsEnabled;
      const { error: upsertError } = await supabase
        .from('user_preferences')
        .upsert({
          user_id: user.id,
          email_notifications: newValue,
        });

      if (upsertError) throw upsertError;

      setNotificationsEnabled(newValue);
      toast.success(
        newValue ? 'Notifications enabled' : 'Notifications disabled'
      );
    } catch (error) {
      console.error('Failed to toggle notifications:', error);
      toast.error('Failed to update notification preferences');
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center p-4">
        <span className="animate-spin">Loading...</span>
      </div>
    );
  }

  return (
    <button
      onClick={toggleNotifications}
      className="p-2 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
      aria-label="Toggle notifications"
    >
      {notificationsEnabled ? (
        <Bell className="w-5 h-5" />
      ) : (
        <BellOff className="w-5 h-5" />
      )}
    </button>
  );
}
