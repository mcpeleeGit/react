export interface BlogAuthor {
  id: number;
  name: string;
}

export interface BlogPost {
  id: number;
  title: string;
  content: string;
  created_at: string;
  author: BlogAuthor;
}

export interface BlogListResponse {
  posts: BlogPost[];
  total: number;
  page: number;
  limit: number;
}

export interface BlogCreateRequest {
  title: string;
  content: string;
}

export interface BlogUpdateRequest {
  id: number;
  title: string;
  content: string;
} 