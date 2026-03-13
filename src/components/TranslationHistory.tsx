import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Trash2, Clock, X, Filter } from 'lucide-react';
import type { Translation } from '@/types';
import { SUPPORTED_LANGUAGES, TARGET_LANGUAGES } from '@/lib/languages';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface TranslationHistoryProps {
  history: Translation[];
  onClear: () => void;
  onDelete: (id: string) => void;
  onSelectTranslation: (translation: Translation) => void;
}

export function TranslationHistory({ history, onClear, onDelete, onSelectTranslation }: TranslationHistoryProps) {
  const [sourceFilter, setSourceFilter] = useState<string>('all');
  const [targetFilter, setTargetFilter] = useState<string>('all');
  const [dateFilter, setDateFilter] = useState<string>('all');

  const getLanguageName = (code: string) => {
    const lang = [...SUPPORTED_LANGUAGES, ...TARGET_LANGUAGES].find(l => l.code === code);
    return lang ? `${lang.flag} ${lang.name}` : code;
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;
    return date.toLocaleDateString();
  };

  const filterByDate = (item: Translation): boolean => {
    if (dateFilter === 'all') return true;
    
    const date = new Date(item.created_at);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffDays = Math.floor(diffMs / 86400000);

    switch (dateFilter) {
      case 'today':
        return diffDays === 0;
      case 'week':
        return diffDays <= 7;
      case 'month':
        return diffDays <= 30;
      default:
        return true;
    }
  };

  const filteredHistory = history.filter(item => {
    const sourceMatch = sourceFilter === 'all' || item.source_language === sourceFilter;
    const targetMatch = targetFilter === 'all' || item.target_language === targetFilter;
    const dateMatch = filterByDate(item);
    return sourceMatch && targetMatch && dateMatch;
  });

  const hasActiveFilters = sourceFilter !== 'all' || targetFilter !== 'all' || dateFilter !== 'all';

  const clearFilters = () => {
    setSourceFilter('all');
    setTargetFilter('all');
    setDateFilter('all');
  };

  // Get unique languages from history
  const uniqueSourceLanguages = Array.from(new Set(history.map(h => h.source_language)));
  const uniqueTargetLanguages = Array.from(new Set(history.map(h => h.target_language)));

  return (
    <Card className="h-full">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3 md:pb-4">
        <CardTitle className="text-base md:text-lg font-semibold flex items-center gap-2">
          <Clock className="h-4 w-4 md:h-5 md:w-5" />
          <span className="hidden sm:inline">Translation History</span>
          <span className="sm:hidden">History</span>
        </CardTitle>
        <div className="flex items-center gap-1 md:gap-2">
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline" size="sm" className="relative">
                <Filter className="h-4 w-4" />
                <span className="hidden sm:inline ml-1">Filter</span>
                {hasActiveFilters && (
                  <span className="absolute -top-1 -right-1 h-3 w-3 bg-primary rounded-full" />
                )}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-[280px] sm:w-80" align="end">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h4 className="font-medium text-sm">Filter History</h4>
                  {hasActiveFilters && (
                    <Button variant="ghost" size="sm" onClick={clearFilters}>
                      Clear
                    </Button>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="source-filter" className="text-xs">Source Language</Label>
                  <Select value={sourceFilter} onValueChange={setSourceFilter}>
                    <SelectTrigger id="source-filter">
                      <SelectValue placeholder="All languages" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All languages</SelectItem>
                      {uniqueSourceLanguages.map((code) => {
                        const lang = [...SUPPORTED_LANGUAGES, ...TARGET_LANGUAGES].find(l => l.code === code);
                        return (
                          <SelectItem key={code} value={code}>
                            {lang ? `${lang.flag} ${lang.name}` : code}
                          </SelectItem>
                        );
                      })}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="target-filter" className="text-xs">Target Language</Label>
                  <Select value={targetFilter} onValueChange={setTargetFilter}>
                    <SelectTrigger id="target-filter">
                      <SelectValue placeholder="All languages" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All languages</SelectItem>
                      {uniqueTargetLanguages.map((code) => {
                        const lang = [...SUPPORTED_LANGUAGES, ...TARGET_LANGUAGES].find(l => l.code === code);
                        return (
                          <SelectItem key={code} value={code}>
                            {lang ? `${lang.flag} ${lang.name}` : code}
                          </SelectItem>
                        );
                      })}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="date-filter" className="text-xs">Date Range</Label>
                  <Select value={dateFilter} onValueChange={setDateFilter}>
                    <SelectTrigger id="date-filter">
                      <SelectValue placeholder="All time" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All time</SelectItem>
                      <SelectItem value="today">Today</SelectItem>
                      <SelectItem value="week">Last 7 days</SelectItem>
                      <SelectItem value="month">Last 30 days</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </PopoverContent>
          </Popover>

          {history.length > 0 && (
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-destructive hover:text-destructive"
                >
                  <Trash2 className="h-4 w-4" />
                  <span className="hidden sm:inline ml-1">Clear All</span>
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Clear all history?</AlertDialogTitle>
                  <AlertDialogDescription>
                    This will permanently delete all your translation history. This action cannot be undone.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction onClick={onClear} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
                    Clear All
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          )}
        </div>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-[300px] md:h-[calc(100vh-250px)]">
          {filteredHistory.length === 0 ? (
            <div className="text-center text-muted-foreground py-8">
              {history.length === 0 ? (
                <>
                  <p>No translation history yet</p>
                  <p className="text-sm mt-2">Your translations will appear here</p>
                </>
              ) : (
                <>
                  <p>No translations match the filters</p>
                  <p className="text-sm mt-2">Try adjusting your filter settings</p>
                  {hasActiveFilters && (
                    <Button variant="outline" size="sm" onClick={clearFilters} className="mt-4">
                      Clear Filters
                    </Button>
                  )}
                </>
              )}
            </div>
          ) : (
            <div className="space-y-3">
              {filteredHistory.map((item) => (
                <div
                  key={item.id}
                  className="relative group p-3 rounded-lg border border-border hover:bg-accent transition-colors"
                >
                  <button
                    type="button"
                    onClick={() => onSelectTranslation(item)}
                    className="w-full text-left"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2 text-xs text-muted-foreground">
                        <span>{getLanguageName(item.source_language)}</span>
                        <span>→</span>
                        <span>{getLanguageName(item.target_language)}</span>
                      </div>
                      <span className="text-xs text-muted-foreground">
                        {formatDate(item.created_at)}
                      </span>
                    </div>
                    <p className="text-sm font-medium line-clamp-1 mb-1">
                      {item.source_text}
                    </p>
                    <p className="text-sm text-muted-foreground line-clamp-1">
                      {item.translated_text}
                    </p>
                  </button>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="absolute top-2 right-2 h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity"
                    onClick={(e) => {
                      e.stopPropagation();
                      onDelete(item.id);
                    }}
                  >
                    <X className="h-4 w-4 text-destructive" />
                  </Button>
                </div>
              ))}
            </div>
          )}
        </ScrollArea>
      </CardContent>
    </Card>
  );
}
