export interface Post {
  userId: number;
  id?: number;
  title: string;
  body: string;
  email?: string;
  commentsHidden?: boolean;
}
