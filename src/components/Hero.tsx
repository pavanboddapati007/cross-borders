import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { MessageSquare, Bot, Newspaper, Sparkles, Globe, Users, Filter, Plus } from 'lucide-react';
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

const Hero = ({
  onNavigate
}: HeroProps) => {
  const [countryFilter, setCountryFilter] = useState('All Countries');
  const [typeFilter, setTypeFilter] = useState('All Types');
  const [stageFilter, setStageFilter] = useState('All Stages');

  const stories: Story[] = [{
    id: '1',
    title: 'Australian PR journey - skilled migration pathway',
    author: 'Priya Sharma',
    country: 'Australia',
    date: 'Jun 24, 2025',
    content: 'After 3 years on a temporary visa, finally got my permanent residency! The points system is competitive but fair. I went through the General Skilled Migration route as a software engineer. Key factors: 1) IELTS score of 8+ in all bands gave me maximum points, 2) Skills assessment through ACS was straightforward for IT, 3) State nomination from South Australia added crucial points, 4) Age factor matters - apply before 33 if possible. The medical and character checks were thorough but routine. Total process took 14 months from EOI to grant. Australia\'s quality of life makes it all worth it!',
    category: 'Permanent Residence',
    stage: 'Skilled Migration',
    status: 'Completed'
  }, {
    id: '2',
    title: 'Canadian Express Entry - Software Developer Path',
    author: 'Ahmed Hassan',
    country: 'Canada',
    date: 'Jun 20, 2025',
    content: 'Just received my ITA! Scored 472 points in the Express Entry pool. My advice: get your language tests done early (IELTS/CELPIP), and don\'t underestimate the importance of French - it can boost your score significantly.',
    category: 'Express Entry',
    stage: 'Professional',
    status: 'In Progress'
  }, {
    id: '3',
    title: 'UK Student to Work Visa Transition',
    author: 'Maria Rodriguez',
    country: 'United Kingdom',
    date: 'Jun 18, 2025',
    content: 'Successfully transitioned from Tier 4 student visa to Skilled Worker visa. The new points-based system is actually quite straightforward if you have a job offer from an approved sponsor.',
    category: 'Work Visa',
    stage: 'Student Transition',
    status: 'Completed'
  }];

  const features = [{
    icon: Users,
    title: "Global Community",
    description: "Connect with immigrants worldwide. Share experiences, challenges, and celebrate successes together.",
    action: () => onNavigate('feed'),
    gradient: "from-cyan-500 to-blue-600"
  }, {
    icon: Bot,
    title: "AI Immigration Assistant",
    description: "Get instant, accurate guidance powered by advanced AI for all your immigration questions.",
    action: () => onNavigate('ai-assistant'),
    gradient: "from-purple-500 to-pink-600"
  }, {
    icon: Globe,
    title: "Immigration Insights",
    description: "Stay ahead with real-time immigration news, policy updates, and expert analysis.",
    action: () => onNavigate('news'),
    gradient: "from-blue-500 to-cyan-500"
  }];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Completed':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'In Progress':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'Planning':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  return <div className="space-y-8 py-4">
      {/* Hero Section */}
      <div className="text-center space-y-6 py-8 relative">
        <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/15 via-purple-500/15 to-blue-500/15 rounded-3xl blur-3xl"></div>
        <div className="relative z-10">
          <div className="flex items-center justify-center mb-4">
            <Sparkles className="w-8 h-8 text-cyan-300 mr-3" />
            <span className="text-cyan-300 font-semibold text-lg">AI-Powered Immigration Platform</span>
          </div>
          <h1 className="text-5xl md:text-6xl font-bold mb-4">
            <span className="bg-gradient-to-r from-white via-cyan-50 to-purple-50 bg-clip-text text-transparent">
              Navigate Your
            </span>
            <br />
            <span className="bg-gradient-to-r from-cyan-300 via-blue-300 to-purple-300 bg-clip-text text-transparent">
              Immigration Journey
            </span>
          </h1>
          <p className="text-lg text-gray-200 max-w-3xl mx-auto leading-relaxed mb-6">Share your wins, your what-now moments, and everything in between. You're not doing this alone anymore.</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button onClick={() => onNavigate('feed')} size="lg" className="bg-gradient-to-r from-cyan-400 to-blue-500 hover:from-cyan-500 hover:to-blue-600 text-white px-8 py-4 rounded-xl font-semibold shadow-lg shadow-cyan-400/30 transition-all duration-300 hover:shadow-cyan-400/50 hover:scale-105">
              Join Community
            </Button>
            <Button onClick={() => onNavigate('ai-assistant')} variant="outline" size="lg" className="border-2 border-purple-400 px-8 py-4 rounded-xl font-semibold backdrop-blur-sm transition-all duration-300 hover:border-purple-300 text-purple-800 bg-zinc-200 hover:bg-zinc-100">AI Assistant (Soon)</Button>
          </div>
        </div>
      </div>

      {/* Features Grid */}
      <div className="grid md:grid-cols-3 gap-6 mb-12">
        {features.map((feature, index) => {
        const Icon = feature.icon;
        return <Card key={index} className="group cursor-pointer transition-all duration-500 hover:scale-105 border border-gray-500/40 bg-gray-700/70 backdrop-blur-xl hover:bg-gray-600/80 rounded-2xl overflow-hidden shadow-lg">
              <CardContent className="p-6 text-center space-y-4 relative">
                <div className="absolute inset-0 bg-gradient-to-r from-cyan-400/10 to-purple-400/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                <div className={`w-12 h-12 mx-auto rounded-xl bg-gradient-to-r ${feature.gradient} flex items-center justify-center group-hover:scale-110 transition-all duration-500 shadow-lg relative z-10`}>
                  <Icon className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-xl font-bold text-white relative z-10">{feature.title}</h3>
                <p className="text-gray-200 leading-relaxed text-sm relative z-10">{feature.description}</p>
                <Button onClick={feature.action} variant="ghost" className="w-full mt-4 bg-white/15 hover:bg-gradient-to-r hover:from-cyan-400/25 hover:to-purple-400/25 border border-gray-500/60 hover:border-cyan-400/60 rounded-xl transition-all duration-300 backdrop-blur-sm text-sm text-white relative z-10">
                  Explore Now
                </Button>
              </CardContent>
            </Card>;
      })}
      </div>

      {/* Community Stories Section */}
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-3xl font-bold text-white">Community Stories</h2>
          <Button className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-3 rounded-xl flex items-center gap-2">
            <Plus className="w-5 h-5" />
            Share Your Story
          </Button>
        </div>

        {/* Filters */}
        <Card className="bg-gray-700/60 backdrop-blur-xl border-gray-600 rounded-2xl p-6">
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-2 text-gray-200">
              <Filter className="w-5 h-5" />
              <span className="font-medium">Filter by:</span>
            </div>
            
            <Select value={countryFilter} onValueChange={setCountryFilter}>
              <SelectTrigger className="w-48 bg-gray-600/60 border-gray-500 text-white">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-gray-700 border-gray-500">
                <SelectItem value="All Countries">All Countries</SelectItem>
                <SelectItem value="Australia">Australia</SelectItem>
                <SelectItem value="Canada">Canada</SelectItem>
                <SelectItem value="United Kingdom">United Kingdom</SelectItem>
                <SelectItem value="United States">United States</SelectItem>
              </SelectContent>
            </Select>

            <Select value={typeFilter} onValueChange={setTypeFilter}>
              <SelectTrigger className="w-48 bg-gray-600/60 border-gray-500 text-white">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-gray-700 border-gray-500">
                <SelectItem value="All Types">All Types</SelectItem>
                <SelectItem value="Permanent Residence">Permanent Residence</SelectItem>
                <SelectItem value="Work Visa">Work Visa</SelectItem>
                <SelectItem value="Student Visa">Student Visa</SelectItem>
                <SelectItem value="Express Entry">Express Entry</SelectItem>
              </SelectContent>
            </Select>

            <Select value={stageFilter} onValueChange={setStageFilter}>
              <SelectTrigger className="w-48 bg-gray-600/60 border-gray-500 text-white">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-gray-700 border-gray-500">
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
          {stories.map(story => <Card key={story.id} className="bg-gray-700/40 backdrop-blur-xl border-gray-600/60 rounded-2xl p-8 hover:bg-gray-700/60 transition-all duration-300">
              <div className="space-y-4">
                <div className="flex items-start justify-between">
                  <h3 className="text-2xl font-bold text-white">{story.title}</h3>
                  <div className="flex gap-2">
                    <Badge className="bg-gray-600 text-gray-200 border-gray-500">
                      {story.category}
                    </Badge>
                    <Badge className={getStatusColor(story.status)}>
                      {story.status}
                    </Badge>
                  </div>
                </div>
                
                <div className="flex items-center gap-6 text-gray-300">
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
                
                <p className="text-gray-200 leading-relaxed">
                  {story.content}
                </p>
              </div>
            </Card>)}
        </div>
      </div>
    </div>;
};

export default Hero;
