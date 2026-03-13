export interface Option {
  label: string;
  value: string;
  icon?: React.ComponentType<{ className?: string }>;
  withCount?: boolean;
}

export interface Translation {
  id: string;
  source_text: string;
  translated_text: string;
  source_language: string;
  target_language: string;
  detected_language?: string;
  user_id?: string;
  created_at: string;
}

export interface Language {
  code: string;
  name: string;
  flag: string;
}

export interface Profile {
  id: string;
  username: string;
  email?: string;
  role: 'user' | 'admin';
  created_at: string;
  updated_at: string;
}

export interface UserSettings {
  id: string;
  user_id: string;
  theme: 'light' | 'dark';
  language: string;
  created_at: string;
  updated_at: string;
}

export interface Feedback {
  id: string;
  user_id?: string;
  name: string;
  email: string;
  suggestion: string;
  rating: number;
  created_at: string;
}
