export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      activities: {
        Row: {
          activity_type: string
          created_at: string | null
          entity_id: string
          entity_type: string
          id: string
          metadata: Json | null
          user_id: string | null
        }
        Insert: {
          activity_type: string
          created_at?: string | null
          entity_id: string
          entity_type: string
          id?: string
          metadata?: Json | null
          user_id?: string | null
        }
        Update: {
          activity_type?: string
          created_at?: string | null
          entity_id?: string
          entity_type?: string
          id?: string
          metadata?: Json | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "activities_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      authors: {
        Row: {
          bio: string | null
          created_at: string | null
          id: string
          name: string
          photo: string | null
          updated_at: string | null
          user_id: string | null
          verified: boolean | null
        }
        Insert: {
          bio?: string | null
          created_at?: string | null
          id?: string
          name: string
          photo?: string | null
          updated_at?: string | null
          user_id?: string | null
          verified?: boolean | null
        }
        Update: {
          bio?: string | null
          created_at?: string | null
          id?: string
          name?: string
          photo?: string | null
          updated_at?: string | null
          user_id?: string | null
          verified?: boolean | null
        }
        Relationships: [
          {
            foreignKeyName: "authors_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      book_authors: {
        Row: {
          author_id: string | null
          book_id: string | null
          created_at: string | null
          id: string
          role: string | null
          updated_at: string | null
        }
        Insert: {
          author_id?: string | null
          book_id?: string | null
          created_at?: string | null
          id?: string
          role?: string | null
          updated_at?: string | null
        }
        Update: {
          author_id?: string | null
          book_id?: string | null
          created_at?: string | null
          id?: string
          role?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "book_authors_author_id_fkey"
            columns: ["author_id"]
            isOneToOne: false
            referencedRelation: "authors"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "book_authors_book_id_fkey"
            columns: ["book_id"]
            isOneToOne: false
            referencedRelation: "books"
            referencedColumns: ["id"]
          },
        ]
      }
      book_genres: {
        Row: {
          book_id: string | null
          created_at: string | null
          genre_id: string | null
          id: string
          updated_at: string | null
        }
        Insert: {
          book_id?: string | null
          created_at?: string | null
          genre_id?: string | null
          id?: string
          updated_at?: string | null
        }
        Update: {
          book_id?: string | null
          created_at?: string | null
          genre_id?: string | null
          id?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "book_genres_book_id_fkey"
            columns: ["book_id"]
            isOneToOne: false
            referencedRelation: "books"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "book_genres_genre_id_fkey"
            columns: ["genre_id"]
            isOneToOne: false
            referencedRelation: "genres"
            referencedColumns: ["id"]
          },
        ]
      }
      book_metadata: {
        Row: {
          book_id: string
          created_at: string | null
          data_source: string | null
          google_books_id: string | null
          id: string
          metadata: Json | null
          updated_at: string | null
        }
        Insert: {
          book_id: string
          created_at?: string | null
          data_source?: string | null
          google_books_id?: string | null
          id?: string
          metadata?: Json | null
          updated_at?: string | null
        }
        Update: {
          book_id?: string
          created_at?: string | null
          data_source?: string | null
          google_books_id?: string | null
          id?: string
          metadata?: Json | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "book_metadata_book_id_fkey"
            columns: ["book_id"]
            isOneToOne: false
            referencedRelation: "books"
            referencedColumns: ["id"]
          },
        ]
      }
      book_publishers: {
        Row: {
          book_id: string | null
          created_at: string | null
          id: string
          publisher_id: string | null
          updated_at: string | null
        }
        Insert: {
          book_id?: string | null
          created_at?: string | null
          id?: string
          publisher_id?: string | null
          updated_at?: string | null
        }
        Update: {
          book_id?: string | null
          created_at?: string | null
          id?: string
          publisher_id?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "book_publishers_book_id_fkey"
            columns: ["book_id"]
            isOneToOne: false
            referencedRelation: "books"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "book_publishers_publisher_id_fkey"
            columns: ["publisher_id"]
            isOneToOne: false
            referencedRelation: "publishers"
            referencedColumns: ["id"]
          },
        ]
      }
      books: {
        Row: {
          cover_image: string | null
          created_at: string | null
          data_source: string | null
          description: string | null
          external_id: string | null
          google_average_rating: number | null
          google_ratings_count: number | null
          id: string
          isbn: string | null
          language: string | null
          openlibrary_key: string | null
          page_count: number | null
          publish_date: string | null
          search_vector: unknown | null
          subjects: string[] | null
          title: string
          updated_at: string | null
        }
        Insert: {
          cover_image?: string | null
          created_at?: string | null
          data_source?: string | null
          description?: string | null
          external_id?: string | null
          google_average_rating?: number | null
          google_ratings_count?: number | null
          id?: string
          isbn?: string | null
          language?: string | null
          openlibrary_key?: string | null
          page_count?: number | null
          publish_date?: string | null
          search_vector?: unknown | null
          subjects?: string[] | null
          title: string
          updated_at?: string | null
        }
        Update: {
          cover_image?: string | null
          created_at?: string | null
          data_source?: string | null
          description?: string | null
          external_id?: string | null
          google_average_rating?: number | null
          google_ratings_count?: number | null
          id?: string
          isbn?: string | null
          language?: string | null
          openlibrary_key?: string | null
          page_count?: number | null
          publish_date?: string | null
          search_vector?: unknown | null
          subjects?: string[] | null
          title?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      comments: {
        Row: {
          content: string
          created_at: string | null
          entity_id: string
          entity_type: string
          id: string
          updated_at: string | null
          user_id: string | null
        }
        Insert: {
          content: string
          created_at?: string | null
          entity_id: string
          entity_type: string
          id?: string
          updated_at?: string | null
          user_id?: string | null
        }
        Update: {
          content?: string
          created_at?: string | null
          entity_id?: string
          entity_type?: string
          id?: string
          updated_at?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "comments_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      follows: {
        Row: {
          created_at: string | null
          follower_id: string | null
          following_id: string | null
          id: string
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          follower_id?: string | null
          following_id?: string | null
          id?: string
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          follower_id?: string | null
          following_id?: string | null
          id?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "follows_follower_id_fkey"
            columns: ["follower_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "follows_following_id_fkey"
            columns: ["following_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      genres: {
        Row: {
          created_at: string | null
          description: string | null
          id: string
          name: string
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          description?: string | null
          id?: string
          name: string
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          description?: string | null
          id?: string
          name?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      group_books: {
        Row: {
          book_id: string | null
          created_at: string | null
          end_date: string | null
          group_id: string | null
          id: string
          start_date: string | null
          updated_at: string | null
        }
        Insert: {
          book_id?: string | null
          created_at?: string | null
          end_date?: string | null
          group_id?: string | null
          id?: string
          start_date?: string | null
          updated_at?: string | null
        }
        Update: {
          book_id?: string | null
          created_at?: string | null
          end_date?: string | null
          group_id?: string | null
          id?: string
          start_date?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "group_books_book_id_fkey"
            columns: ["book_id"]
            isOneToOne: false
            referencedRelation: "books"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "group_books_group_id_fkey"
            columns: ["group_id"]
            isOneToOne: false
            referencedRelation: "groups"
            referencedColumns: ["id"]
          },
        ]
      }
      group_discussions: {
        Row: {
          content: string
          created_at: string | null
          created_by: string | null
          group_id: string | null
          id: string
          title: string
          updated_at: string | null
        }
        Insert: {
          content: string
          created_at?: string | null
          created_by?: string | null
          group_id?: string | null
          id?: string
          title: string
          updated_at?: string | null
        }
        Update: {
          content?: string
          created_at?: string | null
          created_by?: string | null
          group_id?: string | null
          id?: string
          title?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "group_discussions_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "group_discussions_group_id_fkey"
            columns: ["group_id"]
            isOneToOne: false
            referencedRelation: "groups"
            referencedColumns: ["id"]
          },
        ]
      }
      group_members: {
        Row: {
          created_at: string | null
          group_id: string | null
          id: string
          joined_at: string | null
          role: Database["public"]["Enums"]["role_type"] | null
          updated_at: string | null
          user_id: string | null
        }
        Insert: {
          created_at?: string | null
          group_id?: string | null
          id?: string
          joined_at?: string | null
          role?: Database["public"]["Enums"]["role_type"] | null
          updated_at?: string | null
          user_id?: string | null
        }
        Update: {
          created_at?: string | null
          group_id?: string | null
          id?: string
          joined_at?: string | null
          role?: Database["public"]["Enums"]["role_type"] | null
          updated_at?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "group_members_group_id_fkey"
            columns: ["group_id"]
            isOneToOne: false
            referencedRelation: "groups"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "group_members_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      group_messages: {
        Row: {
          content: string
          created_at: string | null
          group_id: string | null
          id: string
          updated_at: string | null
          user_id: string | null
        }
        Insert: {
          content: string
          created_at?: string | null
          group_id?: string | null
          id?: string
          updated_at?: string | null
          user_id?: string | null
        }
        Update: {
          content?: string
          created_at?: string | null
          group_id?: string | null
          id?: string
          updated_at?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "group_messages_group_id_fkey"
            columns: ["group_id"]
            isOneToOne: false
            referencedRelation: "groups"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "group_messages_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      groups: {
        Row: {
          cover_image: string | null
          created_at: string | null
          created_by: string | null
          description: string | null
          id: string
          name: string
          privacy_level: Database["public"]["Enums"]["privacy_level"] | null
          updated_at: string | null
        }
        Insert: {
          cover_image?: string | null
          created_at?: string | null
          created_by?: string | null
          description?: string | null
          id?: string
          name: string
          privacy_level?: Database["public"]["Enums"]["privacy_level"] | null
          updated_at?: string | null
        }
        Update: {
          cover_image?: string | null
          created_at?: string | null
          created_by?: string | null
          description?: string | null
          id?: string
          name?: string
          privacy_level?: Database["public"]["Enums"]["privacy_level"] | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "groups_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      history: {
        Row: {
          created_at: string
          day_slot: string
          dosage_scheduled: number
          id: string
          supplement_id: string
          taken: boolean | null
          taken_at: string | null
          taken_date: string
          timing: string
          unit_scheduled: string | null
        }
        Insert: {
          created_at?: string
          day_slot: string
          dosage_scheduled: number
          id?: string
          supplement_id: string
          taken?: boolean | null
          taken_at?: string | null
          taken_date: string
          timing: string
          unit_scheduled?: string | null
        }
        Update: {
          created_at?: string
          day_slot?: string
          dosage_scheduled?: number
          id?: string
          supplement_id?: string
          taken?: boolean | null
          taken_at?: string | null
          taken_date?: string
          timing?: string
          unit_scheduled?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "history_supplement_id_fkey"
            columns: ["supplement_id"]
            isOneToOne: false
            referencedRelation: "supplements"
            referencedColumns: ["id"]
          },
        ]
      }
      notifications: {
        Row: {
          created_at: string
          day_slot: string | null
          id: string
          is_enabled: boolean | null
          message: string | null
          notification_time: string
        }
        Insert: {
          created_at?: string
          day_slot?: string | null
          id?: string
          is_enabled?: boolean | null
          message?: string | null
          notification_time: string
        }
        Update: {
          created_at?: string
          day_slot?: string | null
          id?: string
          is_enabled?: boolean | null
          message?: string | null
          notification_time?: string
        }
        Relationships: []
      }
      publishers: {
        Row: {
          created_at: string | null
          description: string | null
          id: string
          name: string
          updated_at: string | null
          website: string | null
        }
        Insert: {
          created_at?: string | null
          description?: string | null
          id?: string
          name: string
          updated_at?: string | null
          website?: string | null
        }
        Update: {
          created_at?: string | null
          description?: string | null
          id?: string
          name?: string
          updated_at?: string | null
          website?: string | null
        }
        Relationships: []
      }
      reactions: {
        Row: {
          created_at: string | null
          entity_id: string
          entity_type: string
          id: string
          reaction_type: string
          updated_at: string | null
          user_id: string | null
        }
        Insert: {
          created_at?: string | null
          entity_id: string
          entity_type: string
          id?: string
          reaction_type: string
          updated_at?: string | null
          user_id?: string | null
        }
        Update: {
          created_at?: string | null
          entity_id?: string
          entity_type?: string
          id?: string
          reaction_type?: string
          updated_at?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "reactions_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      recommendations: {
        Row: {
          algorithm: string
          book_id: string | null
          created_at: string | null
          id: string
          reason: string | null
          score: number | null
          updated_at: string | null
          user_id: string | null
        }
        Insert: {
          algorithm: string
          book_id?: string | null
          created_at?: string | null
          id?: string
          reason?: string | null
          score?: number | null
          updated_at?: string | null
          user_id?: string | null
        }
        Update: {
          algorithm?: string
          book_id?: string | null
          created_at?: string | null
          id?: string
          reason?: string | null
          score?: number | null
          updated_at?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "recommendations_book_id_fkey"
            columns: ["book_id"]
            isOneToOne: false
            referencedRelation: "books"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "recommendations_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      schedule: {
        Row: {
          created_at: string
          day_slot: string
          dosage: number
          id: string
          notes: string | null
          supplement_id: string
          timing: string
          week_number: number
        }
        Insert: {
          created_at?: string
          day_slot: string
          dosage: number
          id?: string
          notes?: string | null
          supplement_id: string
          timing: string
          week_number: number
        }
        Update: {
          created_at?: string
          day_slot?: string
          dosage?: number
          id?: string
          notes?: string | null
          supplement_id?: string
          timing?: string
          week_number?: number
        }
        Relationships: [
          {
            foreignKeyName: "schedule_supplement_id_fkey"
            columns: ["supplement_id"]
            isOneToOne: false
            referencedRelation: "supplements"
            referencedColumns: ["id"]
          },
        ]
      }
      shelf_books: {
        Row: {
          added_at: string | null
          book_id: string | null
          created_at: string | null
          id: string
          shelf_id: string | null
          updated_at: string | null
        }
        Insert: {
          added_at?: string | null
          book_id?: string | null
          created_at?: string | null
          id?: string
          shelf_id?: string | null
          updated_at?: string | null
        }
        Update: {
          added_at?: string | null
          book_id?: string | null
          created_at?: string | null
          id?: string
          shelf_id?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "shelf_books_book_id_fkey"
            columns: ["book_id"]
            isOneToOne: false
            referencedRelation: "books"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "shelf_books_shelf_id_fkey"
            columns: ["shelf_id"]
            isOneToOne: false
            referencedRelation: "shelves"
            referencedColumns: ["id"]
          },
        ]
      }
      shelves: {
        Row: {
          created_at: string | null
          description: string | null
          id: string
          name: string
          privacy_level: Database["public"]["Enums"]["privacy_level"] | null
          updated_at: string | null
          user_id: string | null
        }
        Insert: {
          created_at?: string | null
          description?: string | null
          id?: string
          name: string
          privacy_level?: Database["public"]["Enums"]["privacy_level"] | null
          updated_at?: string | null
          user_id?: string | null
        }
        Update: {
          created_at?: string | null
          description?: string | null
          id?: string
          name?: string
          privacy_level?: Database["public"]["Enums"]["privacy_level"] | null
          updated_at?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "shelves_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      supplements: {
        Row: {
          created_at: string
          default_unit: string | null
          id: string
          name: string
        }
        Insert: {
          created_at?: string
          default_unit?: string | null
          id?: string
          name: string
        }
        Update: {
          created_at?: string
          default_unit?: string | null
          id?: string
          name?: string
        }
        Relationships: []
      }
      user_books: {
        Row: {
          book_id: string | null
          created_at: string | null
          finish_date: string | null
          id: string
          progress: number | null
          rating: number | null
          review: string | null
          start_date: string | null
          status: Database["public"]["Enums"]["reading_status"] | null
          updated_at: string | null
          user_id: string | null
        }
        Insert: {
          book_id?: string | null
          created_at?: string | null
          finish_date?: string | null
          id?: string
          progress?: number | null
          rating?: number | null
          review?: string | null
          start_date?: string | null
          status?: Database["public"]["Enums"]["reading_status"] | null
          updated_at?: string | null
          user_id?: string | null
        }
        Update: {
          book_id?: string | null
          created_at?: string | null
          finish_date?: string | null
          id?: string
          progress?: number | null
          rating?: number | null
          review?: string | null
          start_date?: string | null
          status?: Database["public"]["Enums"]["reading_status"] | null
          updated_at?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "user_books_book_id_fkey"
            columns: ["book_id"]
            isOneToOne: false
            referencedRelation: "books"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "user_books_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      user_preferences: {
        Row: {
          created_at: string | null
          genre_id: string | null
          id: string
          updated_at: string | null
          user_id: string | null
          weight: number | null
        }
        Insert: {
          created_at?: string | null
          genre_id?: string | null
          id?: string
          updated_at?: string | null
          user_id?: string | null
          weight?: number | null
        }
        Update: {
          created_at?: string | null
          genre_id?: string | null
          id?: string
          updated_at?: string | null
          user_id?: string | null
          weight?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "user_preferences_genre_id_fkey"
            columns: ["genre_id"]
            isOneToOne: false
            referencedRelation: "genres"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "user_preferences_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      users: {
        Row: {
          avatar_url: string | null
          bio: string | null
          created_at: string | null
          display_name: string | null
          id: string
          preferences: Json | null
          updated_at: string | null
          username: string
        }
        Insert: {
          avatar_url?: string | null
          bio?: string | null
          created_at?: string | null
          display_name?: string | null
          id: string
          preferences?: Json | null
          updated_at?: string | null
          username: string
        }
        Update: {
          avatar_url?: string | null
          bio?: string | null
          created_at?: string | null
          display_name?: string | null
          id?: string
          preferences?: Json | null
          updated_at?: string | null
          username?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      update_user_recommendations: {
        Args: { user_id: string }
        Returns: undefined
      }
    }
    Enums: {
      privacy_level: "public" | "private" | "friends_only"
      reading_status: "want_to_read" | "currently_reading" | "read" | "dnf"
      role_type: "admin" | "moderator" | "member"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DefaultSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      privacy_level: ["public", "private", "friends_only"],
      reading_status: ["want_to_read", "currently_reading", "read", "dnf"],
      role_type: ["admin", "moderator", "member"],
    },
  },
} as const
