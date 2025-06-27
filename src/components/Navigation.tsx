
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
  const { user, loading } = useAuth();

  const navItems = [
    { id: 'home', label: 'Home', icon: Home },
    { id: 'feed', label: 'Community', icon: MessageSquare },
    { id: 'ai-assistant', label: 'AI Assistant', icon: Bot },
    { id: 'news', label: 'News', icon: Newspaper }
  ];

  return (
    <nav className="bg-gray-950/80 backdrop-blur-xl border-b border-gray-800/50 sticky top-0 z-50">
      <div className="container mx-auto px-6">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center space-x-4">
            {/* Modern AI Logo */}
            <div className="relative">
              <div className="w-10 h-10 bg-gradient-to-br from-emerald-400 via-teal-400 to-cyan-400 rounded-xl flex items-center justify-center shadow-lg shadow-emerald-400/25">
                {/* AI Circuit Pattern */}
                <div className="relative w-6 h-6">
                  {/* Central processing unit */}
                  <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-2 h-2 bg-white rounded-full shadow-sm"></div>
                  
                  {/* Neural network nodes */}
                  <div className="absolute top-1 left-1/2 transform -translate-x-1/2 w-1 h-1 bg-white/90 rounded-full"></div>
                  <div className="absolute bottom-1 left-1/2 transform -translate-x-1/2 w-1 h-1 bg-white/90 rounded-full"></div>
                  <div className="absolute top-1/2 left-1 transform -translate-y-1/2 w-1 h-1 bg-white/90 rounded-full"></div>
                  <div className="absolute top-1/2 right-1 transform -translate-y-1/2 w-1 h-1 bg-white/90 rounded-full"></div>
                  
                  {/* Corner nodes */}
                  <div className="absolute top-1 left-1 w-0.5 h-0.5 bg-white/70 rounded-full"></div>
                  <div className="absolute top-1 right-1 w-0.5 h-0.5 bg-white/70 rounded-full"></div>
                  <div className="absolute bottom-1 left-1 w-0.5 h-0.5 bg-white/70 rounded-full"></div>
                  <div className="absolute bottom-1 right-1 w-0.5 h-0.5 bg-white/70 rounded-full"></div>
                  
                  {/* Connection lines */}
                  <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-4 h-px bg-white/50"></div>
                  <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-px h-4 bg-white/50"></div>
                  <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-3 h-px bg-white/40 rotate-45"></div>
                  <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-3 h-px bg-white/40 -rotate-45"></div>
                </div>
              </div>
            </div>
            
            <h1 className="font-bold text-xl">
              <span className="bg-gradient-to-r from-white via-gray-100 to-gray-200 bg-clip-text text-transparent">
                Cross
              </span>
              <span className="bg-gradient-to-r from-emerald-400 via-teal-400 to-cyan-400 bg-clip-text text-transparent ml-1">
                Borders
              </span>
            </h1>
          </div>
          
          <div className="flex items-center space-x-1">
            {navItems.map(item => {
              const Icon = item.icon;
              const isActive = activeSection === item.id;
              return (
                <Button
                  key={item.id}
                  variant="ghost"
                  onClick={() => onNavigate(item.id)}
                  className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-all duration-200 ${
                    isActive 
                      ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20" 
                      : "text-gray-300 hover:text-white hover:bg-white/5"
                  }`}
                >
                  <Icon size={18} />
                  <span className="hidden md:inline font-medium">{item.label}</span>
                </Button>
              );
            })}
            
            <div className="ml-4 pl-4 border-l border-gray-800">
              {loading ? (
                <div className="w-10 h-10 rounded-full bg-gray-800 animate-pulse"></div>
              ) : user ? (
                <UserMenu />
              ) : (
                <Button 
                  onClick={() => setAuthDialogOpen(true)}
                  className="bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white px-6 py-2 rounded-lg font-medium shadow-lg shadow-emerald-500/25 transition-all duration-200 hover:shadow-emerald-500/40"
                >
                  <LogIn size={18} className="mr-2" />
                  <span className="hidden sm:inline">Sign In</span>
                </Button>
              )}
            </div>
          </div>
        </div>
      </div>
      
      <AuthDialog open={authDialogOpen} onOpenChange={setAuthDialogOpen} />
    </nav>
  );
};

export default Navigation;
