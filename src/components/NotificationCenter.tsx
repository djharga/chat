import React, { useState } from 'react';
import { Bell, X, Check, MessageCircle, Phone, Settings, Archive, Trash2 } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from './ui/dialog';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { ScrollArea } from './ui/scroll-area';
import { Avatar, AvatarImage, AvatarFallback } from './ui/avatar';

interface Notification {
  id: string;
  type: 'message' | 'call' | 'system' | 'group';
  title: string;
  content: string;
  avatar?: string;
  timestamp: Date;
  isRead: boolean;
  priority: 'low' | 'normal' | 'high';
  conversationId?: string;
}

interface NotificationCenterProps {
  isOpen: boolean;
  onClose: () => void;
  notifications: Notification[];
  onNotificationAction: (notificationId: string, action: 'read' | 'archive' | 'delete') => void;
  onNavigateToChat: (conversationId: string) => void;
}

export function NotificationCenter({ 
  isOpen, 
  onClose, 
  notifications, 
  onNotificationAction,
  onNavigateToChat 
}: NotificationCenterProps) {
  const [filter, setFilter] = useState<'all' | 'unread'>('all');

  const filteredNotifications = notifications.filter(notification => {
    if (filter === 'unread') return !notification.isRead;
    return true;
  });

  const unreadCount = notifications.filter(n => !n.isRead).length;

  const getNotificationIcon = (type: Notification['type']) => {
    switch (type) {
      case 'message': return MessageCircle;
      case 'call': return Phone;
      case 'system': return Settings;
      default: return Bell;
    }
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

  const handleNotificationClick = (notification: Notification) => {
    if (!notification.isRead) {
      onNotificationAction(notification.id, 'read');
    }

    if (notification.conversationId) {
      onNavigateToChat(notification.conversationId);
      onClose();
    }
  };

  const markAllAsRead = () => {
    notifications.forEach(n => {
      if (!n.isRead) {
        onNotificationAction(n.id, 'read');
      }
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md h-[80vh] flex flex-col p-0">
        <DialogHeader className="p-4 pb-0">
          <div className="flex items-center justify-between">
            <div className="flex gap-2">
              <Button
                variant={filter === 'all' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => setFilter('all')}
              >
                الكل ({notifications.length})
              </Button>
              <Button
                variant={filter === 'unread' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => setFilter('unread')}
              >
                غير مقروءة ({unreadCount})
              </Button>
            </div>
            <DialogTitle className="text-right">الإشعارات</DialogTitle>
          </div>
          
          {unreadCount > 0 && (
            <div className="pt-2">
              <Button variant="outline" size="sm" onClick={markAllAsRead}>
                <Check className="h-4 w-4 ml-2" />
                تحديد الكل كمقروء
              </Button>
            </div>
          )}
        </DialogHeader>

        <ScrollArea className="flex-1 px-4">
          <div className="py-4">
            {filteredNotifications.length > 0 ? (
              <div className="space-y-2">
                <AnimatePresence>
                  {filteredNotifications.map((notification) => {
                    const Icon = getNotificationIcon(notification.type);
                    
                    return (
                      <motion.div
                        key={notification.id}
                        layout
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        className={`group relative p-3 rounded-lg border transition-all cursor-pointer ${
                          notification.isRead 
                            ? 'bg-background hover:bg-muted/50' 
                            : 'bg-primary/5 border-primary/20 hover:bg-primary/10'
                        }`}
                        onClick={() => handleNotificationClick(notification)}
                      >
                        <div className="flex items-start gap-3">
                          {notification.avatar ? (
                            <Avatar className="h-8 w-8">
                              <AvatarImage src={notification.avatar} alt={notification.title} />
                              <AvatarFallback>{notification.title.charAt(0)}</AvatarFallback>
                            </Avatar>
                          ) : (
                            <div className="h-8 w-8 rounded-full bg-muted flex items-center justify-center">
                              <Icon className="h-4 w-4" />
                            </div>
                          )}

                          <div className="flex-1 min-w-0 text-right">
                            <div className="flex items-center justify-between mb-1">
                              <div className="flex items-center gap-2">
                                {notification.priority === 'high' && (
                                  <Badge variant="destructive" className="text-xs">عاجل</Badge>
                                )}
                                <span className="text-xs text-muted-foreground">
                                  {formatTimestamp(notification.timestamp)}
                                </span>
                              </div>
                              <h4 className={`font-medium truncate ${!notification.isRead ? 'font-semibold' : ''}`}>
                                {notification.title}
                              </h4>
                            </div>
                            <p className="text-sm text-muted-foreground line-clamp-2 text-right">
                              {notification.content}
                            </p>
                          </div>

                          <div className="opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-1">
                            <Button
                              variant="ghost"
                              size="sm"
                              className="h-6 w-6 p-0"
                              onClick={(e) => {
                                e.stopPropagation();
                                onNotificationAction(notification.id, 'archive');
                              }}
                            >
                              <Archive className="h-3 w-3" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              className="h-6 w-6 p-0 text-destructive"
                              onClick={(e) => {
                                e.stopPropagation();
                                onNotificationAction(notification.id, 'delete');
                              }}
                            >
                              <X className="h-3 w-3" />
                            </Button>
                          </div>
                        </div>
                      </motion.div>
                    );
                  })}
                </AnimatePresence>
              </div>
            ) : (
              <div className="py-12 text-center">
                <Bell className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                <h3 className="font-medium mb-2">لا توجد إشعارات</h3>
                <p className="text-sm text-muted-foreground">
                  {filter === 'unread' ? 'جميع الإشعارات مقروءة' : 'لا توجد إشعارات في الوقت الحالي'}
                </p>
              </div>
            )}
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}