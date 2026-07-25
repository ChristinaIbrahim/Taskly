export interface TaskUser {
  sub?: string;
  name?: string;
  email?: string;
  department?: string;
  [key: string]: any;
}

export interface TaskEpic {
  id?: string;
  epic_id?: string;
  title?: string;
  [key: string]: any;
}

export interface Task {
  id?: string | number;
  task_id?: string | number;
  title?: string;
  description?: string;
  status?: string;
  due_date?: string | number | Date | null;
  created_at?: string | number | Date | null;
  assignee?: TaskUser;
  reporter?: TaskUser;
  created_by?: TaskUser;
  epic?: TaskEpic;
  assignee_name?: string;
  assignee_initials?: string;
  project_id?: string | number;
  [key: string]: any;
}

export interface BoardColumn {
  key: string;
  label: string;
  tasks: Task[];
  count: number;
}
