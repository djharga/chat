export interface User {
  id: string;
  name: string;
  avatar: string;
  status: 'online' | 'offline' | 'away';
  lastSeen?: Date;
  bio?: string;
}

export interface Message {
  id: string;
  senderId: string;
  content: string;
  timestamp: Date;
  type: 'text' | 'image' | 'voice' | 'file';
  status: 'sent' | 'delivered' | 'read';
  attachments?: {
    type: 'image' | 'voice' | 'file';
    url: string;
    name?: string;
    duration?: number;
  }[];
}

export interface Conversation {
  id: string;
  participants: User[];
  lastMessage?: Message;
  unreadCount: number;
  isPinned: boolean;
  isMuted: boolean;
  isGroup: boolean;
  groupName?: string;
  groupAvatar?: string;
}

export interface VoiceRecording {
  isRecording: boolean;
  duration: number;
  waveform: number[];
}

export interface ChatSettings {
  theme: 'light' | 'dark';
  language: 'ar' | 'en';
  notifications: {
    messages: boolean;
    groups: boolean;
    calls: boolean;
    sounds: boolean;
  };
  privacy: {
    readReceipts: boolean;
    lastSeen: boolean;
    profilePhoto: 'everyone' | 'contacts' | 'nobody';
  };
}

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  phone: string;
  bio: string;
  avatar: string;
  location: string;
  joinDate: string;
  status: 'online' | 'offline' | 'away';
  settings: ChatSettings;
}