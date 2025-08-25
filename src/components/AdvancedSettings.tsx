import React, { useState } from 'react';
import { Settings, User, Bell, Shield, Eye, Download, Upload, Trash2, Moon, Sun, Globe, Smartphone, Monitor, Volume2, VolumeX, Lock, Key, Database, FileText, HelpCircle, Info, ChevronRight, Palette, Type, Zap } from 'lucide-react';
import { motion } from 'motion/react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from './ui/dialog';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Switch } from './ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Separator } from './ui/separator';
import { Badge } from './ui/badge';
import { Slider } from './ui/slider';
import { ScrollArea } from './ui/scroll-area';
import { Alert, AlertDescription } from './ui/alert';
import { Progress } from './ui/progress';
import { currentUser } from '../data/mockData';

interface AdvancedSettingsProps {
  isOpen: boolean;
  onClose: () => void;
  isDarkMode: boolean;
  onToggleDarkMode: () => void;
}

interface AppSettings {
  // Appearance
  theme: 'light' | 'dark' | 'auto';
  fontSize: number;
  language: 'ar' | 'en';
  colorScheme: 'blue' | 'green' | 'purple' | 'orange';
  
  // Notifications
  notifications: {
    messages: boolean;
    groups: boolean;
    calls: boolean;
    sounds: boolean;
    vibration: boolean;
    showPreviews: boolean;
    quietHours: {
      enabled: boolean;
      start: string;
      end: string;
    };
  };
  
  // Privacy & Security
  privacy: {
    readReceipts: boolean;
    lastSeen: boolean;
    profilePhoto: 'everyone' | 'contacts' | 'nobody';
    status: 'everyone' | 'contacts' | 'nobody';
    groups: 'everyone' | 'contacts' | 'nobody';
    twoFactorAuth: boolean;
    screenLock: boolean;
    autoLockTime: number;
  };
  
  // Chat
  chat: {
    enterToSend: boolean;
    showTimestamps: boolean;
    bubbleStyle: 'modern' | 'classic' | 'minimal';
    fontSize: 'small' | 'medium' | 'large';
    animationsEnabled: boolean;
    soundsEnabled: boolean;
    autoDownloadMedia: 'never' | 'wifi' | 'always';
  };
  
  // Storage
  storage: {
    autoBackup: boolean;
    backupFrequency: 'daily' | 'weekly' | 'monthly';
    includeMedia: boolean;
    cacheSize: number;
  };
  
  // Advanced
  advanced: {
    developerMode: boolean;
    debugMode: boolean;
    experimentalFeatures: boolean;
    performanceMode: boolean;
  };
}

