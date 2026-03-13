import { supabase } from './supabase';
import type { Translation, Feedback, UserSettings } from '@/types';

export async function getTranslationHistory(limit = 50): Promise<Translation[]> {
  const { data, error } = await supabase
    .from('translations')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(limit);

  if (error) {
    console.error('Error fetching translation history:', error);
    return [];
  }

  return Array.isArray(data) ? data : [];
}

export async function deleteTranslation(id: string): Promise<boolean> {
  const { error } = await supabase
    .from('translations')
    .delete()
    .eq('id', id);

  if (error) {
    console.error('Error deleting translation:', error);
    return false;
  }

  return true;
}

export async function clearTranslationHistory(): Promise<boolean> {
  const { error } = await supabase
    .from('translations')
    .delete()
    .neq('id', '00000000-0000-0000-0000-000000000000');

  if (error) {
    console.error('Error clearing translation history:', error);
    return false;
  }

  return true;
}

export async function translateText(
  text: string,
  targetLanguage: string,
  sourceLanguage?: string
): Promise<{ translatedText: string; detectedLanguage?: string } | null> {
  try {
    const { data, error } = await supabase.functions.invoke('translate', {
      body: {
        q: text,
        target: targetLanguage,
        source: sourceLanguage,
        format: 'text',
      },
    });

    if (error) {
      const errorMsg = await error?.context?.text();
      console.error('Translation error:', errorMsg || error?.message);
      throw new Error(errorMsg || error?.message || 'Translation failed');
    }

    if (data?.data?.translations?.[0]) {
      return {
        translatedText: data.data.translations[0].translatedText,
        detectedLanguage: data.data.translations[0].detectedSourceLanguage,
      };
    }

    return null;
  } catch (error) {
    console.error('Error translating text:', error);
    throw error;
  }
}

export async function submitFeedback(feedback: Omit<Feedback, 'id' | 'created_at'>): Promise<boolean> {
  const { error } = await supabase
    .from('feedback')
    .insert(feedback);

  if (error) {
    console.error('Error submitting feedback:', error);
    return false;
  }

  return true;
}

export async function getUserSettings(userId: string): Promise<UserSettings | null> {
  const { data, error } = await supabase
    .from('user_settings')
    .select('*')
    .eq('user_id', userId)
    .maybeSingle();

  if (error) {
    console.error('Error fetching user settings:', error);
    return null;
  }

  return data;
}

export async function updateUserSettings(userId: string, settings: Partial<UserSettings>): Promise<boolean> {
  const { error } = await supabase
    .from('user_settings')
    .update(settings)
    .eq('user_id', userId);

  if (error) {
    console.error('Error updating user settings:', error);
    return false;
  }

  return true;
}

export async function getAllFeedback(): Promise<Feedback[]> {
  const { data, error } = await supabase
    .from('feedback')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching feedback:', error);
    return [];
  }

  return Array.isArray(data) ? data : [];
}
