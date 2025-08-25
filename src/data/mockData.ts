import { User, Conversation, Message, UserProfile } from '../types/chat';

export const currentUser: UserProfile = {
  id: 'current-user',
  name: 'أحمد محمد السالم',
  email: 'ahmed.salem@example.com',
  phone: '+966 50 123 4567',
  bio: 'مطور برمجيات | أحب التقنية والابتكار 💻',
  avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face',
  location: 'الرياض، السعودية',
  joinDate: '2023-01-15',
  status: 'online',
  settings: {
    theme: 'light',
    language: 'ar',
    notifications: {
      messages: true,
      groups: true,
      calls: false,
      sounds: true
    },
    privacy: {
      readReceipts: true,
      lastSeen: true,
      profilePhoto: 'everyone'
    }
  }
};

export const users: User[] = [
  {
    id: '1',
    name: 'فاطمة أحمد الزهراني',
    avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=100&h=100&fit=crop&crop=face',
    status: 'online',
    bio: 'مهندسة معمارية | عاشقة للفن والتصميم 🎨'
  },
  {
    id: '2', 
    name: 'محمد علي الشهري',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face',
    status: 'away',
    lastSeen: new Date(Date.now() - 1000 * 60 * 30),
    bio: 'طبيب أطفال | مهتم بالتكنولوجيا الطبية 👨‍⚕️'
  },
  {
    id: '3',
    name: 'سارة خالد المطيري',
    avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop&crop=face',
    status: 'offline',
    lastSeen: new Date(Date.now() - 1000 * 60 * 60 * 2),
    bio: 'معلمة رياضيات | أحب القراءة والسفر 📚'
  },
  {
    id: '4',
    name: 'عبدالله حسن النجار',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop&crop=face',
    status: 'online',
    bio: 'مدير مشاريع | رياضي ومحب للطبيعة 🏔️'
  },
  {
    id: '5',
    name: 'نورا عبدالرحمن القحطاني',
    avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=100&h=100&fit=crop&crop=face',
    status: 'online',
    bio: 'صيدلانية | مهتمة بالصحة والعافية 💊'
  },
  {
    id: '6',
    name: 'يوسف ماجد العتيبي',
    avatar: 'https://images.unsplash.com/photo-1507591064344-4c6ce005b128?w=100&h=100&fit=crop&crop=face',
    status: 'away',
    lastSeen: new Date(Date.now() - 1000 * 60 * 15),
    bio: 'مبرمج تطبيقات | محب للألعاب والأنمي 🎮'
  }
];

export const conversations: Conversation[] = [
  {
    id: '1',
    participants: [users[0]],
    lastMessage: {
      id: 'msg1',
      senderId: '1',
      content: 'مرحباً أحمد! كيف حالك اليوم؟ أتمنى أن تكون بخير 😊',
      timestamp: new Date(Date.now() - 1000 * 60 * 5),
      type: 'text',
      status: 'read'
    },
    unreadCount: 2,
    isPinned: true,
    isMuted: false,
    isGroup: false
  },
  {
    id: '2',
    participants: [users[1], users[2], users[3]],
    lastMessage: {
      id: 'msg2',
      senderId: '2',
      content: 'هل يمكننا تحديد موعد الاجتماع لمناقشة المشروع الجديد؟',
      timestamp: new Date(Date.now() - 1000 * 60 * 30),
      type: 'text',
      status: 'delivered'
    },
    unreadCount: 0,
    isPinned: false,
    isMuted: false,
    isGroup: true,
    groupName: 'فريق المشروع الطبي',
    groupAvatar: 'https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=100&h=100&fit=crop'
  },
  {
    id: '3',
    participants: [users[2]],
    lastMessage: {
      id: 'msg3',
      senderId: 'current-user',
      content: 'شكراً جزيلاً لك على المساعدة في حل المسألة! 🙏',
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2),
      type: 'text',
      status: 'read'
    },
    unreadCount: 0,
    isPinned: false,
    isMuted: true,
    isGroup: false
  },
  {
    id: '4',
    participants: [users[3]],
    lastMessage: {
      id: 'msg4',
      senderId: '4',
      content: 'تم إرسال الملفات المطلوبة عبر البريد الإلكتروني',
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 4),
      type: 'text',
      status: 'read'
    },
    unreadCount: 1,
    isPinned: false,
    isMuted: false,
    isGroup: false
  },
  {
    id: '5',
    participants: [users[4]],
    lastMessage: {
      id: 'msg5',
      senderId: '5',
      content: 'هذا رائع! متى يمكننا البدء بالتنفيذ؟',
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 6),
      type: 'text',
      status: 'delivered'
    },
    unreadCount: 0,
    isPinned: true,
    isMuted: false,
    isGroup: false
  },
  {
    id: '6',
    participants: [users[0], users[4], users[5]],
    lastMessage: {
      id: 'msg6',
      senderId: '6',
      content: 'لا تنسوا اجتماع اليوم الساعة 3:00 مساءً',
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 8),
      type: 'text',
      status: 'read'
    },
    unreadCount: 0,
    isPinned: false,
    isMuted: false,
    isGroup: true,
    groupName: 'مجموعة الأصدقاء',
    groupAvatar: 'https://images.unsplash.com/photo-1511632765486-a01980e01a18?w=100&h=100&fit=crop'
  }
];

