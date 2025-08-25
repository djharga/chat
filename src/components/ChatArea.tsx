import React, { useState, useRef, useEffect } from 'react';
import { MoreVertical, Phone, Video, Search, Info, ArrowLeft, Play, Download, CheckCheck, Check, Clock } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { Avatar, AvatarImage, AvatarFallback } from './ui/avatar';
import { Button } from './ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from './ui/dropdown-menu';
import { Badge } from './ui/badge';
import { MessageComposer } from './MessageComposer';
import { messages, users, conversations, currentUser } from '../data/mockData';
import { Message, User, Conversation } from '../types/chat';

interface ChatAreaProps {
  conversationId: string | null;
  onBack?: () => void;
  isMobile?: boolean;
}

export function ChatArea({ conversationId, onBack, isMobile }: ChatAreaProps) {
  const [chatMessages, setChatMessages] = useState<Message[]>(messages);
  const [isTyping, setIsTyping] = useState(false);
  const [showScrollToBottom, setShowScrollToBottom] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const messagesContainerRef = useRef<HTMLDivElement>(null);

  const conversation = conversations.find(c => c.id === conversationId);
  const participant = conversation?.participants[0];

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [chatMessages]);

  useEffect(() => {
    const container = messagesContainerRef.current;
    if (!container) return;

    const handleScroll = () => {
      const { scrollTop, scrollHeight, clientHeight } = container;
      const isNearBottom = scrollHeight - scrollTop - clientHeight < 100;
      setShowScrollToBottom(!isNearBottom);
    };

    container.addEventListener('scroll', handleScroll);
    return () => container.removeEventListener('scroll', handleScroll);
  }, []);

  const handleSendMessage = (content: string, type: 'text' | 'voice' | 'image') => {
    const newMessage: Message = {
      id: Date.now().toString(),
      senderId: 'current-user',
      content,
      timestamp: new Date(),
      type,
      status: 'sent'
    };

    setChatMessages(prev => [...prev, newMessage]);

    // Simulate message status updates
    setTimeout(() => {
      setChatMessages(prev => 
        prev.map(msg => 
          msg.id === newMessage.id ? { ...msg, status: 'delivered' } : msg
        )
      );
    }, 1000);

    setTimeout(() => {
      setChatMessages(prev => 
        prev.map(msg => 
          msg.id === newMessage.id ? { ...msg, status: 'read' } : msg
        )
      );
    }, 2000);

    // Simulate typing and response
    if (type === 'text' && content.trim()) {
      setIsTyping(true);
      setTimeout(() => {
        setIsTyping(false);
        const responses = [
          'شكراً لك على رسالتك! 😊',
          'هذا رائع! متى يمكننا مناقشة التفاصيل؟',
          'أقدر تواصلك المستمر 🙏',
          'سأراجع الأمر وأعود إليك قريباً',
          'فكرة ممتازة! دعنا نعمل عليها',
        ];
        
        const randomResponse = responses[Math.floor(Math.random() * responses.length)];
        
        const responseMessage: Message = {
          id: (Date.now() + 1).toString(),
          senderId: participant?.id || '1',
          content: randomResponse,
          timestamp: new Date(),
          type: 'text',
          status: 'sent'
        };
        setChatMessages(prev => [...prev, responseMessage]);
      }, 1500 + Math.random() * 2000);
    }
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const formatMessageTime = (timestamp: Date) => {
    return timestamp.toLocaleTimeString('ar-SA', { 
      hour: '2-digit', 
      minute: '2-digit',
      hour12: false 
    });
  };

  const formatMessageDate = (timestamp: Date) => {
    const today = new Date();
    const messageDate = new Date(timestamp);
    
    if (messageDate.toDateString() === today.toDateString()) {
      return 'اليوم';
    }
    
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);
    if (messageDate.toDateString() === yesterday.toDateString()) {
      return 'أمس';
    }
    
    return messageDate.toLocaleDateString('ar-SA');
  };

  const MessageStatusIcon = ({ status }: { status: Message['status'] }) => {
    switch (status) {
      case 'sent':
        return <Clock className="h-3 w-3 text-muted-foreground" />;
      case 'delivered':
        return <Check className="h-3 w-3 text-blue-500" />;
      case 'read':
        return <CheckCheck className="h-3 w-3 text-green-500" />;
      default:
        return null;
    }
  };

  const MessageBubble = ({ message, isOwn, showAvatar = true }: { 
    message: Message; 
    isOwn: boolean; 
    showAvatar?: boolean;
  }) => {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20, scale: 0.8 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.3, ease: 'easeOut' }}
        className={`flex ${isOwn ? 'justify-start' : 'justify-end'} mb-2 group`}
      >
        <div className={`max-w-[70%] md:max-w-sm lg:max-w-md ${isOwn ? 'order-2' : 'order-1'}`}>
          <motion.div
            whileHover={{ scale: 1.01 }}
            className={`relative p-3 rounded-2xl shadow-sm message-bubble ${
              isOwn
                ? 'message-bubble-own text-foreground rounded-br-md'
                : 'message-bubble-other text-primary-foreground rounded-bl-md'
            }`}
          >
            {message.type === 'text' && (
              <p className="text-sm leading-relaxed whitespace-pre-wrap break-words" dir="rtl">
                {message.content}
              </p>
            )}

            {message.type === 'image' && message.attachments && (
              <div className="space-y-2">
                {message.attachments.map((attachment, index) => (
                  <div key={index} className="relative rounded-lg overflow-hidden">
                    <img 
                      src={attachment.url} 
                      alt={attachment.name}
                      className="max-w-full h-auto rounded-lg"
                      loading="lazy"
                    />
                    <motion.div 
                      initial={{ opacity: 0 }}
                      whileHover={{ opacity: 1 }}
                      className="absolute inset-0 bg-black/20 flex items-center justify-center transition-opacity"
                    >
                      <Button variant="ghost" size="sm" className="text-white bg-black/30 hover:bg-black/50">
                        <Download className="h-4 w-4" />
                      </Button>
                    </motion.div>
                  </div>
                ))}
                {message.content && (
                  <p className="text-sm mt-2" dir="rtl">{message.content}</p>
                )}
              </div>
            )}

            {message.type === 'voice' && (
              <div className="flex items-center gap-3 min-w-48">
                <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
                  <Button variant="ghost" size="sm" className="h-8 w-8 p-0 shrink-0">
                    <Play className="h-4 w-4" />
                  </Button>
                </motion.div>
                <div className="flex-1 flex items-center gap-1">
                  {Array.from({ length: 20 }).map((_, index) => (
                    <motion.div
                      key={index}
                      initial={{ height: '0.5rem' }}
                      animate={{ 
                        height: Math.random() > 0.5 ? '0.5rem' : '1rem'
                      }}
                      transition={{ delay: index * 0.05 }}
                      className="w-1 bg-current rounded-full min-h-2"
                    />
                  ))}
                </div>
                <span className="text-xs opacity-70">
                  {message.attachments?.[0]?.duration ? 
                    `${Math.floor(message.attachments[0].duration / 60)}:${(message.attachments[0].duration % 60).toString().padStart(2, '0')}` 
                    : '0:42'
                  }
                </span>
              </div>
            )}

            {/* Message Status & Time */}
            <div className={`flex items-center justify-between mt-2 gap-2 ${isOwn ? 'flex-row' : 'flex-row-reverse'}`}>
              <span className="text-xs opacity-70 flex-shrink-0">
                {formatMessageTime(message.timestamp)}
              </span>
              {isOwn && (
                <div className="flex items-center gap-1">
                  <MessageStatusIcon status={message.status} />
                </div>
              )}
            </div>
          </motion.div>
        </div>

        {/* Avatar */}
        {!isOwn && showAvatar && (
          <Avatar className={`h-8 w-8 ${isOwn ? 'order-1 ml-2' : 'order-2 mr-2'} mt-auto mb-2 opacity-0 group-hover:opacity-100 transition-opacity`}>
            <AvatarImage src={participant?.avatar} alt={participant?.name} />
            <AvatarFallback className="text-xs">{participant?.name?.charAt(0)}</AvatarFallback>
          </Avatar>
        )}
      </motion.div>
    );
  };

  if (!conversation) {
    return (
      <div className="flex-1 flex items-center justify-center bg-gradient-to-br from-muted/20 to-muted/40">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center p-8"
        >
          <div className="w-24 h-24 mx-auto mb-6 bg-primary/10 rounded-full flex items-center justify-center">
            <Search className="h-12 w-12 text-primary/50" />
          </div>
          <h3 className="text-lg font-medium mb-2">اختر محادثة للبدء</h3>
          <p className="text-muted-foreground mb-4">
            اختر محادثة من القائمة أو ابدأ محادثة جديدة
          </p>
          <Button variant="outline" className="gap-2">
            محادثة جديدة
          </Button>
        </motion.div>
      </div>
    );
  }

  const displayName = conversation.isGroup ? conversation.groupName : participant?.name;
  const displayAvatar = conversation.isGroup ? conversation.groupAvatar : participant?.avatar;
  const isOnline = !conversation.isGroup && participant?.status === 'online';

  // Group messages by date
  const groupedMessages = chatMessages.reduce((groups, message) => {
    const date = formatMessageDate(message.timestamp);
    if (!groups[date]) groups[date] = [];
    groups[date].push(message);
    return groups;
  }, {} as Record<string, Message[]>);

  return (
    <div className="flex-1 flex flex-col bg-background relative">
      {/* Chat Header */}
      <motion.div 
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 p-4 shadow-sm"
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            {isMobile && (
              <Button variant="ghost" size="sm" onClick={onBack}>
                <ArrowLeft className="h-4 w-4" />
              </Button>
            )}
            
            <div className="relative">
              <Avatar className="h-10 w-10 ring-2 ring-primary/10">
                <AvatarImage src={displayAvatar} alt={displayName} />
                <AvatarFallback>{displayName?.charAt(0)}</AvatarFallback>
              </Avatar>
              {isOnline && (
                <motion.div 
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-500 rounded-full border-2 border-background" 
                />
              )}
            </div>

            <div className="text-right">
              <h2 className="font-medium">{displayName}</h2>
              <p className="text-sm text-muted-foreground">
                {conversation.isGroup ? 
                  `${conversation.participants.length} أعضاء` :
                  isOnline ? 'متصل الآن' : 
                  participant?.lastSeen ? `آخر ظهور ${formatMessageTime(participant.lastSeen)}` : 'غير متصل'
                }
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {!conversation.isGroup && (
              <>
                <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
                  <Button variant="ghost" size="sm" className="text-green-600 hover:text-green-700 hover:bg-green-50">
                    <Phone className="h-4 w-4" />
                  </Button>
                </motion.div>
                <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
                  <Button variant="ghost" size="sm" className="text-blue-600 hover:text-blue-700 hover:bg-blue-50">
                    <Video className="h-4 w-4" />
                  </Button>
                </motion.div>
              </>
            )}
            <Button variant="ghost" size="sm">
              <Search className="h-4 w-4" />
            </Button>
            
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm">
                  <MoreVertical className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="text-right w-48">
                <DropdownMenuItem>
                  <Info className="h-4 w-4 ml-2" />
                  معلومات المحادثة
                </DropdownMenuItem>
                <DropdownMenuItem>البحث في المحادثة</DropdownMenuItem>
                <DropdownMenuItem>تصدير المحادثة</DropdownMenuItem>
                <DropdownMenuItem>كتم الإشعارات</DropdownMenuItem>
                <DropdownMenuItem>مسح المحادثة</DropdownMenuItem>
                {!conversation.isGroup && (
                  <DropdownMenuItem>حظر المستخدم</DropdownMenuItem>
                )}
                <DropdownMenuItem className="text-destructive">
                  حذف المحادثة
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </motion.div>

      {/* Messages Area */}
      <div 
        ref={messagesContainerRef}
        className="flex-1 overflow-y-auto p-4 space-y-4 bg-gradient-to-b from-background to-muted/10"
      >
        <AnimatePresence>
          {Object.entries(groupedMessages).map(([date, messages]) => (
            <div key={date}>
              {/* Date Separator */}
              <div className="flex items-center justify-center mb-4">
                <div className="bg-muted/50 text-muted-foreground text-xs px-3 py-1 rounded-full">
                  {date}
                </div>
              </div>
              
              {/* Messages for this date */}
              {messages.map((message, index) => {
                const nextMessage = messages[index + 1];
                const showAvatar = !nextMessage || nextMessage.senderId !== message.senderId;
                
                return (
                  <MessageBubble
                    key={message.id}
                    message={message}
                    isOwn={message.senderId === 'current-user'}
                    showAvatar={showAvatar}
                  />
                );
              })}
            </div>
          ))}
        </AnimatePresence>
        
        {/* Typing Indicator */}
        <AnimatePresence>
          {isTyping && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 10 }}
              className="flex justify-end mb-4"
            >
              <div className="flex items-center gap-3 bg-muted/50 rounded-2xl p-3 max-w-20">
                <Avatar className="h-6 w-6">
                  <AvatarImage src={participant?.avatar} alt={participant?.name} />
                  <AvatarFallback className="text-xs">{participant?.name?.charAt(0)}</AvatarFallback>
                </Avatar>
                <div className="flex gap-1">
                  <motion.div
                    animate={{ scale: [1, 1.2, 1] }}
                    transition={{ duration: 0.6, repeat: Infinity, delay: 0 }}
                    className="w-2 h-2 bg-primary rounded-full"
                  />
                  <motion.div
                    animate={{ scale: [1, 1.2, 1] }}
                    transition={{ duration: 0.6, repeat: Infinity, delay: 0.2 }}
                    className="w-2 h-2 bg-primary rounded-full"
                  />
                  <motion.div
                    animate={{ scale: [1, 1.2, 1] }}
                    transition={{ duration: 0.6, repeat: Infinity, delay: 0.4 }}
                    className="w-2 h-2 bg-primary rounded-full"
                  />
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
        
        <div ref={messagesEndRef} />
      </div>

      {/* Scroll to Bottom Button */}
      <AnimatePresence>
        {showScrollToBottom && (
          <motion.div
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0 }}
            className="absolute bottom-20 left-4 z-10"
          >
            <Button
              variant="outline"
              size="sm"
              onClick={scrollToBottom}
              className="rounded-full shadow-lg bg-background/90 backdrop-blur"
            >
              ↓
            </Button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Message Composer */}
      <MessageComposer onSendMessage={handleSendMessage} isTyping={isTyping} />
    </div>
  );
}