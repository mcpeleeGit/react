export interface Author {
  id: number;
  name: string;
}

export interface BlogPost {
  id: number;
  title: string;
  content: string;
  created_at: string;
  author: Author;
}

export interface BlogListResponse {
  posts: BlogPost[];
}

export interface BlogApiResponse {
  status: 'success' | 'error';
  message: string;
  data?: BlogListResponse;
  error_code?: string;
} 