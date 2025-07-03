
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Home, MessageSquare, Bot, Newspaper, LogIn } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { AuthDialog } from './AuthDialog';
import { UserMenu } from './UserMenu';
import AdminPanel from './AdminPanel';

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
          <div className="flex flex-col">
            <div className="flex items-center space-x-3">
              {/* Simple Geometric Logo */}
              <div className="relative">
                <div className="w-10 h-10 bg-gradient-to-br from-emerald-400 via-teal-400 to-cyan-400 rounded-lg flex items-center justify-center shadow-lg shadow-emerald-400/25">
                  {/* Bridge/Connection Symbol */}
                  <div className="relative w-6 h-6">
                    {/* Two pillars representing different sides */}
                    <div className="absolute left-0 top-1 w-1 h-4 bg-white rounded-sm"></div>
                    <div className="absolute right-0 top-1 w-1 h-4 bg-white rounded-sm"></div>
                    
                    {/* Connecting bridge arc */}
                    <div className="absolute top-1.5 left-0.5 w-5 h-2 border-t-2 border-white rounded-t-full"></div>
                    
                    {/* Small dots representing people/movement */}
                    <div className="absolute top-2 left-2 w-0.5 h-0.5 bg-white/90 rounded-full"></div>
                    <div className="absolute top-2.5 left-3 w-0.5 h-0.5 bg-white/90 rounded-full"></div>
                    <div className="absolute top-2 right-2 w-0.5 h-0.5 bg-white/90 rounded-full"></div>
                  </div>
                </div>
              </div>
              
              <div>
                <h1 className="font-bold text-xl leading-tight">
                  <span className="bg-gradient-to-r from-white via-gray-100 to-gray-200 bg-clip-text text-transparent">
                    Cross
                  </span>
                  <span className="bg-gradient-to-r from-emerald-400 via-teal-400 to-cyan-400 bg-clip-text text-transparent ml-1">
                    Borders
                  </span>
                </h1>
                <p className="text-gray-400 text-xs font-medium">The real side of immigration</p>
              </div>
            </div>
          </div>
          
          <div className="flex items-center space-x-1">
            {navItems.map(item => {
              const Icon = item.icon;
              const isActive = activeSection === item.id;
              return (
                <Button
                  key={item.id}
                  variant="ghost"
                  size="sm"
                  onClick={() => onNavigate(item.id)}
                  className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg transition-all duration-200 ${
                    isActive 
                      ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20" 
                      : "text-gray-300 hover:text-white hover:bg-white/5"
                  }`}
                >
                  <Icon size={16} />
                  <span className="hidden lg:inline font-medium text-sm">{item.label}</span>
                </Button>
              );
            })}
            
            {/* Admin Panel - only show if user is logged in */}
            {user && (
              <div className="ml-2">
                <AdminPanel />
              </div>
            )}
            
            <div className="ml-4 pl-4 border-l border-gray-800">
              {loading ? (
                <div className="w-8 h-8 rounded-full bg-gray-800 animate-pulse"></div>
              ) : user ? (
                <UserMenu />
              ) : (
                <Button 
                  onClick={() => setAuthDialogOpen(true)}
                  size="sm"
                  className="bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white px-4 py-1.5 rounded-lg font-medium shadow-lg shadow-emerald-500/25 transition-all duration-200 hover:shadow-emerald-500/40"
                >
                  <LogIn size={16} className="mr-1.5" />
                  <span className="hidden sm:inline text-sm">Sign In</span>
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
