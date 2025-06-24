
import React, { useState } from 'react';
import Navigation from '../components/Navigation';
import PostFeed from '../components/PostFeed';
import AIAssistant from '../components/AIAssistant';
import NewsSection from '../components/NewsSection';
import Hero from '../components/Hero';

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
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50">
      <Navigation activeSection={activeSection} onNavigate={setActiveSection} />
      <main className="container mx-auto px-4 py-8">
        {renderContent()}
      </main>
    </div>
  );
};

export default Index;
