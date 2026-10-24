export type QType = "text" | "email" | "choice" | "yesno";
export interface Question { id: string; type: QType; label: string; required: boolean; options?: string[] }
export interface PublicForm { title: string; questions: Question[]; welcome: string; completion: string; color: string }
export interface FormRow extends PublicForm { id: string; slug: string; published: boolean; created_at: string; response_count?: number }
export interface ResponseRow { id: string; answers: Record<string, string>; created_at: string }
