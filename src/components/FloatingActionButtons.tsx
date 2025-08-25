import React from 'react';
import { motion } from 'motion/react';
import { Button } from './ui/button';
import { MessageCircle, Moon, Sun, Settings } from 'lucide-react';
import { ANIMATION_DELAYS } from '../utils/constants';

interface FloatingActionButtonsProps {
  onNewChat: () => void;
  onToggleDarkMode: () => void;
  onShowAdvancedSettings: () => void;
  isDarkMode: boolean;
}

export function FloatingActionButtons({
  onNewChat,
  onToggleDarkMode,
  onShowAdvancedSettings,
  isDarkMode
}: FloatingActionButtonsProps) {
  return (
    <div className="fixed bottom-6 left-6 z-40 flex flex-col gap-3">
      {/* New Chat Button */}
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ delay: ANIMATION_DELAYS.newChatButton }}
      >
        <Button 
          size="lg" 
          onClick={onNewChat}
          className="rounded-full w-14 h-14 p-0 shadow-lg hover:shadow-xl transition-shadow group"
          title="محادثة جديدة (Ctrl+Shift+N)"
        >
          <MessageCircle className="h-6 w-6 group-hover:scale-110 transition-transform" />
        </Button>
      </motion.div>

      {/* Theme Toggle Button */}
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ delay: ANIMATION_DELAYS.themeButton }}
      >
        <Button 
          onClick={onToggleDarkMode}
          variant="outline"
          size="lg" 
          className="rounded-full w-14 h-14 p-0 shadow-lg hover:shadow-xl transition-shadow group"
          title={isDarkMode ? 'الوضع النهاري' : 'الوضع الليلي'}
        >
          <motion.div
            initial={false}
            animate={{ rotate: isDarkMode ? 180 : 0 }}
            transition={{ duration: 0.3 }}
            className="group-hover:scale-110 transition-transform"
          >
            {isDarkMode ? <Sun className="h-6 w-6" /> : <Moon className="h-6 w-6" />}
          </motion.div>
        </Button>
      </motion.div>

      {/* Quick Settings Button */}
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ delay: ANIMATION_DELAYS.settingsButton }}
      >
        <Button 
          onClick={onShowAdvancedSettings}
          variant="outline"
          size="lg" 
          className="rounded-full w-14 h-14 p-0 shadow-lg hover:shadow-xl transition-shadow group"
          title="الإعدادات السريعة (Ctrl+,)"
        >
          <Settings className="h-6 w-6 group-hover:rotate-90 transition-transform duration-300" />
        </Button>
      </motion.div>
    </div>
  );
}