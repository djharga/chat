import React, { useState, useMemo } from 'react';
import { Search, Plus, Phone, Video, MessageCircle, MoreVertical, Star, StarOff, Edit, Trash2, UserPlus, UserMinus, Users, Filter, Grid, List, SortAsc } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Badge } from './ui/badge';
import { Avatar, AvatarImage, AvatarFallback } from './ui/avatar';
import { Card, CardContent } from './ui/card';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger, DropdownMenuSeparator } from './ui/dropdown-menu';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { ScrollArea } from './ui/scroll-area';
import { Separator } from './ui/separator';
import { Switch } from './ui/switch';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';
import { users } from '../data/mockData';
import { User } from '../types/chat';

interface ContactsManagerProps {
  isOpen: boolean;
  onClose: () => void;
  onStartChat: (userId: string) => void;
  onStartCall: (userId: string, type: 'voice' | 'video') => void;
}

type ViewMode = 'grid' | 'list';
type SortBy = 'name' | 'status' | 'lastSeen' | 'favorite';
type FilterBy = 'all' | 'online' | 'offline' | 'favorites' | 'blocked';

interface ExtendedUser extends User {
  isFavorite?: boolean;
  isBlocked?: boolean;
  phone?: string;
  email?: string;
  notes?: string;
  groups?: string[];
  lastActivity?: Date;
}

