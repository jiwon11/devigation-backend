// Generated types from Supabase CLI
// Run: npx supabase gen types typescript --project-id <project-id> > supabase.types.ts

export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export interface Database {
  public: {
    Tables: {
      users: {
        Row: {
          id: string;
          email: string;
          username: string;
          display_name: string | null;
          bio: string | null;
          avatar_url: string | null;
          github_url: string | null;
          website_url: string | null;
          location: string | null;
          company: string | null;
          role: string;
          status: string;
          providers: string[];
          provider_id: string | null;
          follower_count: number;
          following_count: number;
          roadmap_count: number;
          post_count: number;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          email: string;
          username: string;
          display_name?: string | null;
          bio?: string | null;
          avatar_url?: string | null;
          github_url?: string | null;
          website_url?: string | null;
          location?: string | null;
          company?: string | null;
          role?: string;
          status?: string;
          providers?: string[];
          provider_id?: string | null;
          follower_count?: number;
          following_count?: number;
          roadmap_count?: number;
          post_count?: number;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          email?: string;
          username?: string;
          display_name?: string | null;
          bio?: string | null;
          avatar_url?: string | null;
          github_url?: string | null;
          website_url?: string | null;
          location?: string | null;
          company?: string | null;
          role?: string;
          status?: string;
          providers?: string[];
          provider_id?: string | null;
          follower_count?: number;
          following_count?: number;
          roadmap_count?: number;
          post_count?: number;
          created_at?: string;
          updated_at?: string;
        };
      };
      roadmaps: {
        Row: {
          id: string;
          title: string;
          description: string | null;
          category: string;
          visibility: string;
          author_id: string;
          thumbnail_url: string | null;
          tags: string[];
          forked_from_id: string | null;
          star_count: number;
          fork_count: number;
          view_count: number;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          title: string;
          description?: string | null;
          category: string;
          visibility?: string;
          author_id: string;
          thumbnail_url?: string | null;
          tags?: string[];
          forked_from_id?: string | null;
          star_count?: number;
          fork_count?: number;
          view_count?: number;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          title?: string;
          description?: string | null;
          category?: string;
          visibility?: string;
          author_id?: string;
          thumbnail_url?: string | null;
          tags?: string[];
          forked_from_id?: string | null;
          star_count?: number;
          fork_count?: number;
          view_count?: number;
          created_at?: string;
          updated_at?: string;
        };
      };
      posts: {
        Row: {
          id: string;
          title: string;
          slug: string;
          content: string;
          excerpt: string | null;
          thumbnail_url: string | null;
          author_id: string;
          roadmap_id: string | null;
          node_id: string | null;
          status: string;
          read_time: number;
          tags: string[];
          like_count: number;
          comment_count: number;
          view_count: number;
          published_at: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          title: string;
          slug: string;
          content: string;
          excerpt?: string | null;
          thumbnail_url?: string | null;
          author_id: string;
          roadmap_id?: string | null;
          node_id?: string | null;
          status?: string;
          read_time?: number;
          tags?: string[];
          like_count?: number;
          comment_count?: number;
          view_count?: number;
          published_at?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          title?: string;
          slug?: string;
          content?: string;
          excerpt?: string | null;
          thumbnail_url?: string | null;
          author_id?: string;
          roadmap_id?: string | null;
          node_id?: string | null;
          status?: string;
          read_time?: number;
          tags?: string[];
          like_count?: number;
          comment_count?: number;
          view_count?: number;
          published_at?: string | null;
          created_at?: string;
          updated_at?: string;
        };
      };
    };
    Views: Record<string, never>;
    Functions: Record<string, never>;
    Enums: Record<string, never>;
  };
}