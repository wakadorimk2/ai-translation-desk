export interface Fragment {
  id: number;
  title: string;
  summary: string;
  detail: string;
  lesson: string;
  tags: string[];
  source_company: string;
  created_at: string;
  updated_at: string;
}

export interface FragmentCreate {
  title: string;
  summary?: string;
  detail?: string;
  lesson?: string;
  tags?: string[];
  source_company?: string;
}

export interface Session {
  id: number;
  target_company: string;
  context: string;
  created_at: string;
}

export interface QuestionLog {
  id: number;
  session_id: number;
  question_text: string;
  question_type: string;
  suggested_fragment_ids: number[];
  selected_fragment_ids: number[];
  drafted_answer: string;
  actual_answer_memo: string;
  stuck_points: string;
  created_at: string;
}

export interface SearchResult {
  fragment: Fragment;
  score: number;
}
