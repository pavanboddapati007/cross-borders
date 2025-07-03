import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Heart, MessageCircle, Trash2, Share, Edit } from 'lucide-react';
import { toast } from 'sonner';
import PostStoryDialog from './PostStoryDialog';

const PostFeed = () => {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const [replyingTo, setReplyingTo] = useState<string | null>(null);
  const [replyContent, setReplyContent] = useState('');
  const [postDialogOpen, setPostDialogOpen] = useState(false);

  // Fetch posts with user profiles and like status
  const { data: posts, isLoading: postsLoading } = useQuery({
    queryKey: ['posts', user?.id],
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

      // Fetch user's likes if authenticated
      let userLikes: any[] = [];
      if (user) {
        const { data: likesData, error: likesError } = await supabase
          .from('post_likes')
          .select('post_id')
          .eq('user_id', user.id);

        if (likesError) {
          console.error('Error fetching user likes:', likesError);
        } else {
          userLikes = likesData || [];
        }
      }

      // Merge posts with profiles and like status
      const postsWithProfiles = postsData?.map(post => ({
        ...post,
        profiles: profilesData?.find(profile => profile.id === post.user_id) || null,
        hasUserLiked: userLikes.some(like => like.post_id === post.id)
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

  // Like/Unlike post mutation
  const likeMutation = useMutation({
    mutationFn: async (postId: string) => {
      if (!user) throw new Error('Must be logged in to like posts');

      const post = posts?.find(p => p.id === postId);
      if (!post) throw new Error('Post not found');

      if (post.hasUserLiked) {
        // Unlike the post
        await supabase
          .from('post_likes')
          .delete()
          .eq('user_id', user.id)
          .eq('post_id', postId);

        // Decrease like count
        const newLikes = Math.max(0, (post.likes || 0) - 1);
        await supabase
          .from('posts')
          .update({ likes: newLikes })
          .eq('id', postId);
      } else {
        // Like the post
        await supabase
          .from('post_likes')
          .insert({
            user_id: user.id,
            post_id: postId
          });

        // Increase like count
        const newLikes = (post.likes || 0) + 1;
        await supabase
          .from('posts')
          .update({ likes: newLikes })
          .eq('id', postId);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['posts'] });
    },
    onError: (error) => {
      console.error('Error liking post:', error);
      toast.error('Failed to like post');
    }
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
    <div className="bg-black min-h-screen">
      {/* Post Story Button */}
      <div className="pt-4 pb-6 flex justify-center border-b border-gray-800">
        <Button 
          className="bg-orange-600 hover:bg-orange-700 text-white px-6 py-2 rounded-full font-medium"
          onClick={() => setPostDialogOpen(true)}
        >
          <Edit className="h-4 w-4 mr-2" />
          Post Your Story
        </Button>
      </div>

      <div className="max-w-2xl mx-auto">
        {posts?.map((post) => (
          <div key={post.id} className="border-b border-gray-800 bg-black hover:bg-gray-950 transition-colors">
            <div className="flex p-3 space-x-3">
              {/* User Avatar */}
              <div className="flex-shrink-0">
                <Avatar className="h-8 w-8">
                  <AvatarFallback className="bg-orange-600 text-white text-xs">
                    {post.profiles?.username?.[0]?.toUpperCase() || 'U'}
                  </AvatarFallback>
                </Avatar>
              </div>

              {/* Post Content */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center space-x-2">
                  <span className="font-medium text-white text-sm">
                    {post.profiles?.username || 'Anonymous'}
                  </span>
                  <span className="text-gray-500 text-xs">•</span>
                  <span className="text-gray-500 text-xs">1d ago</span>
                </div>

                <div className="mt-1">
                  {post.title && (
                    <h3 className="text-white font-medium mb-1">{post.title}</h3>
                  )}
                  <p className="text-gray-300 text-sm leading-relaxed whitespace-pre-wrap">
                    {post.content}
                  </p>
                </div>

                {/* Post tags */}
                {(post.category || post.visa_type || post.stage || post.country || post.target_country) && (
                  <div className="flex flex-wrap gap-1 mt-2">
                    {post.category && (
                      <span className="bg-blue-600 text-white px-2 py-0.5 rounded text-xs">
                        {post.category}
                      </span>
                    )}
                    {post.visa_type && (
                      <span className="bg-purple-600 text-white px-2 py-0.5 rounded text-xs">
                        {post.visa_type}
                      </span>
                    )}
                    {post.stage && (
                      <span className="bg-orange-600 text-white px-2 py-0.5 rounded text-xs">
                        {post.stage}
                      </span>
                    )}
                    {post.country && (
                      <span className="bg-gray-600 text-white px-2 py-0.5 rounded text-xs">
                        From: {post.country}
                      </span>
                    )}
                    {post.target_country && (
                      <span className="bg-green-600 text-white px-2 py-0.5 rounded text-xs">
                        To: {post.target_country}
                      </span>
                    )}
                  </div>
                )}

                {/* Action buttons */}
                <div className="flex items-center space-x-4 mt-3">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleLike(post.id)}
                    className={`flex items-center space-x-1 h-8 px-2 rounded-full text-xs ${
                      post.hasUserLiked 
                        ? 'text-orange-500 hover:text-orange-400 hover:bg-orange-950' 
                        : 'text-gray-400 hover:text-orange-500 hover:bg-orange-950'
                    }`}
                  >
                    <Heart className={`h-4 w-4 ${post.hasUserLiked ? 'fill-current' : ''}`} />
                    <span>{post.likes || 0}</span>
                  </Button>
                  
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setReplyingTo(replyingTo === post.id ? null : post.id)}
                    className="flex items-center space-x-1 h-8 px-2 rounded-full text-xs text-gray-400 hover:text-blue-500 hover:bg-blue-950"
                  >
                    <MessageCircle className="h-4 w-4" />
                    <span>{post.comments || 0}</span>
                  </Button>

                  <Button
                    variant="ghost"
                    size="sm"
                    className="flex items-center space-x-1 h-8 px-2 rounded-full text-xs text-gray-400 hover:text-green-500 hover:bg-green-950"
                  >
                    <Share className="h-4 w-4" />
                    <span>Share</span>
                  </Button>
                </div>

                {/* Reply form */}
                {replyingTo === post.id && user && (
                  <div className="mt-3 space-y-2">
                    <Textarea
                      placeholder="Write a reply..."
                      value={replyContent}
                      onChange={(e) => setReplyContent(e.target.value)}
                      className="min-h-[80px] bg-gray-900 border-gray-700 text-white placeholder:text-gray-400 text-sm"
                    />
                    <div className="flex space-x-2">
                      <Button
                        onClick={() => handleReply(post.id)}
                        disabled={!replyContent.trim() || addReplyMutation.isPending}
                        size="sm"
                        className="bg-orange-600 hover:bg-orange-700 text-white text-xs"
                      >
                        {addReplyMutation.isPending ? 'Posting...' : 'Reply'}
                      </Button>
                      <Button
                        variant="outline"
                        onClick={() => {
                          setReplyingTo(null);
                          setReplyContent('');
                        }}
                        size="sm"
                        className="text-xs border-gray-700 text-gray-300 hover:bg-gray-800"
                      >
                        Cancel
                      </Button>
                    </div>
                  </div>
                )}

                {/* Display replies */}
                {getPostReplies(post.id).length > 0 && (
                  <div className="mt-3 space-y-2">
                    {getPostReplies(post.id).map((reply) => (
                      <div key={reply.id} className="bg-gray-900/50 p-3 rounded-lg border-l-2 border-gray-700">
                        <div className="flex items-start justify-between">
                          <div className="flex items-center space-x-2">
                            <Avatar className="h-5 w-5">
                              <AvatarFallback className="text-xs bg-gray-600 text-white">
                                {reply.profiles?.username?.[0]?.toUpperCase() || 'U'}
                              </AvatarFallback>
                            </Avatar>
                            <span className="font-medium text-xs text-white">
                              {reply.profiles?.username || 'Anonymous'}
                            </span>
                          </div>
                          {user && reply.user_id === user.id && (
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleDeleteReply(reply.id)}
                              className="h-5 w-5 p-0 text-red-400 hover:text-red-300 hover:bg-red-950"
                            >
                              <Trash2 className="h-3 w-3" />
                            </Button>
                          )}
                        </div>
                        <p className="text-xs text-gray-300 mt-1 leading-relaxed whitespace-pre-wrap">
                          {reply.content}
                        </p>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      <PostStoryDialog 
        open={postDialogOpen} 
        onOpenChange={setPostDialogOpen} 
      />
    </div>
  );
};

export default PostFeed;
