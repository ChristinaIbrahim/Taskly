


export interface EpicUser {
  sub: string;
  name: string;
  email: string;
  department?: string;
}

export interface Epic {
  id: string;
  epic_id?: string;
  title: string;
  description?: string;
  project_id: string;
  assignee_id?: string;
  deadline?: string;
  created_at?: string;
  assignee?: EpicUser;
  created_by?: EpicUser;
}

export interface ProjectMember {
  id: string;
  name: string;
  email: string;
  role: string;
}