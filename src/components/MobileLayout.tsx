import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Sidebar } from './Sidebar';
import { ChatArea } from './ChatArea';
import { MessageCircle, Users, Settings, Search, User, Sun, Moon, Plus } from 'lucide-react';
import { TAB_TYPES } from '../utils/constants';

interface MobileLayoutProps {
  // State props
  showMobileChatArea: boolean;
  selectedConversationId: string | null;
  activeTab: string;
  isDarkMode: boolean;
  notifications: Array<{ id: string; type: string; title: string; message: string }>;
  
  // Handler props
  onConversationSelect: (id: string) => void;
  onBackToList: () => void;
  onToggleDarkMode: () => void;
  onShowGlobalSearch: () => void;
  onShowUserProfile: () => void;
  onShowContactsManager: () => void;
  onShowAdvancedSettings: () => void;
  onSetActiveTab: (tab: string) => void;
  onNewChat: () => void;
  
  // Utility functions
  getUnreadCount: () => number;
}

export function MobileLayout({
  showMobileChatArea,
  selectedConversationId,
  activeTab,
  isDarkMode,
  notifications,
  onConversationSelect,
  onBackToList,
  onToggleDarkMode,
  onShowGlobalSearch,
  onShowUserProfile,
  onShowContactsManager,
  onShowAdvancedSettings,
  onSetActiveTab,
  onNewChat,
  getUnreadCount
}: MobileLayoutProps) {
  const ContactsTabContent = () => (
    <div className="p-4">
      <div className="text-center py-8">
        <Users className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
        <h3 className="font-medium mb-2">جهات الاتصال</h3>
        <p className="text-sm text-muted-foreground mb-4">
          إدارة جهات الاتصال والأصدقاء
        </p>
        <Button onClick={onShowContactsManager}>
          <Users className="h-4 w-4 ml-2" />
          فتح إدارة جهات الاتصال
        </Button>
      </div>
    </div>
  );

  const SettingsTabContent = () => (
    <div className="p-4">
      <div className="space-y-3">
        <Button 
          variant="outline" 
          className="w-full justify-between"
          onClick={onShowAdvancedSettings}
        >
          <Settings className="h-4 w-4" />
          <span>الإعدادات المتقدمة</span>
        </Button>
        
        <Button 
          variant="outline" 
          className="w-full justify-between"
          onClick={onShowUserProfile}
        >
          <User className="h-4 w-4" />
          <span>الملف الشخصي</span>
        </Button>
        
        <Button 
          variant="outline" 
          className="w-full justify-between"
          onClick={onToggleDarkMode}
        >
          {isDarkMode ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
          <span>{isDarkMode ? 'الوضع النهاري' : 'الوضع الليلي'}</span>
        </Button>
        
        <div className="mt-6 p-4 bg-muted/30 rounded-lg">
          <h4 className="font-medium mb-2 text-right">إشعارات غير مقروءة</h4>
          {notifications.length > 0 ? (
            <div className="space-y-2">
              {notifications.slice(0, 3).map(notification => (
                <div key={notification.id} className="p-2 bg-background rounded text-sm">
                  <div className="font-medium text-right">{notification.title}</div>
                  <div className="text-muted-foreground text-right">{notification.message}</div>
                </div>
              ))}
              {notifications.length > 3 && (
                <div className="text-center text-sm text-muted-foreground">
                  و {notifications.length - 3} إشعارات أخرى
                </div>
              )}
            </div>
          ) : (
            <p className="text-sm text-muted-foreground text-right">لا توجد إشعارات جديدة</p>
          )}
        </div>
      </div>
    </div>
  );

  const MobileHeader = () => (
    <div className="bg-primary text-primary-foreground p-4">
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-xl font-medium">دردشة</h1>
        <div className="flex gap-2">
          <Button 
            variant="ghost" 
            size="sm"
            onClick={onShowGlobalSearch}
            className="text-primary-foreground hover:bg-primary-foreground/20 relative"
          >
            <Search className="h-5 w-5" />
          </Button>
          <Button 
            variant="ghost" 
            size="sm"
            onClick={onShowUserProfile}
            className="text-primary-foreground hover:bg-primary-foreground/20 relative"
          >
            <User className="h-5 w-5" />
            {getUnreadCount() > 0 && (
              <Badge 
                variant="destructive" 
                className="absolute -top-1 -right-1 h-5 w-5 text-xs p-0 flex items-center justify-center"
              >
                {getUnreadCount()}
              </Badge>
            )}
          </Button>
        </div>
      </div>
    </div>
  );

  const BottomNavigation = () => (
    <div className="bg-background border-t px-4 py-2">
      <div className="flex justify-around">
        <Button
          variant={activeTab === TAB_TYPES.CHATS ? 'default' : 'ghost'}
          size="sm"
          onClick={() => onSetActiveTab(TAB_TYPES.CHATS)}
          className="flex-1 flex flex-col items-center gap-1 h-auto py-2 relative"
        >
          <MessageCircle className="h-5 w-5" />
          <span className="text-xs">المحادثات</span>
          {getUnreadCount() > 0 && (
            <Badge variant="destructive" className="absolute -top-1 -right-2 h-4 w-4 text-xs p-0 flex items-center justify-center">
              {getUnreadCount()}
            </Badge>
          )}
        </Button>
        
        <Button
          variant={activeTab === TAB_TYPES.CONTACTS ? 'default' : 'ghost'}
          size="sm"
          onClick={() => onSetActiveTab(TAB_TYPES.CONTACTS)}
          className="flex-1 flex flex-col items-center gap-1 h-auto py-2"
        >
          <Users className="h-5 w-5" />
          <span className="text-xs">جهات الاتصال</span>
        </Button>
        
        <Button
          variant={activeTab === TAB_TYPES.SETTINGS ? 'default' : 'ghost'}
          size="sm"
          onClick={() => onSetActiveTab(TAB_TYPES.SETTINGS)}
          className="flex-1 flex flex-col items-center gap-1 h-auto py-2"
        >
          <Settings className="h-5 w-5" />
          <span className="text-xs">الإعدادات</span>
        </Button>
      </div>
    </div>
  );

  const TabContent = () => {
    switch (activeTab) {
      case TAB_TYPES.CHATS:
        return (
          <Sidebar
            isCollapsed={false}
            selectedConversationId={selectedConversationId}
            onConversationSelect={onConversationSelect}
            onToggleCollapse={() => {}}
            isDarkMode={isDarkMode}
            onToggleDarkMode={onToggleDarkMode}
          />
        );
      case TAB_TYPES.CONTACTS:
        return <ContactsTabContent />;
      case TAB_TYPES.SETTINGS:
        return <SettingsTabContent />;
      default:
        return null;
    }
  };

  return (
    <div className="h-screen flex flex-col bg-background" dir="rtl">
      <AnimatePresence mode="wait">
        {!showMobileChatArea ? (
          <motion.div
            key="sidebar"
            initial={{ x: -300, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: -300, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="flex-1 flex flex-col"
          >
            <MobileHeader />
            <div className="flex-1">
              <TabContent />
            </div>
            <BottomNavigation />
          </motion.div>
        ) : (
          <motion.div
            key="chat"
            initial={{ x: 300, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: 300, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="flex-1"
          >
            <ChatArea
              conversationId={selectedConversationId}
              onBack={onBackToList}
              isMobile={true}
            />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Floating Action Button for New Chat (Mobile) */}
      {!showMobileChatArea && (
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.5 }}
          className="fixed bottom-20 left-4 z-40"
        >
          <Button 
            size="lg" 
            onClick={onNewChat}
            className="rounded-full w-14 h-14 p-0 shadow-lg hover:shadow-xl transition-shadow"
          >
            <Plus className="h-6 w-6" />
          </Button>
        </motion.div>
      )}
    </div>
  );
}