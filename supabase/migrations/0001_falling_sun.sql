/*
  # User Preferences and Notifications Schema

  1. New Tables
    - user_preferences
      - id (uuid, primary key)
      - user_id (uuid, references auth.users)
      - email_notifications (boolean)
      - notification_time (interval)
      - created_at (timestamp)
      - updated_at (timestamp)
    
    - contest_reminders
      - id (uuid, primary key)
      - user_id (uuid, references auth.users)
      - contest_id (text)
      - contest_name (text)
      - contest_start (timestamp)
      - reminder_sent (boolean)
      - created_at (timestamp)

  2. Security
    - Enable RLS on both tables
    - Add policies for users to manage their own preferences and reminders
*/

-- Create user_preferences table
CREATE TABLE IF NOT EXISTS user_preferences (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users NOT NULL,
  email_notifications boolean DEFAULT true,
  notification_time interval DEFAULT '24 hours',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  UNIQUE(user_id)
);

-- Create contest_reminders table
CREATE TABLE IF NOT EXISTS contest_reminders (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users NOT NULL,
  contest_id text NOT NULL,
  contest_name text NOT NULL,
  contest_start timestamptz NOT NULL,
  reminder_sent boolean DEFAULT false,
  created_at timestamptz DEFAULT now(),
  notification_time interval DEFAULT '24 hours',
);

-- Enable RLS
ALTER TABLE user_preferences ENABLE ROW LEVEL SECURITY;
ALTER TABLE contest_reminders ENABLE ROW LEVEL SECURITY;

-- Policies for user_preferences
CREATE POLICY "Users can view own preferences"
  ON user_preferences
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own preferences"
  ON user_preferences
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own preferences"
  ON user_preferences
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id);

-- Policies for contest_reminders
CREATE POLICY "Users can view own reminders"
  ON contest_reminders
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can manage own reminders"
  ON contest_reminders
  FOR ALL
  TO authenticated
  USING (auth.uid() = user_id);