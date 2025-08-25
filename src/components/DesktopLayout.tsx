import React from 'react';
import { motion } from 'motion/react';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Sidebar } from './Sidebar';
import { ChatArea } from './ChatArea';
import { FloatingActionButtons } from './FloatingActionButtons';
import { User, Search, Users, Settings, Bell } from 'lucide-react';
import { APP_CONFIG } from '../utils/constants';

interface DesktopLayoutProps {
  // State props
  selectedConversationId: string | null;
  isSidebarCollapsed: boolean;
  isDarkMode: boolean;
  
  // Handler props
  onConversationSelect: (id: string) => void;
  onToggleSidebar: () => void;
  onToggleDarkMode: () => void;
  onShowUserProfile: () => void;
  onShowGlobalSearch: () => void;
  onShowContactsManager: () => void;
  onShowAdvancedSettings: () => void;
  onNewChat: () => void;
  
  // Utility functions
  getUnreadCount: () => number;
}

export function DesktopLayout({
  selectedConversationId,
  isSidebarCollapsed,
  isDarkMode,
  onConversationSelect,
  onToggleSidebar,
  onToggleDarkMode,
  onShowUserProfile,
  onShowGlobalSearch,
  onShowContactsManager,
  onShowAdvancedSettings,
  onNewChat,
  getUnreadCount
}: DesktopLayoutProps) {
  const DesktopHeader = () => (
    <div className="bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b border-border p-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button 
            variant="ghost" 
            size="sm"
            onClick={onShowUserProfile}
            className="relative"
          >
            <User className="h-4 w-4 ml-2" />
            الملف الشخصي
            {getUnreadCount() > 0 && (
              <Badge 
                variant="destructive" 
                className="absolute -top-1 -right-1 h-5 w-5 text-xs p-0 flex items-center justify-center"
              >
                {getUnreadCount()}
              </Badge>
            )}
          </Button>
          
          <Button 
            variant="ghost" 
            size="sm"
            onClick={onShowGlobalSearch}
          >
            <Search className="h-4 w-4 ml-2" />
            بحث شامل
            <Badge variant="outline" className="ml-2 text-xs">Ctrl+K</Badge>
          </Button>
          
          <Button 
            variant="ghost" 
            size="sm"
            onClick={onShowContactsManager}
          >
            <Users className="h-4 w-4 ml-2" />
            جهات الاتصال
          </Button>
          
          <Button 
            variant="ghost" 
            size="sm"
            onClick={onShowAdvancedSettings}
          >
            <Settings className="h-4 w-4 ml-2" />
            الإعدادات
          </Button>
        </div>
        
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <Badge variant="outline" className="gap-1">
              <div className="w-2 h-2 bg-green-500 rounded-full" />
              متصل
            </Badge>
            
            {getUnreadCount() > 0 && (
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="relative"
              >
                <Button variant="ghost" size="sm">
                  <Bell className="h-4 w-4" />
                </Button>
                <Badge 
                  variant="destructive" 
                  className="absolute -top-1 -right-1 h-5 w-5 text-xs p-0 flex items-center justify-center"
                >
                  {getUnreadCount()}
                </Badge>
              </motion.div>
            )}
          </div>
          
          <motion.h1 
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-lg font-medium bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent"
          >
            {APP_CONFIG.name}
          </motion.h1>
        </div>
      </div>
    </div>
  );

  return (
    <div className="h-screen flex bg-background" dir="rtl">
      {/* Sidebar */}
      <motion.div layout className="relative">
        <Sidebar
          isCollapsed={isSidebarCollapsed}
          selectedConversationId={selectedConversationId}
          onConversationSelect={onConversationSelect}
          onToggleCollapse={onToggleSidebar}
          isDarkMode={isDarkMode}
          onToggleDarkMode={onToggleDarkMode}
        />
      </motion.div>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col">
        <DesktopHeader />
        
        {/* Chat Area */}
        <div className="flex-1">
          <ChatArea conversationId={selectedConversationId} />
        </div>
      </div>

      {/* Floating Action Buttons */}
      <FloatingActionButtons
        onNewChat={onNewChat}
        onToggleDarkMode={onToggleDarkMode}
        onShowAdvancedSettings={onShowAdvancedSettings}
        isDarkMode={isDarkMode}
      />
    </div>
  );
}