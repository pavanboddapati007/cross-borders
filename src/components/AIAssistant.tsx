
import React, { useState } from 'react';
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Bot, User, Send, Sparkles, ArrowUp, Search } from 'lucide-react';
import { useGroqAssistant } from '@/hooks/useGroqAssistant';
import { toast } from '@/hooks/use-toast';

interface Message {
  id: string;
  content: string;
  isUser: boolean;
  timestamp: string;
}

const AIAssistant = () => {
  const { askQuestion, isLoading } = useGroqAssistant();
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      content: 'Hello! I\'m your AI Immigration Assistant powered by real community experiences. I can help you with questions about visa processes, documentation requirements, timelines, and immigration policies based on actual user stories and my knowledge. How can I assist you today?',
      isUser: false,
      timestamp: new Date().toLocaleTimeString()
    }
  ]);
  
  const [inputMessage, setInputMessage] = useState('');
  const [searchQuery, setSearchQuery] = useState('');

  const commonQuestions = [
    'How long does a green card application take?',
    'What documents do I need for a student visa?',
    'Can I work while my asylum case is pending?',
    'How to check my case status?',
    'What are the requirements for citizenship?'
  ];

  const handleSendMessage = async (messageToSend?: string) => {
    const questionText = messageToSend || inputMessage;
    if (!questionText.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      content: questionText,
      isUser: true,
      timestamp: new Date().toLocaleTimeString()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputMessage('');
    setSearchQuery('');

    try {
      console.log('Sending question to AI:', questionText);
      const response = await askQuestion(questionText);
      console.log('Received AI response:', response);
      
      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: response,
        isUser: false,
        timestamp: new Date().toLocaleTimeString()
      };
      
      setMessages(prev => [...prev, aiMessage]);
    } catch (error) {
      console.error('AI Assistant error:', error);
      toast({
        title: "Error",
        description: "Failed to get response from AI assistant. Please try again.",
        variant: "destructive"
      });
      
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: "I apologize, but I'm having trouble processing your question right now. Please try again later or contact support if the issue persists.",
        isUser: false,
        timestamp: new Date().toLocaleTimeString()
      };
      
      setMessages(prev => [...prev, errorMessage]);
    }
  };

  const handleSearchSubmit = () => {
    if (searchQuery.trim()) {
      handleSendMessage(searchQuery);
    }
  };

  const handleQuickQuestion = (question: string) => {
    handleSendMessage(question);
  };

  return (
    <div className="flex flex-col h-[80vh] max-w-4xl mx-auto bg-gray-900 rounded-lg overflow-hidden">
      {/* Header */}
      <div className="bg-gray-800 border-b border-gray-700 p-6">
        <div className="text-center space-y-3">
          <h2 className="text-2xl font-bold text-white">
            Immigration Assistant
          </h2>
          <div className="flex gap-2 justify-center">
            <Badge className="bg-emerald-900/50 text-emerald-300 border-emerald-700">
              <Sparkles className="w-3 h-3 mr-1" />
              Powered by Groq AI
            </Badge>
            <Badge className="bg-blue-900/50 text-blue-300 border-blue-700">
              ✓ Real User Experiences
            </Badge>
          </div>
        </div>
        
        {/* Search Bar */}
        <div className="mt-4 relative">
          <div className="flex space-x-2">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search immigration topics or ask a question..."
                className="bg-gray-700 border-gray-600 text-white placeholder-gray-400 pl-10 py-3 rounded-xl focus:border-blue-500"
                onKeyPress={(e) => e.key === 'Enter' && !isLoading && handleSearchSubmit()}
                disabled={isLoading}
              />
            </div>
            <Button
              onClick={handleSearchSubmit}
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-3 rounded-xl"
              disabled={!searchQuery.trim() || isLoading}
            >
              <Search className="w-4 h-4" />
            </Button>
          </div>
        </div>
        
        {/* Disclaimer */}
        <div className="mt-4 p-3 bg-amber-900/20 border border-amber-700/30 rounded-lg">
          <p className="text-sm text-amber-200">
            <strong>Disclaimer:</strong> This AI assistant provides general information based on community experiences and should not be considered legal advice. 
            Immigration law is complex and individual cases vary. Always consult with a qualified immigration attorney for personalized guidance.
          </p>
        </div>
      </div>

      {/* Chat Messages */}
      <div className="flex-1 overflow-y-auto p-6 space-y-4 bg-gray-950 min-h-0">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex space-x-3 ${message.isUser ? 'flex-row-reverse space-x-reverse' : ''}`}
          >
            <Avatar className="w-8 h-8 flex-shrink-0">
              <AvatarFallback className={message.isUser ? 'bg-blue-600 text-white' : 'bg-emerald-600 text-white'}>
                {message.isUser ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
              </AvatarFallback>
            </Avatar>
            
            <div className={`flex-1 max-w-xs md:max-w-md lg:max-w-2xl ${message.isUser ? 'text-right' : ''}`}>
              <div
                className={`p-4 rounded-xl ${
                  message.isUser
                    ? 'bg-blue-600 text-white ml-auto'
                    : 'bg-gray-800 text-gray-100 border border-gray-700'
                }`}
              >
                <p className="text-sm leading-relaxed whitespace-pre-wrap">{message.content}</p>
              </div>
              <p className="text-xs text-gray-500 mt-2">{message.timestamp}</p>
            </div>
          </div>
        ))}
        
        {isLoading && (
          <div className="flex space-x-3">
            <Avatar className="w-8 h-8">
              <AvatarFallback className="bg-emerald-600 text-white">
                <Bot className="w-4 h-4" />
              </AvatarFallback>
            </Avatar>
            <div className="bg-gray-800 border border-gray-700 p-4 rounded-xl">
              <div className="flex space-x-1">
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
              </div>
            </div>
          </div>
        )}
      </div>
      
      {/* Input Area */}
      <div className="p-4 bg-gray-900 border-t border-gray-700">
        <div className="flex space-x-2 items-end">
          <div className="flex-1 relative">
            <Input
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              placeholder="Type your immigration question here..."
              className="bg-gray-800 border-gray-600 text-white placeholder-gray-400 pr-12 py-3 rounded-xl focus:border-blue-500"
              onKeyPress={(e) => e.key === 'Enter' && !isLoading && handleSendMessage()}
              disabled={isLoading}
            />
          </div>
          <Button
            onClick={() => handleSendMessage()}
            className="bg-blue-600 hover:bg-blue-700 text-white p-3 rounded-xl"
            disabled={!inputMessage.trim() || isLoading}
          >
            <ArrowUp className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {/* Common Questions at bottom - only show when no conversation has started */}
      {messages.length <= 1 && (
        <div className="p-4 bg-gray-800 border-t border-gray-700">
          <h3 className="text-sm font-medium text-gray-300 mb-3">Common Questions:</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
            {commonQuestions.map((question, index) => (
              <Button
                key={index}
                variant="outline"
                className="text-left h-auto p-3 text-white bg-gray-700 border-gray-600 hover:bg-gray-600 hover:border-gray-500 transition-all duration-200"
                onClick={() => handleQuickQuestion(question)}
                disabled={isLoading}
              >
                {question}
              </Button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default AIAssistant;
