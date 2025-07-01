
interface ErrorResponse {
  success: false;
  error: string;
}

interface ScrapeResponse {
  success: true;
  data: {
    markdown: string;
    html: string;
    metadata: {
      title: string;
      description: string;
      url: string;
    };
  };
}

type CrawlResponse = ScrapeResponse | ErrorResponse;

export class FirecrawlService {
  private static API_KEY_STORAGE_KEY = 'firecrawl_api_key';
  private static firecrawlApp: any = null;

  static saveApiKey(apiKey: string): void {
    localStorage.setItem(this.API_KEY_STORAGE_KEY, apiKey);
    console.log('Firecrawl API key saved successfully');
  }

  static getApiKey(): string | null {
    return localStorage.getItem(this.API_KEY_STORAGE_KEY);
  }

  static async scrapeInstagramAccount(username: string): Promise<{ success: boolean; error?: string; data?: any }> {
    const apiKey = this.getApiKey();
    if (!apiKey) {
      return { success: false, error: 'Firecrawl API key not found. Please add it first.' };
    }

    try {
      console.log('Scraping Instagram account:', username);
      
      // Use a more direct approach for Instagram scraping
      const response = await fetch('https://api.firecrawl.dev/v0/scrape', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${apiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          url: `https://www.instagram.com/${username}/`,
          formats: ['markdown', 'html'],
          onlyMainContent: true,
          includeTags: ['p', 'div', 'article', 'span'],
          excludeTags: ['script', 'style', 'nav', 'footer', 'header'],
          waitFor: 2000
        })
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json() as CrawlResponse;

      if (!result.success) {
        console.error('Scrape failed:', (result as ErrorResponse).error);
        return { 
          success: false, 
          error: (result as ErrorResponse).error || 'Failed to scrape Instagram account' 
        };
      }

      console.log('Scrape successful for:', username);
      return { 
        success: true,
        data: result.data 
      };
    } catch (error) {
      console.error('Error during Instagram scrape:', error);
      return { 
        success: false, 
        error: error instanceof Error ? error.message : 'Failed to connect to Firecrawl API' 
      };
    }
  }

  static extractImmigrationPosts(scrapedData: any): Array<{
    content: string;
    title: string;
    relevanceScore: number;
  }> {
    if (!scrapedData?.markdown) return [];

    const content = scrapedData.markdown;
    const posts: Array<{content: string; title: string; relevanceScore: number}> = [];
    
    // Immigration-related keywords
    const immigrationKeywords = [
      'visa', 'green card', 'immigration', 'uscis', 'h1b', 'f1', 'opt', 'stem',
      'citizen', 'residency', 'immigrant', 'embassy', 'consulate', 'petition',
      'adjustment of status', 'asylum', 'refugee', 'deportation', 'naturalization',
      'permanent resident', 'work permit', 'employment authorization', 'i-94',
      'biometrics', 'interview', 'rfe', 'notice of action', 'priority date'
    ];

    // Split content into potential posts (by paragraphs or sections)
    const sections = content.split(/\n\n+/).filter(section => 
      section.trim().length > 50 && section.trim().length < 2000
    );

    sections.forEach(section => {
      const lowerSection = section.toLowerCase();
      let relevanceScore = 0;
      
      // Calculate relevance score based on immigration keywords
      immigrationKeywords.forEach(keyword => {
        const regex = new RegExp(keyword.toLowerCase(), 'gi');
        const matches = lowerSection.match(regex);
        if (matches) {
          relevanceScore += matches.length;
        }
      });

      // Only include posts with relevance score > 0
      if (relevanceScore > 0) {
        // Extract a title from the first sentence or use a generic one
        const sentences = section.trim().split(/[.!?]+/);
        const title = sentences[0]?.trim().substring(0, 100) || 'Immigration Experience';
        
        posts.push({
          content: section.trim(),
          title: title + (title.length === 100 ? '...' : ''),
          relevanceScore
        });
      }
    });

    // Sort by relevance score and return top posts
    return posts.sort((a, b) => b.relevanceScore - a.relevanceScore).slice(0, 10);
  }
}
