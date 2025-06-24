
import React from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { MessageSquare, Bot, Newspaper, Sparkles, Globe, Users } from 'lucide-react';

interface HeroProps {
  onNavigate: (section: string) => void;
}

const Hero = ({ onNavigate }: HeroProps) => {
  const features = [
    {
      icon: Users,
      title: "Global Community",
      description: "Connect with immigrants worldwide. Share experiences, challenges, and celebrate successes together.",
      action: () => onNavigate('feed'),
      gradient: "from-cyan-500 to-blue-600"
    },
    {
      icon: Bot,
      title: "AI Immigration Assistant",
      description: "Get instant, accurate guidance powered by advanced AI for all your immigration questions.",
      action: () => onNavigate('ai-assistant'),
      gradient: "from-purple-500 to-pink-600"
    },
    {
      icon: Globe,
      title: "Immigration Insights",
      description: "Stay ahead with real-time immigration news, policy updates, and expert analysis.",
      action: () => onNavigate('news'),
      gradient: "from-blue-500 to-cyan-500"
    }
  ];

  return (
    <div className="space-y-16 py-8">
      {/* Hero Section */}
      <div className="text-center space-y-8 py-16 relative">
        <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/10 via-purple-500/10 to-blue-500/10 rounded-3xl blur-3xl"></div>
        <div className="relative z-10">
          <div className="flex items-center justify-center mb-6">
            <Sparkles className="w-8 h-8 text-cyan-400 mr-3" />
            <span className="text-cyan-400 font-semibold text-lg">AI-Powered Immigration Platform</span>
          </div>
          <h1 className="text-6xl md:text-7xl font-bold mb-6">
            <span className="bg-gradient-to-r from-white via-cyan-100 to-purple-100 bg-clip-text text-transparent">
              Navigate Your
            </span>
            <br />
            <span className="bg-gradient-to-r from-cyan-400 via-blue-400 to-purple-400 bg-clip-text text-transparent">
              Immigration Journey
            </span>
          </h1>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto leading-relaxed mb-8">
            Empowering immigrants with AI-driven guidance, community support, and real-time insights 
            to make informed decisions on their path to a new life.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button onClick={() => onNavigate('feed')} size="lg" className="bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 text-white px-8 py-4 rounded-xl font-semibold shadow-lg shadow-cyan-500/25 transition-all duration-300 hover:shadow-cyan-500/40 hover:scale-105">
              Join Community
            </Button>
            <Button onClick={() => onNavigate('ai-assistant')} variant="outline" size="lg" className="border-2 border-purple-500 text-purple-400 hover:bg-purple-500/10 px-8 py-4 rounded-xl font-semibold backdrop-blur-sm transition-all duration-300 hover:border-purple-400">
              Try AI Assistant
            </Button>
          </div>
        </div>
      </div>

      {/* Features Grid */}
      <div className="grid md:grid-cols-3 gap-8">
        {features.map((feature, index) => {
          const Icon = feature.icon;
          return (
            <Card key={index} className="group cursor-pointer transition-all duration-500 hover:scale-105 border-0 bg-gradient-to-br from-gray-900/50 to-gray-800/30 backdrop-blur-xl hover:from-gray-800/60 hover:to-gray-700/40 rounded-2xl overflow-hidden">
              <CardContent className="p-8 text-center space-y-6 relative">
                <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/5 to-purple-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                <div className={`w-16 h-16 mx-auto rounded-2xl bg-gradient-to-r ${feature.gradient} flex items-center justify-center group-hover:scale-110 transition-all duration-500 shadow-lg`}>
                  <Icon className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-black">{feature.title}</h3>
                <p className="text-black leading-relaxed">{feature.description}</p>
                <Button onClick={feature.action} variant="ghost" className="w-full mt-6 bg-white/5 hover:bg-gradient-to-r hover:from-cyan-500/20 hover:to-purple-500/20 border border-gray-700 hover:border-cyan-500/50 rounded-xl transition-all duration-300 backdrop-blur-sm text-black">
                  Explore Now
                </Button>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
};

export default Hero;
