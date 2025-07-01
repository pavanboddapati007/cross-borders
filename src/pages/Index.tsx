
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
      <div className="min-h-screen bg-gray-950">
        {/* Background Pattern */}
        <div className="fixed inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-gray-900 via-gray-950 to-black"></div>
        <div className="fixed inset-0 bg-[radial-gradient(ellipse_at_bottom_right,_var(--tw-gradient-stops))] from-emerald-900/20 via-transparent to-transparent"></div>
        <div className="fixed inset-0 bg-[radial-gradient(ellipse_at_top_left,_var(--tw-gradient-stops))] from-teal-900/20 via-transparent to-transparent"></div>
        
        {/* Grid Pattern */}
        <div className="fixed inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:100px_100px]"></div>
        
        <Navigation activeSection={activeSection} onNavigate={setActiveSection} />
        <main className="container mx-auto px-6 py-8 relative z-10">
          {renderContent()}
        </main>
        <Toaster />
      </div>
    </AuthProvider>
  );
};

export default Index;
