export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "14.1";
  };
  public: {
    Tables: {
      abg_records: {
        Row: {
          anion_gap: number | null;
          base_excess: number | null;
          compensation: string | null;
          created_at: string;
          fio2: number | null;
          hco3: number | null;
          id: string;
          interpretation: string | null;
          lactate: number | null;
          notes: string | null;
          paco2: number | null;
          pao2: number | null;
          patient_id: string | null;
          pf_ratio: number | null;
          ph: number | null;
          primary_disorder: string | null;
          record_date: string;
          sao2: number | null;
          updated_at: string;
          user_id: string | null;
        };
        Insert: {
          anion_gap?: number | null;
          base_excess?: number | null;
          compensation?: string | null;
          created_at?: string;
          fio2?: number | null;
          hco3?: number | null;
          id?: string;
          interpretation?: string | null;
          lactate?: number | null;
          notes?: string | null;
          paco2?: number | null;
          pao2?: number | null;
          patient_id?: string | null;
          pf_ratio?: number | null;
          ph?: number | null;
          primary_disorder?: string | null;
          record_date?: string;
          sao2?: number | null;
          updated_at?: string;
          user_id?: string | null;
        };
        Update: {
          anion_gap?: number | null;
          base_excess?: number | null;
          compensation?: string | null;
          created_at?: string;
          fio2?: number | null;
          hco3?: number | null;
          id?: string;
          interpretation?: string | null;
          lactate?: number | null;
          notes?: string | null;
          paco2?: number | null;
          pao2?: number | null;
          patient_id?: string | null;
          pf_ratio?: number | null;
          ph?: number | null;
          primary_disorder?: string | null;
          record_date?: string;
          sao2?: number | null;
          updated_at?: string;
          user_id?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: "abg_records_patient_id_fkey";
            columns: ["patient_id"];
            isOneToOne: false;
            referencedRelation: "patients";
            referencedColumns: ["id"];
          },
        ];
      };
      ai_chat_messages: {
        Row: {
          content: string;
          created_at: string;
          id: string;
          metadata: Json | null;
          referenced_document_ids: Json | null;
          referenced_record_ids: Json | null;
          role: string;
          session_id: string;
        };
        Insert: {
          content: string;
          created_at?: string;
          id?: string;
          metadata?: Json | null;
          referenced_document_ids?: Json | null;
          referenced_record_ids?: Json | null;
          role?: string;
          session_id: string;
        };
        Update: {
          content?: string;
          created_at?: string;
          id?: string;
          metadata?: Json | null;
          referenced_document_ids?: Json | null;
          referenced_record_ids?: Json | null;
          role?: string;
          session_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: "ai_chat_messages_session_id_fkey";
            columns: ["session_id"];
            isOneToOne: false;
            referencedRelation: "ai_chat_sessions";
            referencedColumns: ["id"];
          },
        ];
      };
      ai_chat_sessions: {
        Row: {
          context_metadata: Json | null;
          created_at: string;
          id: string;
          patient_id: string | null;
          session_type: string;
          title: string | null;
          updated_at: string;
          user_id: string | null;
        };
        Insert: {
          context_metadata?: Json | null;
          created_at?: string;
          id?: string;
          patient_id?: string | null;
          session_type?: string;
          title?: string | null;
          updated_at?: string;
          user_id?: string | null;
        };
        Update: {
          context_metadata?: Json | null;
          created_at?: string;
          id?: string;
          patient_id?: string | null;
          session_type?: string;
          title?: string | null;
          updated_at?: string;
          user_id?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: "ai_chat_sessions_patient_id_fkey";
            columns: ["patient_id"];
            isOneToOne: false;
            referencedRelation: "patients";
            referencedColumns: ["id"];
          },
        ];
      };
      ai_predictions: {
        Row: {
          confidence_level: string | null;
          created_at: string;
          examination_id: string | null;
          final_findings: Json | null;
          final_interpretation: string | null;
          id: string;
          image_url: string;
          model_used: string;
          operator: string | null;
          raw_response: Json | null;
          status: string;
          suggested_findings: Json;
          suggested_interpretation: string | null;
          suggested_pattern: string | null;
          suggested_zone_score: number | null;
          updated_at: string;
        };
        Insert: {
          confidence_level?: string | null;
          created_at?: string;
          examination_id?: string | null;
          final_findings?: Json | null;
          final_interpretation?: string | null;
          id?: string;
          image_url: string;
          model_used?: string;
          operator?: string | null;
          raw_response?: Json | null;
          status?: string;
          suggested_findings?: Json;
          suggested_interpretation?: string | null;
          suggested_pattern?: string | null;
          suggested_zone_score?: number | null;
          updated_at?: string;
        };
        Update: {
          confidence_level?: string | null;
          created_at?: string;
          examination_id?: string | null;
          final_findings?: Json | null;
          final_interpretation?: string | null;
          id?: string;
          image_url?: string;
          model_used?: string;
          operator?: string | null;
          raw_response?: Json | null;
          status?: string;
          suggested_findings?: Json;
          suggested_interpretation?: string | null;
          suggested_pattern?: string | null;
          suggested_zone_score?: number | null;
          updated_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "ai_predictions_examination_id_fkey";
            columns: ["examination_id"];
            isOneToOne: false;
            referencedRelation: "lung_examinations";
            referencedColumns: ["id"];
          },
        ];
      };
      ai_training_queue: {
        Row: {
          created_at: string;
          file_id: string | null;
          id: string;
          label_status: string;
          notes: string | null;
          ready_for_training: boolean;
          source_record_id: string | null;
          source_type: string;
          training_version: string | null;
          updated_at: string;
          used_for_training: boolean;
        };
        Insert: {
          created_at?: string;
          file_id?: string | null;
          id?: string;
          label_status?: string;
          notes?: string | null;
          ready_for_training?: boolean;
          source_record_id?: string | null;
          source_type: string;
          training_version?: string | null;
          updated_at?: string;
          used_for_training?: boolean;
        };
        Update: {
          created_at?: string;
          file_id?: string | null;
          id?: string;
          label_status?: string;
          notes?: string | null;
          ready_for_training?: boolean;
          source_record_id?: string | null;
          source_type?: string;
          training_version?: string | null;
          updated_at?: string;
          used_for_training?: boolean;
        };
        Relationships: [
          {
            foreignKeyName: "ai_training_queue_file_id_fkey";
            columns: ["file_id"];
            isOneToOne: false;
            referencedRelation: "study_files";
            referencedColumns: ["id"];
          },
        ];
      };
      audit_logs: {
        Row: {
          action: string;
          created_at: string;
          entity_id: string | null;
          entity_type: string;
          id: string;
          ip_address: string | null;
          metadata: Json | null;
          user_email: string | null;
          user_id: string | null;
        };
        Insert: {
          action: string;
          created_at?: string;
          entity_id?: string | null;
          entity_type: string;
          id?: string;
          ip_address?: string | null;
          metadata?: Json | null;
          user_email?: string | null;
          user_id?: string | null;
        };
        Update: {
          action?: string;
          created_at?: string;
          entity_id?: string | null;
          entity_type?: string;
          id?: string;
          ip_address?: string | null;
          metadata?: Json | null;
          user_email?: string | null;
          user_id?: string | null;
        };
        Relationships: [];
      };
      clinical_alerts: {
        Row: {
          alert_type: string;
          created_at: string;
          description: string | null;
          id: string;
          is_dismissed: boolean;
          is_read: boolean;
          patient_id: string | null;
          severity: string;
          source_record_id: string | null;
          source_type: string | null;
          title: string;
          user_id: string | null;
        };
        Insert: {
          alert_type: string;
          created_at?: string;
          description?: string | null;
          id?: string;
          is_dismissed?: boolean;
          is_read?: boolean;
          patient_id?: string | null;
          severity?: string;
          source_record_id?: string | null;
          source_type?: string | null;
          title: string;
          user_id?: string | null;
        };
        Update: {
          alert_type?: string;
          created_at?: string;
          description?: string | null;
          id?: string;
          is_dismissed?: boolean;
          is_read?: boolean;
          patient_id?: string | null;
          severity?: string;
          source_record_id?: string | null;
          source_type?: string | null;
          title?: string;
          user_id?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: "clinical_alerts_patient_id_fkey";
            columns: ["patient_id"];
            isOneToOne: false;
            referencedRelation: "patients";
            referencedColumns: ["id"];
          },
        ];
      };
      clinical_labels: {
        Row: {
          created_at: string;
          file_id: string | null;
          id: string;
          label_category: string;
          label_metadata: Json | null;
          label_name: string;
          label_value: string | null;
          labeled_by: string | null;
          patient_id: string | null;
          source_record_id: string | null;
          source_type: string;
          updated_at: string;
          validation_status: string;
        };
        Insert: {
          created_at?: string;
          file_id?: string | null;
          id?: string;
          label_category?: string;
          label_metadata?: Json | null;
          label_name: string;
          label_value?: string | null;
          labeled_by?: string | null;
          patient_id?: string | null;
          source_record_id?: string | null;
          source_type?: string;
          updated_at?: string;
          validation_status?: string;
        };
        Update: {
          created_at?: string;
          file_id?: string | null;
          id?: string;
          label_category?: string;
          label_metadata?: Json | null;
          label_name?: string;
          label_value?: string | null;
          labeled_by?: string | null;
          patient_id?: string | null;
          source_record_id?: string | null;
          source_type?: string;
          updated_at?: string;
          validation_status?: string;
        };
        Relationships: [
          {
            foreignKeyName: "clinical_labels_file_id_fkey";
            columns: ["file_id"];
            isOneToOne: false;
            referencedRelation: "study_files";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "clinical_labels_patient_id_fkey";
            columns: ["patient_id"];
            isOneToOne: false;
            referencedRelation: "patients";
            referencedColumns: ["id"];
          },
        ];
      };
      document_chunks: {
        Row: {
          chunk_index: number;
          chunk_summary: string | null;
          chunk_text: string;
          created_at: string;
          document_id: string;
          embedding_status: string;
          id: string;
          metadata: Json | null;
        };
        Insert: {
          chunk_index?: number;
          chunk_summary?: string | null;
          chunk_text: string;
          created_at?: string;
          document_id: string;
          embedding_status?: string;
          id?: string;
          metadata?: Json | null;
        };
        Update: {
          chunk_index?: number;
          chunk_summary?: string | null;
          chunk_text?: string;
          created_at?: string;
          document_id?: string;
          embedding_status?: string;
          id?: string;
          metadata?: Json | null;
        };
        Relationships: [
          {
            foreignKeyName: "document_chunks_document_id_fkey";
            columns: ["document_id"];
            isOneToOne: false;
            referencedRelation: "knowledge_documents";
            referencedColumns: ["id"];
          },
        ];
      };
      institutional_connections: {
        Row: {
          auth_method: string;
          base_url: string | null;
          connection_status: string;
          created_at: string;
          id: string;
          institution_name: string;
          is_active: boolean;
          last_sync_at: string | null;
          metadata: Json | null;
          system_type: string;
          updated_at: string;
          user_id: string;
        };
        Insert: {
          auth_method?: string;
          base_url?: string | null;
          connection_status?: string;
          created_at?: string;
          id?: string;
          institution_name: string;
          is_active?: boolean;
          last_sync_at?: string | null;
          metadata?: Json | null;
          system_type?: string;
          updated_at?: string;
          user_id: string;
        };
        Update: {
          auth_method?: string;
          base_url?: string | null;
          connection_status?: string;
          created_at?: string;
          id?: string;
          institution_name?: string;
          is_active?: boolean;
          last_sync_at?: string | null;
          metadata?: Json | null;
          system_type?: string;
          updated_at?: string;
          user_id?: string;
        };
        Relationships: [];
      };
      knowledge_documents: {
        Row: {
          abstract: string | null;
          article_type: string | null;
          authors: string | null;
          citation_text: string | null;
          created_at: string;
          document_type: string;
          doi: string | null;
          file_url: string | null;
          id: string;
          import_source: string | null;
          is_public: boolean;
          journal: string | null;
          metadata_json: Json | null;
          publication_date: string | null;
          publication_year: number | null;
          pubmed_id: string | null;
          source: string | null;
          specialty_area: string;
          summary: string | null;
          tags: Json | null;
          title: string;
          updated_at: string;
          uploaded_by: string | null;
        };
        Insert: {
          abstract?: string | null;
          article_type?: string | null;
          authors?: string | null;
          citation_text?: string | null;
          created_at?: string;
          document_type?: string;
          doi?: string | null;
          file_url?: string | null;
          id?: string;
          import_source?: string | null;
          is_public?: boolean;
          journal?: string | null;
          metadata_json?: Json | null;
          publication_date?: string | null;
          publication_year?: number | null;
          pubmed_id?: string | null;
          source?: string | null;
          specialty_area?: string;
          summary?: string | null;
          tags?: Json | null;
          title: string;
          updated_at?: string;
          uploaded_by?: string | null;
        };
        Update: {
          abstract?: string | null;
          article_type?: string | null;
          authors?: string | null;
          citation_text?: string | null;
          created_at?: string;
          document_type?: string;
          doi?: string | null;
          file_url?: string | null;
          id?: string;
          import_source?: string | null;
          is_public?: boolean;
          journal?: string | null;
          metadata_json?: Json | null;
          publication_date?: string | null;
          publication_year?: number | null;
          pubmed_id?: string | null;
          source?: string | null;
          specialty_area?: string;
          summary?: string | null;
          tags?: Json | null;
          title?: string;
          updated_at?: string;
          uploaded_by?: string | null;
        };
        Relationships: [];
      };
      lung_examinations: {
        Row: {
          anatomical_line: string | null;
          created_at: string;
          exam_date: string;
          examiner: string | null;
          findings: Json;
          frequency: string | null;
          id: string;
          imaging_mode: string | null;
          intercostal_space: string | null;
          interpretation: string | null;
          lung_side: string | null;
          lus_scores: Json;
          lus_total: number | null;
          notes: string | null;
          patient_id: string;
          patient_position: string | null;
          transducer_type: string | null;
          updated_at: string;
          zone: string | null;
        };
        Insert: {
          anatomical_line?: string | null;
          created_at?: string;
          exam_date?: string;
          examiner?: string | null;
          findings?: Json;
          frequency?: string | null;
          id?: string;
          imaging_mode?: string | null;
          intercostal_space?: string | null;
          interpretation?: string | null;
          lung_side?: string | null;
          lus_scores?: Json;
          lus_total?: number | null;
          notes?: string | null;
          patient_id: string;
          patient_position?: string | null;
          transducer_type?: string | null;
          updated_at?: string;
          zone?: string | null;
        };
        Update: {
          anatomical_line?: string | null;
          created_at?: string;
          exam_date?: string;
          examiner?: string | null;
          findings?: Json;
          frequency?: string | null;
          id?: string;
          imaging_mode?: string | null;
          intercostal_space?: string | null;
          interpretation?: string | null;
          lung_side?: string | null;
          lus_scores?: Json;
          lus_total?: number | null;
          notes?: string | null;
          patient_id?: string;
          patient_position?: string | null;
          transducer_type?: string | null;
          updated_at?: string;
          zone?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: "lung_examinations_patient_id_fkey";
            columns: ["patient_id"];
            isOneToOne: false;
            referencedRelation: "patients";
            referencedColumns: ["id"];
          },
        ];
      };
      patients: {
        Row: {
          address: string | null;
          admission_date: string | null;
          admission_reason: string | null;
          age: number | null;
          bed_number: string | null;
          blood_pressure: string | null;
          clinical_notes: string | null;
          commune: string | null;
          comorbidities: string | null;
          created_at: string;
          deleted_at: string | null;
          deleted_by: string | null;
          email: string | null;
          establishment: string | null;
          external_id: string | null;
          heart_rate: number | null;
          height: number | null;
          hospital_id: string | null;
          icu_admission_date: string | null;
          id: string;
          initials: string | null;
          name: string;
          patient_position: string | null;
          patient_status: string | null;
          phone: string | null;
          prevision: string | null;
          primary_diagnosis: string | null;
          recent_abg: Json | null;
          respiratory_phenotype: string | null;
          respiratory_rate: number | null;
          respiratory_support: string | null;
          responsible_professional: string | null;
          rut: string | null;
          service_unit: string | null;
          sex: string | null;
          spo2: number | null;
          updated_at: string;
          user_id: string | null;
          ventilation_mode: string | null;
          visibility_type: string | null;
          weight: number | null;
        };
        Insert: {
          address?: string | null;
          admission_date?: string | null;
          admission_reason?: string | null;
          age?: number | null;
          bed_number?: string | null;
          blood_pressure?: string | null;
          clinical_notes?: string | null;
          commune?: string | null;
          comorbidities?: string | null;
          created_at?: string;
          deleted_at?: string | null;
          deleted_by?: string | null;
          email?: string | null;
          establishment?: string | null;
          external_id?: string | null;
          heart_rate?: number | null;
          height?: number | null;
          hospital_id?: string | null;
          icu_admission_date?: string | null;
          id?: string;
          initials?: string | null;
          name: string;
          patient_position?: string | null;
          patient_status?: string | null;
          phone?: string | null;
          prevision?: string | null;
          primary_diagnosis?: string | null;
          recent_abg?: Json | null;
          respiratory_phenotype?: string | null;
          respiratory_rate?: number | null;
          respiratory_support?: string | null;
          responsible_professional?: string | null;
          rut?: string | null;
          service_unit?: string | null;
          sex?: string | null;
          spo2?: number | null;
          updated_at?: string;
          user_id?: string | null;
          ventilation_mode?: string | null;
          visibility_type?: string | null;
          weight?: number | null;
        };
        Update: {
          address?: string | null;
          admission_date?: string | null;
          admission_reason?: string | null;
          age?: number | null;
          bed_number?: string | null;
          blood_pressure?: string | null;
          clinical_notes?: string | null;
          commune?: string | null;
          comorbidities?: string | null;
          created_at?: string;
          deleted_at?: string | null;
          deleted_by?: string | null;
          email?: string | null;
          establishment?: string | null;
          external_id?: string | null;
          heart_rate?: number | null;
          height?: number | null;
          hospital_id?: string | null;
          icu_admission_date?: string | null;
          id?: string;
          initials?: string | null;
          name?: string;
          patient_position?: string | null;
          patient_status?: string | null;
          phone?: string | null;
          prevision?: string | null;
          primary_diagnosis?: string | null;
          recent_abg?: Json | null;
          respiratory_phenotype?: string | null;
          respiratory_rate?: number | null;
          respiratory_support?: string | null;
          responsible_professional?: string | null;
          rut?: string | null;
          service_unit?: string | null;
          sex?: string | null;
          spo2?: number | null;
          updated_at?: string;
          user_id?: string | null;
          ventilation_mode?: string | null;
          visibility_type?: string | null;
          weight?: number | null;
        };
        Relationships: [];
      };
      pending_sync_queue: {
        Row: {
          action: string;
          connection_id: string;
          created_at: string;
          direction: string;
          error_message: string | null;
          id: string;
          max_retries: number;
          patient_id: string | null;
          payload: Json;
          retry_count: number;
          status: string;
          updated_at: string;
          user_id: string;
        };
        Insert: {
          action: string;
          connection_id: string;
          created_at?: string;
          direction?: string;
          error_message?: string | null;
          id?: string;
          max_retries?: number;
          patient_id?: string | null;
          payload?: Json;
          retry_count?: number;
          status?: string;
          updated_at?: string;
          user_id: string;
        };
        Update: {
          action?: string;
          connection_id?: string;
          created_at?: string;
          direction?: string;
          error_message?: string | null;
          id?: string;
          max_retries?: number;
          patient_id?: string | null;
          payload?: Json;
          retry_count?: number;
          status?: string;
          updated_at?: string;
          user_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: "pending_sync_queue_connection_id_fkey";
            columns: ["connection_id"];
            isOneToOne: false;
            referencedRelation: "institutional_connections";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "pending_sync_queue_patient_id_fkey";
            columns: ["patient_id"];
            isOneToOne: false;
            referencedRelation: "patients";
            referencedColumns: ["id"];
          },
        ];
      };
      profiles: {
        Row: {
          avatar_url: string | null;
          created_at: string;
          full_name: string | null;
          id: string;
          institution: string | null;
          specialty: string | null;
          updated_at: string;
        };
        Insert: {
          avatar_url?: string | null;
          created_at?: string;
          full_name?: string | null;
          id: string;
          institution?: string | null;
          specialty?: string | null;
          updated_at?: string;
        };
        Update: {
          avatar_url?: string | null;
          created_at?: string;
          full_name?: string | null;
          id?: string;
          institution?: string | null;
          specialty?: string | null;
          updated_at?: string;
        };
        Relationships: [];
      };
      pubmed_auto_searches: {
        Row: {
          auto_import: boolean | null;
          created_at: string;
          frequency: string;
          id: string;
          is_active: boolean | null;
          last_run_at: string | null;
          max_results: number | null;
          search_term: string;
          specialty_area: string | null;
          updated_at: string;
        };
        Insert: {
          auto_import?: boolean | null;
          created_at?: string;
          frequency?: string;
          id?: string;
          is_active?: boolean | null;
          last_run_at?: string | null;
          max_results?: number | null;
          search_term: string;
          specialty_area?: string | null;
          updated_at?: string;
        };
        Update: {
          auto_import?: boolean | null;
          created_at?: string;
          frequency?: string;
          id?: string;
          is_active?: boolean | null;
          last_run_at?: string | null;
          max_results?: number | null;
          search_term?: string;
          specialty_area?: string | null;
          updated_at?: string;
        };
        Relationships: [];
      };
      pubmed_searches: {
        Row: {
          filters: Json | null;
          id: string;
          query_text: string;
          searched_at: string;
          total_results: number | null;
          user_id: string | null;
        };
        Insert: {
          filters?: Json | null;
          id?: string;
          query_text: string;
          searched_at?: string;
          total_results?: number | null;
          user_id?: string | null;
        };
        Update: {
          filters?: Json | null;
          id?: string;
          query_text?: string;
          searched_at?: string;
          total_results?: number | null;
          user_id?: string | null;
        };
        Relationships: [];
      };
      study_document_links: {
        Row: {
          created_at: string;
          document_id: string;
          id: string;
          patient_id: string | null;
          relation_type: string;
          study_id: string | null;
          study_type: string;
        };
        Insert: {
          created_at?: string;
          document_id: string;
          id?: string;
          patient_id?: string | null;
          relation_type?: string;
          study_id?: string | null;
          study_type?: string;
        };
        Update: {
          created_at?: string;
          document_id?: string;
          id?: string;
          patient_id?: string | null;
          relation_type?: string;
          study_id?: string | null;
          study_type?: string;
        };
        Relationships: [
          {
            foreignKeyName: "study_document_links_document_id_fkey";
            columns: ["document_id"];
            isOneToOne: false;
            referencedRelation: "knowledge_documents";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "study_document_links_patient_id_fkey";
            columns: ["patient_id"];
            isOneToOne: false;
            referencedRelation: "patients";
            referencedColumns: ["id"];
          },
        ];
      };
      study_files: {
        Row: {
          bucket_name: string;
          created_at: string;
          file_path: string;
          file_type: string;
          file_url: string | null;
          id: string;
          mime_type: string | null;
          notes: string | null;
          original_filename: string | null;
          patient_id: string | null;
          related_id: string | null;
          related_type: string;
          updated_at: string;
          uploaded_by: string | null;
        };
        Insert: {
          bucket_name: string;
          created_at?: string;
          file_path: string;
          file_type?: string;
          file_url?: string | null;
          id?: string;
          mime_type?: string | null;
          notes?: string | null;
          original_filename?: string | null;
          patient_id?: string | null;
          related_id?: string | null;
          related_type?: string;
          updated_at?: string;
          uploaded_by?: string | null;
        };
        Update: {
          bucket_name?: string;
          created_at?: string;
          file_path?: string;
          file_type?: string;
          file_url?: string | null;
          id?: string;
          mime_type?: string | null;
          notes?: string | null;
          original_filename?: string | null;
          patient_id?: string | null;
          related_id?: string | null;
          related_type?: string;
          updated_at?: string;
          uploaded_by?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: "study_files_patient_id_fkey";
            columns: ["patient_id"];
            isOneToOne: false;
            referencedRelation: "patients";
            referencedColumns: ["id"];
          },
        ];
      };
      sync_logs: {
        Row: {
          action: string;
          connection_id: string;
          created_at: string;
          direction: string;
          error_message: string | null;
          id: string;
          patient_id: string | null;
          request_payload: Json | null;
          resource_type: string | null;
          response_payload: Json | null;
          status: string;
          user_id: string;
        };
        Insert: {
          action: string;
          connection_id: string;
          created_at?: string;
          direction?: string;
          error_message?: string | null;
          id?: string;
          patient_id?: string | null;
          request_payload?: Json | null;
          resource_type?: string | null;
          response_payload?: Json | null;
          status?: string;
          user_id: string;
        };
        Update: {
          action?: string;
          connection_id?: string;
          created_at?: string;
          direction?: string;
          error_message?: string | null;
          id?: string;
          patient_id?: string | null;
          request_payload?: Json | null;
          resource_type?: string | null;
          response_payload?: Json | null;
          status?: string;
          user_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: "sync_logs_connection_id_fkey";
            columns: ["connection_id"];
            isOneToOne: false;
            referencedRelation: "institutional_connections";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "sync_logs_patient_id_fkey";
            columns: ["patient_id"];
            isOneToOne: false;
            referencedRelation: "patients";
            referencedColumns: ["id"];
          },
        ];
      };
      user_activity: {
        Row: {
          action: string;
          created_at: string;
          id: string;
          last_active_at: string | null;
          metadata: Json | null;
          session_count: number | null;
          user_email: string | null;
          user_id: string;
        };
        Insert: {
          action?: string;
          created_at?: string;
          id?: string;
          last_active_at?: string | null;
          metadata?: Json | null;
          session_count?: number | null;
          user_email?: string | null;
          user_id: string;
        };
        Update: {
          action?: string;
          created_at?: string;
          id?: string;
          last_active_at?: string | null;
          metadata?: Json | null;
          session_count?: number | null;
          user_email?: string | null;
          user_id?: string;
        };
        Relationships: [];
      };
      user_roles: {
        Row: {
          created_at: string;
          id: string;
          role: Database["public"]["Enums"]["app_role"];
          user_id: string;
        };
        Insert: {
          created_at?: string;
          id?: string;
          role: Database["public"]["Enums"]["app_role"];
          user_id: string;
        };
        Update: {
          created_at?: string;
          id?: string;
          role?: Database["public"]["Enums"]["app_role"];
          user_id?: string;
        };
        Relationships: [];
      };
      validated_findings: {
        Row: {
          ai_prediction_id: string | null;
          created_at: string;
          final_diagnosis: string | null;
          final_findings: Json | null;
          final_interpretation: string | null;
          id: string;
          patient_id: string | null;
          severity_level: string | null;
          source_record_id: string | null;
          source_type: string;
          updated_at: string;
          validated_by: string | null;
          validation_notes: string | null;
        };
        Insert: {
          ai_prediction_id?: string | null;
          created_at?: string;
          final_diagnosis?: string | null;
          final_findings?: Json | null;
          final_interpretation?: string | null;
          id?: string;
          patient_id?: string | null;
          severity_level?: string | null;
          source_record_id?: string | null;
          source_type: string;
          updated_at?: string;
          validated_by?: string | null;
          validation_notes?: string | null;
        };
        Update: {
          ai_prediction_id?: string | null;
          created_at?: string;
          final_diagnosis?: string | null;
          final_findings?: Json | null;
          final_interpretation?: string | null;
          id?: string;
          patient_id?: string | null;
          severity_level?: string | null;
          source_record_id?: string | null;
          source_type?: string;
          updated_at?: string;
          validated_by?: string | null;
          validation_notes?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: "validated_findings_ai_prediction_id_fkey";
            columns: ["ai_prediction_id"];
            isOneToOne: false;
            referencedRelation: "ai_predictions";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "validated_findings_patient_id_fkey";
            columns: ["patient_id"];
            isOneToOne: false;
            referencedRelation: "patients";
            referencedColumns: ["id"];
          },
        ];
      };
      ventilation_records: {
        Row: {
          arterial_gases: Json | null;
          compliance: number | null;
          created_at: string | null;
          driving_pressure: number | null;
          fio2: number | null;
          id: string;
          notes: string | null;
          patient_id: string;
          peak_pressure: number | null;
          peep: number | null;
          plateau_pressure: number | null;
          record_date: string;
          resistance: number | null;
          respiratory_rate: number | null;
          spo2: number | null;
          tidal_volume: number | null;
          updated_at: string | null;
          ventilation_mode: string | null;
        };
        Insert: {
          arterial_gases?: Json | null;
          compliance?: number | null;
          created_at?: string | null;
          driving_pressure?: number | null;
          fio2?: number | null;
          id?: string;
          notes?: string | null;
          patient_id: string;
          peak_pressure?: number | null;
          peep?: number | null;
          plateau_pressure?: number | null;
          record_date?: string;
          resistance?: number | null;
          respiratory_rate?: number | null;
          spo2?: number | null;
          tidal_volume?: number | null;
          updated_at?: string | null;
          ventilation_mode?: string | null;
        };
        Update: {
          arterial_gases?: Json | null;
          compliance?: number | null;
          created_at?: string | null;
          driving_pressure?: number | null;
          fio2?: number | null;
          id?: string;
          notes?: string | null;
          patient_id?: string;
          peak_pressure?: number | null;
          peep?: number | null;
          plateau_pressure?: number | null;
          record_date?: string;
          resistance?: number | null;
          respiratory_rate?: number | null;
          spo2?: number | null;
          tidal_volume?: number | null;
          updated_at?: string | null;
          ventilation_mode?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: "ventilation_records_patient_id_fkey";
            columns: ["patient_id"];
            isOneToOne: false;
            referencedRelation: "patients";
            referencedColumns: ["id"];
          },
        ];
      };
      xray_examinations: {
        Row: {
          created_at: string | null;
          exam_date: string;
          findings: Json | null;
          id: string;
          image_url: string | null;
          inspiration: string | null;
          notes: string | null;
          patient_id: string;
          rotation: string | null;
          technical_quality: string | null;
          updated_at: string | null;
          xray_type: string | null;
        };
        Insert: {
          created_at?: string | null;
          exam_date?: string;
          findings?: Json | null;
          id?: string;
          image_url?: string | null;
          inspiration?: string | null;
          notes?: string | null;
          patient_id: string;
          rotation?: string | null;
          technical_quality?: string | null;
          updated_at?: string | null;
          xray_type?: string | null;
        };
        Update: {
          created_at?: string | null;
          exam_date?: string;
          findings?: Json | null;
          id?: string;
          image_url?: string | null;
          inspiration?: string | null;
          notes?: string | null;
          patient_id?: string;
          rotation?: string | null;
          technical_quality?: string | null;
          updated_at?: string | null;
          xray_type?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: "xray_examinations_patient_id_fkey";
            columns: ["patient_id"];
            isOneToOne: false;
            referencedRelation: "patients";
            referencedColumns: ["id"];
          },
        ];
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"];
          _user_id: string;
        };
        Returns: boolean;
      };
    };
    Enums: {
      app_role:
        | "owner"
        | "admin"
        | "medico"
        | "kinesiologo"
        | "enfermeria"
        | "supervisor"
        | "lector";
    };
    CompositeTypes: {
      [_ in never]: never;
    };
  };
};

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">;

type DefaultSchema = DatabaseWithoutInternals[Extract<
  keyof Database,
  "public"
>];

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R;
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R;
      }
      ? R
      : never
    : never;

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I;
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I;
      }
      ? I
      : never
    : never;

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U;
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U;
      }
      ? U
      : never
    : never;

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never;

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never;

export const Constants = {
  public: {
    Enums: {
      app_role: [
        "owner",
        "admin",
        "medico",
        "kinesiologo",
        "enfermeria",
        "supervisor",
        "lector",
      ],
    },
  },
} as const;
