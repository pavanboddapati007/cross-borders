
import React, { useState } from 'react';
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { MessageSquarePlus, Heart, MessageSquare, Share } from 'lucide-react';

interface Post {
  id: string;
  author: string;
  avatar: string;
  country: string;
  title: string;
  content: string;
  timestamp: string;
  likes: number;
  comments: number;
  tags: string[];
}

const PostFeed = () => {
  const [posts, setPosts] = useState<Post[]>([
    {
      id: '1',
      author: 'Maria Rodriguez',
      avatar: '',
      country: 'Spain → USA',
      title: 'Finally got my Green Card!',
      content: 'After 3 years of waiting, I finally received my green card today! The process was challenging but worth it. Happy to share my experience and help others going through the same journey. The key was staying organized with all documents and being patient with the timeline.',
      timestamp: '2 hours ago',
      likes: 47,
      comments: 12,
      tags: ['Green Card', 'USA', 'Success Story']
    },
    {
      id: '2',
      author: 'Ahmed Hassan',
      avatar: '',
      country: 'Egypt → Canada',
      title: 'Tips for Canadian Express Entry',
      content: 'Just wanted to share some tips that helped me with my Canadian Express Entry application. Language tests are crucial - invest time in improving your scores. Also, getting your credentials evaluated early saves a lot of time later.',
      timestamp: '5 hours ago',
      likes: 23,
      comments: 8,
      tags: ['Canada', 'Express Entry', 'Tips']
    },
    {
      id: '3',
      author: 'Priya Sharma',
      avatar: '',
      country: 'India → UK',
      title: 'Navigating UK Student Visa',
      content: 'Currently going through the UK student visa process. The financial requirements can be overwhelming, but there are ways to manage it. Happy to connect with others in similar situations.',
      timestamp: '1 day ago',
      likes: 18,
      comments: 15,
      tags: ['UK', 'Student Visa', 'Education']
    }
  ]);

  const [newPost, setNewPost] = useState({
    title: '',
    content: '',
    country: '',
    tags: ''
  });

  const handleSubmitPost = () => {
    if (newPost.title && newPost.content) {
      const post: Post = {
        id: Date.now().toString(),
        author: 'You',
        avatar: '',
        country: newPost.country || 'Unknown',
        title: newPost.title,
        content: newPost.content,
        timestamp: 'Just now',
        likes: 0,
        comments: 0,
        tags: newPost.tags ? newPost.tags.split(',').map(tag => tag.trim()) : []
      };
      
      setPosts([post, ...posts]);
      setNewPost({ title: '', content: '', country: '', tags: '' });
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="text-center space-y-4 mb-8">
        <h2 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-green-600 bg-clip-text text-transparent">
          Share Your Immigration Journey
        </h2>
        <p className="text-gray-600">Connect with fellow immigrants and share your experiences</p>
      </div>

      {/* Create Post Card */}
      <Card className="bg-white/90 backdrop-blur-sm border-0 shadow-lg">
        <CardHeader>
          <div className="flex items-center space-x-2">
            <MessageSquarePlus className="w-5 h-5 text-blue-600" />
            <h3 className="font-semibold text-gray-800">Share Your Experience</h3>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <Input
            placeholder="Title of your post..."
            value={newPost.title}
            onChange={(e) => setNewPost({ ...newPost, title: e.target.value })}
            className="border-gray-200 focus:border-blue-500"
          />
          <Textarea
            placeholder="Share your immigration experience, tips, or ask for advice..."
            value={newPost.content}
            onChange={(e) => setNewPost({ ...newPost, content: e.target.value })}
            className="min-h-[100px] border-gray-200 focus:border-blue-500"
          />
          <div className="flex space-x-4">
            <Input
              placeholder="Country (e.g., India → USA)"
              value={newPost.country}
              onChange={(e) => setNewPost({ ...newPost, country: e.target.value })}
              className="border-gray-200 focus:border-blue-500"
            />
            <Input
              placeholder="Tags (comma separated)"
              value={newPost.tags}
              onChange={(e) => setNewPost({ ...newPost, tags: e.target.value })}
              className="border-gray-200 focus:border-blue-500"
            />
          </div>
          <Button 
            onClick={handleSubmitPost}
            className="bg-gradient-to-r from-blue-600 to-green-600 hover:from-blue-700 hover:to-green-700 text-white"
          >
            Share Experience
          </Button>
        </CardContent>
      </Card>

      {/* Posts Feed */}
      <div className="space-y-6">
        {posts.map((post) => (
          <Card key={post.id} className="bg-white/90 backdrop-blur-sm border-0 shadow-lg hover:shadow-xl transition-shadow duration-300">
            <CardContent className="p-6">
              <div className="flex items-start space-x-4">
                <Avatar className="w-12 h-12">
                  <AvatarImage src={post.avatar} />
                  <AvatarFallback className="bg-gradient-to-r from-blue-600 to-green-600 text-white">
                    {post.author.split(' ').map(n => n[0]).join('')}
                  </AvatarFallback>
                </Avatar>
                
                <div className="flex-1 space-y-3">
                  <div className="flex items-center space-x-2">
                    <h4 className="font-semibold text-gray-800">{post.author}</h4>
                    <Badge variant="outline" className="text-blue-600 border-blue-600">
                      {post.country}
                    </Badge>
                    <span className="text-sm text-gray-500">{post.timestamp}</span>
                  </div>
                  
                  <h3 className="text-lg font-medium text-gray-800">{post.title}</h3>
                  <p className="text-gray-600 leading-relaxed">{post.content}</p>
                  
                  <div className="flex flex-wrap gap-2">
                    {post.tags.map((tag, index) => (
                      <Badge key={index} variant="secondary" className="bg-blue-50 text-blue-700">
                        #{tag}
                      </Badge>
                    ))}
                  </div>
                  
                  <div className="flex items-center space-x-6 pt-2">
                    <Button variant="ghost" size="sm" className="text-gray-500 hover:text-red-500">
                      <Heart className="w-4 h-4 mr-1" />
                      {post.likes}
                    </Button>
                    <Button variant="ghost" size="sm" className="text-gray-500 hover:text-blue-500">
                      <MessageSquare className="w-4 h-4 mr-1" />
                      {post.comments}
                    </Button>
                    <Button variant="ghost" size="sm" className="text-gray-500 hover:text-green-500">
                      <Share className="w-4 h-4 mr-1" />
                      Share
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default PostFeed;
