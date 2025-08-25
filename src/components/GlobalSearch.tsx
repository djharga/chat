import React, { useState, useEffect, useMemo } from 'react';
import { Search, X, MessageCircle, User, Hash, Clock, Filter, SortAsc, SortDesc } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from './ui/dialog';
import { Input } from './ui/input';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { ScrollArea } from './ui/scroll-area';
import { Separator } from './ui/separator';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Avatar, AvatarImage, AvatarFallback } from './ui/avatar';
import { conversations, messages, users } from '../data/mockData';
import { Message, Conversation, User as UserType } from '../types/chat';

interface GlobalSearchProps {
  isOpen: boolean;
  onClose: () => void;
  onConversationSelect: (conversationId: string) => void;
  onMessageSelect: (messageId: string, conversationId: string) => void;
}

type SearchType = 'all' | 'messages' | 'contacts' | 'groups';
type SortType = 'relevance' | 'date' | 'name';

interface SearchResult {
  type: 'message' | 'conversation' | 'contact';
  id: string;
  title: string;
  subtitle: string;
  content?: string;
  timestamp?: Date;
  avatar?: string;
  conversationId?: string;
  highlight?: string;
}

export function GlobalSearch({ isOpen, onClose, onConversationSelect, onMessageSelect }: GlobalSearchProps) {
  const [query, setQuery] = useState('');
  const [searchType, setSearchType] = useState<SearchType>('all');
  const [sortType, setSortType] = useState<SortType>('relevance');
  const [isAdvancedSearch, setIsAdvancedSearch] = useState(false);
  const [dateFilter, setDateFilter] = useState<'all' | 'today' | 'week' | 'month'>('all');
  const [results, setResults] = useState<SearchResult[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [selectedResultIndex, setSelectedResultIndex] = useState(0);

  // Advanced search filters
  const [fromUser, setFromUser] = useState('');
  const [hasAttachments, setHasAttachments] = useState(false);

  const searchResults = useMemo(() => {
    if (!query.trim()) return [];

    setIsSearching(true);
    const searchTerm = query.toLowerCase().trim();
    const results: SearchResult[] = [];

    // Search in messages
    if (searchType === 'all' || searchType === 'messages') {
      messages.forEach(message => {
        if (message.content.toLowerCase().includes(searchTerm)) {
          const conversation = conversations.find(c => c.participants.some(p => p.id === message.senderId));
          const sender = users.find(u => u.id === message.senderId);
          
          // Apply filters
          if (fromUser && sender?.name.toLowerCase() !== fromUser.toLowerCase()) return;
          if (hasAttachments && !message.attachments?.length) return;
          if (dateFilter !== 'all') {
            const messageDate = new Date(message.timestamp);
            const now = new Date();
            const daysDiff = Math.floor((now.getTime() - messageDate.getTime()) / (1000 * 60 * 60 * 24));
            
            if (dateFilter === 'today' && daysDiff > 0) return;
            if (dateFilter === 'week' && daysDiff > 7) return;
            if (dateFilter === 'month' && daysDiff > 30) return;
          }

          results.push({
            type: 'message',
            id: message.id,
            title: sender?.name || 'مستخدم غير معروف',
            subtitle: conversation?.isGroup ? conversation.groupName || 'مجموعة' : 'محادثة فردية',
            content: message.content,
            timestamp: message.timestamp,
            avatar: sender?.avatar,
            conversationId: conversation?.id,
            highlight: highlightSearchTerm(message.content, searchTerm)
          });
        }
      });
    }

    // Search in conversations
    if (searchType === 'all' || searchType === 'groups') {
      conversations.forEach(conversation => {
        const name = conversation.isGroup ? conversation.groupName : conversation.participants[0]?.name;
        if (name?.toLowerCase().includes(searchTerm)) {
          results.push({
            type: 'conversation',
            id: conversation.id,
            title: name,
            subtitle: conversation.isGroup ? `${conversation.participants.length} أعضاء` : 'محادثة فردية',
            timestamp: conversation.lastMessage?.timestamp,
            avatar: conversation.isGroup ? conversation.groupAvatar : conversation.participants[0]?.avatar
          });
        }
      });
    }

    // Search in contacts
    if (searchType === 'all' || searchType === 'contacts') {
      users.forEach(user => {
        if (user.name.toLowerCase().includes(searchTerm) || user.bio?.toLowerCase().includes(searchTerm)) {
          results.push({
            type: 'contact',
            id: user.id,
            title: user.name,
            subtitle: user.bio || 'لا توجد معلومات إضافية',
            avatar: user.avatar
          });
        }
      });
    }

    // Sort results
    results.sort((a, b) => {
      switch (sortType) {
        case 'date':
          return (b.timestamp?.getTime() || 0) - (a.timestamp?.getTime() || 0);
        case 'name':
          return a.title.localeCompare(b.title, 'ar');
        case 'relevance':
        default:
          // Simple relevance scoring
          const aScore = calculateRelevanceScore(a, searchTerm);
          const bScore = calculateRelevanceScore(b, searchTerm);
          return bScore - aScore;
      }
    });

    setTimeout(() => setIsSearching(false), 300);
    return results;
  }, [query, searchType, sortType, fromUser, hasAttachments, dateFilter]);

  const highlightSearchTerm = (text: string, term: string): string => {
    const regex = new RegExp(`(${term})`, 'gi');
    return text.replace(regex, '<mark class="bg-yellow-200 dark:bg-yellow-800">$1</mark>');
  };

  const calculateRelevanceScore = (result: SearchResult, term: string): number => {
    let score = 0;
    const termLower = term.toLowerCase();
    
    // Title exact match gets highest score
    if (result.title.toLowerCase() === termLower) score += 100;
    else if (result.title.toLowerCase().includes(termLower)) score += 50;
    
    // Content match
    if (result.content?.toLowerCase().includes(termLower)) score += 30;
    
    // Subtitle match
    if (result.subtitle.toLowerCase().includes(termLower)) score += 20;
    
    // Recent messages get higher score
    if (result.timestamp) {
      const daysDiff = Math.floor((Date.now() - result.timestamp.getTime()) / (1000 * 60 * 60 * 24));
      score += Math.max(0, 10 - daysDiff);
    }
    
    return score;
  };

  const handleResultSelect = (result: SearchResult) => {
    if (result.type === 'message' && result.conversationId) {
      onMessageSelect(result.id, result.conversationId);
    } else if (result.type === 'conversation') {
      onConversationSelect(result.id);
    } else if (result.type === 'contact') {
      // Find or create conversation with this contact
      const existingConversation = conversations.find(c => 
        !c.isGroup && c.participants.some(p => p.id === result.id)
      );
      if (existingConversation) {
        onConversationSelect(existingConversation.id);
      }
    }
    onClose();
  };

  const formatTimestamp = (timestamp: Date) => {
    const now = new Date();
    const diff = now.getTime() - timestamp.getTime();
    const minutes = Math.floor(diff / (1000 * 60));
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));

    if (minutes < 1) return 'الآن';
    if (minutes < 60) return `منذ ${minutes} دقيقة`;
    if (hours < 24) return `منذ ${hours} ساعة`;
    if (days < 7) return `منذ ${days} يوم`;
    return timestamp.toLocaleDateString('ar-SA');
  };

  const getResultIcon = (type: SearchResult['type']) => {
    switch (type) {
      case 'message': return MessageCircle;
      case 'conversation': return Hash;
      case 'contact': return User;
      default: return Search;
    }
  };

  const getResultTypeLabel = (type: SearchResult['type']) => {
    switch (type) {
      case 'message': return 'رسالة';
      case 'conversation': return 'محادثة';
      case 'contact': return 'جهة اتصال';
      default: return '';
    }
  };

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isOpen) return;

      switch (e.key) {
        case 'ArrowDown':
          e.preventDefault();
          setSelectedResultIndex(prev => 
            prev < searchResults.length - 1 ? prev + 1 : prev
          );
          break;
        case 'ArrowUp':
          e.preventDefault();
          setSelectedResultIndex(prev => prev > 0 ? prev - 1 : prev);
          break;
        case 'Enter':
          e.preventDefault();
          if (searchResults[selectedResultIndex]) {
            handleResultSelect(searchResults[selectedResultIndex]);
          }
          break;
        case 'Escape':
          onClose();
          break;
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, searchResults, selectedResultIndex]);

  // Reset selected index when results change
  useEffect(() => {
    setSelectedResultIndex(0);
  }, [searchResults]);

  const recentSearches = ['اجتماع الفريق', 'تقرير المشروع', 'فاطمة أحمد', 'مجموعة العمل'];

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl h-[80vh] flex flex-col p-0">
        <DialogHeader className="p-6 pb-0">
          <DialogTitle className="text-right">البحث الشامل</DialogTitle>
        </DialogHeader>

        {/* Search Input */}
        <div className="px-6 py-4 border-b">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="ابحث في الرسائل، المحادثات، وجهات الاتصال..."
              className="pl-10 text-right"
              autoFocus
            />
            {query && (
              <Button
                variant="ghost"
                size="sm"
                className="absolute right-2 top-1/2 transform -translate-y-1/2 h-6 w-6 p-0"
                onClick={() => setQuery('')}
              >
                <X className="h-3 w-3" />
              </Button>
            )}
          </div>

          {/* Search Filters */}
          <div className="flex items-center gap-2 mt-4 flex-wrap">
            <Select value={searchType} onValueChange={(value: SearchType) => setSearchType(value)}>
              <SelectTrigger className="w-32">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">الكل</SelectItem>
                <SelectItem value="messages">الرسائل</SelectItem>
                <SelectItem value="contacts">جهات الاتصال</SelectItem>
                <SelectItem value="groups">المجموعات</SelectItem>
              </SelectContent>
            </Select>

            <Select value={sortType} onValueChange={(value: SortType) => setSortType(value)}>
              <SelectTrigger className="w-32">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="relevance">الأكثر صلة</SelectItem>
                <SelectItem value="date">التاريخ</SelectItem>
                <SelectItem value="name">الاسم</SelectItem>
              </SelectContent>
            </Select>

            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsAdvancedSearch(!isAdvancedSearch)}
            >
              <Filter className="h-4 w-4 ml-2" />
              فلاتر متقدمة
            </Button>
          </div>

          {/* Advanced Search Filters */}
          <AnimatePresence>
            {isAdvancedSearch && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                className="mt-4 p-4 bg-muted/30 rounded-lg space-y-3"
              >
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium mb-2 block">من المستخدم:</label>
                    <Input
                      value={fromUser}
                      onChange={(e) => setFromUser(e.target.value)}
                      placeholder="اسم المرسل"
                      className="text-right"
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium mb-2 block">التاريخ:</label>
                    <Select value={dateFilter} onValueChange={(value: any) => setDateFilter(value)}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">جميع التواريخ</SelectItem>
                        <SelectItem value="today">اليوم</SelectItem>
                        <SelectItem value="week">هذا الأسبوع</SelectItem>
                        <SelectItem value="month">هذا الشهر</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Search Results */}
        <ScrollArea className="flex-1 px-6">
          {!query ? (
            <div className="py-8">
              <h3 className="text-sm font-medium mb-4 text-right">عمليات البحث الأخيرة</h3>
              <div className="space-y-2">
                {recentSearches.map((search, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="flex items-center gap-3 p-2 rounded-lg hover:bg-muted/50 cursor-pointer"
                    onClick={() => setQuery(search)}
                  >
                    <Clock className="h-4 w-4 text-muted-foreground" />
                    <span className="flex-1 text-right">{search}</span>
                  </motion.div>
                ))}
              </div>
            </div>
          ) : (
            <div className="py-4">
              {isSearching ? (
                <div className="space-y-3">
                  {[1, 2, 3].map(i => (
                    <div key={i} className="flex items-center gap-3 p-3 rounded-lg">
                      <div className="w-10 h-10 bg-muted rounded-full loading-shimmer" />
                      <div className="flex-1 space-y-2">
                        <div className="h-4 bg-muted rounded loading-shimmer" />
                        <div className="h-3 bg-muted rounded w-2/3 loading-shimmer" />
                      </div>
                    </div>
                  ))}
                </div>
              ) : searchResults.length > 0 ? (
                <>
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-sm text-muted-foreground">
                      تم العثور على {searchResults.length} نتيجة
                    </span>
                  </div>
                  <div className="space-y-1">
                    {searchResults.map((result, index) => {
                      const Icon = getResultIcon(result.type);
                      return (
                        <motion.div
                          key={result.id}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: index * 0.05 }}
                          className={`flex items-center gap-3 p-3 rounded-lg cursor-pointer transition-colors ${
                            index === selectedResultIndex ? 'bg-primary/10' : 'hover:bg-muted/50'
                          }`}
                          onClick={() => handleResultSelect(result)}
                        >
                          {result.avatar ? (
                            <Avatar className="h-10 w-10">
                              <AvatarImage src={result.avatar} alt={result.title} />
                              <AvatarFallback>{result.title.charAt(0)}</AvatarFallback>
                            </Avatar>
                          ) : (
                            <div className="h-10 w-10 bg-muted rounded-full flex items-center justify-center">
                              <Icon className="h-5 w-5 text-muted-foreground" />
                            </div>
                          )}
                          
                          <div className="flex-1 min-w-0 text-right">
                            <div className="flex items-center justify-between mb-1">
                              <div className="flex items-center gap-2">
                                <Badge variant="outline" className="text-xs">
                                  {getResultTypeLabel(result.type)}
                                </Badge>
                                {result.timestamp && (
                                  <span className="text-xs text-muted-foreground">
                                    {formatTimestamp(result.timestamp)}
                                  </span>
                                )}
                              </div>
                              <h4 className="font-medium truncate">{result.title}</h4>
                            </div>
                            <p className="text-sm text-muted-foreground truncate">
                              {result.subtitle}
                            </p>
                            {result.content && (
                              <p 
                                className="text-sm text-foreground mt-1 line-clamp-2"
                                dangerouslySetInnerHTML={{ 
                                  __html: result.highlight || result.content 
                                }}
                              />
                            )}
                          </div>
                        </motion.div>
                      );
                    })}
                  </div>
                </>
              ) : (
                <div className="py-12 text-center">
                  <Search className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                  <h3 className="font-medium mb-2">لا توجد نتائج</h3>
                  <p className="text-sm text-muted-foreground">
                    جرب البحث بكلمات مختلفة أو قم بتعديل الفلاتر
                  </p>
                </div>
              )}
            </div>
          )}
        </ScrollArea>

        {/* Footer */}
        <div className="px-6 py-4 border-t bg-muted/30">
          <div className="text-xs text-muted-foreground text-center">
            استخدم ↑↓ للتنقل، Enter للاختيار، Esc للخروج
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}