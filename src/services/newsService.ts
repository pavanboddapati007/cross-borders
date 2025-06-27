
interface RSSItem {
  title: string;
  link: string;
  pubDate: string;
  description: string;
  source: string;
}

interface NewsItem {
  id: string;
  title: string;
  summary: string;
  category: string;
  country: string;
  publishedAt: string;
  source: string;
  urgent: boolean;
  link: string;
}

const parseRSSFeed = async (rssUrl: string): Promise<RSSItem[]> => {
  try {
    // Use a CORS proxy to fetch the RSS feed
    const proxyUrl = `https://api.allorigins.win/raw?url=${encodeURIComponent(rssUrl)}`;
    const response = await fetch(proxyUrl);
    const xmlText = await response.text();
    
    const parser = new DOMParser();
    const xmlDoc = parser.parseFromString(xmlText, 'text/xml');
    
    const items = xmlDoc.querySelectorAll('item');
    const rssItems: RSSItem[] = [];
    
    items.forEach((item) => {
      const title = item.querySelector('title')?.textContent || '';
      const link = item.querySelector('link')?.textContent || '';
      const pubDate = item.querySelector('pubDate')?.textContent || '';
      const description = item.querySelector('description')?.textContent || '';
      
      // Extract source from the title (Google News format usually includes source)
      const sourceMatch = title.match(/- (.+)$/);
      const source = sourceMatch ? sourceMatch[1] : 'Google News';
      
      rssItems.push({
        title: title.replace(/ - .+$/, ''), // Remove source from title
        link,
        pubDate,
        description,
        source
      });
    });
    
    return rssItems;
  } catch (error) {
    console.error('Error parsing RSS feed:', error);
    return [];
  }
};

const categorizeNews = (title: string, description: string): string => {
  const text = (title + ' ' + description).toLowerCase();
  
  if (text.includes('policy') || text.includes('law') || text.includes('regulation')) {
    return 'Policy Update';
  }
  if (text.includes('visa') || text.includes('green card') || text.includes('citizenship')) {
    return 'Visa News';
  }
  if (text.includes('border') || text.includes('customs') || text.includes('enforcement')) {
    return 'Border Security';
  }
  if (text.includes('court') || text.includes('ruling') || text.includes('judge')) {
    return 'Legal News';
  }
  if (text.includes('reform') || text.includes('bill') || text.includes('congress')) {
    return 'Immigration Reform';
  }
  
  return 'General News';
};

const isUrgent = (title: string, description: string): boolean => {
  const text = (title + ' ' + description).toLowerCase();
  return text.includes('breaking') || 
         text.includes('urgent') || 
         text.includes('emergency') || 
         text.includes('immediate') ||
         text.includes('suspended') ||
         text.includes('banned');
};

export const fetchImmigrationNews = async (): Promise<NewsItem[]> => {
  try {
    const rssUrl = 'https://news.google.com/rss/search?q=immigration+USA';
    const rssItems = await parseRSSFeed(rssUrl);
    
    return rssItems.map((item, index) => ({
      id: `news-${index}`,
      title: item.title,
      summary: item.description.replace(/<[^>]*>/g, '').substring(0, 200) + '...',
      category: categorizeNews(item.title, item.description),
      country: 'USA',
      publishedAt: item.pubDate,
      source: item.source,
      urgent: isUrgent(item.title, item.description),
      link: item.link
    }));
  } catch (error) {
    console.error('Error fetching immigration news:', error);
    return [];
  }
};
