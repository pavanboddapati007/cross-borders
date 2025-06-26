
import React, { useState } from 'react';
import Navigation from '../components/Navigation';
import PostFeed from '../components/PostFeed';
import AIAssistant from '../components/AIAssistant';
import NewsSection from '../components/NewsSection';
import Hero from '../components/Hero';
import { AuthProvider } from '../contexts/AuthContext';
import { Toaster } from '@/components/ui/toaster';

const Index = () => {
  const [activeSection, setActiveSection] = useState('home');

  const renderContent = () => {
    switch (activeSection) {
      case 'feed':
        return <PostFeed />;
      case 'ai-assistant':
        return <AIAssistant />;
      case 'news':
        return <NewsSection />;
      default:
        return <Hero onNavigate={setActiveSection} />;
    }
  };

  return (
    <AuthProvider>
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900">
        <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/5 via-purple-500/5 to-blue-500/5"></div>
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-cyan-900/20 via-transparent to-purple-900/20"></div>
        <Navigation activeSection={activeSection} onNavigate={setActiveSection} />
        <main className="container mx-auto px-4 py-8 relative z-10">
          {renderContent()}
        </main>
        <Toaster />
      </div>
    </AuthProvider>
  );
};

export default Index;
