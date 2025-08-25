import React, { useState, useEffect, Suspense, lazy } from 'react';

// Lazy-loaded components for code-splitting
const MobileLayout = lazy(() => import('./components/MobileLayout').then(m => ({ default: m.MobileLayout })));
const DesktopLayout = lazy(() => import('./components/DesktopLayout').then(m => ({ default: m.DesktopLayout })));
const UserProfile = lazy(() => import('./components/UserProfile').then(m => ({ default: m.UserProfile })));
const GlobalSearch = lazy(() => import('./components/GlobalSearch').then(m => ({ default: m.GlobalSearch })));
const ContactsManager = lazy(() => import('./components/ContactsManager').then(m => ({ default: m.ContactsManager })));
const AdvancedSettings = lazy(() => import('./components/AdvancedSettings').then(m => ({ default: m.AdvancedSettings })));
const NotificationCenter = lazy(() => import('./components/NotificationCenter').then(m => ({ default: m.NotificationCenter })));
import { Toaster } from './components/ui/sonner';
import { toast } from 'sonner';

// Utils and constants
import { 
  getDarkModePreference, 
  saveDarkModePreference, 
  applyDarkMode,
  isMobileDevice,
  isKeyboardShortcut,
  filterNotificationsByType,
  getThemeToggleMessage,
  getCallTypeMessage,
  createNotification
} from './utils/helpers';
import { 
  APP_CONFIG, 
  KEYBOARD_SHORTCUTS, 
  MOCK_NOTIFICATIONS
} from './utils/constants';

interface AppNotification {
  id: string;
  title: string;
  message: string;
  type: 'message' | 'call' | 'system';
  timestamp: Date;
}

type TabType = 'chats' | 'contacts' | 'settings';

