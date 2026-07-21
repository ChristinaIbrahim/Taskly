export interface Epic {
  id: string;
  epic_code?: string;
  title: string;
  description?: string;
  project_id: string;
  assignee_id?: string;
  deadline?: string;
  created_at?: string;
  assignee?: {
    name: string;
  };
  creator?: {
    name: string;
  };
}

export interface ProjectMember {
  id: string;
  name: string;
  email: string;
  role: string;
}
