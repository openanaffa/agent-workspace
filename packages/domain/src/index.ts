export const TASK_STATUSES = [
  "backlog",
  "ready",
  "claimed",
  "running",
  "blocked",
  "review",
  "approved",
  "done",
] as const;

export type TaskStatus = (typeof TASK_STATUSES)[number];

export type Agent = {
  id: string;
  name: string;
  role: string;
  status: "offline" | "idle" | "busy" | "blocked";
  capabilities: string[];
};

export type Project = {
  id: string;
  name: string;
  description: string;
  status: "active" | "paused" | "completed" | "archived";
};

export type Task = {
  id: string;
  projectId: string;
  title: string;
  description: string;
  status: TaskStatus;
  assigneeId?: string;
  priority: number;
  startAt?: string;
  dueAt?: string;
};
