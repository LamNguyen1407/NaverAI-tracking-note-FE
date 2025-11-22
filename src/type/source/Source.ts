export interface SourceAsset {
  file_path: string;
  url: string;
}

export interface ProcessingInfo {
  started_at: string;
  completed_at: string | null;
  error: string;
}

export interface SourceItem {
  id: string;
  title: string;
  topics: string[];
  asset: SourceAsset;
  embedded: boolean;
  embedded_chunks: number;
  insights_count: number;
  created: string;
  updated: string;
  file_available: boolean | null;
  command_id: string;
  status: string;
  processing_info: ProcessingInfo;
}

export interface NoteItem {
  id: string;
  title: string | null;
  content: string;
  note_type: string;
  created: string;
  updated: string;
}

export interface SimpleSource {
  id: string;
  name: string;
}
