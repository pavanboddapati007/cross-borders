
import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Heart, MessageCircle, Trash2 } from 'lucide-react';
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
      const { data, error } = await supabase
        .from('posts')
        .select(`
          *,
          profiles:user_id (
            username,
            full_name,
            avatar_url
          )
        `)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching posts:', error);
        throw error;
      }

      console.log('Posts fetched:', data);
      return data;
    },
  });

  // Fetch replies with user profiles
  const { data: replies } = useQuery({
    queryKey: ['post_replies'],
    queryFn: async () => {
      console.log('Fetching replies...');
      const { data, error } = await supabase
        .from('post_replies')
        .select(`
          *,
          profiles:user_id (
            username,
            full_name,
            avatar_url
          )
        `)
        .order('created_at', { ascending: true });

      if (error) {
        console.error('Error fetching replies:', error);
        throw error;
      }

      console.log('Replies fetched:', data);
      return data;
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
    <div className="space-y-6">
      {posts?.map((post) => (
        <Card key={post.id} className="w-full">
          <CardHeader className="pb-3">
            <div className="flex items-center space-x-3">
              <Avatar className="h-10 w-10">
                <AvatarImage src={post.profiles?.avatar_url || ''} />
                <AvatarFallback>
                  {post.profiles?.username?.[0]?.toUpperCase() || 
                   post.profiles?.full_name?.[0]?.toUpperCase() || 'U'}
                </AvatarFallback>
              </Avatar>
              <div>
                <p className="font-semibold">
                  {post.profiles?.full_name || post.profiles?.username || 'Anonymous'}
                </p>
                <p className="text-sm text-muted-foreground">
                  {new Date(post.created_at).toLocaleDateString()}
                </p>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h3 className="font-semibold text-lg mb-2">{post.title}</h3>
              <p className="text-gray-700 whitespace-pre-wrap">{post.content}</p>
            </div>

            {/* Post metadata */}
            <div className="flex flex-wrap gap-2 text-sm text-muted-foreground">
              {post.country && (
                <span className="bg-blue-100 px-2 py-1 rounded">
                  Country: {post.country}
                </span>
              )}
              {post.target_country && (
                <span className="bg-green-100 px-2 py-1 rounded">
                  Target: {post.target_country}
                </span>
              )}
              {post.visa_type && (
                <span className="bg-purple-100 px-2 py-1 rounded">
                  Visa: {post.visa_type}
                </span>
              )}
              {post.stage && (
                <span className="bg-orange-100 px-2 py-1 rounded">
                  Stage: {post.stage}
                </span>
              )}
            </div>

            {/* Action buttons */}
            <div className="flex items-center space-x-4 pt-2 border-t">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => handleLike(post.id)}
                className="flex items-center space-x-2"
              >
                <Heart className="h-4 w-4" />
                <span>{post.likes || 0}</span>
              </Button>
              
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setReplyingTo(replyingTo === post.id ? null : post.id)}
                className="flex items-center space-x-2"
              >
                <MessageCircle className="h-4 w-4" />
                <span>{post.comments || 0}</span>
              </Button>
            </div>

            {/* Reply form */}
            {replyingTo === post.id && user && (
              <div className="space-y-2 pt-2 border-t">
                <Textarea
                  placeholder="Write a reply..."
                  value={replyContent}
                  onChange={(e) => setReplyContent(e.target.value)}
                  className="min-h-[100px]"
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
              <div className="space-y-3 pt-3 border-t">
                <h4 className="font-medium text-sm">Replies:</h4>
                {getPostReplies(post.id).map((reply) => (
                  <div key={reply.id} className="bg-gray-50 p-3 rounded-lg">
                    <div className="flex items-start justify-between">
                      <div className="flex items-center space-x-2 mb-2">
                        <Avatar className="h-6 w-6">
                          <AvatarImage src={reply.profiles?.avatar_url || ''} />
                          <AvatarFallback className="text-xs">
                            {reply.profiles?.username?.[0]?.toUpperCase() || 
                             reply.profiles?.full_name?.[0]?.toUpperCase() || 'U'}
                          </AvatarFallback>
                        </Avatar>
                        <span className="font-medium text-sm">
                          {reply.profiles?.full_name || reply.profiles?.username || 'Anonymous'}
                        </span>
                        <span className="text-xs text-muted-foreground">
                          {new Date(reply.created_at).toLocaleDateString()}
                        </span>
                      </div>
                      {user && reply.user_id === user.id && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDeleteReply(reply.id)}
                          className="h-6 w-6 p-0 text-red-500 hover:text-red-700"
                        >
                          <Trash2 className="h-3 w-3" />
                        </Button>
                      )}
                    </div>
                    <p className="text-sm text-gray-700 whitespace-pre-wrap">
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
  );
};

export default PostFeed;
