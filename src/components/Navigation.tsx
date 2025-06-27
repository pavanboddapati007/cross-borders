import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Home, MessageSquare, Bot, Newspaper, LogIn } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { AuthDialog } from './AuthDialog';
import { UserMenu } from './UserMenu';
interface NavigationProps {
  activeSection: string;
  onNavigate: (section: string) => void;
}
const Navigation = ({
  activeSection,
  onNavigate
}: NavigationProps) => {
  const [authDialogOpen, setAuthDialogOpen] = useState(false);
  const {
    user,
    loading
  } = useAuth();
  const navItems = [{
    id: 'home',
    label: 'Home',
    icon: Home
  }, {
    id: 'feed',
    label: 'Community',
    icon: MessageSquare
  }, {
    id: 'ai-assistant',
    label: 'AI Assistant',
    icon: Bot
  }, {
    id: 'news',
    label: 'News',
    icon: Newspaper
  }];
  return <nav className="bg-black/90 backdrop-blur-xl border-b border-gray-800 sticky top-0 z-50">
      <div className="container mx-auto px-6">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center space-x-3">
            <div className="relative w-10 h-10 bg-gradient-to-br from-cyan-400 via-blue-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg shadow-blue-500/25">
              {/* AI-focused logo with neural network pattern */}
              <div className="relative w-6 h-6">
                {/* Central node */}
                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-2 h-2 bg-white rounded-full"></div>
                {/* Surrounding nodes */}
                <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-1 h-1 bg-white/80 rounded-full"></div>
                <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-1 h-1 bg-white/80 rounded-full"></div>
                <div className="absolute top-1/2 left-0 transform -translate-y-1/2 w-1 h-1 bg-white/80 rounded-full"></div>
                <div className="absolute top-1/2 right-0 transform -translate-y-1/2 w-1 h-1 bg-white/80 rounded-full"></div>
                <div className="absolute top-1 right-1 w-1 h-1 bg-white/60 rounded-full"></div>
                <div className="absolute bottom-1 left-1 w-1 h-1 bg-white/60 rounded-full"></div>
                {/* Connection lines */}
                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-4 h-px bg-white/40 rotate-0"></div>
                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-4 h-px bg-white/40 rotate-90"></div>
                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-3 h-px bg-white/30 rotate-45"></div>
                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-3 h-px bg-white/30 -rotate-45"></div>
              </div>
            </div>
            <h1 className="font-bold bg-gradient-to-r from-cyan-400 via-blue-400 to-purple-400 bg-clip-text text-transparent text-xl">Cross Borders</h1>
          </div>
          
          <div className="flex items-center space-x-2">
            {navItems.map(item => {
            const Icon = item.icon;
            const isActive = activeSection === item.id;
            return <Button key={item.id} variant="ghost" onClick={() => onNavigate(item.id)} className={`flex items-center space-x-2 transition-all duration-300 rounded-xl ${isActive ? "bg-gradient-to-r from-cyan-500/20 to-purple-500/20 text-cyan-300 border border-cyan-500/30" : "text-gray-300 hover:text-white hover:bg-white/5"}`}>
                  <Icon size={18} />
                  <span className="hidden md:inline font-medium">{item.label}</span>
                </Button>;
          })}
            
            <div className="ml-4">
              {loading ? <div className="w-10 h-10 rounded-full bg-gray-700 animate-pulse"></div> : user ? <UserMenu /> : <Button onClick={() => setAuthDialogOpen(true)} className="bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 text-white px-4 py-2 rounded-xl font-medium shadow-lg shadow-cyan-500/25 transition-all duration-300 hover:shadow-cyan-500/40">
                  <LogIn size={18} className="mr-2" />
                  <span className="hidden sm:inline">Sign In</span>
                </Button>}
            </div>
          </div>
        </div>
      </div>
      
      <AuthDialog open={authDialogOpen} onOpenChange={setAuthDialogOpen} />
    </nav>;
};
export default Navigation;