export default function App() {
  // Core state
  const [selectedConversationId, setSelectedConversationId] = useState<string | null>('1');
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(getDarkModePreference);
  const [isMobile, setIsMobile] = useState(false);
  
  // Mobile specific state
  const [showMobileChatArea, setShowMobileChatArea] = useState(false);
  const [activeTab, setActiveTab] = useState<TabType>('chats');
  
  // Modal states
  const [showUserProfile, setShowUserProfile] = useState(false);
  const [showGlobalSearch, setShowGlobalSearch] = useState(false);
  const [showContactsManager, setShowContactsManager] = useState(false);
  const [showAdvancedSettings, setShowAdvancedSettings] = useState(false);
  const [showNotificationCenter, setShowNotificationCenter] = useState(false);
  
  // Notifications
  const [notifications, setNotifications] = useState<AppNotification[]>([]);

  // Mobile detection
  useEffect(() => {
    const checkMobile = () => setIsMobile(isMobileDevice());
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Dark mode management
  useEffect(() => {
    applyDarkMode(isDarkMode);
    saveDarkModePreference(isDarkMode);
  }, [isDarkMode]);

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (isKeyboardShortcut(e, KEYBOARD_SHORTCUTS.globalSearch)) {
        e.preventDefault();
        setShowGlobalSearch(true);
      } else if (isKeyboardShortcut(e, KEYBOARD_SHORTCUTS.newChat)) {
        e.preventDefault();
        setShowContactsManager(true);
      } else if (isKeyboardShortcut(e, KEYBOARD_SHORTCUTS.settings)) {
        e.preventDefault();
        setShowAdvancedSettings(true);
      } else if (isKeyboardShortcut(e, KEYBOARD_SHORTCUTS.escape)) {
        setShowGlobalSearch(false);
        setShowContactsManager(false);
        setShowAdvancedSettings(false);
        setShowUserProfile(false);
        setShowNotificationCenter(false);
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Notification simulation
  useEffect(() => {
    const interval = setInterval(() => {
      if (Math.random() > 0.7) { // 30% chance
        const mockNotification = MOCK_NOTIFICATIONS[Math.floor(Math.random() * MOCK_NOTIFICATIONS.length)];
        const newNotification = createNotification(
          mockNotification.title,
          mockNotification.message,
          mockNotification.type
        );
        
        setNotifications(prev => [newNotification, ...prev.slice(0, APP_CONFIG.maxNotifications - 1)]);
        
        toast(mockNotification.title, {
          description: mockNotification.message,
          action: mockNotification.type === 'message' ? {
            label: 'رد',
            onClick: () => setShowMobileChatArea(true)
          } : undefined,
        });
      }
    }, APP_CONFIG.notificationCheckInterval);

    return () => clearInterval(interval);
  }, []);

  // Event handlers
  const handleConversationSelect = (conversationId: string) => {
    setSelectedConversationId(conversationId);
    if (isMobile) setShowMobileChatArea(true);
    
    // Mark related notifications as read
    setNotifications(prev => prev.filter(n => 
      n.type !== 'message' || !n.title.includes('رسالة جديدة')
    ));
  };

  const handleBackToList = () => {
    if (isMobile) setShowMobileChatArea(false);
  };

  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode);
    toast.success(getThemeToggleMessage(isDarkMode));
  };

  const handleStartChat = (userId: string) => {
    toast.success('تم بدء محادثة جديدة');
    setShowContactsManager(false);
  };

  const handleStartCall = (userId: string, type: 'voice' | 'video') => {
    toast.info(getCallTypeMessage(type));
    setShowContactsManager(false);
  };

  const handleMessageSelect = (messageId: string, conversationId: string) => {
    setSelectedConversationId(conversationId);
    setShowGlobalSearch(false);
    if (isMobile) setShowMobileChatArea(true);
    toast.success('تم الانتقال إلى الرسالة');
  };

  const handleNewChat = () => setShowContactsManager(true);

  const getUnreadNotificationsCount = () => {
    return filterNotificationsByType(notifications, 'system');
  };

  const handleNotificationAction = (notificationId: string, action: 'read' | 'archive' | 'delete') => {
    setNotifications(prev => prev.filter(n => n.id !== notificationId));
  };

  // Shared props for layouts
  const sharedProps = {
    selectedConversationId,
    isDarkMode,
    onConversationSelect: handleConversationSelect,
    onToggleDarkMode: toggleDarkMode,
    onShowUserProfile: () => setShowUserProfile(true),
    onShowGlobalSearch: () => setShowGlobalSearch(true),
    onShowContactsManager: () => setShowContactsManager(true),
    onShowAdvancedSettings: () => setShowAdvancedSettings(true),
    onNewChat: handleNewChat,
    getUnreadCount: getUnreadNotificationsCount
  };

  return (
    <Suspense fallback={<div className="p-4 text-center">جارٍ التحميل...</div>}>
      <>
      {isMobile ? (
        <MobileLayout
          {...sharedProps}
          showMobileChatArea={showMobileChatArea}
          activeTab={activeTab}
          notifications={notifications}
          onBackToList={handleBackToList}
          onSetActiveTab={setActiveTab}
        />
      ) : (
        <DesktopLayout
          {...sharedProps}
          isSidebarCollapsed={isSidebarCollapsed}
          onToggleSidebar={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
        />
      )}

      {/* Modals */}
      <UserProfile 
        isOpen={showUserProfile} 
        onClose={() => setShowUserProfile(false)} 
      />
      
      <GlobalSearch
        isOpen={showGlobalSearch}
        onClose={() => setShowGlobalSearch(false)}
        onConversationSelect={handleConversationSelect}
        onMessageSelect={handleMessageSelect}
      />
      
      <ContactsManager
        isOpen={showContactsManager}
        onClose={() => setShowContactsManager(false)}
        onStartChat={handleStartChat}
        onStartCall={handleStartCall}
      />
      
      <AdvancedSettings
        isOpen={showAdvancedSettings}
        onClose={() => setShowAdvancedSettings(false)}
        isDarkMode={isDarkMode}
        onToggleDarkMode={toggleDarkMode}
      />

      <NotificationCenter
        isOpen={showNotificationCenter}
        onClose={() => setShowNotificationCenter(false)}
        notifications={notifications.map(n => ({
          ...n,
          content: n.message,
          isRead: false,
          priority: 'normal' as const
        }))}
        onNotificationAction={handleNotificationAction}
        onNavigateToChat={handleConversationSelect}
      />

      {/* Toast Notifications */}
      <Toaster 
        position="top-left"
        toastOptions={{
          style: {
            background: isDarkMode ? '#1f2937' : '#ffffff',
            color: isDarkMode ? '#f9fafb' : '#111827',
            border: `1px solid ${isDarkMode ? '#374151' : '#e5e7eb'}`,
            direction: 'rtl',
            textAlign: 'right'
          }
        }}
      />
      </>
    </Suspense>
  );
}