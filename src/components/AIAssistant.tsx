
import React, { useState } from 'react';
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Bot, User, Send } from 'lucide-react';

interface Message {
  id: string;
  content: string;
  isUser: boolean;
  timestamp: string;
}

const AIAssistant = () => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      content: 'Hello! I\'m your AI Immigration Assistant. I can help you with questions about visa processes, documentation requirements, timelines, and immigration policies. How can I assist you today?',
      isUser: false,
      timestamp: new Date().toLocaleTimeString()
    }
  ]);
  
  const [inputMessage, setInputMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);

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
    setInputMessage('');
    setIsTyping(true);

    // Simulate AI response
    setTimeout(() => {
      const aiResponse = generateAIResponse(inputMessage);
      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: aiResponse,
        isUser: false,
        timestamp: new Date().toLocaleTimeString()
      };
      
      setMessages(prev => [...prev, aiMessage]);
      setIsTyping(false);
    }, 1500);
  };

  const generateAIResponse = (question: string): string => {
    const q = question.toLowerCase();
    
    if (q.includes('green card') || q.includes('permanent resident')) {
      return 'Green card processing times vary by category and country. Generally, family-based applications can take 1-3 years, while employment-based applications may take 6 months to several years depending on your priority date and country of birth. I recommend checking the USCIS processing times for your specific case type and service center.';
    }
    
    if (q.includes('student visa') || q.includes('f-1')) {
      return 'For a student visa (F-1), you\'ll need: 1) Form I-20 from your school, 2) Valid passport, 3) SEVIS fee payment receipt, 4) Financial documents showing ability to pay, 5) Academic transcripts, 6) English proficiency test scores. The interview is usually scheduled within 2-4 weeks of application.';
    }
    
    if (q.includes('work') && q.includes('asylum')) {
      return 'Yes, you can apply for work authorization 150 days after filing your asylum application, but you cannot receive the employment authorization document (EAD) until at least 180 days have passed since filing. You must file Form I-765 to request work authorization.';
    }
    
    if (q.includes('case status') || q.includes('check status')) {
      return 'You can check your case status online at the USCIS website using your receipt number. You can also call the USCIS Contact Center at 1-800-375-5283. Make sure to have your receipt number ready when checking your status.';
    }
    
    if (q.includes('citizenship') || q.includes('naturalization')) {
      return 'To apply for U.S. citizenship, you must: 1) Be 18+ years old, 2) Be a permanent resident for 5 years (or 3 years if married to a U.S. citizen), 3) Have continuous residence in the U.S., 4) Be physically present in the U.S. for at least half the required period, 5) Pass English and civics tests, 6) Demonstrate good moral character.';
    }
    
    return 'Thank you for your question about immigration. While I can provide general guidance, immigration law is complex and individual cases vary significantly. I recommend consulting with a qualified immigration attorney for personalized advice. Is there a specific aspect of immigration law you\'d like me to explain in general terms?';
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
        <p className="text-gray-600">Get instant guidance on immigration processes and requirements</p>
        <Badge className="bg-green-100 text-green-800 border-green-200">
          ✓ Trained on Official Immigration Guidelines
        </Badge>
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
                    <p className="text-sm leading-relaxed">{message.content}</p>
                  </div>
                  <p className="text-xs text-gray-500 mt-1">{message.timestamp}</p>
                </div>
              </div>
            ))}
            
            {isTyping && (
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
                onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
              />
              <Button
                onClick={handleSendMessage}
                className="bg-gradient-to-r from-blue-600 to-green-600 hover:from-blue-700 hover:to-green-700 text-white"
                disabled={!inputMessage.trim() || isTyping}
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
            <strong>Disclaimer:</strong> This AI assistant provides general information only and should not be considered legal advice. 
            Immigration law is complex and individual cases vary. Always consult with a qualified immigration attorney for personalized guidance.
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export default AIAssistant;
