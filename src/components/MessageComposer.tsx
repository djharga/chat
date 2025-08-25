import React, { useState, useRef, useEffect } from 'react';
import { Send, Paperclip, Mic, MicOff, Image, Smile, X, Play, Pause, FileText, Camera } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { Button } from './ui/button';
import { Textarea } from './ui/textarea';
import { Popover, PopoverContent, PopoverTrigger } from './ui/popover';
import { Progress } from './ui/progress';
import { quickReplies } from '../data/mockData';
import { VoiceRecording } from '../types/chat';

interface MessageComposerProps {
  onSendMessage: (content: string, type: 'text' | 'voice' | 'image') => void;
  isTyping?: boolean;
}

export function MessageComposer({ onSendMessage, isTyping }: MessageComposerProps) {
  const [message, setMessage] = useState('');
  const [voiceRecording, setVoiceRecording] = useState<VoiceRecording>({
    isRecording: false,
    duration: 0,
    waveform: []
  });
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [showAttachmentMenu, setShowAttachmentMenu] = useState(false);
  const [attachments, setAttachments] = useState<File[]>([]);
  const [isDragging, setIsDragging] = useState(false);
  
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const recordingInterval = useRef<NodeJS.Timeout>();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const imageInputRef = useRef<HTMLInputElement>(null);

  const emojis = [
    '😀', '😂', '🤣', '😊', '😍', '🥰', '😘', '😗', '😙', '😚',
    '❤️', '🧡', '💛', '💚', '💙', '💜', '🖤', '🤍', '🤎', '💔',
    '👍', '👎', '👌', '✌️', '🤞', '🤝', '👏', '🙌', '👐', '🤲',
    '🙏', '✨', '🌟', '💫', '⭐', '🌠', '☀️', '🌙', '⚡', '🔥',
    '💯', '✅', '❌', '⚠️', '🔴', '🟢', '🔵', '⚪', '⚫', '🟤'
  ];

  const attachmentTypes = [
    { icon: Camera, label: 'كاميرا', action: () => imageInputRef.current?.click() },
    { icon: Image, label: 'صورة', action: () => imageInputRef.current?.click() },
    { icon: FileText, label: 'ملف', action: () => fileInputRef.current?.click() },
  ];

  useEffect(() => {
    if (voiceRecording.isRecording) {
      recordingInterval.current = setInterval(() => {
        setVoiceRecording(prev => ({
          ...prev,
          duration: prev.duration + 0.1,
          waveform: [...prev.waveform, Math.random() * 100]
        }));
      }, 100);
    } else {
      if (recordingInterval.current) {
        clearInterval(recordingInterval.current);
      }
    }

    return () => {
      if (recordingInterval.current) {
        clearInterval(recordingInterval.current);
      }
    };
  }, [voiceRecording.isRecording]);

  // Auto-resize textarea
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = Math.min(textareaRef.current.scrollHeight, 120) + 'px';
    }
  }, [message]);

  const handleSendMessage = () => {
    if (message.trim() || attachments.length > 0) {
      if (attachments.length > 0) {
        onSendMessage('تم إرسال ' + attachments.length + ' ملف', 'image');
      } else {
        onSendMessage(message.trim(), 'text');
      }
      setMessage('');
      setAttachments([]);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const startVoiceRecording = () => {
    setVoiceRecording({
      isRecording: true,
      duration: 0,
      waveform: []
    });
  };

  const stopVoiceRecording = () => {
    setVoiceRecording(prev => ({ ...prev, isRecording: false }));
    if (voiceRecording.duration > 0.5) {
      onSendMessage('رسالة صوتية', 'voice');
    }
    setTimeout(() => {
      setVoiceRecording({ isRecording: false, duration: 0, waveform: [] });
    }, 1000);
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    setAttachments(prev => [...prev, ...files]);
    setShowAttachmentMenu(false);
  };

  const removeAttachment = (index: number) => {
    setAttachments(prev => prev.filter((_, i) => i !== index));
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const files = Array.from(e.dataTransfer.files);
    setAttachments(prev => [...prev, ...files]);
  };

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const getFileIcon = (file: File) => {
    if (file.type.startsWith('image/')) return '🖼️';
    if (file.type.startsWith('video/')) return '🎥';
    if (file.type.startsWith('audio/')) return '🎵';
    if (file.type.includes('pdf')) return '📄';
    return '📎';
  };

  const canSend = message.trim() || attachments.length > 0;

  return (
    <div 
      className={`border-t bg-background/95 backdrop-blur p-4 transition-all duration-300 ${
        isDragging ? 'bg-primary/10 border-primary' : ''
      }`}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
    >
      {/* Drag & Drop Overlay */}
      <AnimatePresence>
        {isDragging && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-primary/10 border-2 border-dashed border-primary rounded-lg flex items-center justify-center z-20"
          >
            <div className="text-center">
              <Paperclip className="h-8 w-8 mx-auto mb-2 text-primary" />
              <p className="text-primary font-medium">اسحب الملفات هنا لإرفاقها</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Attachments Preview */}
      <AnimatePresence>
        {attachments.length > 0 && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="mb-3 p-3 bg-muted/30 rounded-lg"
          >
            <div className="flex gap-2 flex-wrap">
              {attachments.map((file, index) => (
                <motion.div
                  key={index}
                  initial={{ scale: 0, rotate: -10 }}
                  animate={{ scale: 1, rotate: 0 }}
                  exit={{ scale: 0, rotate: 10 }}
                  className="relative bg-background rounded-lg p-3 flex items-center gap-2 shadow-sm border max-w-48"
                >
                  <span className="text-lg">{getFileIcon(file)}</span>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">{file.name}</p>
                    <p className="text-xs text-muted-foreground">
                      {(file.size / 1024 / 1024).toFixed(1)} MB
                    </p>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-6 w-6 p-0 text-muted-foreground hover:text-destructive"
                    onClick={() => removeAttachment(index)}
                  >
                    <X className="h-3 w-3" />
                  </Button>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Voice Recording UI */}
      <AnimatePresence>
        {voiceRecording.isRecording && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            className="mb-3 bg-destructive/10 border border-destructive/20 rounded-lg p-4"
          >
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <motion.div
                  animate={{ scale: [1, 1.2, 1] }}
                  transition={{ duration: 1, repeat: Infinity }}
                  className="w-3 h-3 bg-destructive rounded-full"
                />
                <span className="text-sm font-medium text-destructive">جاري التسجيل...</span>
              </div>
              <span className="text-sm text-muted-foreground font-mono">
                {formatDuration(voiceRecording.duration)}
              </span>
            </div>
            
            {/* Waveform Visualization */}
            <div className="flex items-end gap-1 h-12 mb-4 bg-background/50 rounded p-2">
              {voiceRecording.waveform.slice(-50).map((height, index) => (
                <motion.div
                  key={index}
                  initial={{ height: 0 }}
                  animate={{ height: `${Math.max(height, 10)}%` }}
                  className="w-1 bg-destructive rounded-full min-h-2"
                />
              ))}
            </div>
            
            <div className="flex gap-2">
              <Button variant="destructive" size="sm" onClick={stopVoiceRecording}>
                <MicOff className="h-4 w-4 ml-2" />
                إيقاف التسجيل
              </Button>
              <Button 
                variant="outline" 
                size="sm" 
                onClick={() => setVoiceRecording({ isRecording: false, duration: 0, waveform: [] })}
              >
                إلغاء
              </Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Input Area */}
      <div className="flex items-end gap-3">
        {/* Attachment Button */}
        <Popover open={showAttachmentMenu} onOpenChange={setShowAttachmentMenu}>
          <PopoverTrigger asChild>
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Button
                variant="ghost"
                size="sm"
                className="shrink-0 text-muted-foreground hover:text-primary"
              >
                <Paperclip className="h-5 w-5" />
              </Button>
            </motion.div>
          </PopoverTrigger>
          <PopoverContent side="top" className="w-auto p-2">
            <div className="flex gap-1">
              {attachmentTypes.map((type, index) => (
                <motion.div
                  key={index}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={type.action}
                    className="flex flex-col items-center gap-1 h-auto p-3"
                  >
                    <type.icon className="h-5 w-5" />
                    <span className="text-xs">{type.label}</span>
                  </Button>
                </motion.div>
              ))}
            </div>
          </PopoverContent>
        </Popover>

        <input
          ref={fileInputRef}
          type="file"
          multiple
          accept=".pdf,.doc,.docx,.txt,.zip,.rar"
          onChange={handleFileSelect}
          className="hidden"
        />

        <input
          ref={imageInputRef}
          type="file"
          multiple
          accept="image/*,video/*"
          onChange={handleFileSelect}
          className="hidden"
        />

        {/* Message Input */}
        <div className="flex-1 relative">
          <Textarea
            ref={textareaRef}
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="اكتب رسالة..."
            className="min-h-12 max-h-32 resize-none text-right pr-12 pl-4 py-3 rounded-2xl border-2 border-transparent focus:border-primary/20 transition-colors"
            style={{ height: '48px' }}
            dir="rtl"
          />

          {/* Emoji Picker */}
          <Popover open={showEmojiPicker} onOpenChange={setShowEmojiPicker}>
            <PopoverTrigger asChild>
              <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
                <Button
                  variant="ghost"
                  size="sm"
                  className="absolute right-2 top-2 h-8 w-8 p-0 text-muted-foreground hover:text-primary"
                >
                  <Smile className="h-4 w-4" />
                </Button>
              </motion.div>
            </PopoverTrigger>
            <PopoverContent className="w-80 p-3" side="top">
              <div className="grid grid-cols-10 gap-1 max-h-48 overflow-y-auto">
                {emojis.map((emoji, index) => (
                  <motion.div
                    key={index}
                    whileHover={{ scale: 1.2 }}
                    whileTap={{ scale: 0.9 }}
                  >
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-8 w-8 p-0 text-lg hover:bg-primary/10"
                      onClick={() => {
                        setMessage(prev => prev + emoji);
                        textareaRef.current?.focus();
                      }}
                    >
                      {emoji}
                    </Button>
                  </motion.div>
                ))}
              </div>
            </PopoverContent>
          </Popover>
        </div>

        {/* Send/Voice Button */}
        <div className="shrink-0">
          <AnimatePresence mode="wait">
            {canSend ? (
              <motion.div
                key="send"
                initial={{ scale: 0, rotate: -180 }}
                animate={{ scale: 1, rotate: 0 }}
                exit={{ scale: 0, rotate: 180 }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Button 
                  onClick={handleSendMessage} 
                  size="sm" 
                  className="h-12 w-12 p-0 rounded-full bg-primary hover:bg-primary/90 shadow-lg"
                >
                  <Send className="h-5 w-5" />
                </Button>
              </motion.div>
            ) : (
              <motion.div
                key="voice"
                initial={{ scale: 0, rotate: 180 }}
                animate={{ scale: 1, rotate: 0 }}
                exit={{ scale: 0, rotate: -180 }}
              >
                <Button
                  variant={voiceRecording.isRecording ? "destructive" : "outline"}
                  size="sm"
                  className={`h-12 w-12 p-0 rounded-full shadow-lg transition-all ${
                    voiceRecording.isRecording 
                      ? 'bg-destructive hover:bg-destructive/90' 
                      : 'hover:bg-primary hover:text-primary-foreground'
                  }`}
                  onMouseDown={startVoiceRecording}
                  onMouseUp={stopVoiceRecording}
                  onMouseLeave={stopVoiceRecording}
                  onTouchStart={startVoiceRecording}
                  onTouchEnd={stopVoiceRecording}
                >
                  <motion.div
                    animate={voiceRecording.isRecording ? { scale: [1, 1.2, 1] } : {}}
                    transition={{ duration: 0.5, repeat: voiceRecording.isRecording ? Infinity : 0 }}
                  >
                    <Mic className="h-5 w-5" />
                  </motion.div>
                </Button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Quick Replies */}
      <AnimatePresence>
        {!message && !voiceRecording.isRecording && attachments.length === 0 && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            className="mt-3 flex gap-2 flex-wrap"
          >
            {quickReplies.slice(0, 5).map((reply, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Button
                  variant="outline"
                  size="sm"
                  className="text-xs h-8 px-3 rounded-full border-primary/20 hover:bg-primary/10 hover:border-primary/40"
                  onClick={() => {
                    setMessage(reply);
                    setTimeout(handleSendMessage, 100);
                  }}
                >
                  {reply}
                </Button>
              </motion.div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}