export function AdvancedSettings({ isOpen, onClose, isDarkMode, onToggleDarkMode }: AdvancedSettingsProps) {
  const [activeTab, setActiveTab] = useState('general');
  const [showDataUsage, setShowDataUsage] = useState(false);
  const [showExportDialog, setShowExportDialog] = useState(false);
  const [showImportDialog, setShowImportDialog] = useState(false);
  const [showResetDialog, setShowResetDialog] = useState(false);
  
  const [settings, setSettings] = useState<AppSettings>({
    theme: isDarkMode ? 'dark' : 'light',
    fontSize: 14,
    language: 'ar',
    colorScheme: 'blue',
    
    notifications: {
      messages: true,
      groups: true,
      calls: true,
      sounds: true,
      vibration: true,
      showPreviews: true,
      quietHours: {
        enabled: false,
        start: '22:00',
        end: '07:00'
      }
    },
    
    privacy: {
      readReceipts: true,
      lastSeen: true,
      profilePhoto: 'everyone',
      status: 'everyone',
      groups: 'everyone',
      twoFactorAuth: false,
      screenLock: false,
      autoLockTime: 5
    },
    
    chat: {
      enterToSend: true,
      showTimestamps: true,
      bubbleStyle: 'modern',
      fontSize: 'medium',
      animationsEnabled: true,
      soundsEnabled: true,
      autoDownloadMedia: 'wifi'
    },
    
    storage: {
      autoBackup: true,
      backupFrequency: 'daily',
      includeMedia: false,
      cacheSize: 500
    },
    
    advanced: {
      developerMode: false,
      debugMode: false,
      experimentalFeatures: false,
      performanceMode: false
    }
  });

  const updateSettings = (section: keyof AppSettings, key: string, value: any) => {
    setSettings(prev => ({
      ...prev,
      [section]: {
        ...prev[section],
        [key]: value
      }
    }));
  };

  const updateNestedSettings = (section: keyof AppSettings, subsection: string, key: string, value: any) => {
    setSettings(prev => ({
      ...prev,
      [section]: {
        ...prev[section],
        [subsection]: {
          ...(prev[section] as any)[subsection],
          [key]: value
        }
      }
    }));
  };

  const getStorageUsage = () => {
    return {
      total: 2.1, // GB
      messages: 0.8,
      media: 1.1,
      cache: 0.2,
      available: 10.5
    };
  };

  const storageUsage = getStorageUsage();

  const exportData = () => {
    const data = {
      settings,
      user: currentUser,
      exportDate: new Date().toISOString()
    };
    
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `chat-backup-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    setShowExportDialog(false);
  };

  const clearCache = () => {
    // Simulate cache clearing
    setTimeout(() => {
      alert('تم مسح ذاكرة التخزين المؤقت بنجاح');
    }, 1000);
  };

  const resetSettings = () => {
    setSettings({
      theme: 'light',
      fontSize: 14,
      language: 'ar',
      colorScheme: 'blue',
      notifications: {
        messages: true,
        groups: true,
        calls: true,
        sounds: true,
        vibration: true,
        showPreviews: true,
        quietHours: { enabled: false, start: '22:00', end: '07:00' }
      },
      privacy: {
        readReceipts: true,
        lastSeen: true,
        profilePhoto: 'everyone',
        status: 'everyone',
        groups: 'everyone',
        twoFactorAuth: false,
        screenLock: false,
        autoLockTime: 5
      },
      chat: {
        enterToSend: true,
        showTimestamps: true,
        bubbleStyle: 'modern',
        fontSize: 'medium',
        animationsEnabled: true,
        soundsEnabled: true,
        autoDownloadMedia: 'wifi'
      },
      storage: {
        autoBackup: true,
        backupFrequency: 'daily',
        includeMedia: false,
        cacheSize: 500
      },
      advanced: {
        developerMode: false,
        debugMode: false,
        experimentalFeatures: false,
        performanceMode: false
      }
    });
    setShowResetDialog(false);
  };

  const SettingRow = ({ 
    icon: Icon, 
    title, 
    description, 
    children, 
    badge 
  }: { 
    icon: any; 
    title: string; 
    description?: string; 
    children: React.ReactNode;
    badge?: string;
  }) => (
    <div className="flex items-center justify-between py-3">
      <div className="flex items-center gap-3 flex-1">
        <div className="p-2 bg-muted/50 rounded-lg">
          <Icon className="h-4 w-4" />
        </div>
        <div className="text-right flex-1">
          <div className="flex items-center gap-2 justify-end">
            <h4 className="font-medium">{title}</h4>
            {badge && <Badge variant="outline" className="text-xs">{badge}</Badge>}
          </div>
          {description && (
            <p className="text-sm text-muted-foreground">{description}</p>
          )}
        </div>
      </div>
      <div className="ml-4">
        {children}
      </div>
    </div>
  );

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl h-[90vh] flex flex-col p-0">
        <DialogHeader className="p-6 pb-0">
          <DialogTitle className="text-right flex items-center gap-2">
            <Settings className="h-5 w-5" />
            الإعدادات المتقدمة
          </DialogTitle>
        </DialogHeader>

        <div className="flex-1 flex">
          {/* Settings Navigation */}
          <div className="w-64 border-l p-4">
            <div className="space-y-1">
              {[
                { id: 'general', label: 'عام', icon: Settings },
                { id: 'notifications', label: 'الإشعارات', icon: Bell },
                { id: 'privacy', label: 'الخصوصية والأمان', icon: Shield },
                { id: 'chat', label: 'إعدادات الدردشة', icon: MessageCircle },
                { id: 'storage', label: 'التخزين', icon: Database },
                { id: 'advanced', label: 'متقدم', icon: Zap },
                { id: 'about', label: 'حول التطبيق', icon: Info }
              ].map((tab) => {
                const Icon = tab.icon;
                return (
                  <Button
                    key={tab.id}
                    variant={activeTab === tab.id ? 'default' : 'ghost'}
                    className="w-full justify-end gap-2 text-right"
                    onClick={() => setActiveTab(tab.id)}
                  >
                    {tab.label}
                    <Icon className="h-4 w-4" />
                  </Button>
                );
              })}
            </div>
          </div>

          {/* Settings Content */}
          <ScrollArea className="flex-1">
            <div className="p-6">
              {/* General Settings */}
              {activeTab === 'general' && (
                <div className="space-y-6">
                  <div>
                    <h3 className="text-lg font-medium mb-4 text-right">الإعدادات العامة</h3>
                    
                    <Card>
                      <CardHeader>
                        <CardTitle className="text-right flex items-center gap-2">
                          <Palette className="h-5 w-5" />
                          المظهر والشكل
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <SettingRow
                          icon={Moon}
                          title="الوضع الليلي"
                          description="تبديل بين الوضع الليلي والنهاري"
                        >
                          <Switch
                            checked={settings.theme === 'dark'}
                            onCheckedChange={(checked) => {
                              updateSettings('theme', 'theme', checked ? 'dark' : 'light');
                              onToggleDarkMode();
                            }}
                          />
                        </SettingRow>

                        <SettingRow
                          icon={Type}
                          title="حجم الخط"
                          description="تخصيص حجم النص في التطبيق"
                        >
                          <div className="w-32">
                            <Slider
                              value={[settings.fontSize]}
                              onValueChange={([value]) => updateSettings('fontSize', 'fontSize', value)}
                              min={12}
                              max={20}
                              step={1}
                            />
                            <div className="text-center text-xs text-muted-foreground mt-1">
                              {settings.fontSize}px
                            </div>
                          </div>
                        </SettingRow>

                        <SettingRow
                          icon={Globe}
                          title="اللغة"
                          description="اختيار لغة التطبيق"
                        >
                          <Select
                            value={settings.language}
                            onValueChange={(value) => updateSettings('language', 'language', value)}
                          >
                            <SelectTrigger className="w-32">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="ar">العربية</SelectItem>
                              <SelectItem value="en">English</SelectItem>
                            </SelectContent>
                          </Select>
                        </SettingRow>

                        <SettingRow
                          icon={Palette}
                          title="نظام الألوان"
                          description="اختيار مخطط الألوان المفضل"
                        >
                          <Select
                            value={settings.colorScheme}
                            onValueChange={(value) => updateSettings('colorScheme', 'colorScheme', value)}
                          >
                            <SelectTrigger className="w-32">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="blue">أزرق</SelectItem>
                              <SelectItem value="green">أخضر</SelectItem>
                              <SelectItem value="purple">بنفسجي</SelectItem>
                              <SelectItem value="orange">برتقالي</SelectItem>
                            </SelectContent>
                          </Select>
                        </SettingRow>
                      </CardContent>
                    </Card>
                  </div>
                </div>
              )}

              {/* Notifications Settings */}
              {activeTab === 'notifications' && (
                <div className="space-y-6">
                  <div>
                    <h3 className="text-lg font-medium mb-4 text-right">إعدادات الإشعارات</h3>
                    
                    <Card>
                      <CardHeader>
                        <CardTitle className="text-right">الإشعارات العامة</CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <SettingRow
                          icon={MessageCircle}
                          title="إشعارات الرسائل"
                          description="إشعار عند وصول رسائل جديدة"
                        >
                          <Switch
                            checked={settings.notifications.messages}
                            onCheckedChange={(checked) => 
                              updateNestedSettings('notifications', 'notifications', 'messages', checked)
                            }
                          />
                        </SettingRow>

                        <SettingRow
                          icon={User}
                          title="إشعارات المجموعات"
                          description="إشعار عند النشاط في المجموعات"
                        >
                          <Switch
                            checked={settings.notifications.groups}
                            onCheckedChange={(checked) => 
                              updateNestedSettings('notifications', 'notifications', 'groups', checked)
                            }
                          />
                        </SettingRow>

                        <SettingRow
                          icon={Volume2}
                          title="الأصوات"
                          description="تشغيل أصوات الإشعارات"
                        >
                          <Switch
                            checked={settings.notifications.sounds}
                            onCheckedChange={(checked) => 
                              updateNestedSettings('notifications', 'notifications', 'sounds', checked)
                            }
                          />
                        </SettingRow>

                        <SettingRow
                          icon={Smartphone}
                          title="الاهتزاز"
                          description="اهتزاز الجهاز عند الإشعارات"
                        >
                          <Switch
                            checked={settings.notifications.vibration}
                            onCheckedChange={(checked) => 
                              updateNestedSettings('notifications', 'notifications', 'vibration', checked)
                            }
                          />
                        </SettingRow>

                        <SettingRow
                          icon={Eye}
                          title="معاينة الرسائل"
                          description="إظهار محتوى الرسالة في الإشعار"
                        >
                          <Switch
                            checked={settings.notifications.showPreviews}
                            onCheckedChange={(checked) => 
                              updateNestedSettings('notifications', 'notifications', 'showPreviews', checked)
                            }
                          />
                        </SettingRow>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardHeader>
                        <CardTitle className="text-right">الساعات الهادئة</CardTitle>
                        <CardDescription className="text-right">
                          كتم الإشعارات في أوقات محددة
                        </CardDescription>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <SettingRow
                          icon={VolumeX}
                          title="تفعيل الساعات الهادئة"
                          description="منع الإشعارات في الأوقات المحددة"
                        >
                          <Switch
                            checked={settings.notifications.quietHours.enabled}
                            onCheckedChange={(checked) => 
                              updateNestedSettings('notifications', 'notifications', 'quietHours', {
                                ...settings.notifications.quietHours,
                                enabled: checked
                              })
                            }
                          />
                        </SettingRow>

                        {settings.notifications.quietHours.enabled && (
                          <>
                            <div className="grid grid-cols-2 gap-4">
                              <div>
                                <Label className="text-right block mb-2">من الساعة:</Label>
                                <Input
                                  type="time"
                                  value={settings.notifications.quietHours.start}
                                  onChange={(e) => 
                                    updateNestedSettings('notifications', 'notifications', 'quietHours', {
                                      ...settings.notifications.quietHours,
                                      start: e.target.value
                                    })
                                  }
                                />
                              </div>
                              <div>
                                <Label className="text-right block mb-2">إلى الساعة:</Label>
                                <Input
                                  type="time"
                                  value={settings.notifications.quietHours.end}
                                  onChange={(e) => 
                                    updateNestedSettings('notifications', 'notifications', 'quietHours', {
                                      ...settings.notifications.quietHours,
                                      end: e.target.value
                                    })
                                  }
                                />
                              </div>
                            </div>
                          </>
                        )}
                      </CardContent>
                    </Card>
                  </div>
                </div>
              )}

              {/* Privacy & Security Settings */}
              {activeTab === 'privacy' && (
                <div className="space-y-6">
                  <div>
                    <h3 className="text-lg font-medium mb-4 text-right">الخصوصية والأمان</h3>
                    
                    <Card>
                      <CardHeader>
                        <CardTitle className="text-right">إعدادات الخصوصية</CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <SettingRow
                          icon={Eye}
                          title="إيصالات القراءة"
                          description="إعلام الآخرين عند قراءة رسائلهم"
                        >
                          <Switch
                            checked={settings.privacy.readReceipts}
                            onCheckedChange={(checked) => 
                              updateNestedSettings('privacy', 'privacy', 'readReceipts', checked)
                            }
                          />
                        </SettingRow>

                        <SettingRow
                          icon={Clock}
                          title="آخر ظهور"
                          description="إظهار وقت آخر نشاط لك"
                        >
                          <Switch
                            checked={settings.privacy.lastSeen}
                            onCheckedChange={(checked) => 
                              updateNestedSettings('privacy', 'privacy', 'lastSeen', checked)
                            }
                          />
                        </SettingRow>

                        <SettingRow
                          icon={User}
                          title="الصورة الشخصية"
                          description="من يمكنه رؤية صورتك الشخصية"
                        >
                          <Select
                            value={settings.privacy.profilePhoto}
                            onValueChange={(value) => 
                              updateNestedSettings('privacy', 'privacy', 'profilePhoto', value)
                            }
                          >
                            <SelectTrigger className="w-32">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="everyone">الجميع</SelectItem>
                              <SelectItem value="contacts">جهات الاتصال</SelectItem>
                              <SelectItem value="nobody">لا أحد</SelectItem>
                            </SelectContent>
                          </Select>
                        </SettingRow>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardHeader>
                        <CardTitle className="text-right">الأمان</CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <SettingRow
                          icon={Key}
                          title="المصادقة الثنائية"
                          description="حماية إضافية لحسابك"
                          badge="موصى به"
                        >
                          <Switch
                            checked={settings.privacy.twoFactorAuth}
                            onCheckedChange={(checked) => 
                              updateNestedSettings('privacy', 'privacy', 'twoFactorAuth', checked)
                            }
                          />
                        </SettingRow>

                        <SettingRow
                          icon={Lock}
                          title="قفل الشاشة"
                          description="قفل التطبيق بكلمة مرور أو بصمة"
                        >
                          <Switch
                            checked={settings.privacy.screenLock}
                            onCheckedChange={(checked) => 
                              updateNestedSettings('privacy', 'privacy', 'screenLock', checked)
                            }
                          />
                        </SettingRow>

                        {settings.privacy.screenLock && (
                          <SettingRow
                            icon={Clock}
                            title="وقت القفل التلقائي"
                            description="قفل التطبيق بعد فترة عدم النشاط"
                          >
                            <Select
                              value={settings.privacy.autoLockTime.toString()}
                              onValueChange={(value) => 
                                updateNestedSettings('privacy', 'privacy', 'autoLockTime', parseInt(value))
                              }
                            >
                              <SelectTrigger className="w-32">
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="1">دقيقة واحدة</SelectItem>
                                <SelectItem value="5">5 دقائق</SelectItem>
                                <SelectItem value="15">15 دقيقة</SelectItem>
                                <SelectItem value="30">30 دقيقة</SelectItem>
                              </SelectContent>
                            </Select>
                          </SettingRow>
                        )}
                      </CardContent>
                    </Card>
                  </div>
                </div>
              )}

              {/* Storage Settings */}
              {activeTab === 'storage' && (
                <div className="space-y-6">
                  <div>
                    <h3 className="text-lg font-medium mb-4 text-right">إدارة التخزين</h3>
                    
                    <Card>
                      <CardHeader>
                        <CardTitle className="text-right">استخدام التخزين</CardTitle>
                        <CardDescription className="text-right">
                          مراقبة استخدام مساحة التخزين
                        </CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-4">
                          <div>
                            <div className="flex justify-between text-sm mb-2">
                              <span>{storageUsage.total} GB مستخدم</span>
                              <span>المساحة المستخدمة</span>
                            </div>
                            <Progress value={(storageUsage.total / (storageUsage.total + storageUsage.available)) * 100} />
                          </div>
                          
                          <div className="grid grid-cols-2 gap-4 text-sm">
                            <div className="text-center p-3 bg-muted/30 rounded-lg">
                              <MessageCircle className="h-6 w-6 mx-auto mb-2 text-blue-500" />
                              <div className="font-medium">{storageUsage.messages} GB</div>
                              <div className="text-muted-foreground">الرسائل</div>
                            </div>
                            <div className="text-center p-3 bg-muted/30 rounded-lg">
                              <Image className="h-6 w-6 mx-auto mb-2 text-green-500" />
                              <div className="font-medium">{storageUsage.media} GB</div>
                              <div className="text-muted-foreground">الوسائط</div>
                            </div>
                            <div className="text-center p-3 bg-muted/30 rounded-lg">
                              <Database className="h-6 w-6 mx-auto mb-2 text-orange-500" />
                              <div className="font-medium">{storageUsage.cache} GB</div>
                              <div className="text-muted-foreground">التخزين المؤقت</div>
                            </div>
                            <div className="text-center p-3 bg-muted/30 rounded-lg">
                              <HardDrive className="h-6 w-6 mx-auto mb-2 text-purple-500" />
                              <div className="font-medium">{storageUsage.available} GB</div>
                              <div className="text-muted-foreground">متاح</div>
                            </div>
                          </div>
                          
                          <div className="flex gap-2">
                            <Button variant="outline" onClick={clearCache} className="flex-1">
                              <Trash2 className="h-4 w-4 ml-2" />
                              مسح التخزين المؤقت
                            </Button>
                            <Button variant="outline" onClick={() => setShowDataUsage(true)}>
                              <Eye className="h-4 w-4 ml-2" />
                              تفاصيل أكثر
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardHeader>
                        <CardTitle className="text-right">النسخ الاحتياطي</CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <SettingRow
                          icon={Download}
                          title="النسخ الاحتياطي التلقائي"
                          description="إنشاء نسخة احتياطية تلقائياً"
                        >
                          <Switch
                            checked={settings.storage.autoBackup}
                            onCheckedChange={(checked) => 
                              updateNestedSettings('storage', 'storage', 'autoBackup', checked)
                            }
                          />
                        </SettingRow>

                        {settings.storage.autoBackup && (
                          <>
                            <SettingRow
                              icon={Clock}
                              title="تكرار النسخ الاحتياطي"
                              description="عدد مرات إنشاء النسخ الاحتياطية"
                            >
                              <Select
                                value={settings.storage.backupFrequency}
                                onValueChange={(value) => 
                                  updateNestedSettings('storage', 'storage', 'backupFrequency', value)
                                }
                              >
                                <SelectTrigger className="w-32">
                                  <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="daily">يومياً</SelectItem>
                                  <SelectItem value="weekly">أسبوعياً</SelectItem>
                                  <SelectItem value="monthly">شهرياً</SelectItem>
                                </SelectContent>
                              </Select>
                            </SettingRow>

                            <SettingRow
                              icon={Image}
                              title="تضمين الوسائط"
                              description="حفظ الصور والفيديوهات في النسخة الاحتياطية"
                            >
                              <Switch
                                checked={settings.storage.includeMedia}
                                onCheckedChange={(checked) => 
                                  updateNestedSettings('storage', 'storage', 'includeMedia', checked)
                                }
                              />
                            </SettingRow>
                          </>
                        )}

                        <Separator />

                        <div className="grid grid-cols-2 gap-2">
                          <Button variant="outline" onClick={() => setShowExportDialog(true)}>
                            <Download className="h-4 w-4 ml-2" />
                            تصدير البيانات
                          </Button>
                          <Button variant="outline" onClick={() => setShowImportDialog(true)}>
                            <Upload className="h-4 w-4 ml-2" />
                            استيراد البيانات
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </div>
              )}

              {/* Advanced Settings */}
              {activeTab === 'advanced' && (
                <div className="space-y-6">
                  <div>
                    <h3 className="text-lg font-medium mb-4 text-right">الإعدادات المتقدمة</h3>
                    
                    <Alert className="mb-4">
                      <AlertTriangle className="h-4 w-4" />
                      <AlertDescription className="text-right">
                        هذه الإعدادات مخصصة للمستخدمين المتقدمين. قد تؤثر على أداء التطبيق.
                      </AlertDescription>
                    </Alert>

                    <Card>
                      <CardHeader>
                        <CardTitle className="text-right">الميزات التجريبية</CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <SettingRow
                          icon={Zap}
                          title="الميزات التجريبية"
                          description="تجربة الميزات الجديدة قبل إطلاقها رسمياً"
                          badge="تجريبي"
                        >
                          <Switch
                            checked={settings.advanced.experimentalFeatures}
                            onCheckedChange={(checked) => 
                              updateNestedSettings('advanced', 'advanced', 'experimentalFeatures', checked)
                            }
                          />
                        </SettingRow>

                        <SettingRow
                          icon={Monitor}
                          title="وضع الأداء"
                          description="تحسين الأداء على الأجهزة البطيئة"
                        >
                          <Switch
                            checked={settings.advanced.performanceMode}
                            onCheckedChange={(checked) => 
                              updateNestedSettings('advanced', 'advanced', 'performanceMode', checked)
                            }
                          />
                        </SettingRow>

                        <SettingRow
                          icon={Code}
                          title="وضع المطور"
                          description="إظهار معلومات إضافية للمطورين"
                        >
                          <Switch
                            checked={settings.advanced.developerMode}
                            onCheckedChange={(checked) => 
                              updateNestedSettings('advanced', 'advanced', 'developerMode', checked)
                            }
                          />
                        </SettingRow>

                        {settings.advanced.developerMode && (
                          <SettingRow
                            icon={Bug}
                            title="وضع التشخيص"
                            description="تسجيل معلومات إضافية لاستكشاف الأخطاء"
                          >
                            <Switch
                              checked={settings.advanced.debugMode}
                              onCheckedChange={(checked) => 
                                updateNestedSettings('advanced', 'advanced', 'debugMode', checked)
                              }
                            />
                          </SettingRow>
                        )}
                      </CardContent>
                    </Card>

                    <Card>
                      <CardHeader>
                        <CardTitle className="text-right text-destructive">منطقة الخطر</CardTitle>
                        <CardDescription className="text-right">
                          إجراءات لا يمكن التراجع عنها
                        </CardDescription>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <Button 
                          variant="outline" 
                          onClick={() => setShowResetDialog(true)}
                          className="w-full text-destructive border-destructive hover:bg-destructive/10"
                        >
                          <Trash2 className="h-4 w-4 ml-2" />
                          إعادة تعيين جميع الإعدادات
                        </Button>
                      </CardContent>
                    </Card>
                  </div>
                </div>
              )}

              {/* About */}
              {activeTab === 'about' && (
                <div className="space-y-6">
                  <div>
                    <h3 className="text-lg font-medium mb-4 text-right">حول التطبيق</h3>
                    
                    <Card>
                      <CardContent className="p-6 text-center">
                        <div className="w-16 h-16 bg-primary rounded-lg flex items-center justify-center mx-auto mb-4">
                          <MessageCircle className="h-8 w-8 text-primary-foreground" />
                        </div>
                        <h2 className="text-xl font-bold mb-2">تطبيق الدردشة العربي</h2>
                        <p className="text-muted-foreground mb-4">الإصدار 2.1.0</p>
                        
                        <div className="grid grid-cols-2 gap-4 text-sm mb-6">
                          <div className="text-center p-3 bg-muted/30 rounded-lg">
                            <div className="font-medium">تاريخ الإنشاء</div>
                            <div className="text-muted-foreground">يناير 2024</div>
                          </div>
                          <div className="text-center p-3 bg-muted/30 rounded-lg">
                            <div className="font-medium">حجم التطبيق</div>
                            <div className="text-muted-foreground">45.2 MB</div>
                          </div>
                        </div>

                        <div className="space-y-2">
                          <Button variant="outline" className="w-full">
                            <FileText className="h-4 w-4 ml-2" />
                            شروط الاستخدام
                          </Button>
                          <Button variant="outline" className="w-full">
                            <Shield className="h-4 w-4 ml-2" />
                            سياسة الخصوصية
                          </Button>
                          <Button variant="outline" className="w-full">
                            <HelpCircle className="h-4 w-4 ml-2" />
                            المساعدة والدعم
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </div>
              )}
            </div>
          </ScrollArea>
        </div>

        {/* Export Data Dialog */}
        <Dialog open={showExportDialog} onOpenChange={setShowExportDialog}>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle className="text-right">تصدير البيانات</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <p className="text-sm text-muted-foreground text-right">
                سيتم تصدير جميع بياناتك بما في ذلك الرسائل والإعدادات إلى ملف JSON.
              </p>
              <Alert>
                <Info className="h-4 w-4" />
                <AlertDescription className="text-right">
                  تأكد من حفظ الملف في مكان آمن. لا تشارك هذا الملف مع أي شخص آخر.
                </AlertDescription>
              </Alert>
              <div className="flex gap-2">
                <Button variant="outline" onClick={() => setShowExportDialog(false)} className="flex-1">
                  إلغاء
                </Button>
                <Button onClick={exportData} className="flex-1">
                  تصدير
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>

        {/* Reset Settings Dialog */}
        <Dialog open={showResetDialog} onOpenChange={setShowResetDialog}>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle className="text-right">إعادة تعيين الإعدادات</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <p className="text-sm text-muted-foreground text-right">
                هل أنت متأكد من أنك تريد إعادة تعيين جميع الإعدادات إلى القيم الافتراضية؟
              </p>
              <Alert>
                <AlertTriangle className="h-4 w-4" />
                <AlertDescription className="text-right">
                  لا يمكن التراجع عن هذا الإجراء. ستفقد جميع الإعدادات المخصصة.
                </AlertDescription>
              </Alert>
              <div className="flex gap-2">
                <Button variant="outline" onClick={() => setShowResetDialog(false)} className="flex-1">
                  إلغاء
                </Button>
                <Button variant="destructive" onClick={resetSettings} className="flex-1">
                  إعادة تعيين
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </DialogContent>
    </Dialog>
  );
}