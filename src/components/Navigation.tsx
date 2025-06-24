
import React from 'react';
import { Button } from "@/components/ui/button";
import { Home, MessageSquare, Bot, Newspaper } from 'lucide-react';

interface NavigationProps {
  activeSection: string;
  onNavigate: (section: string) => void;
}

const Navigation = ({ activeSection, onNavigate }: NavigationProps) => {
  const navItems = [
    { id: 'home', label: 'Home', icon: Home },
    { id: 'feed', label: 'Community', icon: MessageSquare },
    { id: 'ai-assistant', label: 'AI Assistant', icon: Bot },
    { id: 'news', label: 'News', icon: Newspaper },
  ];

  return (
    <nav className="bg-black/90 backdrop-blur-xl border-b border-gray-800 sticky top-0 z-50">
      <div className="container mx-auto px-6">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-br from-cyan-400 via-blue-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg shadow-blue-500/25">
              <div className="w-6 h-6 bg-white rounded-md flex items-center justify-center">
                <div className="w-3 h-3 bg-gradient-to-br from-cyan-400 to-purple-600 rounded-sm"></div>
              </div>
            </div>
            <h1 className="text-2xl font-bold bg-gradient-to-r from-cyan-400 via-blue-400 to-purple-400 bg-clip-text text-transparent">
              Cross Borders
            </h1>
          </div>
          
          <div className="flex space-x-2">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeSection === item.id;
              
              return (
                <Button
                  key={item.id}
                  variant="ghost"
                  onClick={() => onNavigate(item.id)}
                  className={`flex items-center space-x-2 transition-all duration-300 rounded-xl ${
                    isActive 
                      ? "bg-gradient-to-r from-cyan-500/20 to-purple-500/20 text-cyan-300 border border-cyan-500/30" 
                      : "text-gray-300 hover:text-white hover:bg-white/5"
                  }`}
                >
                  <Icon size={18} />
                  <span className="hidden md:inline font-medium">{item.label}</span>
                </Button>
              );
            })}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navigation;
