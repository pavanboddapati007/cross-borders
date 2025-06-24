
import React, { useState } from 'react';
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Clock, ExternalLink, Search } from 'lucide-react';

interface NewsItem {
  id: string;
  title: string;
  summary: string;
  category: string;
  country: string;
  publishedAt: string;
  source: string;
  urgent: boolean;
}

const NewsSection = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedCountry, setSelectedCountry] = useState('all');

  const newsItems: NewsItem[] = [
    {
      id: '1',
      title: 'USCIS Extends Automatic Extension Period for Employment Authorization Documents',
      summary: 'USCIS announced an extension of the automatic extension period for certain Employment Authorization Documents (EADs) from 180 days to 540 days for qualifying renewal applicants.',
      category: 'Policy Update',
      country: 'USA',
      publishedAt: '2024-01-15',
      source: 'USCIS',
      urgent: true
    },
    {
      id: '2',
      title: 'Canada Announces New Express Entry Draw with Lower CRS Score',
      summary: 'Immigration, Refugees and Citizenship Canada (IRCC) conducted a new Express Entry draw with a minimum Comprehensive Ranking System (CRS) score of 481, inviting 4,750 candidates.',
      category: 'Draw Results',
      country: 'Canada',
      publishedAt: '2024-01-14',
      source: 'IRCC',
      urgent: false
    },
    {
      id: '3',
      title: 'UK Introduces New Graduate Visa Restrictions',
      summary: 'The UK government announced new restrictions on the Graduate visa route, affecting international students who completed their studies at UK universities.',
      category: 'Policy Change',
      country: 'UK',
      publishedAt: '2024-01-13',
      source: 'UK Gov',
      urgent: true
    },
    {
      id: '4',
      title: 'Australia Updates Skills Priority List for 2024',
      summary: 'The Australian government has updated the Skills Priority List, adding new occupations and removing others based on current labor market needs.',
      category: 'Skills List',
      country: 'Australia',
      publishedAt: '2024-01-12',
      source: 'Dept of Home Affairs',
      urgent: false
    },
    {
      id: '5',
      title: 'EU Proposes New Digital Nomad Visa Framework',
      summary: 'The European Union is considering a new framework for digital nomad visas that would allow remote workers to move freely between member states.',
      category: 'Proposal',
      country: 'EU',
      publishedAt: '2024-01-11',
      source: 'European Commission',
      urgent: false
    },
    {
      id: '6',
      title: 'New Zealand Resumes Parent Category Visa Applications',
      summary: 'Immigration New Zealand announced the reopening of the Parent Category visa applications after a temporary suspension due to high demand.',
      category: 'Program Reopening',
      country: 'New Zealand',
      publishedAt: '2024-01-10',
      source: 'Immigration NZ',
      urgent: false
    }
  ];

  const categories = ['all', 'Policy Update', 'Policy Change', 'Draw Results', 'Skills List', 'Proposal', 'Program Reopening'];
  const countries = ['all', 'USA', 'Canada', 'UK', 'Australia', 'EU', 'New Zealand'];

  const filteredNews = newsItems.filter(item => {
    const matchesSearch = item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         item.summary.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || item.category === selectedCategory;
    const matchesCountry = selectedCountry === 'all' || item.country === selectedCountry;
    
    return matchesSearch && matchesCategory && matchesCountry;
  });

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - date.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 1) return '1 day ago';
    if (diffDays < 7) return `${diffDays} days ago`;
    return date.toLocaleDateString();
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <div className="text-center space-y-4 mb-8">
        <h2 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-green-600 bg-clip-text text-transparent">
          Immigration News & Updates
        </h2>
        <p className="text-gray-600">Stay informed with the latest immigration policies and announcements</p>
      </div>

      {/* Filters */}
      <Card className="bg-white/90 backdrop-blur-sm border-0 shadow-lg">
        <CardContent className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search news..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 border-gray-200 focus:border-blue-500"
              />
            </div>
            
            <Select value={selectedCategory} onValueChange={setSelectedCategory}>
              <SelectTrigger className="border-gray-200 focus:border-blue-500">
                <SelectValue placeholder="Select category" />
              </SelectTrigger>
              <SelectContent>
                {categories.map(category => (
                  <SelectItem key={category} value={category}>
                    {category === 'all' ? 'All Categories' : category}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            
            <Select value={selectedCountry} onValueChange={setSelectedCountry}>
              <SelectTrigger className="border-gray-200 focus:border-blue-500">
                <SelectValue placeholder="Select country" />
              </SelectTrigger>
              <SelectContent>
                {countries.map(country => (
                  <SelectItem key={country} value={country}>
                    {country === 'all' ? 'All Countries' : country}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* News Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {filteredNews.map((item) => (
          <Card key={item.id} className="bg-white/90 backdrop-blur-sm border-0 shadow-lg hover:shadow-xl transition-all duration-300 group">
            <CardHeader className="space-y-3">
              <div className="flex items-start justify-between">
                <div className="flex flex-wrap gap-2">
                  <Badge 
                    variant={item.urgent ? "destructive" : "secondary"}
                    className={item.urgent ? "bg-red-100 text-red-800 border-red-200" : "bg-blue-100 text-blue-800 border-blue-200"}
                  >
                    {item.country}
                  </Badge>
                  <Badge variant="outline" className="border-gray-300">
                    {item.category}
                  </Badge>
                  {item.urgent && (
                    <Badge className="bg-orange-100 text-orange-800 border-orange-200">
                      Urgent
                    </Badge>
                  )}
                </div>
              </div>
              
              <h3 className="text-lg font-semibold text-gray-800 line-clamp-2 group-hover:text-blue-600 transition-colors">
                {item.title}
              </h3>
            </CardHeader>
            
            <CardContent className="space-y-4">
              <p className="text-gray-600 text-sm leading-relaxed line-clamp-3">
                {item.summary}
              </p>
              
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2 text-sm text-gray-500">
                  <Clock className="w-4 h-4" />
                  <span>{formatDate(item.publishedAt)}</span>
                  <span>•</span>
                  <span>{item.source}</span>
                </div>
                
                <Button variant="ghost" size="sm" className="text-blue-600 hover:text-blue-700 hover:bg-blue-50">
                  <ExternalLink className="w-4 h-4 mr-1" />
                  Read More
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredNews.length === 0 && (
        <Card className="bg-gray-50 border-gray-200">
          <CardContent className="text-center py-12">
            <p className="text-gray-500">No news items found matching your criteria.</p>
          </CardContent>
        </Card>
      )}

      {/* Newsletter Signup */}
      <Card className="bg-gradient-to-r from-blue-600 to-green-600 text-white border-0">
        <CardContent className="text-center p-8 space-y-4">
          <h3 className="text-xl font-semibold">Stay Updated</h3>
          <p className="text-blue-100">Get the latest immigration news delivered to your inbox</p>
          <div className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
            <Input 
              placeholder="Enter your email" 
              className="bg-white/10 border-white/20 text-white placeholder-white/70 focus:bg-white/20"
            />
            <Button variant="secondary" className="bg-white text-blue-600 hover:bg-gray-100">
              Subscribe
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default NewsSection;
