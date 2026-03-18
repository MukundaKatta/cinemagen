export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string;
          email: string;
          full_name: string | null;
          avatar_url: string | null;
          credits: number;
          plan: 'free' | 'pro' | 'studio';
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id: string;
          email: string;
          full_name?: string | null;
          avatar_url?: string | null;
          credits?: number;
          plan?: 'free' | 'pro' | 'studio';
        };
        Update: {
          full_name?: string | null;
          avatar_url?: string | null;
          credits?: number;
          plan?: 'free' | 'pro' | 'studio';
        };
      };
      projects: {
        Row: {
          id: string;
          user_id: string;
          name: string;
          description: string;
          export_preset: string;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          name: string;
          description?: string;
          export_preset?: string;
        };
        Update: {
          name?: string;
          description?: string;
          export_preset?: string;
          updated_at?: string;
        };
      };
      generation_jobs: {
        Row: {
          id: string;
          project_id: string;
          user_id: string;
          prompt_data: Record<string, unknown>;
          status: string;
          progress: number;
          video_url: string | null;
          thumbnail_url: string | null;
          cost: number;
          error: string | null;
          created_at: string;
          completed_at: string | null;
        };
        Insert: {
          id?: string;
          project_id: string;
          user_id: string;
          prompt_data: Record<string, unknown>;
          status?: string;
          progress?: number;
          cost?: number;
        };
        Update: {
          status?: string;
          progress?: number;
          video_url?: string | null;
          thumbnail_url?: string | null;
          cost?: number;
          error?: string | null;
          completed_at?: string | null;
        };
      };
      video_clips: {
        Row: {
          id: string;
          project_id: string;
          job_id: string;
          name: string;
          video_url: string;
          thumbnail_url: string;
          duration: number;
          width: number;
          height: number;
          fps: number;
          clip_order: number;
          transition_type: string;
          transition_duration: number;
          trim_start: number;
          trim_end: number;
          audio_track_data: Record<string, unknown> | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          project_id: string;
          job_id: string;
          name: string;
          video_url: string;
          thumbnail_url: string;
          duration: number;
          width?: number;
          height?: number;
          fps?: number;
          clip_order?: number;
          transition_type?: string;
          transition_duration?: number;
          trim_start?: number;
          trim_end?: number;
          audio_track_data?: Record<string, unknown> | null;
        };
        Update: {
          name?: string;
          clip_order?: number;
          transition_type?: string;
          transition_duration?: number;
          trim_start?: number;
          trim_end?: number;
          audio_track_data?: Record<string, unknown> | null;
        };
      };
      characters: {
        Row: {
          id: string;
          project_id: string;
          name: string;
          description: string;
          reference_images: string[];
          embedding: number[] | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          project_id: string;
          name: string;
          description: string;
          reference_images?: string[];
        };
        Update: {
          name?: string;
          description?: string;
          reference_images?: string[];
          embedding?: number[] | null;
        };
      };
      scripts: {
        Row: {
          id: string;
          project_id: string;
          title: string;
          raw_text: string;
          scenes_data: Record<string, unknown>[];
          created_at: string;
        };
        Insert: {
          id?: string;
          project_id: string;
          title: string;
          raw_text: string;
          scenes_data?: Record<string, unknown>[];
        };
        Update: {
          title?: string;
          raw_text?: string;
          scenes_data?: Record<string, unknown>[];
        };
      };
    };
  };
}
