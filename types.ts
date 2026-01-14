
export interface Post {
  id: string;
  authorName: string;
  authorUsername: string;
  authorImage: string;
  isVerified: boolean;
  timestamp: string;
  content: string;
  images?: string[];
  videoEmbed?: string;
  likes: number;
  hasLiked?: boolean; // Nuevo: rastrear si el usuario actual dio like
  comments: number;
}

export interface Candidate {
  id: string;
  name: string;
  location: string;
  image: string;
}

export interface DailyMessage {
  text: string;
  type: 'greeting' | 'news' | 'motivation';
}