export const messages: Message[] = [
  {
    id: '1',
    senderId: '1',
    content: 'مرحباً أحمد! كيف حالك؟ أتمنى أن تكون بأفضل صحة وحال',
    timestamp: new Date(Date.now() - 1000 * 60 * 60),
    type: 'text',
    status: 'read'
  },
  {
    id: '2',
    senderId: 'current-user',
    content: 'مرحباً فاطمة! أنا بخير والحمد لله. كيف كان يومك في العمل؟',
    timestamp: new Date(Date.now() - 1000 * 60 * 55),
    type: 'text',
    status: 'read'
  },
  {
    id: '3',
    senderId: '1',
    content: 'كان يوماً رائعاً ومثمراً! انتهيت من تصميم المشروع الجديد اليوم 🎉',
    timestamp: new Date(Date.now() - 1000 * 60 * 50),
    type: 'text',
    status: 'read'
  },
  {
    id: '4',
    senderId: '1',
    content: 'أريد أن أشاركك بعض اللقطات من التصميم',
    timestamp: new Date(Date.now() - 1000 * 60 * 48),
    type: 'text',
    status: 'read'
  },
  {
    id: '5',
    senderId: '1',
    content: '',
    timestamp: new Date(Date.now() - 1000 * 60 * 45),
    type: 'image',
    status: 'read',
    attachments: [{
      type: 'image',
      url: 'https://images.unsplash.com/photo-1558618047-3c8c76ca7d13?w=400&h=300&fit=crop',
      name: 'architectural-design.jpg'
    }]
  },
  {
    id: '6',
    senderId: 'current-user',
    content: 'واو! التصميم رائع جداً! 👏 يبدو احترافياً ومتميزاً',
    timestamp: new Date(Date.now() - 1000 * 60 * 40),
    type: 'text',
    status: 'read'
  },
  {
    id: '7',
    senderId: '1',
    content: 'شكراً لك! هذا من لطفك 😊',
    timestamp: new Date(Date.now() - 1000 * 60 * 35),
    type: 'text',
    status: 'read'
  },
  {
    id: '8',
    senderId: 'current-user',
    content: 'بالمناسبة، أرسل لك تسجيلاً صوتياً مهماً',
    timestamp: new Date(Date.now() - 1000 * 60 * 30),
    type: 'text',
    status: 'read'
  },
  {
    id: '9',
    senderId: 'current-user',
    content: '',
    timestamp: new Date(Date.now() - 1000 * 60 * 28),
    type: 'voice',
    status: 'read',
    attachments: [{
      type: 'voice',
      url: '#',
      duration: 42
    }]
  },
  {
    id: '10',
    senderId: '1',
    content: 'مرحباً مرة أخرى! كيف حالك اليوم؟ 😊',
    timestamp: new Date(Date.now() - 1000 * 60 * 5),
    type: 'text',
    status: 'delivered'
  }
];

// إضافة بيانات وهمية للبحث السريع
export const quickReplies = [
  '👍', '👎', 'شكراً', 'حسناً', 'لا بأس', 'ممتاز', 'رائع', 'موافق', 'إن شاء الله', 'بارك الله فيك'
];

export const searchSuggestions = [
  'المشروع الجديد',
  'الاجتماع',
  'الملفات',
  'التصميم',
  'موعد العمل',
  'اجتماع الفريق',
  'المهام المطلوبة'
];

// بيانات الإشعارات
export const notifications = [
  {
    id: '1',
    type: 'message',
    title: 'رسالة جديدة من فاطمة',
    content: 'مرحباً! كيف حالك اليوم؟',
    timestamp: new Date(Date.now() - 1000 * 60 * 5),
    isRead: false
  },
  {
    id: '2',
    type: 'group',
    title: 'فريق المشروع الطبي',
    content: 'تم إضافتك إلى مجموعة جديدة',
    timestamp: new Date(Date.now() - 1000 * 60 * 30),
    isRead: true
  }
];