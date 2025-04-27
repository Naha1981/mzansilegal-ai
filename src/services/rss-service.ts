import Parser from 'rss-parser';
import type { Item } from 'rss-parser';

// Define the structure for a news item we care about
export interface NewsItem {
  title?: string;
  link?: string;
  contentSnippet?: string; // Often a short summary
  isoDate?: string; // Publication date
  source?: string; // The name of the feed source
}

// Custom fields we might encounter
interface CustomItem extends Item {
  // Add any custom fields if needed, e.g., 'media:content': unknown;
}

/**
 * Fetches and parses news items from a list of RSS feed URLs.
 * @param urls An array of RSS feed URLs.
 * @returns A promise that resolves to an array of NewsItem objects.
 */
export async function fetchRssNews(urls: string[]): Promise<NewsItem[]> {
  const parser = new Parser<object, CustomItem>(); // Use custom item type if needed
  const allNewsItems: NewsItem[] = [];
  const fetchPromises = urls.map(async (url) => {
    try {
      const feed = await parser.parseURL(url);
      const sourceName = feed.title || url; // Use feed title or URL as source name
      console.log(`Fetched ${feed.items.length} items from ${sourceName}`); // Log fetching success

      feed.items.forEach((item) => {
        // Basic filtering: Ensure item has a title and link
        if (item.title && item.link) {
          allNewsItems.push({
            title: item.title,
            link: item.link,
            contentSnippet: item.contentSnippet?.substring(0, 200), // Limit snippet length
            isoDate: item.isoDate || item.pubDate,
            source: sourceName,
          });
        }
      });
    } catch (error) {
      console.error(`Error fetching or parsing RSS feed from ${url}:`, error);
      // Optionally, you could return a specific error indicator or just skip this feed
    }
  });

  await Promise.all(fetchPromises);

  // Optional: Sort news items by date, newest first
  allNewsItems.sort((a, b) => {
    const dateA = a.isoDate ? new Date(a.isoDate).getTime() : 0;
    const dateB = b.isoDate ? new Date(b.isoDate).getTime() : 0;
    return dateB - dateA; // Descending order
  });

  console.log(`Returning ${allNewsItems.length} total sorted news items.`); // Log total items
  // Optional: Limit the total number of news items returned
  // return allNewsItems.slice(0, 10); // Example: Return top 10 newest

  return allNewsItems;
}
