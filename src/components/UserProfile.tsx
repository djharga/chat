import React, { useState } from 'react';
import { X, Edit3, Camera, Phone, Mail, MapPin, Calendar, Settings } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { Avatar, AvatarImage, AvatarFallback } from './ui/avatar';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Textarea } from './ui/textarea';
import { Label } from './ui/label';
import { Badge } from './ui/badge';
import { Separator } from './ui/separator';
import { Switch } from './ui/switch';
import { currentUser } from '../data/mockData';

interface UserProfileProps {
  isOpen: boolean;
  onClose: () => void;
}

export function UserProfile({ isOpen, onClose }: UserProfileProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [profile, setProfile] = useState({
    name: currentUser.name,
    bio: currentUser.bio || '',
    email: 'ahmed@example.com',
    phone: '+966 50 123 4567',
    location: 'الرياض، السعودية',
    joinDate: '2023-01-15',
    notifications: {
      messages: true,
      groups: true,
      calls: false,
      sounds: true
    }
  });

  const handleSave = () => {
    setIsEditing(false);
    // Save profile changes
  };

  const handleInputChange = (field: string, value: string) => {
    setProfile(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleNotificationChange = (field: string, value: boolean) => {
    setProfile(prev => ({
      ...prev,
      notifications: {
        ...prev.notifications,
        [field]: value
      }
    }));
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.95, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="bg-background rounded-lg w-full max-w-md max-h-[90vh] overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b">
              <div className="flex items-center gap-2">
                {isEditing && (
                  <Button variant="outline" size="sm" onClick={() => setIsEditing(false)}>
                    إلغاء
                  </Button>
                )}
                <Button
                  variant={isEditing ? "default" : "outline"}
                  size="sm"
                  onClick={isEditing ? handleSave : () => setIsEditing(true)}
                >
                  {isEditing ? 'حفظ' : <Edit3 className="h-4 w-4" />}
                </Button>
              </div>
              
              <h2 className="font-medium">الملف الشخصي</h2>
              
              <Button variant="ghost" size="sm" onClick={onClose}>
                <X className="h-4 w-4" />
              </Button>
            </div>

            <div className="overflow-y-auto max-h-[calc(90vh-80px)]">
              {/* Profile Picture Section */}
              <div className="p-6 text-center border-b">
                <div className="relative inline-block">
                  <Avatar className="h-24 w-24 mx-auto">
                    <AvatarImage src={currentUser.avatar} alt={currentUser.name} />
                    <AvatarFallback className="text-2xl">{currentUser.name.charAt(0)}</AvatarFallback>
                  </Avatar>
                  {isEditing && (
                    <Button
                      variant="outline"
                      size="sm"
                      className="absolute -bottom-2 -right-2 h-8 w-8 p-0 rounded-full"
                    >
                      <Camera className="h-4 w-4" />
                    </Button>
                  )}
                </div>
                
                <div className="mt-4 space-y-2">
                  {isEditing ? (
                    <Input
                      value={profile.name}
                      onChange={(e) => handleInputChange('name', e.target.value)}
                      className="text-center font-medium"
                    />
                  ) : (
                    <h3 className="font-medium text-lg">{profile.name}</h3>
                  )}
                  
                  <div className="flex items-center justify-center gap-2">
                    <div className="w-3 h-3 bg-green-500 rounded-full" />
                    <span className="text-sm text-muted-foreground">متصل الآن</span>
                  </div>
                </div>
              </div>

              {/* Bio Section */}
              <div className="p-4 border-b">
                <Label className="text-sm font-medium">النبذة التعريفية</Label>
                {isEditing ? (
                  <Textarea
                    value={profile.bio}
                    onChange={(e) => handleInputChange('bio', e.target.value)}
                    placeholder="اكتب نبذة عنك..."
                    className="mt-2 text-right"
                    dir="rtl"
                  />
                ) : (
                  <p className="mt-2 text-sm text-muted-foreground text-right" dir="rtl">
                    {profile.bio || 'لا توجد نبذة تعريفية'}
                  </p>
                )}
              </div>

              {/* Contact Information */}
              <div className="p-4 border-b">
                <h4 className="font-medium mb-3">معلومات الاتصال</h4>
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <Mail className="h-4 w-4 text-muted-foreground" />
                    {isEditing ? (
                      <Input
                        value={profile.email}
                        onChange={(e) => handleInputChange('email', e.target.value)}
                        type="email"
                        className="text-sm"
                      />
                    ) : (
                      <span className="text-sm">{profile.email}</span>
                    )}
                  </div>
                  
                  <div className="flex items-center gap-3">
                    <Phone className="h-4 w-4 text-muted-foreground" />
                    {isEditing ? (
                      <Input
                        value={profile.phone}
                        onChange={(e) => handleInputChange('phone', e.target.value)}
                        type="tel"
                        className="text-sm"
                      />
                    ) : (
                      <span className="text-sm">{profile.phone}</span>
                    )}
                  </div>
                  
                  <div className="flex items-center gap-3">
                    <MapPin className="h-4 w-4 text-muted-foreground" />
                    {isEditing ? (
                      <Input
                        value={profile.location}
                        onChange={(e) => handleInputChange('location', e.target.value)}
                        className="text-sm"
                      />
                    ) : (
                      <span className="text-sm">{profile.location}</span>
                    )}
                  </div>
                  
                  <div className="flex items-center gap-3">
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm">انضم في {new Date(profile.joinDate).toLocaleDateString('ar-SA')}</span>
                  </div>
                </div>
              </div>

              {/* Statistics */}
              <div className="p-4 border-b">
                <h4 className="font-medium mb-3">الإحصائيات</h4>
                <div className="grid grid-cols-3 gap-4">
                  <div className="text-center">
                    <div className="text-lg font-medium">142</div>
                    <div className="text-xs text-muted-foreground">رسالة</div>
                  </div>
                  <div className="text-center">
                    <div className="text-lg font-medium">23</div>
                    <div className="text-xs text-muted-foreground">مجموعة</div>
                  </div>
                  <div className="text-center">
                    <div className="text-lg font-medium">8</div>
                    <div className="text-xs text-muted-foreground">اتصال</div>
                  </div>
                </div>
              </div>

              {/* Notification Settings */}
              <div className="p-4">
                <h4 className="font-medium mb-3">إعدادات الإشعارات</h4>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm">إشعارات الرسائل</span>
                    <Switch
                      checked={profile.notifications.messages}
                      onCheckedChange={(value) => handleNotificationChange('messages', value)}
                    />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <span className="text-sm">إشعارات المجموعات</span>
                    <Switch
                      checked={profile.notifications.groups}
                      onCheckedChange={(value) => handleNotificationChange('groups', value)}
                    />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <span className="text-sm">إشعارات المكالمات</span>
                    <Switch
                      checked={profile.notifications.calls}
                      onCheckedChange={(value) => handleNotificationChange('calls', value)}
                    />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <span className="text-sm">الأصوات</span>
                    <Switch
                      checked={profile.notifications.sounds}
                      onCheckedChange={(value) => handleNotificationChange('sounds', value)}
                    />
                  </div>
                </div>
              </div>

              {/* Privacy Settings */}
              <div className="p-4 border-t">
                <div className="space-y-2">
                  <Button variant="outline" className="w-full justify-center gap-2">
                    <Settings className="h-4 w-4" />
                    إعدادات الخصوصية
                  </Button>
                  
                  <Button variant="outline" className="w-full">
                    إعدادات الحساب
                  </Button>
                  
                  <Button variant="destructive" className="w-full">
                    تسجيل الخروج
                  </Button>
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}