// App Constants and Configuration
export const APP_CONFIG = {
  name: 'تطبيق الدردشة العربي المتطور',
  version: '2.1.0',
  notificationCheckInterval: 10000, // 10 seconds
  maxNotifications: 10,
  autoLockTimes: [1, 5, 15, 30], // minutes
  supportedLanguages: ['ar', 'en'],
  themes: ['light', 'dark', 'auto'] as const,
  colorSchemes: ['blue', 'green', 'purple', 'orange'] as const
};

export const KEYBOARD_SHORTCUTS = {
  globalSearch: { key: 'k', ctrlKey: true },
  newChat: { key: 'N', ctrlKey: true, shiftKey: true },
  settings: { key: ',', ctrlKey: true },
  escape: { key: 'Escape' }
};

export const NOTIFICATION_TYPES = {
  MESSAGE: 'message',
  CALL: 'call', 
  SYSTEM: 'system',
  GROUP: 'group'
} as const;

export const MOBILE_BREAKPOINT = 768;

export const ANIMATION_DELAYS = {
  newChatButton: 0.5,
  themeButton: 0.7,
  settingsButton: 0.9
};

export const MOCK_NOTIFICATIONS = [
  { 
    title: 'رسالة جديدة من فاطمة', 
    message: 'مرحباً! كيف حالك؟', 
    type: NOTIFICATION_TYPES.MESSAGE 
  },
  { 
    title: 'مكالمة فائتة من محمد', 
    message: 'مكالمة صوتية', 
    type: NOTIFICATION_TYPES.CALL 
  },
  { 
    title: 'تحديث النظام', 
    message: 'تم تحديث التطبيق بنجاح', 
    type: NOTIFICATION_TYPES.SYSTEM 
  }
];

export const STORAGE_KEYS = {
  darkMode: 'darkMode',
  userPreferences: 'userPreferences',
  chatSettings: 'chatSettings'
};

export const TAB_TYPES = {
  CHATS: 'chats',
  CONTACTS: 'contacts', 
  SETTINGS: 'settings'
} as const;