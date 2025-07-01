
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { PlusCircle, X, UserPlus, MessageSquarePlus, Sparkles } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useGroqClassification } from '@/hooks/useGroqClassification';
import { toast } from '@/hooks/use-toast';
import { generateRandomUsername } from '@/utils/usernameGenerator';

interface Comment {
  id: string;
  content: string;
  username: string;
}

interface StoryData {
  title: string;
  content: string;
  country: string;
  category: string;
  stage: string;
  username: string;
  comments: Comment[];
}

const AdminPanel = () => {
  const { user } = useAuth();
  const { classifyPost, isClassifying } = useGroqClassification();
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  
  const [storyData, setStoryData] = useState<StoryData>({
    title: '',
    content: '',
    country: '',
    category: '',
    stage: '',
    username: generateRandomUsername(),
    comments: []
  });

  const [newComment, setNewComment] = useState('');

  const addComment = () => {
    if (!newComment.trim()) return;
    
    const comment: Comment = {
      id: Date.now().toString(),
      content: newComment,
      username: generateRandomUsername()
    };
    
    setStoryData(prev => ({
      ...prev,
      comments: [...prev.comments, comment]
    }));
    setNewComment('');
  };

  const removeComment = (commentId: string) => {
    setStoryData(prev => ({
      ...prev,
      comments: prev.comments.filter(c => c.id !== commentId)
    }));
  };

  const generateNewUsername = () => {
    setStoryData(prev => ({
      ...prev,
      username: generateRandomUsername()
    }));
  };

  const resetForm = () => {
    setStoryData({
      title: '',
      content: '',
      country: '',
      category: '',
      stage: '',
      username: generateRandomUsername(),
      comments: []
    });
    setNewComment('');
  };

  const extractTagsFromContent = (content: string, title: string): string[] => {
    const text = (title + ' ' + content).toLowerCase();
    const tags: string[] = [];
    
    // Visa type tags
    if (text.includes('h1b') || text.includes('h-1b')) tags.push('H1B');
    if (text.includes('green card') || text.includes('permanent resident')) tags.push('Green Card');
    if (text.includes('f1') || text.includes('f-1') || text.includes('student')) tags.push('Student Visa');
    if (text.includes('asylum') || text.includes('refugee')) tags.push('Asylum');
    if (text.includes('family') || text.includes('marriage')) tags.push('Family Based');
    if (text.includes('tourist') || text.includes('visitor')) tags.push('Tourist');
    
    // Process stage tags
    if (text.includes('interview') || text.includes('consulate')) tags.push('Interview');
    if (text.includes('application') || text.includes('filing')) tags.push('Application');
    if (text.includes('approval') || text.includes('approved')) tags.push('Approved');
    if (text.includes('waiting') || text.includes('pending')) tags.push('Waiting');
    if (text.includes('denied') || text.includes('rejection')) tags.push('Denied');
    
    // Experience tags
    if (text.includes('success') || text.includes('got it') || text.includes('received')) tags.push('Success Story');
    if (text.includes('help') || text.includes('advice') || text.includes('question')) tags.push('Seeking Advice');
    if (text.includes('warning') || text.includes('scam') || text.includes('fraud')) tags.push('Warning');
    
    return [...new Set(tags)]; // Remove duplicates
  };

  const handleSubmit = async () => {
    if (!storyData.title || !storyData.content || !user) {
      toast({
        title: "Error",
        description: "Please fill in required fields",
        variant: "destructive"
      });
      return;
    }

    setLoading(true);
    try {
      // Create the main post
      const { data: postData, error: postError } = await supabase
        .from('posts')
        .insert({
          user_id: user.id,
          title: storyData.title,
          content: storyData.content,
          country: storyData.country || null,
          category: storyData.category || null,
          stage: storyData.stage || null,
          status: 'Completed',
          tags: extractTagsFromContent(storyData.content, storyData.title),
          visa_type: storyData.category || null,
          target_country: storyData.country || null
        })
        .select()
        .single();

      if (postError) throw postError;

      // Add comments if any
      if (storyData.comments.length > 0) {
        const commentInserts = storyData.comments.map(comment => ({
          post_id: postData.id,
          user_id: user.id,
          content: `[${comment.username}]: ${comment.content}`
        }));

        const { error: commentsError } = await supabase
          .from('post_replies')
          .insert(commentInserts);

        if (commentsError) throw commentsError;
      }

      // Classify the post using AI
      try {
        await classifyPost(
          postData.id,
          storyData.title,
          storyData.content,
          storyData.country,
          storyData.category
        );
      } catch (classificationError) {
        console.error('Classification failed:', classificationError);
      }

      toast({
        title: "Success",
        description: "Story added to community feed successfully!",
      });

      resetForm();
      setIsOpen(false);
      
    } catch (error) {
      console.error('Error creating story:', error);
      toast({
        title: "Error",
        description: "Failed to add story",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) {
    return (
      <Button
        onClick={() => setIsOpen(true)}
        size="sm"
        className="bg-purple-600 hover:bg-purple-700 text-white"
      >
        <UserPlus size={16} className="mr-1.5" />
        Admin
      </Button>
    );
  }

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <Card className="bg-gray-900 border-gray-700 max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-white flex items-center gap-2">
            <UserPlus className="w-6 h-6 text-purple-400" />
            Admin Panel - Add User Story
          </CardTitle>
          <Button
            onClick={() => setIsOpen(false)}
            variant="ghost"
            size="sm"
            className="text-gray-400 hover:text-white"
          >
            <X className="w-4 h-4" />
          </Button>
        </CardHeader>
        
        <CardContent className="space-y-6">
          {/* Story Details */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 mb-4">
              <Input
                placeholder="Random Username"
                value={storyData.username}
                onChange={(e) => setStoryData(prev => ({ ...prev, username: e.target.value }))}
                className="bg-gray-800 border-gray-600 text-white flex-1"
              />
              <Button
                onClick={generateNewUsername}
                variant="outline"
                size="sm"
                className="border-gray-600 text-gray-300 hover:text-white"
              >
                Generate
              </Button>
            </div>
            
            <Input
              placeholder="Story Title *"
              value={storyData.title}
              onChange={(e) => setStoryData(prev => ({ ...prev, title: e.target.value }))}
              className="bg-gray-800 border-gray-600 text-white"
            />
            
            <Textarea
              placeholder="User's immigration story content *"
              value={storyData.content}
              onChange={(e) => setStoryData(prev => ({ ...prev, content: e.target.value }))}
              className="min-h-[120px] bg-gray-800 border-gray-600 text-white"
            />
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Input
                placeholder="Country"
                value={storyData.country}
                onChange={(e) => setStoryData(prev => ({ ...prev, country: e.target.value }))}
                className="bg-gray-800 border-gray-600 text-white"
              />
              <Input
                placeholder="Category/Visa Type"
                value={storyData.category}
                onChange={(e) => setStoryData(prev => ({ ...prev, category: e.target.value }))}
                className="bg-gray-800 border-gray-600 text-white"
              />
              <Input
                placeholder="Stage"
                value={storyData.stage}
                onChange={(e) => setStoryData(prev => ({ ...prev, stage: e.target.value }))}
                className="bg-gray-800 border-gray-600 text-white"
              />
            </div>
          </div>

          {/* Preview Tags */}
          {(storyData.title || storyData.content) && (
            <div className="space-y-2">
              <h4 className="text-sm font-medium text-gray-300 flex items-center gap-2">
                <Sparkles className="w-4 h-4" />
                Auto-generated Tags Preview:
              </h4>
              <div className="flex flex-wrap gap-2">
                {extractTagsFromContent(storyData.content, storyData.title).map(tag => (
                  <Badge key={tag} className="bg-blue-100 text-blue-800">
                    {tag}
                  </Badge>
                ))}
              </div>
            </div>
          )}

          {/* Comments Section */}
          <div className="space-y-4">
            <h4 className="text-lg font-semibold text-white flex items-center gap-2">
              <MessageSquarePlus className="w-5 h-5" />
              Comments (Optional)
            </h4>
            
            {/* Add Comment */}
            <div className="flex gap-2">
              <Textarea
                placeholder="Add a comment to this story..."
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                className="bg-gray-800 border-gray-600 text-white min-h-[60px] flex-1"
              />
              <Button
                onClick={addComment}
                disabled={!newComment.trim()}
                className="bg-green-600 hover:bg-green-700 text-white self-start"
              >
                <PlusCircle className="w-4 h-4" />
              </Button>
            </div>
            
            {/* Comments List */}
            {storyData.comments.length > 0 && (
              <div className="space-y-3 max-h-60 overflow-y-auto">
                {storyData.comments.map((comment) => (
                  <div key={comment.id} className="bg-gray-800 rounded-lg p-3 flex justify-between items-start">
                    <div className="flex-1">
                      <div className="text-sm font-medium text-blue-400 mb-1">
                        {comment.username}
                      </div>
                      <div className="text-gray-300 text-sm">
                        {comment.content}
                      </div>
                    </div>
                    <Button
                      onClick={() => removeComment(comment.id)}
                      variant="ghost"
                      size="sm"
                      className="text-red-400 hover:text-red-300 ml-2"
                    >
                      <X className="w-4 h-4" />
                    </Button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Submit Button */}
          <div className="flex gap-3 pt-4">
            <Button
              onClick={handleSubmit}
              disabled={loading || isClassifying || !storyData.title || !storyData.content}
              className="bg-gradient-to-r from-purple-500 to-blue-600 hover:from-purple-600 hover:to-blue-700 text-white flex-1"
            >
              {loading || isClassifying ? 'Adding Story...' : 'Add to Community Feed'}
            </Button>
            <Button
              onClick={resetForm}
              variant="outline"
              className="border-gray-600 text-gray-300 hover:text-white"
            >
              Reset
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminPanel;
