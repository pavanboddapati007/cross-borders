
import React from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { MessageSquare, BookOpen, News } from 'lucide-react';

interface HeroProps {
  onNavigate: (section: string) => void;
}

const Hero = ({ onNavigate }: HeroProps) => {
  const features = [
    {
      icon: MessageSquare,
      title: "Share Your Journey",
      description: "Connect with fellow immigrants and share your experiences, challenges, and success stories.",
      action: () => onNavigate('feed'),
      color: "from-blue-500 to-blue-600"
    },
    {
      icon: BookOpen,
      title: "AI Immigration Assistant",
      description: "Get instant, accurate guidance on immigration processes, documentation, and requirements.",
      action: () => onNavigate('ai-assistant'),
      color: "from-green-500 to-green-600"
    },
    {
      icon: News,
      title: "Latest Immigration News",
      description: "Stay updated with the latest immigration policies, changes, and important announcements.",
      action: () => onNavigate('news'),
      color: "from-purple-500 to-purple-600"
    }
  ];

  return (
    <div className="space-y-12">
      {/* Hero Section */}
      <div className="text-center space-y-6 py-12">
        <h1 className="text-5xl md:text-6xl font-bold bg-gradient-to-r from-blue-600 via-green-600 to-purple-600 bg-clip-text text-transparent">
          Your Immigration Journey Starts Here
        </h1>
        <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
          Connect with a supportive community of immigrants, get AI-powered guidance, 
          and stay informed with the latest immigration news and updates.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button 
            onClick={() => onNavigate('feed')} 
            size="lg" 
            className="bg-gradient-to-r from-blue-600 to-green-600 hover:from-blue-700 hover:to-green-700 text-white px-8 py-3"
          >
            Join the Community
          </Button>
          <Button 
            onClick={() => onNavigate('ai-assistant')} 
            variant="outline" 
            size="lg"
            className="border-2 border-blue-600 text-blue-600 hover:bg-blue-50 px-8 py-3"
          >
            Try AI Assistant
          </Button>
        </div>
      </div>

      {/* Features Grid */}
      <div className="grid md:grid-cols-3 gap-8">
        {features.map((feature, index) => {
          const Icon = feature.icon;
          return (
            <Card key={index} className="group cursor-pointer transition-all duration-300 hover:shadow-xl hover:-translate-y-2 border-0 bg-white/80 backdrop-blur-sm">
              <CardContent className="p-8 text-center space-y-4">
                <div className={`w-16 h-16 mx-auto rounded-full bg-gradient-to-r ${feature.color} flex items-center justify-center group-hover:scale-110 transition-transform duration-300`}>
                  <Icon className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl font-semibold text-gray-800">{feature.title}</h3>
                <p className="text-gray-600 leading-relaxed">{feature.description}</p>
                <Button 
                  onClick={feature.action}
                  variant="outline" 
                  className="w-full mt-4 group-hover:bg-gradient-to-r group-hover:from-blue-600 group-hover:to-green-600 group-hover:text-white group-hover:border-transparent transition-all duration-300"
                >
                  Get Started
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
