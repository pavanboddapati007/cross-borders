import React, { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';

interface PostStoryDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const PostStoryDialog = ({ open, onOpenChange }: PostStoryDialogProps) => {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    category: '',
    visa_type: '',
    stage: '',
    country: '',
    target_country: ''
  });

  const createPostMutation = useMutation({
    mutationFn: async (postData: typeof formData) => {
      if (!user) throw new Error('Must be logged in to create posts');

      const { error } = await supabase
        .from('posts')
        .insert({
          title: postData.title,
          content: postData.content,
          category: postData.category || null,
          visa_type: postData.visa_type || null,
          stage: postData.stage || null,
          country: postData.country || null,
          target_country: postData.target_country || null,
          user_id: user.id,
        });

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['posts'] });
      setFormData({
        title: '',
        content: '',
        category: '',
        visa_type: '',
        stage: '',
        country: '',
        target_country: ''
      });
      onOpenChange(false);
      toast.success('Story posted successfully!');
    },
    onError: (error) => {
      console.error('Error creating post:', error);
      toast.error('Failed to post story');
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title.trim() || !formData.content.trim()) {
      toast.error('Please fill in both title and content');
      return;
    }
    createPostMutation.mutate(formData);
  };

  const handleInputChange = (field: keyof typeof formData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl bg-gray-900 border-gray-700">
        <DialogHeader>
          <DialogTitle className="text-white text-xl">Post Your Story</DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="title" className="text-gray-300">Title</Label>
            <Input
              id="title"
              value={formData.title}
              onChange={(e) => handleInputChange('title', e.target.value)}
              placeholder="Enter your story title..."
              className="bg-gray-800 border-gray-600 text-white placeholder:text-gray-400"
              required
            />
          </div>

          <div>
            <Label htmlFor="content" className="text-gray-300">Content</Label>
            <Textarea
              id="content"
              value={formData.content}
              onChange={(e) => handleInputChange('content', e.target.value)}
              placeholder="Share your immigration story..."
              className="min-h-[120px] bg-gray-800 border-gray-600 text-white placeholder:text-gray-400"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="category" className="text-gray-300">Category</Label>
              <Input
                id="category"
                value={formData.category}
                onChange={(e) => handleInputChange('category', e.target.value)}
                placeholder="e.g., Experience, Question"
                className="bg-gray-800 border-gray-600 text-white placeholder:text-gray-400"
              />
            </div>

            <div>
              <Label htmlFor="visa_type" className="text-gray-300">Visa Type</Label>
              <Input
                id="visa_type"
                value={formData.visa_type}
                onChange={(e) => handleInputChange('visa_type', e.target.value)}
                placeholder="e.g., H1B, F1, Green Card"
                className="bg-gray-800 border-gray-600 text-white placeholder:text-gray-400"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="country" className="text-gray-300">From Country</Label>
              <Input
                id="country"
                value={formData.country}
                onChange={(e) => handleInputChange('country', e.target.value)}
                placeholder="e.g., India, China"
                className="bg-gray-800 border-gray-600 text-white placeholder:text-gray-400"
              />
            </div>

            <div>
              <Label htmlFor="target_country" className="text-gray-300">To Country</Label>
              <Input
                id="target_country"
                value={formData.target_country}
                onChange={(e) => handleInputChange('target_country', e.target.value)}
                placeholder="e.g., USA, Canada"
                className="bg-gray-800 border-gray-600 text-white placeholder:text-gray-400"
              />
            </div>
          </div>

          <div>
            <Label htmlFor="stage" className="text-gray-300">Stage</Label>
            <Input
              id="stage"
              value={formData.stage}
              onChange={(e) => handleInputChange('stage', e.target.value)}
              placeholder="e.g., Applied, Approved, In Process"
              className="bg-gray-800 border-gray-600 text-white placeholder:text-gray-400"
            />
          </div>

          <div className="flex justify-end space-x-3 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              className="border-gray-600 text-gray-300 hover:bg-gray-800"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={createPostMutation.isPending}
              className="bg-orange-600 hover:bg-orange-700 text-white"
            >
              {createPostMutation.isPending ? 'Posting...' : 'Post Story'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default PostStoryDialog;