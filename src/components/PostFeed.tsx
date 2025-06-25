import React, { useState } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { MessageSquarePlus, Heart, MessageSquare, Share, Users, Globe, Filter, Plus, X } from 'lucide-react';

interface Post {
  id: string;
  author: string;
  country: string;
  title: string;
  content: string;
  timestamp: string;
  likes: number;
  comments: number;
  category: string;
  stage: string;
  status: 'Completed' | 'In Progress' | 'Planning';
}

const PostFeed = () => {
  const [countryFilter, setCountryFilter] = useState('All Countries');
  const [typeFilter, setTypeFilter] = useState('All Types');
  const [stageFilter, setStageFilter] = useState('All Stages');
  const [showCreatePost, setShowCreatePost] = useState(false);

  const [posts, setPosts] = useState<Post[]>([
    {
      id: '1',
      author: 'Maria Rodriguez',
      country: 'Spain',
      title: 'Finally got my Green Card!',
      content: 'After 3 years of waiting, I finally received my green card today! The process was challenging but worth it. Happy to share my experience and help others going through the same journey. The key was staying organized with all documents and being patient with the timeline.',
      timestamp: 'Jun 24, 2025',
      likes: 47,
      comments: 12,
      category: 'Green Card',
      stage: 'Professional',
      status: 'Completed'
    },
    {
      id: '2',
      author: 'Ahmed Hassan',
      country: 'Canada',
      title: 'Tips for Canadian Express Entry',
      content: 'Just wanted to share some tips that helped me with my Canadian Express Entry application. Language tests are crucial - invest time in improving your scores. Also, getting your credentials evaluated early saves a lot of time later.',
      timestamp: 'Jun 20, 2025',
      likes: 23,
      comments: 8,
      category: 'Express Entry',
      stage: 'Skilled Migration',
      status: 'In Progress'
    },
    {
      id: '3',
      author: 'Priya Sharma',
      country: 'United Kingdom',
      title: 'Navigating UK Student Visa',
      content: 'Currently going through the UK student visa process. The financial requirements can be overwhelming, but there are ways to manage it. Happy to connect with others in similar situations.',
      timestamp: 'Jun 18, 2025',
      likes: 18,
      comments: 15,
      category: 'Student Visa',
      stage: 'Student Transition',
      status: 'Planning'
    }
  ]);

  const [newPost, setNewPost] = useState({
    title: '',
    content: '',
    country: '',
    category: '',
    stage: ''
  });

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

  const handleSubmitPost = () => {
    if (newPost.title && newPost.content) {
      const post: Post = {
        id: Date.now().toString(),
        author: 'You',
        country: newPost.country || 'Unknown',
        title: newPost.title,
        content: newPost.content,
        timestamp: 'Just now',
        likes: 0,
        comments: 0,
        category: newPost.category || 'General',
        stage: newPost.stage || 'Planning',
        status: 'Planning'
      };
      
      setPosts([post, ...posts]);
      setNewPost({ title: '', content: '', country: '', category: '', stage: '' });
      setShowCreatePost(false);
    }
  };

  return (
    <div className="space-y-12 py-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-4xl font-bold text-white">Community Feed</h2>
        <Button 
          onClick={() => setShowCreatePost(!showCreatePost)}
          className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl flex items-center gap-2"
        >
          {showCreatePost ? (
            <>
              <X className="w-5 h-5" />
              Cancel
            </>
          ) : (
            <>
              <Plus className="w-5 h-5" />
              Share Your Story
            </>
          )}
        </Button>
      </div>

      {/* Create Post Card - Only show when showCreatePost is true */}
      {showCreatePost && (
        <Card className="bg-gray-800/50 backdrop-blur-xl border-gray-700 rounded-2xl p-8">
          <div className="space-y-6">
            <div className="flex items-center space-x-2 mb-4">
              <MessageSquarePlus className="w-6 h-6 text-cyan-400" />
              <h3 className="text-2xl font-bold text-white">Share Your Experience</h3>
            </div>
            
            <Input
              placeholder="Title of your post..."
              value={newPost.title}
              onChange={(e) => setNewPost({ ...newPost, title: e.target.value })}
              className="bg-gray-700/50 border-gray-600 text-white placeholder-gray-400 rounded-xl"
            />
            
            <Textarea
              placeholder="Share your immigration experience, tips, or ask for advice..."
              value={newPost.content}
              onChange={(e) => setNewPost({ ...newPost, content: e.target.value })}
              className="min-h-[100px] bg-gray-700/50 border-gray-600 text-white placeholder-gray-400 rounded-xl"
            />
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Input
                placeholder="Country"
                value={newPost.country}
                onChange={(e) => setNewPost({ ...newPost, country: e.target.value })}
                className="bg-gray-700/50 border-gray-600 text-white placeholder-gray-400 rounded-xl"
              />
              <Input
                placeholder="Category (e.g., Green Card)"
                value={newPost.category}
                onChange={(e) => setNewPost({ ...newPost, category: e.target.value })}
                className="bg-gray-700/50 border-gray-600 text-white placeholder-gray-400 rounded-xl"
              />
              <Input
                placeholder="Stage (e.g., Professional)"
                value={newPost.stage}
                onChange={(e) => setNewPost({ ...newPost, stage: e.target.value })}
                className="bg-gray-700/50 border-gray-600 text-white placeholder-gray-400 rounded-xl"
              />
            </div>
            
            <Button 
              onClick={handleSubmitPost}
              className="bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 text-white px-8 py-3 rounded-xl font-semibold"
            >
              Share Experience
            </Button>
          </div>
        </Card>
      )}

      {/* Filters */}
      <Card className="bg-gray-800/50 backdrop-blur-xl border-gray-700 rounded-2xl p-6">
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-2 text-gray-300">
            <Filter className="w-5 h-5" />
            <span className="font-medium">Filter by:</span>
          </div>
          
          <Select value={countryFilter} onValueChange={setCountryFilter}>
            <SelectTrigger className="w-48 bg-gray-700/50 border-gray-600 text-white">
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="bg-gray-800 border-gray-600">
              <SelectItem value="All Countries">All Countries</SelectItem>
              <SelectItem value="Australia">Australia</SelectItem>
              <SelectItem value="Canada">Canada</SelectItem>
              <SelectItem value="United Kingdom">United Kingdom</SelectItem>
              <SelectItem value="United States">United States</SelectItem>
              <SelectItem value="Spain">Spain</SelectItem>
            </SelectContent>
          </Select>

          <Select value={typeFilter} onValueChange={setTypeFilter}>
            <SelectTrigger className="w-48 bg-gray-700/50 border-gray-600 text-white">
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="bg-gray-800 border-gray-600">
              <SelectItem value="All Types">All Types</SelectItem>
              <SelectItem value="Green Card">Green Card</SelectItem>
              <SelectItem value="Express Entry">Express Entry</SelectItem>
              <SelectItem value="Student Visa">Student Visa</SelectItem>
              <SelectItem value="Work Visa">Work Visa</SelectItem>
            </SelectContent>
          </Select>

          <Select value={stageFilter} onValueChange={setStageFilter}>
            <SelectTrigger className="w-48 bg-gray-700/50 border-gray-600 text-white">
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="bg-gray-800 border-gray-600">
              <SelectItem value="All Stages">All Stages</SelectItem>
              <SelectItem value="Professional">Professional</SelectItem>
              <SelectItem value="Skilled Migration">Skilled Migration</SelectItem>
              <SelectItem value="Student Transition">Student Transition</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </Card>

      {/* Posts Feed */}
      <div className="space-y-6">
        {posts.map((post) => (
          <Card key={post.id} className="bg-gray-800/30 backdrop-blur-xl border-gray-700/50 rounded-2xl p-8 hover:bg-gray-800/50 transition-all duration-300">
            <div className="space-y-4">
              <div className="flex items-start justify-between">
                <h3 className="text-2xl font-bold text-white">{post.title}</h3>
                <div className="flex gap-2">
                  <Badge className="bg-gray-700 text-gray-300 border-gray-600">
                    {post.category}
                  </Badge>
                  <Badge className={getStatusColor(post.status)}>
                    {post.status}
                  </Badge>
                </div>
              </div>
              
              <div className="flex items-center gap-6 text-gray-400">
                <div className="flex items-center gap-2">
                  <Users className="w-4 h-4" />
                  <span>{post.author}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Globe className="w-4 h-4" />
                  <span>{post.country}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span>{post.timestamp}</span>
                </div>
              </div>
              
              <p className="text-gray-300 leading-relaxed">
                {post.content}
              </p>
              
              <div className="flex items-center space-x-6 pt-2">
                <Button variant="ghost" size="sm" className="text-gray-400 hover:text-red-400 hover:bg-red-400/10">
                  <Heart className="w-4 h-4 mr-2" />
                  {post.likes}
                </Button>
                <Button variant="ghost" size="sm" className="text-gray-400 hover:text-blue-400 hover:bg-blue-400/10">
                  <MessageSquare className="w-4 h-4 mr-2" />
                  {post.comments}
                </Button>
                <Button variant="ghost" size="sm" className="text-gray-400 hover:text-green-400 hover:bg-green-400/10">
                  <Share className="w-4 h-4 mr-2" />
                  Share
                </Button>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default PostFeed;
