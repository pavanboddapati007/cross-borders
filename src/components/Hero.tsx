import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { MessageSquare, Bot, Newspaper, Sparkles, Globe, Users, Filter, Plus, ArrowRight, Heart, TrendingUp, Star, Eye } from 'lucide-react';
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
  likes: number;
  comments: number;
  views: number;
  featured: boolean;
  trending: boolean;
}
const Hero = ({
  onNavigate
}: HeroProps) => {
  const [activeTab, setActiveTab] = useState<'featured' | 'trending'>('featured');
  
  // Fetch real posts from the database
  const { data: posts, isLoading } = useQuery({
    queryKey: ['hero-posts'],
    queryFn: async () => {
      console.log('Fetching posts for hero...');
      
      // Fetch posts
      const { data: postsData, error: postsError } = await supabase
        .from('posts')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(6);

      if (postsError) {
        console.error('Error fetching posts:', postsError);
        throw postsError;
      }

      // Fetch profiles for the posts
      const userIds = postsData?.map(post => post.user_id).filter(Boolean) || [];
      const { data: profilesData, error: profilesError } = await supabase
        .from('profiles')
        .select('id, username, full_name, avatar_url')
        .in('id', userIds);

      if (profilesError) {
        console.error('Error fetching profiles:', profilesError);
        throw profilesError;
      }

      // Transform posts to match the Story interface
      const transformedPosts = postsData?.map(post => {
        const profile = profilesData?.find(profile => profile.id === post.user_id);
        const author = post.display_username || profile?.username || 'Anonymous';
        
        return {
          id: post.id,
          title: post.title,
          author,
          country: post.country || post.target_country || 'Unknown',
          date: new Date(post.created_at).toLocaleDateString('en-US', { 
            month: 'short', 
            day: 'numeric', 
            year: 'numeric' 
          }),
          content: post.content.length > 150 ? post.content.substring(0, 150) + '...' : post.content,
          category: post.category || 'General',
          stage: post.stage || 'Unknown',
          status: post.status || 'Planning',
          likes: post.likes || 0,
          comments: post.comments || 0,
          views: Math.floor(Math.random() * 2000) + 100, // Generate random views for display
          featured: Math.random() > 0.5, // Randomly assign featured status
          trending: Math.random() > 0.6, // Randomly assign trending status
        } as Story;
      }) || [];

      console.log('Transformed posts:', transformedPosts);
      return transformedPosts;
    },
  });
  const features = [{
    icon: Users,
    title: "Global Community",
    description: "Connect with immigrants worldwide. Share experiences, challenges, and celebrate successes together.",
    action: () => onNavigate('feed'),
    gradient: "from-emerald-500 to-teal-600"
  }, {
    icon: Bot,
    title: "AI Immigration Assistant",
    description: "Get instant, accurate guidance powered by advanced AI for all your immigration questions.",
    action: () => onNavigate('ai-assistant'),
    gradient: "from-teal-500 to-cyan-600"
  }, {
    icon: Globe,
    title: "Immigration Insights",
    description: "Stay ahead with real-time immigration news, policy updates, and expert analysis.",
    action: () => onNavigate('news'),
    gradient: "from-cyan-500 to-blue-600"
  }];
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
  const filteredStories = activeTab === 'featured' 
    ? (posts || []).filter(story => story.featured) 
    : (posts || []).filter(story => story.trending);
  return <div className="space-y-20">
      {/* Hero Section */}
      <div className="text-center space-y-8 py-8 relative">
        <div className="absolute inset-0 bg-gradient-to-r from-emerald-500/5 via-teal-500/5 to-cyan-500/5 rounded-3xl blur-3xl"></div>
        <div className="relative z-10 max-w-4xl mx-auto">
          <div className="inline-flex items-center gap-2 bg-gradient-to-r from-emerald-500/10 to-teal-500/10 border border-emerald-500/20 rounded-full px-4 py-2 mb-6">
            <Sparkles className="w-5 h-5 text-emerald-400" />
            <span className="text-emerald-300 font-medium">AI-Powered Immigration Platform</span>
          </div>
          
          <h1 className="text-6xl md:text-7xl font-bold leading-tight mb-6">
            <span className="block text-white">Your immigration story</span>
            <span className="block bg-gradient-to-r from-emerald-400 via-teal-400 to-cyan-400 bg-clip-text text-transparent">doesn't stop.</span>
          </h1>
          
          <p className="text-xl text-gray-300 max-w-2xl mx-auto leading-relaxed mb-8">
            Share what's real, learn from others, and get AI-powered help to keep moving forward.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button onClick={() => onNavigate('feed')} size="lg" className="bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white px-8 py-4 rounded-xl font-semibold shadow-lg shadow-emerald-500/25 transition-all duration-300 hover:shadow-emerald-500/40">
              Start your journey
              <ArrowRight className="ml-2 w-5 h-5" />
            </Button>
            <Button onClick={() => onNavigate('ai-assistant')} variant="outline" size="lg" className="border-2 border-gray-600 text-gray-300 hover:text-white hover:border-gray-500 px-8 py-4 rounded-xl font-semibold backdrop-blur-sm transition-all duration-300 bg-gray-900/50 hover:bg-gray-800/50">
              Try AI Assistant
            </Button>
          </div>
        </div>
      </div>

      {/* Features Grid */}
      <div className="grid md:grid-cols-3 gap-8">
        {features.map((feature, index) => {
        const Icon = feature.icon;
        return <Card key={index} className="group cursor-pointer transition-all duration-300 hover:scale-105 border border-gray-800/50 bg-gray-900/50 backdrop-blur-xl hover:bg-gray-800/50 rounded-2xl overflow-hidden" onClick={feature.action}>
              <CardContent className="p-8 text-center space-y-6 relative">
                <div className="absolute inset-0 bg-gradient-to-br from-emerald-400/5 to-teal-400/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                <div className={`w-16 h-16 mx-auto rounded-2xl bg-gradient-to-r ${feature.gradient} flex items-center justify-center group-hover:scale-110 transition-all duration-300 shadow-lg relative z-10`}>
                  <Icon className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-white relative z-10">{feature.title}</h3>
                <p className="text-gray-300 leading-relaxed relative z-10">{feature.description}</p>
                <Button variant="ghost" className="w-full mt-6 bg-white/5 hover:bg-white/10 border border-gray-700 hover:border-gray-600 rounded-xl transition-all duration-300 backdrop-blur-sm text-white relative z-10">
                  Explore Now
                  <ArrowRight className="ml-2 w-4 h-4" />
                </Button>
              </CardContent>
            </Card>;
      })}
      </div>

      {/* Featured & Trending Stories Section */}
      <div className="space-y-8">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-4xl font-bold text-white mb-2">Stories</h2>
            <p className="text-gray-400">Inspiring journeys from our community</p>
          </div>
          <Button onClick={() => onNavigate('feed')} className="bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white px-6 py-3 rounded-xl flex items-center gap-2 shadow-lg shadow-emerald-500/25">
            <Plus className="w-5 h-5" />
            Share Your Story
          </Button>
        </div>

        {/* Tab Navigation */}
        <div className="flex gap-4">
          <Button onClick={() => setActiveTab('featured')} variant={activeTab === 'featured' ? "default" : "outline"} className={`flex items-center gap-2 px-6 py-3 rounded-xl transition-all duration-300 ${activeTab === 'featured' ? 'bg-gradient-to-r from-emerald-500 to-teal-600 text-white shadow-lg shadow-emerald-500/25' : 'border-gray-700 text-gray-300 hover:text-white hover:border-gray-600 bg-gray-900/50'}`}>
            <Star className="w-5 h-5" />
            Featured Stories
          </Button>
          <Button onClick={() => setActiveTab('trending')} variant={activeTab === 'trending' ? "default" : "outline"} className={`flex items-center gap-2 px-6 py-3 rounded-xl transition-all duration-300 ${activeTab === 'trending' ? 'bg-gradient-to-r from-emerald-500 to-teal-600 text-white shadow-lg shadow-emerald-500/25' : 'border-gray-700 text-gray-300 hover:text-white hover:border-gray-600 bg-gray-900/50'}`}>
            <TrendingUp className="w-5 h-5" />
            Trending Now
          </Button>
        </div>

        {/* Stories */}
        <div className="space-y-6">
          {filteredStories.map(story => <Card key={story.id} className="bg-gray-900/30 backdrop-blur-xl border-gray-800/50 rounded-2xl p-8 hover:bg-gray-800/30 transition-all duration-300 hover:border-gray-700/50 cursor-pointer group" onClick={() => onNavigate('feed')}>
              <div className="space-y-4">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <h3 className="text-2xl font-bold text-white group-hover:text-emerald-400 transition-colors duration-300">{story.title}</h3>
                    {story.featured && <Badge className="bg-gradient-to-r from-emerald-500/20 to-teal-500/20 text-emerald-300 border-emerald-500/30">
                        <Star className="w-3 h-3 mr-1" />
                        Featured
                      </Badge>}
                    {story.trending && <Badge className="bg-gradient-to-r from-orange-500/20 to-red-500/20 text-orange-300 border-orange-500/30">
                        <TrendingUp className="w-3 h-3 mr-1" />
                        Trending
                      </Badge>}
                  </div>
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

                {/* Story Stats */}
                <div className="flex items-center gap-6 pt-4 border-t border-gray-800/50">
                  <div className="flex items-center gap-2 text-gray-400 hover:text-red-400 transition-colors">
                    <Heart className="w-4 h-4" />
                    <span className="font-medium">{story.likes}</span>
                  </div>
                  <div className="flex items-center gap-2 text-gray-400 hover:text-blue-400 transition-colors">
                    <MessageSquare className="w-4 h-4" />
                    <span className="font-medium">{story.comments}</span>
                  </div>
                  <div className="flex items-center gap-2 text-gray-400">
                    <Eye className="w-4 h-4" />
                    <span className="font-medium">{story.views}</span>
                  </div>
                  <div className="ml-auto">
                    <Button variant="ghost" size="sm" className="text-emerald-400 hover:text-emerald-300 hover:bg-emerald-400/10">
                      Read More
                      <ArrowRight className="w-4 h-4 ml-1" />
                    </Button>
                  </div>
                </div>
              </div>
            </Card>)}
        </div>

        {/* View All Stories Button */}
        <div className="text-center pt-8">
          <Button onClick={() => onNavigate('feed')} variant="outline" size="lg" className="border-2 border-gray-700 hover:border-emerald-500 hover:bg-emerald-500/10 px-8 py-4 rounded-xl font-semibold transition-all duration-300 text-zinc-950">
            View All Stories
            <ArrowRight className="ml-2 w-5 h-5" />
          </Button>
        </div>
      </div>
    </div>;
};
export default Hero;