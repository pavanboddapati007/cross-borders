
import React, { useState, useEffect } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { MessageSquarePlus, Heart, MessageSquare, Share, Users, Globe, Plus, X, Sparkles, ChevronDown, ChevronUp } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useGroqClassification } from '@/hooks/useGroqClassification';
import { toast } from '@/hooks/use-toast';

interface Post {
  id: string;
  user_id: string;
  title: string;
  content: string;
  country: string | null;
  category: string | null;
  stage: string | null;
  status: string | null;
  likes: number;
  comments: number;
  classification: string | null;
  classification_confidence: number | null;
  tags: string[] | null;
  visa_type: string | null;
  target_country: string | null;
  created_at: string;
  post_replies?: Array<{
    id: string;
    content: string;
    created_at: string;
  }>;
}

const PostFeed = () => {
  const { user } = useAuth();
  const { classifyPost, isClassifying } = useGroqClassification();
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreatePost, setShowCreatePost] = useState(false);
  const [expandedComments, setExpandedComments] = useState<Set<string>>(new Set());

  const [newPost, setNewPost] = useState({
    title: '',
    content: '',
    country: '',
    category: '',
    stage: ''
  });

  // Fetch posts from Supabase
  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    try {
      const { data, error } = await supabase
        .from('posts')
        .select(`
          *,
          post_replies (
            id,
            content,
            created_at
          )
        `)
        .order('created_at', { ascending: false });

      if (error) throw error;
      
      // Ensure the data matches our Post interface by providing defaults for new fields
      const postsWithDefaults = (data || []).map((post: any) => ({
        ...post,
        tags: post.tags || null,
        visa_type: post.visa_type || null,
        target_country: post.target_country || null,
        likes: post.likes || 0,
        comments: post.comments || 0
      }));
      
      setPosts(postsWithDefaults);
    } catch (error) {
      console.error('Error fetching posts:', error);
      toast({
        title: "Error",
        description: "Failed to load posts",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const toggleComments = (postId: string) => {
    setExpandedComments(prev => {
      const newSet = new Set(prev);
      if (newSet.has(postId)) {
        newSet.delete(postId);
      } else {
        newSet.add(postId);
      }
      return newSet;
    });
  };

  const getStatusColor = (status: string | null) => {
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

  const getClassificationColor = (classification: string | null) => {
    switch (classification) {
      case 'immigration_process':
        return 'bg-blue-100 text-blue-800';
      case 'visa_work':
        return 'bg-purple-100 text-purple-800';
      case 'visa_student':
        return 'bg-indigo-100 text-indigo-800';
      case 'green_card':
        return 'bg-green-100 text-green-800';
      case 'scam_warning':
        return 'bg-red-100 text-red-800';
      case 'success_story':
        return 'bg-emerald-100 text-emerald-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const handleSubmitPost = async () => {
    if (!newPost.title || !newPost.content || !user) {
      toast({
        title: "Error",
        description: "Please fill in required fields and ensure you're logged in",
        variant: "destructive"
      });
      return;
    }

    try {
      const { data, error } = await supabase
        .from('posts')
        .insert({
          user_id: user.id,
          title: newPost.title,
          content: newPost.content,
          country: newPost.country || null,
          category: newPost.category || null,
          stage: newPost.stage || null,
          status: 'Planning'
        })
        .select()
        .single();

      if (error) throw error;

      // Classify the post using Groq
      try {
        await classifyPost(
          data.id,
          newPost.title,
          newPost.content,
          newPost.country,
          newPost.category
        );
        toast({
          title: "Success",
          description: "Post created and classified successfully!",
        });
      } catch (classificationError) {
        console.error('Classification failed:', classificationError);
        toast({
          title: "Post Created",
          description: "Post created but classification failed",
        });
      }

      // Reset form and refresh posts
      setNewPost({ title: '', content: '', country: '', category: '', stage: '' });
      setShowCreatePost(false);
      fetchPosts();
      
    } catch (error) {
      console.error('Error creating post:', error);
      toast({
        title: "Error",
        description: "Failed to create post",
        variant: "destructive"
      });
    }
  };

  const handleClassifyPost = async (post: Post) => {
    try {
      await classifyPost(post.id, post.title, post.content, post.country || '', post.category || '');
      toast({
        title: "Success",
        description: "Post classified successfully!",
      });
      fetchPosts(); // Refresh to show classification
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to classify post",
        variant: "destructive"
      });
    }
  };

  if (loading) {
    return <div className="text-white text-center py-8">Loading posts...</div>;
  }

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

      {/* Create Post Card */}
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
              disabled={isClassifying}
              className="bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 text-white px-8 py-3 rounded-xl font-semibold"
            >
              {isClassifying ? 'Creating & Classifying...' : 'Share Experience'}
            </Button>
          </div>
        </Card>
      )}

      {/* Posts Feed */}
      <div className="space-y-6">
        {posts.map((post) => (
          <Card key={post.id} className="bg-gray-800/30 backdrop-blur-xl border-gray-700/50 rounded-2xl p-8 hover:bg-gray-800/50 transition-all duration-300">
            <div className="space-y-4">
              <div className="flex items-start justify-between">
                <h3 className="text-2xl font-bold text-white">{post.title}</h3>
                <div className="flex gap-2 flex-wrap">
                  {post.category && (
                    <Badge className="bg-gray-700 text-gray-300 border-gray-600">
                      {post.category}
                    </Badge>
                  )}
                  {post.status && (
                    <Badge className={getStatusColor(post.status)}>
                      {post.status}
                    </Badge>
                  )}
                  {post.classification && (
                    <Badge className={getClassificationColor(post.classification)}>
                      <Sparkles className="w-3 h-3 mr-1" />
                      {post.classification.replace('_', ' ')}
                    </Badge>
                  )}
                </div>
              </div>
              
              <div className="flex items-center gap-6 text-gray-400">
                <div className="flex items-center gap-2">
                  <Users className="w-4 h-4" />
                  <span>User</span>
                </div>
                {post.country && (
                  <div className="flex items-center gap-2">
                    <Globe className="w-4 h-4" />
                    <span>{post.country}</span>
                  </div>
                )}
                <div className="flex items-center gap-2">
                  <span>{new Date(post.created_at).toLocaleDateString()}</span>
                </div>
              </div>
              
              <p className="text-gray-300 leading-relaxed">
                {post.content}
              </p>
              
              {/* Tags */}
              {post.tags && post.tags.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {post.tags.map((tag, index) => (
                    <Badge key={index} className="bg-blue-100 text-blue-800 text-xs">
                      {tag}
                    </Badge>
                  ))}
                </div>
              )}
              
              <div className="flex items-center justify-between pt-2">
                <div className="flex items-center space-x-6">
                  <Button variant="ghost" size="sm" className="text-gray-400 hover:text-red-400 hover:bg-red-400/10">
                    <Heart className="w-4 h-4 mr-2" />
                    {post.likes || 0}
                  </Button>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className="text-gray-400 hover:text-blue-400 hover:bg-blue-400/10"
                    onClick={() => toggleComments(post.id)}
                  >
                    <MessageSquare className="w-4 h-4 mr-2" />
                    {post.post_replies?.length || 0}
                    {expandedComments.has(post.id) ? (
                      <ChevronUp className="w-4 h-4 ml-1" />
                    ) : (
                      <ChevronDown className="w-4 h-4 ml-1" />
                    )}
                  </Button>
                  <Button variant="ghost" size="sm" className="text-gray-400 hover:text-green-400 hover:bg-green-400/10">
                    <Share className="w-4 h-4 mr-2" />
                    Share
                  </Button>
                </div>
                
                {!post.classification && user && (
                  <Button 
                    onClick={() => handleClassifyPost(post)}
                    disabled={isClassifying}
                    size="sm"
                    className="bg-purple-600 hover:bg-purple-700 text-white"
                  >
                    <Sparkles className="w-4 h-4 mr-2" />
                    {isClassifying ? 'Classifying...' : 'Classify'}
                  </Button>
                )}
              </div>

              {/* Comments Section */}
              {expandedComments.has(post.id) && post.post_replies && post.post_replies.length > 0 && (
                <div className="mt-4 pl-4 border-l-2 border-gray-700 space-y-3">
                  {post.post_replies.map((reply) => (
                    <div key={reply.id} className="bg-gray-700/30 rounded-lg p-3">
                      <div className="text-gray-300 text-sm">
                        {reply.content}
                      </div>
                      <div className="text-gray-500 text-xs mt-1">
                        {new Date(reply.created_at).toLocaleDateString()}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </Card>
        ))}
      </div>

      {posts.length === 0 && (
        <div className="text-center text-gray-400 py-12">
          <MessageSquarePlus className="w-16 h-16 mx-auto mb-4 text-gray-600" />
          <h3 className="text-xl font-semibold mb-2">No posts yet</h3>
          <p>Be the first to share your immigration story!</p>
        </div>
      )}
    </div>
  );
};

export default PostFeed;
