import React, { useState } from 'react';
import { Search, Pin, MoreVertical, Settings, Moon, Sun, Plus, Archive, Users, Bell } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { Avatar, AvatarImage, AvatarFallback } from './ui/avatar';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Badge } from './ui/badge';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from './ui/dropdown-menu';
import { Separator } from './ui/separator';
import { Switch } from './ui/switch';
import { conversations, currentUser, notifications } from '../data/mockData';
import { Conversation } from '../types/chat';

interface SidebarProps {
  isCollapsed: boolean;
  selectedConversationId: string | null;
  onConversationSelect: (conversationId: string) => void;
  onToggleCollapse: () => void;
  isDarkMode: boolean;
  onToggleDarkMode: () => void;
}

export function Sidebar({ 
  isCollapsed, 
  selectedConversationId, 
  onConversationSelect, 
  onToggleCollapse,
  isDarkMode,
  onToggleDarkMode 
}: SidebarProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [draggedItem, setDraggedItem] = useState<string | null>(null);
  const [activeFilter, setActiveFilter] = useState<'all' | 'unread' | 'groups'>('all');

  const filteredConversations = conversations.filter(conv => {
    const name = conv.isGroup ? conv.groupName : conv.participants[0]?.name;
    const matchesSearch = name?.toLowerCase().includes(searchQuery.toLowerCase());
    
    if (activeFilter === 'unread') return matchesSearch && conv.unreadCount > 0;
    if (activeFilter === 'groups') return matchesSearch && conv.isGroup;
    return matchesSearch;
  });

  const pinnedConversations = filteredConversations.filter(conv => conv.isPinned);
  const regularConversations = filteredConversations.filter(conv => !conv.isPinned);
  const unreadNotifications = notifications.filter(n => !n.isRead).length;

  const formatLastSeen = (date: Date) => {
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const minutes = Math.floor(diff / (1000 * 60));
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    
    if (minutes < 1) return 'الآن';
    if (minutes < 60) return `منذ ${minutes} دقيقة`;
    if (hours < 24) return `منذ ${hours} ساعة`;
    if (days < 7) return `منذ ${days} يوم`;
    return date.toLocaleDateString('ar-SA');
  };

  const ConversationItem = ({ conversation }: { conversation: Conversation }) => {
    const participant = conversation.participants[0];
    const displayName = conversation.isGroup ? conversation.groupName : participant?.name;
    const displayAvatar = conversation.isGroup ? conversation.groupAvatar : participant?.avatar;
    const isOnline = !conversation.isGroup && participant?.status === 'online';

    return (
      <motion.div
        layout
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        whileHover={{ backgroundColor: isDarkMode ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)' }}
        className={`group relative p-3 cursor-pointer transition-all duration-200 rounded-lg mx-2 mb-1 ${
          selectedConversationId === conversation.id 
            ? 'bg-primary/10 border-r-2 border-r-primary shadow-sm' 
            : 'border-r-2 border-r-transparent hover:bg-muted/50'
        } ${draggedItem === conversation.id ? 'opacity-50' : ''}`}
        onClick={() => onConversationSelect(conversation.id)}
        onDragStart={() => setDraggedItem(conversation.id)}
        onDragEnd={() => setDraggedItem(null)}
        draggable
      >
        <div className="flex items-center gap-3 text-right">
          <div className="relative">
            <Avatar className="h-12 w-12 ring-2 ring-transparent group-hover:ring-primary/20 transition-all">
              <AvatarImage src={displayAvatar} alt={displayName} />
              <AvatarFallback className="text-sm font-medium">
                {displayName?.charAt(0)}
              </AvatarFallback>
            </Avatar>
            {isOnline && (
              <motion.div 
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-background shadow-sm" 
              />
            )}
            {conversation.isGroup && (
              <div className="absolute -bottom-1 -left-1 w-4 h-4 bg-blue-500 rounded-full border-2 border-background flex items-center justify-center">
                <Users className="h-2 w-2 text-white" />
              </div>
            )}
          </div>
          
          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between mb-1">
              <div className="flex items-center gap-1">
                {conversation.isPinned && (
                  <motion.div whileHover={{ rotate: 15 }}>
                    <Pin className="h-3 w-3 text-primary" />
                  </motion.div>
                )}
                {conversation.isMuted && (
                  <div className="h-2 w-2 bg-muted-foreground rounded-full opacity-60" />
                )}
                <span className="text-xs text-muted-foreground">
                  {conversation.lastMessage && formatLastSeen(conversation.lastMessage.timestamp)}
                </span>
              </div>
              <h3 className="font-medium truncate text-sm max-w-24">
                {displayName}
              </h3>
            </div>
            
            <div className="flex items-center justify-between">
              {conversation.unreadCount > 0 && (
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  whileHover={{ scale: 1.1 }}
                >
                  <Badge variant="default" className="h-5 min-w-5 text-xs px-1.5 bg-primary">
                    {conversation.unreadCount > 99 ? '99+' : conversation.unreadCount}
                  </Badge>
                </motion.div>
              )}
              <p className="text-sm text-muted-foreground truncate text-right flex-1 mr-2">
                {conversation.lastMessage?.type === 'voice' && '🎵 رسالة صوتية'}
                {conversation.lastMessage?.type === 'image' && '📷 صورة'}
                {conversation.lastMessage?.type === 'text' && (conversation.lastMessage?.content || 'لا توجد رسائل')}
              </p>
            </div>
          </div>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button 
                variant="ghost" 
                size="sm" 
                className="h-8 w-8 p-0 opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <MoreVertical className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="text-right w-48">
              <DropdownMenuItem>
                <Pin className="h-4 w-4 ml-2" />
                {conversation.isPinned ? 'إلغاء التثبيت' : 'تثبيت المحادثة'}
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Bell className="h-4 w-4 ml-2" />
                {conversation.isMuted ? 'إلغاء كتم الإشعارات' : 'كتم الإشعارات'}
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Archive className="h-4 w-4 ml-2" />
                أرشفة
              </DropdownMenuItem>
              <DropdownMenuItem className="text-destructive">
                حذف المحادثة
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </motion.div>
    );
  };

  return (
    <motion.div
      initial={{ width: isCollapsed ? 80 : 320 }}
      animate={{ width: isCollapsed ? 80 : 320 }}
      transition={{ duration: 0.3, ease: 'easeInOut' }}
      className="bg-sidebar border-l border-sidebar-border flex flex-col h-full shadow-sm"
    >
      {/* Header */}
      <div className="p-4 border-b border-sidebar-border bg-sidebar/50 backdrop-blur-sm">
        <div className="flex items-center justify-between mb-4">
          {!isCollapsed && (
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="flex items-center gap-3"
            >
              <div className="relative">
                <Avatar className="h-10 w-10 ring-2 ring-primary/10">
                  <AvatarImage src={currentUser.avatar} alt={currentUser.name} />
                  <AvatarFallback>{currentUser.name.charAt(0)}</AvatarFallback>
                </Avatar>
                <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-sidebar" />
              </div>
              <div className="text-right flex-1 min-w-0">
                <h2 className="font-medium truncate">{currentUser.name}</h2>
                <p className="text-sm text-muted-foreground truncate">{currentUser.bio}</p>
              </div>
            </motion.div>
          )}
          
          <div className="flex items-center gap-2">
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={onToggleCollapse}
              className="relative"
            >
              <Search className="h-4 w-4" />
              {unreadNotifications > 0 && (
                <div className="absolute -top-1 -right-1 w-3 h-3 bg-destructive rounded-full flex items-center justify-center">
                  <span className="text-xs text-destructive-foreground">
                    {unreadNotifications}
                  </span>
                </div>
              )}
            </Button>
            
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm">
                  <Settings className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="text-right w-48">
                <div className="flex items-center justify-between p-2">
                  <div className="flex items-center gap-2">
                    {isDarkMode ? <Moon className="h-4 w-4" /> : <Sun className="h-4 w-4" />}
                    <span className="text-sm">الوضع الليلي</span>
                  </div>
                  <Switch checked={isDarkMode} onCheckedChange={onToggleDarkMode} />
                </div>
                <Separator />
                <DropdownMenuItem>الملف الشخصي</DropdownMenuItem>
                <DropdownMenuItem>الإعدادات العامة</DropdownMenuItem>
                <DropdownMenuItem>الخصوصية والأمان</DropdownMenuItem>
                <Separator />
                <DropdownMenuItem className="text-destructive">
                  تسجيل الخروج
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>

        {!isCollapsed && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-3"
          >
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="البحث في المحادثات..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 text-right bg-background/50 border-0 focus:bg-background transition-colors"
              />
            </div>
            
            {/* Filter Tabs */}
            <div className="flex gap-1 bg-muted/30 rounded-lg p-1">
              {[
                { key: 'all', label: 'الكل', count: conversations.length },
                { key: 'unread', label: 'غير مقروءة', count: conversations.filter(c => c.unreadCount > 0).length },
                { key: 'groups', label: 'مجموعات', count: conversations.filter(c => c.isGroup).length }
              ].map((filter) => (
                <Button
                  key={filter.key}
                  variant={activeFilter === filter.key ? 'default' : 'ghost'}
                  size="sm"
                  className="flex-1 text-xs h-8 gap-1"
                  onClick={() => setActiveFilter(filter.key as any)}
                >
                  {filter.label}
                  {filter.count > 0 && (
                    <Badge variant="secondary" className="h-4 w-4 text-xs p-0 flex items-center justify-center">
                      {filter.count}
                    </Badge>
                  )}
                </Button>
              ))}
            </div>
          </motion.div>
        )}
      </div>

      {/* New Chat Button */}
      {!isCollapsed && (
        <div className="p-4">
          <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
            <Button className="w-full justify-center gap-2 bg-primary hover:bg-primary/90 shadow-sm" variant="default">
              <Plus className="h-4 w-4" />
              محادثة جديدة
            </Button>
          </motion.div>
        </div>
      )}

      {/* Conversations List */}
      <div className="flex-1 overflow-y-auto">
        {!isCollapsed && (
          <>
            {pinnedConversations.length > 0 && (
              <div className="p-2">
                <h3 className="text-xs font-medium text-muted-foreground mb-2 px-2 flex items-center gap-2">
                  <Pin className="h-3 w-3" />
                  المحادثات المثبتة
                </h3>
                <AnimatePresence>
                  {pinnedConversations.map((conversation) => (
                    <ConversationItem key={conversation.id} conversation={conversation} />
                  ))}
                </AnimatePresence>
              </div>
            )}
            
            {regularConversations.length > 0 && (
              <div className="p-2">
                {pinnedConversations.length > 0 && <Separator className="my-2" />}
                <h3 className="text-xs font-medium text-muted-foreground mb-2 px-2">
                  المحادثات الأخيرة
                </h3>
                <AnimatePresence>
                  {regularConversations.map((conversation) => (
                    <ConversationItem key={conversation.id} conversation={conversation} />
                  ))}
                </AnimatePresence>
              </div>
            )}

            {filteredConversations.length === 0 && (
              <div className="p-8 text-center">
                <div className="text-muted-foreground">
                  <Search className="h-8 w-8 mx-auto mb-2 opacity-50" />
                  <p className="text-sm">لا توجد محادثات</p>
                  <p className="text-xs">جرب البحث بكلمات أخرى</p>
                </div>
              </div>
            )}
          </>
        )}
        
        {isCollapsed && (
          <div className="p-2 space-y-2">
            {conversations.slice(0, 8).map((conversation) => (
              <motion.div
                key={conversation.id}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className={`relative p-2 cursor-pointer rounded-lg transition-colors mx-auto w-12 h-12 flex items-center justify-center ${
                  selectedConversationId === conversation.id ? 'bg-primary/10' : 'hover:bg-muted/50'
                }`}
                onClick={() => onConversationSelect(conversation.id)}
              >
                <Avatar className="h-10 w-10">
                  <AvatarImage 
                    src={conversation.isGroup ? conversation.groupAvatar : conversation.participants[0]?.avatar} 
                    alt={conversation.isGroup ? conversation.groupName : conversation.participants[0]?.name} 
                  />
                  <AvatarFallback className="text-xs">
                    {(conversation.isGroup ? conversation.groupName : conversation.participants[0]?.name)?.charAt(0)}
                  </AvatarFallback>
                </Avatar>
                {conversation.unreadCount > 0 && (
                  <Badge variant="destructive" className="absolute -top-1 -right-1 h-5 w-5 text-xs p-0 flex items-center justify-center">
                    {conversation.unreadCount > 9 ? '9+' : conversation.unreadCount}
                  </Badge>
                )}
              </motion.div>
            ))}
          </div>
        )}
      </div>

      {/* Archive Button */}
      {!isCollapsed && (
        <div className="p-4 border-t border-sidebar-border bg-sidebar/30">
          <Button variant="ghost" className="w-full justify-start gap-2 text-muted-foreground hover:text-foreground">
            <Archive className="h-4 w-4" />
            المحادثات المؤرشفة
            <Badge variant="outline" className="mr-auto">3</Badge>
          </Button>
        </div>
      )}
    </motion.div>
  );
}