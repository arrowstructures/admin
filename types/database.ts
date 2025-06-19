export interface Database {
  public: {
    Tables: {
      blogs: {
        Row: {
          id: string
          title: string
          excerpt: string
          content: string
          image: string
          category: string
          tag: string
          featured_post: boolean
          publish_immediately: boolean
          created_at: string
        }
        Insert: {
          id?: string
          title: string
          excerpt: string
          content: string
          image: string
          category: string
          tag: string
          featured_post?: boolean
          publish_immediately?: boolean
          created_at?: string
        }
        Update: {
          id?: string
          title?: string
          excerpt?: string
          content?: string
          image?: string
          category?: string
          tag?: string
          featured_post?: boolean
          publish_immediately?: boolean
          created_at?: string
        }
      }
      news: {
        Row: {
          id: string
          headline: string
          summary: string
          content: string
          image: string
          featured_news: boolean
          publish_immediately: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          headline: string
          summary: string
          content: string
          image: string
          featured_news?: boolean
          publish_immediately?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          headline?: string
          summary?: string
          content?: string
          image?: string
          featured_news?: boolean
          publish_immediately?: boolean
          created_at?: string
          updated_at?: string
        }
      }
      articles: {
        Row: {
          id: string
          title: string
          slug: string
          content: string | null
          thumbnail_path: string | null
          category: string
          author: string
          views: number
          status: "published" | "draft" | "scheduled"
          is_breaking: boolean
          created_at: string
          user_id: string
        }
        Insert: {
          id?: string
          title: string
          slug: string
          content?: string | null
          thumbnail_path?: string | null
          category: string
          author: string
          views?: number
          status: "published" | "draft" | "scheduled"
          is_breaking?: boolean
          created_at?: string
          user_id: string
        }
        Update: {
          id?: string
          title?: string
          slug?: string
          content?: string | null
          thumbnail_path?: string | null
          category?: string
          author?: string
          views?: number
          status?: "published" | "draft" | "scheduled"
          is_breaking?: boolean
          created_at?: string
          user_id?: string
        }
      }
      clients: {
        Row: {
          id: string
          client_name: string
          email: string
          mobile_number: string
          client_logo_url: string
          location: string
          company_name: string
          created_at: string
        }
        Insert: {
          id?: string
          client_name: string
          email: string
          mobile_number: string
          client_logo_url: string
          location: string
          company_name: string
          created_at?: string
        }
        Update: {
          id?: string
          client_name?: string
          email?: string
          mobile_number?: string
          client_logo_url?: string
          location?: string
          company_name?: string
          created_at?: string
        }
      }
      careers: {
        Row: {
          id: string
          job_title: string
          department: string
          location: string
          job_type: string
          job_description: string
          requirements: string
          benefits: string
          min_salary: number
          max_salary: number
          remote_work_available: boolean
          publish_immediately: boolean
          created_at: string
        }
        Insert: {
          id?: string
          job_title: string
          department: string
          location: string
          job_type: string
          job_description: string
          requirements: string
          benefits: string
          min_salary: number
          max_salary: number
          remote_work_available?: boolean
          publish_immediately?: boolean
          created_at?: string
        }
        Update: {
          id?: string
          job_title?: string
          department?: string
          location?: string
          job_type?: string
          job_description?: string
          requirements?: string
          benefits?: string
          min_salary?: number
          max_salary?: number
          remote_work_available?: boolean
          publish_immediately?: boolean
          created_at?: string
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
  }
}