export function ContactsManager({ isOpen, onClose, onStartChat, onStartCall }: ContactsManagerProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [viewMode, setViewMode] = useState<ViewMode>('list');
  const [sortBy, setSortBy] = useState<SortBy>('name');
  const [filterBy, setFilterBy] = useState<FilterBy>('all');
  const [selectedContacts, setSelectedContacts] = useState<string[]>([]);
  const [showAddContact, setShowAddContact] = useState(false);
  const [editingContact, setEditingContact] = useState<ExtendedUser | null>(null);
  
  // Extended users data with additional fields
  const [contacts, setContacts] = useState<ExtendedUser[]>(
    users.map(user => ({
      ...user,
      isFavorite: Math.random() > 0.7,
      isBlocked: false,
      phone: `+966 5${Math.floor(Math.random() * 10000000).toString().padStart(7, '0')}`,
      email: `${user.name.split(' ')[0].toLowerCase()}@example.com`,
      notes: '',
      groups: ['الأصدقاء', 'العمل', 'العائلة'][Math.floor(Math.random() * 3)] ? ['الأصدقاء'] : [],
      lastActivity: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000)
    }))
  );

  const [newContact, setNewContact] = useState({
    name: '',
    phone: '',
    email: '',
    notes: '',
    avatar: ''
  });

  const filteredAndSortedContacts = useMemo(() => {
    let filtered = contacts.filter(contact => {
      const matchesSearch = contact.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           contact.phone?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           contact.email?.toLowerCase().includes(searchQuery.toLowerCase());
      
      switch (filterBy) {
        case 'online':
          return matchesSearch && contact.status === 'online';
        case 'offline':
          return matchesSearch && contact.status !== 'online';
        case 'favorites':
          return matchesSearch && contact.isFavorite;
        case 'blocked':
          return matchesSearch && contact.isBlocked;
        default:
          return matchesSearch && !contact.isBlocked;
      }
    });

    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'status':
          const statusOrder = { online: 0, away: 1, offline: 2 };
          return (statusOrder[a.status] || 2) - (statusOrder[b.status] || 2);
        case 'lastSeen':
          return (b.lastActivity?.getTime() || 0) - (a.lastActivity?.getTime() || 0);
        case 'favorite':
          return Number(b.isFavorite) - Number(a.isFavorite);
        case 'name':
        default:
          return a.name.localeCompare(b.name, 'ar');
      }
    });

    return filtered;
  }, [contacts, searchQuery, filterBy, sortBy]);

  const handleToggleFavorite = (userId: string) => {
    setContacts(prev => prev.map(contact => 
      contact.id === userId 
        ? { ...contact, isFavorite: !contact.isFavorite }
        : contact
    ));
  };

  const handleBlockContact = (userId: string) => {
    setContacts(prev => prev.map(contact => 
      contact.id === userId 
        ? { ...contact, isBlocked: !contact.isBlocked }
        : contact
    ));
  };

  const handleDeleteContact = (userId: string) => {
    setContacts(prev => prev.filter(contact => contact.id !== userId));
  };

  const handleAddContact = () => {
    if (newContact.name && newContact.phone) {
      const contact: ExtendedUser = {
        id: Date.now().toString(),
        name: newContact.name,
        avatar: newContact.avatar || `https://images.unsplash.com/photo-${Math.floor(Math.random() * 1000)}?w=100&h=100&fit=crop&crop=face`,
        status: 'offline',
        phone: newContact.phone,
        email: newContact.email,
        bio: newContact.notes,
        notes: newContact.notes,
        isFavorite: false,
        isBlocked: false,
        groups: [],
        lastActivity: new Date()
      };
      
      setContacts(prev => [...prev, contact]);
      setNewContact({ name: '', phone: '', email: '', notes: '', avatar: '' });
      setShowAddContact(false);
    }
  };

  const handleEditContact = (contact: ExtendedUser) => {
    if (editingContact) {
      setContacts(prev => prev.map(c => 
        c.id === editingContact.id ? editingContact : c
      ));
      setEditingContact(null);
    }
  };

  const getStatusColor = (status: User['status']) => {
    switch (status) {
      case 'online': return 'bg-green-500';
      case 'away': return 'bg-yellow-500';
      case 'offline': return 'bg-gray-400';
      default: return 'bg-gray-400';
    }
  };

  const getStatusText = (status: User['status']) => {
    switch (status) {
      case 'online': return 'متصل';
      case 'away': return 'غائب';
      case 'offline': return 'غير متصل';
      default: return 'غير معروف';
    }
  };

  const formatLastActivity = (date: Date) => {
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const minutes = Math.floor(diff / (1000 * 60));
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));

    if (minutes < 1) return 'الآن';
    if (minutes < 60) return `منذ ${minutes} دقيقة`;
    if (hours < 24) return `منذ ${hours} ساعة`;
    if (days < 7) return `منذ ${days} يوم`;
    return date.toLocaleDateString('ar-SA');
  };

  const ContactCard = ({ contact }: { contact: ExtendedUser }) => (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      whileHover={{ scale: 1.02 }}
      className="bg-card rounded-lg p-4 shadow-sm border hover:shadow-md transition-all"
    >
      <div className="flex items-center gap-3 mb-3">
        <div className="relative">
          <Avatar className="h-12 w-12">
            <AvatarImage src={contact.avatar} alt={contact.name} />
            <AvatarFallback>{contact.name.charAt(0)}</AvatarFallback>
          </Avatar>
          <div className={`absolute -bottom-1 -right-1 w-4 h-4 rounded-full border-2 border-background ${getStatusColor(contact.status)}`} />
        </div>
        
        <div className="flex-1 min-w-0 text-right">
          <h3 className="font-medium truncate">{contact.name}</h3>
          <p className="text-sm text-muted-foreground">{getStatusText(contact.status)}</p>
        </div>

        <div className="flex items-center gap-1">
          {contact.isFavorite && (
            <Star className="h-4 w-4 text-yellow-500 fill-current" />
          )}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                <MoreVertical className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => onStartChat(contact.id)}>
                <MessageCircle className="h-4 w-4 ml-2" />
                بدء محادثة
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => onStartCall(contact.id, 'voice')}>
                <Phone className="h-4 w-4 ml-2" />
                مكالمة صوتية
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => onStartCall(contact.id, 'video')}>
                <Video className="h-4 w-4 ml-2" />
                مكالمة مرئية
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => handleToggleFavorite(contact.id)}>
                {contact.isFavorite ? <StarOff className="h-4 w-4 ml-2" /> : <Star className="h-4 w-4 ml-2" />}
                {contact.isFavorite ? 'إزالة من المفضلة' : 'إضافة للمفضلة'}
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setEditingContact(contact)}>
                <Edit className="h-4 w-4 ml-2" />
                تعديل
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleBlockContact(contact.id)}>
                <UserMinus className="h-4 w-4 ml-2" />
                {contact.isBlocked ? 'إلغاء الحظر' : 'حظر'}
              </DropdownMenuItem>
              <DropdownMenuItem 
                onClick={() => handleDeleteContact(contact.id)}
                className="text-destructive"
              >
                <Trash2 className="h-4 w-4 ml-2" />
                حذف
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      <div className="space-y-2 text-sm">
        {contact.phone && (
          <div className="flex items-center justify-between">
            <span className="text-muted-foreground">{contact.phone}</span>
            <Phone className="h-3 w-3 text-muted-foreground" />
          </div>
        )}
        {contact.bio && (
          <p className="text-muted-foreground line-clamp-2 text-right">{contact.bio}</p>
        )}
        {contact.lastActivity && contact.status !== 'online' && (
          <p className="text-xs text-muted-foreground text-right">
            آخر ظهور: {formatLastActivity(contact.lastActivity)}
          </p>
        )}
      </div>

      <div className="flex gap-2 mt-3">
        <Button size="sm" onClick={() => onStartChat(contact.id)} className="flex-1">
          <MessageCircle className="h-4 w-4 ml-2" />
          محادثة
        </Button>
        <Button variant="outline" size="sm" onClick={() => onStartCall(contact.id, 'voice')}>
          <Phone className="h-4 w-4" />
        </Button>
        <Button variant="outline" size="sm" onClick={() => onStartCall(contact.id, 'video')}>
          <Video className="h-4 w-4" />
        </Button>
      </div>
    </motion.div>
  );

  const ContactListItem = ({ contact }: { contact: ExtendedUser }) => (
    <motion.div
      layout
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className="flex items-center gap-3 p-3 rounded-lg hover:bg-muted/50 transition-colors"
    >
      <div className="relative">
        <Avatar className="h-10 w-10">
          <AvatarImage src={contact.avatar} alt={contact.name} />
          <AvatarFallback>{contact.name.charAt(0)}</AvatarFallback>
        </Avatar>
        <div className={`absolute -bottom-1 -right-1 w-3 h-3 rounded-full border-2 border-background ${getStatusColor(contact.status)}`} />
      </div>

      <div className="flex-1 min-w-0 text-right">
        <div className="flex items-center justify-between mb-1">
          <div className="flex items-center gap-2">
            {contact.isFavorite && (
              <Star className="h-3 w-3 text-yellow-500 fill-current" />
            )}
            <span className="text-xs text-muted-foreground">
              {getStatusText(contact.status)}
            </span>
          </div>
          <h3 className="font-medium truncate">{contact.name}</h3>
        </div>
        <p className="text-sm text-muted-foreground truncate">{contact.bio || contact.phone}</p>
      </div>

      <div className="flex items-center gap-1">
        <Button variant="ghost" size="sm" onClick={() => onStartChat(contact.id)}>
          <MessageCircle className="h-4 w-4" />
        </Button>
        <Button variant="ghost" size="sm" onClick={() => onStartCall(contact.id, 'voice')}>
          <Phone className="h-4 w-4" />
        </Button>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
              <MoreVertical className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={() => onStartCall(contact.id, 'video')}>
              <Video className="h-4 w-4 ml-2" />
              مكالمة مرئية
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => handleToggleFavorite(contact.id)}>
              {contact.isFavorite ? <StarOff className="h-4 w-4 ml-2" /> : <Star className="h-4 w-4 ml-2" />}
              {contact.isFavorite ? 'إزالة من المفضلة' : 'إضافة للمفضلة'}
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => setEditingContact(contact)}>
              <Edit className="h-4 w-4 ml-2" />
              تعديل
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </motion.div>
  );

  const getFilterStats = () => {
    const stats = {
      all: contacts.filter(c => !c.isBlocked).length,
      online: contacts.filter(c => c.status === 'online' && !c.isBlocked).length,
      offline: contacts.filter(c => c.status !== 'online' && !c.isBlocked).length,
      favorites: contacts.filter(c => c.isFavorite && !c.isBlocked).length,
      blocked: contacts.filter(c => c.isBlocked).length
    };
    return stats;
  };

  const filterStats = getFilterStats();

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-6xl h-[90vh] flex flex-col p-0">
        <DialogHeader className="p-6 pb-0">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button 
                onClick={() => setShowAddContact(true)}
                className="gap-2"
              >
                <UserPlus className="h-4 w-4" />
                إضافة جهة اتصال
              </Button>
              
              <div className="flex items-center gap-2">
                <Button
                  variant={viewMode === 'list' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setViewMode('list')}
                >
                  <List className="h-4 w-4" />
                </Button>
                <Button
                  variant={viewMode === 'grid' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setViewMode('grid')}
                >
                  <Grid className="h-4 w-4" />
                </Button>
              </div>
            </div>
            
            <DialogTitle className="text-right">
              إدارة جهات الاتصال ({filteredAndSortedContacts.length})
            </DialogTitle>
          </div>
        </DialogHeader>

        {/* Search and Filters */}
        <div className="px-6 py-4 border-b space-y-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="البحث في جهات الاتصال..."
              className="pl-10 text-right"
            />
          </div>

          <div className="flex items-center gap-4 flex-wrap">
            <div className="flex items-center gap-2">
              <Label htmlFor="filter">تصفية:</Label>
              <Select value={filterBy} onValueChange={(value: FilterBy) => setFilterBy(value)}>
                <SelectTrigger className="w-40" id="filter">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">الكل ({filterStats.all})</SelectItem>
                  <SelectItem value="online">متصل ({filterStats.online})</SelectItem>
                  <SelectItem value="offline">غير متصل ({filterStats.offline})</SelectItem>
                  <SelectItem value="favorites">المفضلة ({filterStats.favorites})</SelectItem>
                  <SelectItem value="blocked">محظور ({filterStats.blocked})</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex items-center gap-2">
              <Label htmlFor="sort">ترتيب:</Label>
              <Select value={sortBy} onValueChange={(value: SortBy) => setSortBy(value)}>
                <SelectTrigger className="w-32" id="sort">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="name">الاسم</SelectItem>
                  <SelectItem value="status">الحالة</SelectItem>
                  <SelectItem value="lastSeen">آخر ظهور</SelectItem>
                  <SelectItem value="favorite">المفضلة</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        {/* Contacts List */}
        <ScrollArea className="flex-1 px-6">
          <div className="py-4">
            {filteredAndSortedContacts.length > 0 ? (
              <div className={viewMode === 'grid' 
                ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4' 
                : 'space-y-2'
              }>
                <AnimatePresence>
                  {filteredAndSortedContacts.map((contact) => (
                    viewMode === 'grid' ? (
                      <ContactCard key={contact.id} contact={contact} />
                    ) : (
                      <ContactListItem key={contact.id} contact={contact} />
                    )
                  ))}
                </AnimatePresence>
              </div>
            ) : (
              <div className="py-12 text-center">
                <Users className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                <h3 className="font-medium mb-2">لا توجد جهات اتصال</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  {searchQuery ? 'لم يتم العثور على نتائج مطابقة' : 'ابدأ بإضافة جهات اتصال جديدة'}
                </p>
                <Button onClick={() => setShowAddContact(true)}>
                  <UserPlus className="h-4 w-4 ml-2" />
                  إضافة جهة اتصال
                </Button>
              </div>
            )}
          </div>
        </ScrollArea>

        {/* Add Contact Dialog */}
        <Dialog open={showAddContact} onOpenChange={setShowAddContact}>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>إضافة جهة اتصال جديدة</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="name">الاسم *</Label>
                <Input
                  id="name"
                  value={newContact.name}
                  onChange={(e) => setNewContact(prev => ({ ...prev, name: e.target.value }))}
                  placeholder="الاسم الكامل"
                  className="text-right"
                />
              </div>
              <div>
                <Label htmlFor="phone">رقم الهاتف *</Label>
                <Input
                  id="phone"
                  value={newContact.phone}
                  onChange={(e) => setNewContact(prev => ({ ...prev, phone: e.target.value }))}
                  placeholder="+966 50 123 4567"
                  className="text-right"
                />
              </div>
              <div>
                <Label htmlFor="email">البريد الإلكتروني</Label>
                <Input
                  id="email"
                  type="email"
                  value={newContact.email}
                  onChange={(e) => setNewContact(prev => ({ ...prev, email: e.target.value }))}
                  placeholder="example@email.com"
                  className="text-right"
                />
              </div>
              <div>
                <Label htmlFor="notes">ملاحظات</Label>
                <Textarea
                  id="notes"
                  value={newContact.notes}
                  onChange={(e) => setNewContact(prev => ({ ...prev, notes: e.target.value }))}
                  placeholder="أي ملاحظات إضافية..."
                  className="text-right"
                />
              </div>
              <div className="flex gap-2 pt-4">
                <Button variant="outline" onClick={() => setShowAddContact(false)} className="flex-1">
                  إلغاء
                </Button>
                <Button onClick={handleAddContact} className="flex-1" disabled={!newContact.name || !newContact.phone}>
                  إضافة
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>

        {/* Edit Contact Dialog */}
        <Dialog open={!!editingContact} onOpenChange={() => setEditingContact(null)}>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>تعديل جهة الاتصال</DialogTitle>
            </DialogHeader>
            {editingContact && (
              <div className="space-y-4">
                <div>
                  <Label htmlFor="edit-name">الاسم</Label>
                  <Input
                    id="edit-name"
                    value={editingContact.name}
                    onChange={(e) => setEditingContact(prev => prev ? ({ ...prev, name: e.target.value }) : null)}
                    className="text-right"
                  />
                </div>
                <div>
                  <Label htmlFor="edit-phone">رقم الهاتف</Label>
                  <Input
                    id="edit-phone"
                    value={editingContact.phone || ''}
                    onChange={(e) => setEditingContact(prev => prev ? ({ ...prev, phone: e.target.value }) : null)}
                    className="text-right"
                  />
                </div>
                <div>
                  <Label htmlFor="edit-email">البريد الإلكتروني</Label>
                  <Input
                    id="edit-email"
                    value={editingContact.email || ''}
                    onChange={(e) => setEditingContact(prev => prev ? ({ ...prev, email: e.target.value }) : null)}
                    className="text-right"
                  />
                </div>
                <div>
                  <Label htmlFor="edit-bio">النبذة الشخصية</Label>
                  <Textarea
                    id="edit-bio"
                    value={editingContact.bio || ''}
                    onChange={(e) => setEditingContact(prev => prev ? ({ ...prev, bio: e.target.value }) : null)}
                    className="text-right"
                  />
                </div>
                <div className="flex items-center space-x-2 space-x-reverse">
                  <Switch
                    id="favorite"
                    checked={editingContact.isFavorite || false}
                    onCheckedChange={(checked) => setEditingContact(prev => prev ? ({ ...prev, isFavorite: checked }) : null)}
                  />
                  <Label htmlFor="favorite">إضافة للمفضلة</Label>
                </div>
                <div className="flex gap-2 pt-4">
                  <Button variant="outline" onClick={() => setEditingContact(null)} className="flex-1">
                    إلغاء
                  </Button>
                  <Button onClick={handleEditContact} className="flex-1">
                    حفظ التغييرات
                  </Button>
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>
      </DialogContent>
    </Dialog>
  );
}