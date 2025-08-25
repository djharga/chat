import { MOBILE_BREAKPOINT, STORAGE_KEYS } from './constants';

// Dark mode utilities
export const getDarkModePreference = (): boolean => {
  if (typeof window === 'undefined') return false;
  
  const stored = localStorage.getItem(STORAGE_KEYS.darkMode);
  if (stored) return JSON.parse(stored);
  
  return window.matchMedia('(prefers-color-scheme: dark)').matches;
};

export const saveDarkModePreference = (isDark: boolean): void => {
  if (typeof window !== 'undefined') {
    localStorage.setItem(STORAGE_KEYS.darkMode, JSON.stringify(isDark));
  }
};

export const applyDarkMode = (isDark: boolean): void => {
  if (isDark) {
    document.documentElement.classList.add('dark');
  } else {
    document.documentElement.classList.remove('dark');
  }
};

// Mobile detection
export const isMobileDevice = (): boolean => {
  return window.innerWidth < MOBILE_BREAKPOINT;
};

// Keyboard shortcuts
export const isKeyboardShortcut = (
  event: KeyboardEvent,
  shortcut: { key: string; ctrlKey?: boolean; shiftKey?: boolean }
): boolean => {
  const { key, ctrlKey, shiftKey } = shortcut;
  const isCtrlPressed = ctrlKey ? (event.ctrlKey || event.metaKey) : true;
  const isShiftPressed = shiftKey ? event.shiftKey : true;
  
  return event.key === key && isCtrlPressed && isShiftPressed;
};

// Notification utilities
export const filterNotificationsByType = (
  notifications: Array<{ type: string }>,
  excludeType?: string
): number => {
  if (excludeType) {
    return notifications.filter(n => n.type !== excludeType).length;
  }
  return notifications.length;
};

// Toast message helpers
export const getThemeToggleMessage = (isDark: boolean): string => {
  return isDark ? 'تم تفعيل الوضع النهاري' : 'تم تفعيل الوضع الليلي';
};

export const getCallTypeMessage = (type: 'voice' | 'video'): string => {
  return `جاري بدء ${type === 'voice' ? 'مكالمة صوتية' : 'مكالمة مرئية'}...`;
};

// Animation utilities
export const createStaggeredAnimation = (index: number, baseDelay: number = 0.1) => ({
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { delay: index * baseDelay }
});

// Local storage utilities
export const saveToStorage = (key: string, data: any): void => {
  if (typeof window !== 'undefined') {
    localStorage.setItem(key, JSON.stringify(data));
  }
};

export const loadFromStorage = (key: string, defaultValue: any): any => {
  if (typeof window !== 'undefined') {
    const stored = localStorage.getItem(key);
    if (stored) {
      try {
        return JSON.parse(stored);
      } catch {
        return defaultValue;
      }
    }
  }
  return defaultValue;
};

// Notification generation
export const generateNotificationId = (): string => {
  return Date.now().toString();
};

export const createNotification = (
  title: string,
  message: string,
  type: string
) => ({
  id: generateNotificationId(),
  title,
  message,
  type,
  timestamp: new Date()
});