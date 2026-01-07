
export interface Post {
  id: string;
  authorName: string;
  authorUsername: string;
  authorImage: string;
  isVerified: boolean;
  timestamp: string;
  content: string;
  images?: string[];
  videoEmbed?: string; // New property for video iframes/embeds
  likes: number;
  comments: number;
}

export interface DailyMessage {
  text: string;
  type: 'greeting' | 'news' | 'motivation';
}
