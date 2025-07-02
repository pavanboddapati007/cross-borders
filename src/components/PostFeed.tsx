import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Heart, MessageCircle, Trash2, Share } from 'lucide-react';
import { toast } from 'sonner';

const PostFeed = () => {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const [replyingTo, setReplyingTo] = useState<string | null>(null);
  const [replyContent, setReplyContent] = useState('');

  // Fetch posts with user profiles
  const { data: posts, isLoading: postsLoading } = useQuery({
    queryKey: ['posts'],
    queryFn: async () => {
      console.log('Fetching posts...');
      
      // Fetch posts
      const { data: postsData, error: postsError } = await supabase
        .from('posts')
        .select('*')
        .order('created_at', { ascending: false });

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

      // Merge posts with profiles
      const postsWithProfiles = postsData?.map(post => ({
        ...post,
        profiles: profilesData?.find(profile => profile.id === post.user_id) || null
      }));

      console.log('Posts fetched:', postsWithProfiles);
      return postsWithProfiles;
    },
  });

  // Fetch replies with user profiles
  const { data: replies } = useQuery({
    queryKey: ['post_replies'],
    queryFn: async () => {
      console.log('Fetching replies...');
      
      // Fetch replies
      const { data: repliesData, error: repliesError } = await supabase
        .from('post_replies')
        .select('*')
        .order('created_at', { ascending: true });

      if (repliesError) {
        console.error('Error fetching replies:', repliesError);
        throw repliesError;
      }

      // Fetch profiles for the replies
      const userIds = repliesData?.map(reply => reply.user_id).filter(Boolean) || [];
      const { data: profilesData, error: profilesError } = await supabase
        .from('profiles')
        .select('id, username, full_name, avatar_url')
        .in('id', userIds);

      if (profilesError) {
        console.error('Error fetching profiles:', profilesError);
        throw profilesError;
      }

      // Merge replies with profiles
      const repliesWithProfiles = repliesData?.map(reply => ({
        ...reply,
        profiles: profilesData?.find(profile => profile.id === reply.user_id) || null
      }));

      console.log('Replies fetched:', repliesWithProfiles);
      return repliesWithProfiles;
    },
  });

  // Like post mutation
  const likeMutation = useMutation({
    mutationFn: async (postId: string) => {
      const post = posts?.find(p => p.id === postId);
      const newLikes = (post?.likes || 0) + 1;
      
      const { error } = await supabase
        .from('posts')
        .update({ likes: newLikes })
        .eq('id', postId);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['posts'] });
    },
  });

  // Add reply mutation
  const addReplyMutation = useMutation({
    mutationFn: async ({ postId, content }: { postId: string; content: string }) => {
      if (!user) throw new Error('Must be logged in to reply');

      const { error } = await supabase
        .from('post_replies')
        .insert({
          post_id: postId,
          content,
          user_id: user.id,
        });

      if (error) throw error;

      // Update comment count
      const post = posts?.find(p => p.id === postId);
      const newCommentCount = (post?.comments || 0) + 1;
      
      await supabase
        .from('posts')
        .update({ comments: newCommentCount })
        .eq('id', postId);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['posts'] });
      queryClient.invalidateQueries({ queryKey: ['post_replies'] });
      setReplyingTo(null);
      setReplyContent('');
      toast.success('Reply added successfully!');
    },
    onError: (error) => {
      console.error('Error adding reply:', error);
      toast.error('Failed to add reply');
    },
  });

  // Delete reply mutation
  const deleteReplyMutation = useMutation({
    mutationFn: async (replyId: string) => {
      const { error } = await supabase
        .from('post_replies')
        .delete()
        .eq('id', replyId);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['post_replies'] });
      queryClient.invalidateQueries({ queryKey: ['posts'] });
      toast.success('Reply deleted successfully!');
    },
    onError: (error) => {
      console.error('Error deleting reply:', error);
      toast.error('Failed to delete reply');
    },
  });

  const handleLike = (postId: string) => {
    likeMutation.mutate(postId);
  };

  const handleReply = (postId: string) => {
    if (!replyContent.trim()) return;
    addReplyMutation.mutate({ postId, content: replyContent });
  };

  const handleDeleteReply = (replyId: string) => {
    if (window.confirm('Are you sure you want to delete this reply?')) {
      deleteReplyMutation.mutate(replyId);
    }
  };

  const getPostReplies = (postId: string) => {
    return replies?.filter(reply => reply.post_id === postId) || [];
  };

  if (postsLoading) {
    return <div className="flex justify-center p-4">Loading posts...</div>;
  }

  return (
    <div className="bg-slate-900 min-h-screen p-6">
      {/* Share Post Button */}
      <div className="mb-6 flex justify-center">
        <Button 
          className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-full font-medium"
          onClick={() => {
            // You can implement post creation logic here
            toast.success('Post sharing feature coming soon!');
          }}
        >
          <Share className="h-4 w-4 mr-2" />
          Share Your Story
        </Button>
      </div>

      <div className="space-y-6 max-w-4xl mx-auto">
        {posts?.map((post) => (
        <Card key={post.id} className="w-full bg-slate-800 border-slate-700 text-white">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <Avatar className="h-8 w-8">
                  <AvatarFallback className="bg-slate-700 text-white text-sm">
                    {post.profiles?.username?.[0]?.toUpperCase() || 'U'}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <p className="font-medium text-sm text-white">
                    {post.profiles?.username || 'Anonymous'}
                  </p>
                </div>
              </div>
              {post.status && (
                <span className="bg-green-600 text-white px-3 py-1 rounded-full text-xs font-medium">
                  {post.status}
                </span>
              )}
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h3 className="font-semibold text-lg mb-2 text-white">{post.title}</h3>
              <p className="text-gray-300 whitespace-pre-wrap leading-relaxed">{post.content}</p>
            </div>

            {/* Post tags */}
            {(post.category || post.visa_type || post.stage || post.country || post.target_country) && (
              <div className="flex flex-wrap gap-2">
                {post.category && (
                  <span className="bg-blue-600 text-white px-3 py-1 rounded-full text-xs font-medium">
                    {post.category}
                  </span>
                )}
                {post.visa_type && (
                  <span className="bg-purple-600 text-white px-3 py-1 rounded-full text-xs font-medium">
                    {post.visa_type}
                  </span>
                )}
                {post.stage && (
                  <span className="bg-orange-600 text-white px-3 py-1 rounded-full text-xs font-medium">
                    {post.stage}
                  </span>
                )}
                {post.country && (
                  <span className="bg-slate-600 text-white px-3 py-1 rounded-full text-xs font-medium">
                    From: {post.country}
                  </span>
                )}
                {post.target_country && (
                  <span className="bg-green-600 text-white px-3 py-1 rounded-full text-xs font-medium">
                    To: {post.target_country}
                  </span>
                )}
              </div>
            )}

            {/* Action buttons */}
            <div className="flex items-center space-x-4 pt-2 border-t border-slate-700">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => handleLike(post.id)}
                className="flex items-center space-x-2 text-gray-300 hover:text-white hover:bg-slate-700"
              >
                <Heart className="h-4 w-4" />
                <span>{post.likes || 0}</span>
              </Button>
              
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setReplyingTo(replyingTo === post.id ? null : post.id)}
                className="flex items-center space-x-2 text-gray-300 hover:text-white hover:bg-slate-700"
              >
                <MessageCircle className="h-4 w-4" />
                <span>{post.comments || 0}</span>
              </Button>
            </div>

            {/* Reply form */}
            {replyingTo === post.id && user && (
              <div className="space-y-2 pt-2 border-t border-slate-700">
                <Textarea
                  placeholder="Write a reply..."
                  value={replyContent}
                  onChange={(e) => setReplyContent(e.target.value)}
                  className="min-h-[100px] bg-slate-700 border-slate-600 text-white placeholder:text-gray-400"
                />
                <div className="flex space-x-2">
                  <Button
                    onClick={() => handleReply(post.id)}
                    disabled={!replyContent.trim() || addReplyMutation.isPending}
                    size="sm"
                  >
                    {addReplyMutation.isPending ? 'Posting...' : 'Post Reply'}
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => {
                      setReplyingTo(null);
                      setReplyContent('');
                    }}
                    size="sm"
                  >
                    Cancel
                  </Button>
                </div>
              </div>
            )}

            {/* Display replies */}
            {getPostReplies(post.id).length > 0 && (
              <div className="space-y-3 pt-3 border-t border-slate-700">
                <h4 className="font-medium text-sm text-white">Replies:</h4>
                {getPostReplies(post.id).map((reply) => (
                  <div className="bg-slate-700/50 p-3 rounded-lg">
                    <div className="flex items-start justify-between">
                      <div className="flex items-center space-x-2 mb-2">
                        <Avatar className="h-6 w-6">
                          <AvatarFallback className="text-xs bg-slate-600 text-white">
                            {reply.profiles?.username?.[0]?.toUpperCase() || 'U'}
                          </AvatarFallback>
                        </Avatar>
                        <span className="font-medium text-sm text-white">
                          {reply.profiles?.username || 'Anonymous'}
                        </span>
                      </div>
                      {user && reply.user_id === user.id && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDeleteReply(reply.id)}
                          className="h-6 w-6 p-0 text-red-400 hover:text-red-300 hover:bg-slate-600"
                        >
                          <Trash2 className="h-3 w-3" />
                        </Button>
                      )}
                    </div>
                    <p className="text-sm text-gray-300 whitespace-pre-wrap leading-relaxed">
                      {reply.content}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
          ))}
      </div>
    </div>
  );
};

export default PostFeed;
