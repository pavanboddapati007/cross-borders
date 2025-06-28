
import React, { useState } from 'react';
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Bot, User, Send, Sparkles } from 'lucide-react';
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

  const commonQuestions = [
    'How long does a green card application take?',
    'What documents do I need for a student visa?',
    'Can I work while my asylum case is pending?',
    'How to check my case status?',
    'What are the requirements for citizenship?'
  ];

  const handleSendMessage = async () => {
    if (!inputMessage.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      content: inputMessage,
      isUser: true,
      timestamp: new Date().toLocaleTimeString()
    };

    setMessages(prev => [...prev, userMessage]);
    const currentQuestion = inputMessage;
    setInputMessage('');

    try {
      const response = await askQuestion(currentQuestion);
      
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
        description: "Failed to get response from AI assistant",
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

  const handleQuickQuestion = (question: string) => {
    setInputMessage(question);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="text-center space-y-4 mb-8">
        <h2 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-green-600 bg-clip-text text-transparent">
          AI Immigration Assistant
        </h2>
        <p className="text-gray-600">Get instant guidance powered by real community experiences and official immigration guidelines</p>
        <div className="flex gap-2 justify-center">
          <Badge className="bg-green-100 text-green-800 border-green-200">
            <Sparkles className="w-3 h-3 mr-1" />
            Powered by Groq AI
          </Badge>
          <Badge className="bg-blue-100 text-blue-800 border-blue-200">
            ✓ Real User Experiences
          </Badge>
        </div>
      </div>

      {/* Quick Questions */}
      <Card className="bg-gradient-to-r from-blue-50 to-green-50 border-0">
        <CardHeader>
          <h3 className="font-semibold text-gray-800">Quick Questions</h3>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {commonQuestions.map((question, index) => (
              <Button
                key={index}
                variant="outline"
                className="text-left h-auto p-3 hover:bg-white hover:shadow-md transition-all duration-200"
                onClick={() => handleQuickQuestion(question)}
                disabled={isLoading}
              >
                {question}
              </Button>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Chat Interface */}
      <Card className="bg-white/90 backdrop-blur-sm border-0 shadow-lg">
        <CardContent className="p-0">
          {/* Messages */}
          <div className="h-96 overflow-y-auto p-6 space-y-4">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex space-x-3 ${message.isUser ? 'flex-row-reverse space-x-reverse' : ''}`}
              >
                <Avatar className="w-8 h-8 flex-shrink-0">
                  <AvatarFallback className={message.isUser ? 'bg-blue-600 text-white' : 'bg-green-600 text-white'}>
                    {message.isUser ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
                  </AvatarFallback>
                </Avatar>
                
                <div className={`flex-1 max-w-xs md:max-w-md lg:max-w-lg ${message.isUser ? 'text-right' : ''}`}>
                  <div
                    className={`p-3 rounded-lg ${
                      message.isUser
                        ? 'bg-blue-600 text-white ml-auto'
                        : 'bg-gray-100 text-gray-800'
                    }`}
                  >
                    <p className="text-sm leading-relaxed whitespace-pre-wrap">{message.content}</p>
                  </div>
                  <p className="text-xs text-gray-500 mt-1">{message.timestamp}</p>
                </div>
              </div>
            ))}
            
            {isLoading && (
              <div className="flex space-x-3">
                <Avatar className="w-8 h-8">
                  <AvatarFallback className="bg-green-600 text-white">
                    <Bot className="w-4 h-4" />
                  </AvatarFallback>
                </Avatar>
                <div className="bg-gray-100 p-3 rounded-lg">
                  <div className="flex space-x-1">
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                  </div>
                </div>
              </div>
            )}
          </div>
          
          {/* Input */}
          <div className="border-t p-4">
            <div className="flex space-x-2">
              <Input
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                placeholder="Ask about immigration processes, requirements, or timelines..."
                className="flex-1 border-gray-200 focus:border-blue-500"
                onKeyPress={(e) => e.key === 'Enter' && !isLoading && handleSendMessage()}
                disabled={isLoading}
              />
              <Button
                onClick={handleSendMessage}
                className="bg-gradient-to-r from-blue-600 to-green-600 hover:from-blue-700 hover:to-green-700 text-white"
                disabled={!inputMessage.trim() || isLoading}
              >
                <Send className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Disclaimer */}
      <Card className="bg-amber-50 border-amber-200">
        <CardContent className="p-4">
          <p className="text-sm text-amber-800">
            <strong>Disclaimer:</strong> This AI assistant provides general information based on community experiences and should not be considered legal advice. 
            Immigration law is complex and individual cases vary. Always consult with a qualified immigration attorney for personalized guidance.
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export default AIAssistant;
