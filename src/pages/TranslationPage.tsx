import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { LanguageSelector } from '@/components/LanguageSelector';
import { TranslationHistory } from '@/components/TranslationHistory';
import { ArrowLeftRight, Copy, Loader2, Languages } from 'lucide-react';
import { SUPPORTED_LANGUAGES, TARGET_LANGUAGES } from '@/lib/languages';
import { translateText, getTranslationHistory, clearTranslationHistory, deleteTranslation } from '@/db/api';
import type { Translation } from '@/types';
import { toast } from 'sonner';

export default function TranslationPage() {
  const [sourceText, setSourceText] = useState('');
  const [translatedText, setTranslatedText] = useState('');
  const [sourceLanguage, setSourceLanguage] = useState('auto');
  const [targetLanguage, setTargetLanguage] = useState('en');
  const [isTranslating, setIsTranslating] = useState(false);
  const [history, setHistory] = useState<Translation[]>([]);
  const [detectedLanguage, setDetectedLanguage] = useState<string | undefined>();

  useEffect(() => {
    loadHistory();
  }, []);

  const loadHistory = async () => {
    const data = await getTranslationHistory();
    setHistory(data);
  };

  const handleTranslate = async () => {
    if (!sourceText.trim()) {
      toast.error('Please enter text to translate');
      return;
    }

    if (targetLanguage === 'auto') {
      toast.error('Please select a target language');
      return;
    }

    setIsTranslating(true);
    setTranslatedText('');
    setDetectedLanguage(undefined);

    try {
      const result = await translateText(
        sourceText,
        targetLanguage,
        sourceLanguage === 'auto' ? undefined : sourceLanguage
      );

      if (result) {
        setTranslatedText(result.translatedText);
        setDetectedLanguage(result.detectedLanguage);
        await loadHistory();
        toast.success('Translation completed successfully');
      }
    } catch (error) {
      console.error('Translation error:', error);
      toast.error(error instanceof Error ? error.message : 'An error occurred during translation');
    } finally {
      setIsTranslating(false);
    }
  };

  const handleSwapLanguages = () => {
    if (sourceLanguage === 'auto') {
      toast.error('Cannot swap when source language is set to Auto Detect');
      return;
    }

    const temp = sourceLanguage;
    setSourceLanguage(targetLanguage);
    setTargetLanguage(temp);
    setSourceText(translatedText);
    setTranslatedText(sourceText);
  };

  const handleCopyTranslation = async () => {
    if (!translatedText) return;

    try {
      await navigator.clipboard.writeText(translatedText);
      toast.success('Translation copied to clipboard');
    } catch (error) {
      toast.error('Failed to copy to clipboard');
    }
  };

  const handleClearHistory = async () => {
    const success = await clearTranslationHistory();
    if (success) {
      setHistory([]);
      toast.success('Translation history cleared');
    } else {
      toast.error('Failed to clear history');
    }
  };

  const handleDeleteTranslation = async (id: string) => {
    const success = await deleteTranslation(id);
    if (success) {
      setHistory(history.filter(item => item.id !== id));
      toast.success('Translation deleted');
    } else {
      toast.error('Failed to delete translation');
    }
  };

  const handleSelectTranslation = (translation: Translation) => {
    setSourceText(translation.source_text);
    setTranslatedText(translation.translated_text);
    setSourceLanguage(translation.source_language);
    setTargetLanguage(translation.target_language);
    setDetectedLanguage(translation.detected_language);
  };

  const getDetectedLanguageDisplay = () => {
    if (!detectedLanguage) return null;
    const lang = SUPPORTED_LANGUAGES.find(l => l.code === detectedLanguage);
    return lang ? `${lang.flag} ${lang.name}` : detectedLanguage;
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-4 md:py-8">
        <div className="mb-6 md:mb-8 text-center">
          <div className="flex items-center justify-center gap-3 mb-2">
            <Languages className="h-6 w-6 md:h-8 md:w-8 text-primary" />
            <h1 className="text-2xl md:text-4xl font-bold">Multilingual Translation Tool</h1>
          </div>
          <p className="text-sm md:text-base text-muted-foreground">
            Translate text between multiple languages instantly
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 md:gap-6">
          <div className="lg:col-span-2 space-y-4 md:space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg md:text-xl">Translation</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-[1fr_auto_1fr] gap-3 md:gap-4 items-center">
                  <div>
                    <label className="text-sm font-medium mb-2 block">Source Language</label>
                    <LanguageSelector
                      languages={SUPPORTED_LANGUAGES}
                      value={sourceLanguage}
                      onValueChange={setSourceLanguage}
                      placeholder="Select source language"
                    />
                    {detectedLanguage && sourceLanguage === 'auto' && (
                      <p className="text-xs text-muted-foreground mt-1">
                        Detected: {getDetectedLanguageDisplay()}
                      </p>
                    )}
                  </div>

                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={handleSwapLanguages}
                    className="mt-0 md:mt-6"
                    disabled={sourceLanguage === 'auto'}
                  >
                    <ArrowLeftRight className="h-4 w-4" />
                  </Button>

                  <div>
                    <label className="text-sm font-medium mb-2 block">Target Language</label>
                    <LanguageSelector
                      languages={TARGET_LANGUAGES}
                      value={targetLanguage}
                      onValueChange={setTargetLanguage}
                      placeholder="Select target language"
                    />
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-medium mb-2 block">Text to Translate</label>
                    <Textarea
                      value={sourceText}
                      onChange={(e) => setSourceText(e.target.value)}
                      placeholder="Enter text to translate..."
                      className="min-h-[150px] md:min-h-[200px] resize-none"
                    />
                    <p className="text-xs text-muted-foreground mt-1">
                      {sourceText.length} characters
                    </p>
                  </div>

                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <label className="text-sm font-medium">Translation</label>
                      {translatedText && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={handleCopyTranslation}
                        >
                          <Copy className="h-4 w-4 mr-1" />
                          <span className="hidden sm:inline">Copy</span>
                        </Button>
                      )}
                    </div>
                    <Textarea
                      value={translatedText}
                      readOnly
                      placeholder="Translation will appear here..."
                      className="min-h-[150px] md:min-h-[200px] resize-none bg-muted"
                    />
                    <p className="text-xs text-muted-foreground mt-1">
                      {translatedText.length} characters
                    </p>
                  </div>
                </div>

                <Button
                  onClick={handleTranslate}
                  disabled={isTranslating || !sourceText.trim()}
                  className="w-full"
                  size="lg"
                >
                  {isTranslating ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Translating...
                    </>
                  ) : (
                    <>
                      <Languages className="h-4 w-4 mr-2" />
                      Translate
                    </>
                  )}
                </Button>
              </CardContent>
            </Card>
          </div>

          <div className="lg:col-span-1">
            <TranslationHistory
              history={history}
              onClear={handleClearHistory}
              onDelete={handleDeleteTranslation}
              onSelectTranslation={handleSelectTranslation}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
