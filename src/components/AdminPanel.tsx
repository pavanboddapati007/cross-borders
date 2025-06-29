
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { InstagramScraper } from './InstagramScraper';
import { Settings, Database } from 'lucide-react';

export const AdminPanel = () => {
  return (
    <div className="space-y-8 py-8">
      <div className="flex items-center gap-3">
        <Settings className="w-8 h-8 text-cyan-400" />
        <h1 className="text-4xl font-bold text-white">Admin Panel</h1>
      </div>
      
      <Card className="bg-gray-800/30 backdrop-blur-xl border-gray-700/50 rounded-2xl p-6">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-white">
            <Database className="w-6 h-6 text-blue-500" />
            Content Management
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-gray-300 mb-6">
            Use the tools below to populate your community with real immigration stories from Instagram accounts.
            This helps create initial content while you build your user base.
          </p>
          <InstagramScraper />
        </CardContent>
      </Card>
    </div>
  );
};
