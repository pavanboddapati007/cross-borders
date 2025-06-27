
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { MessageSquare, Bot, Newspaper, Sparkles, Globe, Users, Filter, Plus, ArrowRight } from 'lucide-react';
import { Badge } from "@/components/ui/badge";

interface HeroProps {
  onNavigate: (section: string) => void;
}

interface Story {
  id: string;
  title: string;
  author: string;
  country: string;
  date: string;
  content: string;
  category: string;
  stage: string;
  status: 'Completed' | 'In Progress' | 'Planning';
}

const Hero = ({ onNavigate }: HeroProps) => {
  const [countryFilter, setCountryFilter] = useState('All Countries');
  const [typeFilter, setTypeFilter] = useState('All Types');
  const [stageFilter, setStageFilter] = useState('All Stages');

  const stories: Story[] = [
    {
      id: '1',
      title: 'Australian PR journey - skilled migration pathway',
      author: 'Priya Sharma',
      country: 'Australia',
      date: 'Jun 24, 2025',
      content: 'After 3 years on a temporary visa, finally got my permanent residency! The points system is competitive but fair. I went through the General Skilled Migration route as a software engineer...',
      category: 'Permanent Residence',
      stage: 'Skilled Migration',
      status: 'Completed'
    },
    {
      id: '2',
      title: 'Canadian Express Entry - Software Developer Path',
      author: 'Ahmed Hassan',
      country: 'Canada',
      date: 'Jun 20, 2025',
      content: 'Just received my ITA! Scored 472 points in the Express Entry pool. My advice: get your language tests done early (IELTS/CELPIP)...',
      category: 'Express Entry',
      stage: 'Professional',
      status: 'In Progress'
    },
    {
      id: '3',
      title: 'UK Student to Work Visa Transition',
      author: 'Maria Rodriguez',
      country: 'United Kingdom',
      date: 'Jun 18, 2025',
      content: 'Successfully transitioned from Tier 4 student visa to Skilled Worker visa. The new points-based system is actually quite straightforward...',
      category: 'Work Visa',
      stage: 'Student Transition',
      status: 'Completed'
    }
  ];

  const features = [
    {
      icon: Users,
      title: "Global Community",
      description: "Connect with immigrants worldwide. Share experiences, challenges, and celebrate successes together.",
      action: () => onNavigate('feed'),
      gradient: "from-emerald-500 to-teal-600"
    },
    {
      icon: Bot,
      title: "AI Immigration Assistant",
      description: "Get instant, accurate guidance powered by advanced AI for all your immigration questions.",
      action: () => onNavigate('ai-assistant'),
      gradient: "from-teal-500 to-cyan-600"
    },
    {
      icon: Globe,
      title: "Immigration Insights",
      description: "Stay ahead with real-time immigration news, policy updates, and expert analysis.",
      action: () => onNavigate('news'),
      gradient: "from-cyan-500 to-blue-600"
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Completed':
        return 'bg-emerald-50 text-emerald-700 border-emerald-200';
      case 'In Progress':
        return 'bg-blue-50 text-blue-700 border-blue-200';
      case 'Planning':
        return 'bg-amber-50 text-amber-700 border-amber-200';
      default:
        return 'bg-gray-50 text-gray-700 border-gray-200';
    }
  };

  return (
    <div className="space-y-20">
      {/* Hero Section */}
      <div className="text-center space-y-8 py-16 relative">
        <div className="absolute inset-0 bg-gradient-to-r from-emerald-500/5 via-teal-500/5 to-cyan-500/5 rounded-3xl blur-3xl"></div>
        <div className="relative z-10 max-w-4xl mx-auto">
          <div className="inline-flex items-center gap-2 bg-gradient-to-r from-emerald-500/10 to-teal-500/10 border border-emerald-500/20 rounded-full px-4 py-2 mb-8">
            <Sparkles className="w-5 h-5 text-emerald-400" />
            <span className="text-emerald-300 font-medium">AI-Powered Immigration Platform</span>
          </div>
          
          <h1 className="text-6xl md:text-7xl font-bold leading-tight mb-6">
            <span className="block text-white">Build your future</span>
            <span className="block bg-gradient-to-r from-emerald-400 via-teal-400 to-cyan-400 bg-clip-text text-transparent">
              Scale to success
            </span>
          </h1>
          
          <p className="text-xl text-gray-300 max-w-2xl mx-auto leading-relaxed mb-8">
            Cross Borders is the AI-powered immigration platform. Navigate your journey with 
            community support, expert guidance, and real-time updates.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button 
              onClick={() => onNavigate('feed')} 
              size="lg" 
              className="bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white px-8 py-4 rounded-xl font-semibold shadow-lg shadow-emerald-500/25 transition-all duration-300 hover:shadow-emerald-500/40"
            >
              Start your journey
              <ArrowRight className="ml-2 w-5 h-5" />
            </Button>
            <Button 
              onClick={() => onNavigate('ai-assistant')} 
              variant="outline" 
              size="lg" 
              className="border-2 border-gray-600 text-gray-300 hover:text-white hover:border-gray-500 px-8 py-4 rounded-xl font-semibold backdrop-blur-sm transition-all duration-300 bg-gray-900/50 hover:bg-gray-800/50"
            >
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
            <Card 
              key={index} 
              className="group cursor-pointer transition-all duration-300 hover:scale-105 border border-gray-800/50 bg-gray-900/50 backdrop-blur-xl hover:bg-gray-800/50 rounded-2xl overflow-hidden"
              onClick={feature.action}
            >
              <CardContent className="p-8 text-center space-y-6 relative">
                <div className="absolute inset-0 bg-gradient-to-br from-emerald-400/5 to-teal-400/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                <div className={`w-16 h-16 mx-auto rounded-2xl bg-gradient-to-r ${feature.gradient} flex items-center justify-center group-hover:scale-110 transition-all duration-300 shadow-lg relative z-10`}>
                  <Icon className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-white relative z-10">{feature.title}</h3>
                <p className="text-gray-300 leading-relaxed relative z-10">{feature.description}</p>
                <Button 
                  variant="ghost" 
                  className="w-full mt-6 bg-white/5 hover:bg-white/10 border border-gray-700 hover:border-gray-600 rounded-xl transition-all duration-300 backdrop-blur-sm text-white relative z-10"
                >
                  Explore Now
                  <ArrowRight className="ml-2 w-4 h-4" />
                </Button>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Community Stories Section */}
      <div className="space-y-8">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-4xl font-bold text-white mb-2">Community Stories</h2>
            <p className="text-gray-400">Real experiences from our global community</p>
          </div>
          <Button className="bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white px-6 py-3 rounded-xl flex items-center gap-2 shadow-lg shadow-emerald-500/25">
            <Plus className="w-5 h-5" />
            Share Your Story
          </Button>
        </div>

        {/* Filters */}
        <Card className="bg-gray-900/50 backdrop-blur-xl border-gray-800/50 rounded-2xl p-6">
          <div className="flex items-center gap-6 flex-wrap">
            <div className="flex items-center gap-2 text-gray-300">
              <Filter className="w-5 h-5" />
              <span className="font-medium">Filter by:</span>
            </div>
            
            <Select value={countryFilter} onValueChange={setCountryFilter}>
              <SelectTrigger className="w-48 bg-gray-800/50 border-gray-700 text-white">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-gray-800 border-gray-700">
                <SelectItem value="All Countries">All Countries</SelectItem>
                <SelectItem value="Australia">Australia</SelectItem>
                <SelectItem value="Canada">Canada</SelectItem>
                <SelectItem value="United Kingdom">United Kingdom</SelectItem>
                <SelectItem value="United States">United States</SelectItem>
              </SelectContent>
            </Select>

            <Select value={typeFilter} onValueChange={setTypeFilter}>
              <SelectTrigger className="w-48 bg-gray-800/50 border-gray-700 text-white">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-gray-800 border-gray-700">
                <SelectItem value="All Types">All Types</SelectItem>
                <SelectItem value="Permanent Residence">Permanent Residence</SelectItem>
                <SelectItem value="Work Visa">Work Visa</SelectItem>
                <SelectItem value="Student Visa">Student Visa</SelectItem>
                <SelectItem value="Express Entry">Express Entry</SelectItem>
              </SelectContent>
            </Select>

            <Select value={stageFilter} onValueChange={setStageFilter}>
              <SelectTrigger className="w-48 bg-gray-800/50 border-gray-700 text-white">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-gray-800 border-gray-700">
                <SelectItem value="All Stages">All Stages</SelectItem>
                <SelectItem value="Skilled Migration">Skilled Migration</SelectItem>
                <SelectItem value="Professional">Professional</SelectItem>
                <SelectItem value="Student Transition">Student Transition</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </Card>

        {/* Stories */}
        <div className="space-y-6">
          {stories.map(story => (
            <Card 
              key={story.id} 
              className="bg-gray-900/30 backdrop-blur-xl border-gray-800/50 rounded-2xl p-8 hover:bg-gray-800/30 transition-all duration-300 hover:border-gray-700/50"
            >
              <div className="space-y-4">
                <div className="flex items-start justify-between">
                  <h3 className="text-2xl font-bold text-white flex-1 pr-4">{story.title}</h3>
                  <div className="flex gap-2 flex-shrink-0">
                    <Badge className="bg-gray-800 text-gray-200 border-gray-700">
                      {story.category}
                    </Badge>
                    <Badge className={getStatusColor(story.status)}>
                      {story.status}
                    </Badge>
                  </div>
                </div>
                
                <div className="flex items-center gap-6 text-gray-400">
                  <div className="flex items-center gap-2">
                    <Users className="w-4 h-4" />
                    <span>{story.author}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Globe className="w-4 h-4" />
                    <span>{story.country}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span>{story.date}</span>
                  </div>
                </div>
                
                <p className="text-gray-300 leading-relaxed">
                  {story.content}
                </p>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Hero;
