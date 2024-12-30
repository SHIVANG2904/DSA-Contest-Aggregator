export interface Database {
  public: {
    Tables: {
      user_preferences: {
        Row: {
          id: string;
          user_id: string;
          email_notifications: boolean;
          notification_time: string;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          email_notifications?: boolean;
          notification_time?: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          email_notifications?: boolean;
          notification_time?: string;
          created_at?: string;
          updated_at?: string;
        };
      };
      contest_reminders: {
        Row: {
          id: string;
          user_id: string;
          contest_id: string;
          contest_name: string;
          contest_start: string;
          reminder_sent: boolean;
          created_at: string;
          notification_time: number;
        };
        Insert: {
          id?: string;
          user_id: string;
          contest_id: string;
          contest_name: string;
          contest_start: string;
          reminder_sent?: boolean;
          created_at?: string;
          notification_time: number;
        };
        Update: {
          id?: string;
          user_id?: string;
          contest_id?: string;
          contest_name?: string;
          contest_start?: string;
          reminder_sent?: boolean;
          created_at?: string;
          notification_time?: number;
        };
      };
    };
  };
}