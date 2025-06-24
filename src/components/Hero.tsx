
import React from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { MessageSquare, Bot, Newspaper, Sparkles, Globe, Users, ArrowRight } from 'lucide-react';

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
      gradient: "from-emerald-400 via-cyan-400 to-blue-500",
      bgGradient: "from-emerald-50/90 to-cyan-50/90"
    },
    {
      icon: Bot,
      title: "AI Immigration Assistant",
      description: "Get instant, accurate guidance powered by advanced AI for all your immigration questions.",
      action: () => onNavigate('ai-assistant'),
      gradient: "from-purple-400 via-pink-400 to-red-400",
      bgGradient: "from-purple-50/90 to-pink-50/90"
    },
    {
      icon: Globe,
      title: "Immigration Insights",
      description: "Stay ahead with real-time immigration news, policy updates, and expert analysis.",
      action: () => onNavigate('news'),
      gradient: "from-blue-400 via-indigo-400 to-purple-500",
      bgGradient: "from-blue-50/90 to-indigo-50/90"
    }
  ];

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-slate-50 via-white to-blue-50">
        <div className="absolute top-0 left-0 w-72 h-72 bg-purple-300 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse"></div>
        <div className="absolute top-0 right-0 w-72 h-72 bg-yellow-300 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse animation-delay-2000"></div>
        <div className="absolute bottom-0 left-0 w-72 h-72 bg-pink-300 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse animation-delay-4000"></div>
      </div>

      <div className="relative z-10 space-y-20 py-12">
        {/* Hero Section */}
        <div className="text-center space-y-8 py-20 px-4">
          <div className="inline-flex items-center justify-center mb-8 px-4 py-2 bg-gradient-to-r from-blue-500/10 to-purple-500/10 rounded-full border border-blue-200/50 backdrop-blur-sm">
            <Sparkles className="w-5 h-5 text-blue-600 mr-2" />
            <span className="text-blue-700 font-semibold text-sm">AI-Powered Immigration Platform</span>
          </div>
          
          <h1 className="text-6xl md:text-8xl font-black mb-8 leading-tight">
            <span className="block bg-gradient-to-r from-gray-900 via-blue-800 to-purple-800 bg-clip-text text-transparent">
              Navigate Your
            </span>
            <span className="block bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent mt-2">
              Immigration Journey
            </span>
          </h1>
          
          <p className="text-xl md:text-2xl text-gray-700 max-w-4xl mx-auto leading-relaxed mb-12 font-light">
            Empowering immigrants with <span className="font-semibold text-blue-600">AI-driven guidance</span>, 
            <span className="font-semibold text-purple-600"> community support</span>, and 
            <span className="font-semibold text-pink-600"> real-time insights</span> for your new life journey.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
            <Button 
              onClick={() => onNavigate('feed')} 
              size="lg" 
              className="group bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-10 py-6 rounded-2xl font-bold text-lg shadow-2xl shadow-blue-500/25 transition-all duration-300 hover:shadow-blue-500/40 hover:scale-105"
            >
              Join Community
              <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Button>
            <Button 
              onClick={() => onNavigate('ai-assistant')} 
              variant="outline" 
              size="lg" 
              className="group border-2 border-purple-300 text-purple-700 hover:bg-purple-50 px-10 py-6 rounded-2xl font-bold text-lg backdrop-blur-sm transition-all duration-300 hover:border-purple-400 hover:scale-105"
            >
              Try AI Assistant
              <Bot className="ml-2 w-5 h-5 group-hover:scale-110 transition-transform" />
            </Button>
          </div>
        </div>

        {/* Features Grid */}
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              Everything You Need in One Place
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Comprehensive tools and resources designed specifically for immigrants
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <Card 
                  key={index} 
                  className="group cursor-pointer transition-all duration-500 hover:scale-105 border-0 shadow-xl hover:shadow-2xl rounded-3xl overflow-hidden bg-white/80 backdrop-blur-sm"
                  onClick={feature.action}
                >
                  <CardContent className="p-8 text-center space-y-6 relative">
                    <div className={`absolute inset-0 bg-gradient-to-br ${feature.bgGradient} opacity-0 group-hover:opacity-100 transition-opacity duration-500`}></div>
                    
                    <div className="relative z-10">
                      <div className={`w-20 h-20 mx-auto rounded-3xl bg-gradient-to-r ${feature.gradient} flex items-center justify-center group-hover:scale-110 transition-all duration-500 shadow-2xl mb-6`}>
                        <Icon className="w-10 h-10 text-white" />
                      </div>
                      
                      <h3 className="text-2xl font-bold text-gray-900 mb-4 group-hover:text-gray-800">
                        {feature.title}
                      </h3>
                      
                      <p className="text-gray-600 leading-relaxed mb-6 group-hover:text-gray-700">
                        {feature.description}
                      </p>
                      
                      <Button 
                        variant="ghost" 
                        className="group/btn w-full bg-white/50 hover:bg-white/80 border-2 border-gray-200 hover:border-gray-300 rounded-xl transition-all duration-300 backdrop-blur-sm text-gray-800 font-semibold py-3"
                      >
                        Explore Now
                        <ArrowRight className="ml-2 w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>

        {/* Stats Section */}
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 py-16 mx-4 rounded-3xl shadow-2xl">
          <div className="max-w-6xl mx-auto px-8">
            <div className="grid md:grid-cols-3 gap-8 text-center text-white">
              <div className="space-y-2">
                <div className="text-4xl font-bold">10K+</div>
                <div className="text-blue-100">Active Users</div>
              </div>
              <div className="space-y-2">
                <div className="text-4xl font-bold">50+</div>
                <div className="text-blue-100">Countries Supported</div>
              </div>
              <div className="space-y-2">
                <div className="text-4xl font-bold">95%</div>
                <div className="text-blue-100">Success Rate</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Hero;
