export interface Document {
  id: string;
  name: string;
  size: number;
  taskId?: string;
  projectId?: string;
  uploadedAt: Date;
  uploadedBy: string;
}
