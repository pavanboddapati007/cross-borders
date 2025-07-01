
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Instagram, Plus, AlertCircle, CheckCircle, Sparkles } from 'lucide-react';
import { FirecrawlService } from '@/utils/FirecrawlService';
import { generateRandomUsername } from '@/utils/usernameGenerator';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useGroqClassification } from '@/hooks/useGroqClassification';
import { toast } from '@/hooks/use-toast';

interface ExtractedPost {
  content: string;
  title: string;
  relevanceScore: number;
  selected?: boolean;
}

export const InstagramScraper = () => {
  const { user } = useAuth();
  const { classifyPost, isClassifying } = useGroqClassification();
  const [username, setUsername] = useState('');
  const [firecrawlApiKey, setFirecrawlApiKey] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [extractedPosts, setExtractedPosts] = useState<ExtractedPost[]>([]);
  const [isPosting, setIsPosting] = useState(false);

  const handleSaveApiKey = () => {
    if (!firecrawlApiKey.trim()) {
      toast({
        title: "Error",
        description: "Please enter a valid Firecrawl API key",
        variant: "destructive"
      });
      return;
    }
    
    FirecrawlService.saveApiKey(firecrawlApiKey);
    toast({
      title: "Success",
      description: "Firecrawl API key saved successfully"
    });
    setFirecrawlApiKey('');
  };

  const handleScrape = async () => {
    if (!username.trim()) {
      toast({
        title: "Error",
        description: "Please enter an Instagram username",
        variant: "destructive"
      });
      return;
    }

    if (!FirecrawlService.getApiKey()) {
      toast({
        title: "Error",
        description: "Please add your Firecrawl API key first",
        variant: "destructive"
      });
      return;
    }

    setIsLoading(true);
    setExtractedPosts([]);

    try {
      const result = await FirecrawlService.scrapeInstagramAccount(username);
      
      if (result.success) {
        const posts = FirecrawlService.extractImmigrationPosts(result.data);
        setExtractedPosts(posts.map(post => ({ ...post, selected: true })));
        
        toast({
          title: "Success",
          description: `Found ${posts.length} immigration-related posts from @${username}`,
        });
      } else {
        toast({
          title: "Error",
          description: result.error || "Failed to scrape Instagram account",
          variant: "destructive"
        });
      }
    } catch (error) {
      console.error('Scraping error:', error);
      toast({
        title: "Error",
        description: "An unexpected error occurred while scraping",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const togglePostSelection = (index: number) => {
    setExtractedPosts(prev => 
      prev.map((post, i) => 
        i === index ? { ...post, selected: !post.selected } : post
      )
    );
  };

  const handlePostToFeed = async () => {
    if (!user) {
      toast({
        title: "Error",
        description: "You must be logged in to post content",
        variant: "destructive"
      });
      return;
    }

    const selectedPosts = extractedPosts.filter(post => post.selected);
    if (selectedPosts.length === 0) {
      toast({
        title: "Error",
        description: "Please select at least one post to add to the feed",
        variant: "destructive"
      });
      return;
    }

    setIsPosting(true);
    let successCount = 0;

    try {
      for (const post of selectedPosts) {
        const randomUsername = generateRandomUsername();
        
        // Create the post in the database
        const { data: newPost, error } = await supabase
          .from('posts')
          .insert({
            user_id: user.id,
            title: post.title,
            content: post.content,
            country: 'United States', // Default country for immigration posts
            category: 'Immigration Experience',
            stage: 'Shared Experience',
            status: 'Completed'
          })
          .select()
          .single();

        if (error) {
          console.error('Error creating post:', error);
          continue;
        }

        // Classify the post using Groq
        try {
          await classifyPost(
            newPost.id,
            post.title,
            post.content,
            'United States',
            'Immigration Experience'
          );
        } catch (classificationError) {
          console.error('Classification failed:', classificationError);
          // Continue even if classification fails
        }

        successCount++;
      }

      toast({
        title: "Success",
        description: `Successfully added ${successCount} posts to the community feed`,
      });

      // Clear the extracted posts after successful posting
      setExtractedPosts([]);
      setUsername('');

    } catch (error) {
      console.error('Error posting to feed:', error);
      toast({
        title: "Error",
        description: "Failed to post some content to the feed",
        variant: "destructive"
      });
    } finally {
      setIsPosting(false);
    }
  };

  return (
    <div className="space-y-6">
      <Card className="bg-gray-800/50 backdrop-blur-xl border-gray-700 rounded-2xl">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-white">
            <Instagram className="w-6 h-6 text-pink-500" />
            Instagram Content Scraper
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {!FirecrawlService.getApiKey() && (
            <div className="space-y-3 p-4 bg-yellow-900/20 border border-yellow-700 rounded-lg">
              <div className="flex items-center gap-2 text-yellow-400">
                <AlertCircle className="w-5 h-5" />
                <span className="font-medium">Firecrawl API Key Required</span>
              </div>
              <p className="text-gray-300 text-sm">
                To scrape Instagram content, you need a Firecrawl API key. Get one from{' '}
                <a href="https://firecrawl.dev" target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:underline">
                  firecrawl.dev
                </a>
              </p>
              <div className="flex gap-2">
                <Input
                  type="password"
                  placeholder="Enter your Firecrawl API key"
                  value={firecrawlApiKey}
                  onChange={(e) => setFirecrawlApiKey(e.target.value)}
                  className="bg-gray-700/50 border-gray-600 text-white placeholder-gray-400"
                />
                <Button onClick={handleSaveApiKey} className="bg-blue-600 hover:bg-blue-700">
                  Save Key
                </Button>
              </div>
            </div>
          )}

          <div className="flex gap-2">
            <Input
              placeholder="Instagram username (without @)"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="bg-gray-700/50 border-gray-600 text-white placeholder-gray-400"
            />
            <Button 
              onClick={handleScrape}
              disabled={isLoading || !FirecrawlService.getApiKey()}
              className="bg-pink-600 hover:bg-pink-700"
            >
              {isLoading ? 'Scraping...' : 'Scrape Posts'}
            </Button>
          </div>
        </CardContent>
      </Card>

      {extractedPosts.length > 0 && (
        <Card className="bg-gray-800/50 backdrop-blur-xl border-gray-700 rounded-2xl">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2 text-white">
                <CheckCircle className="w-6 h-6 text-green-500" />
                Extracted Immigration Posts ({extractedPosts.length})
              </CardTitle>
              <Button 
                onClick={handlePostToFeed}
                disabled={isPosting || extractedPosts.filter(p => p.selected).length === 0}
                className="bg-green-600 hover:bg-green-700"
              >
                <Plus className="w-4 h-4 mr-2" />
                {isPosting ? 'Posting...' : `Post Selected (${extractedPosts.filter(p => p.selected).length})`}
              </Button>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            {extractedPosts.map((post, index) => (
              <div 
                key={index}
                className={`p-4 rounded-lg border cursor-pointer transition-all ${
                  post.selected 
                    ? 'bg-blue-900/20 border-blue-500' 
                    : 'bg-gray-700/30 border-gray-600'
                }`}
                onClick={() => togglePostSelection(index)}
              >
                <div className="flex items-start justify-between mb-2">
                  <h3 className="font-semibold text-white">{post.title}</h3>
                  <div className="flex items-center gap-2">
                    <Badge className="bg-purple-600 text-white">
                      <Sparkles className="w-3 h-3 mr-1" />
                      Score: {post.relevanceScore}
                    </Badge>
                    {post.selected && (
                      <CheckCircle className="w-5 h-5 text-green-500" />
                    )}
                  </div>
                </div>
                <Textarea
                  value={post.content}
                  readOnly
                  className="bg-gray-800/50 border-gray-600 text-gray-300 min-h-[100px] resize-none"
                />
              </div>
            ))}
          </CardContent>
        </Card>
      )}
    </div>
  );
};
