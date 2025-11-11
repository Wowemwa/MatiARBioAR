export type User = {
  id: string;
  email: string;
  password: string;
  created_at: string;
  updated_at: string;
};

export type Profile = {
  id: string;
  user_id: string;
  username: string;
  bio?: string;
  avatar_url?: string;
  created_at: string;
  updated_at: string;
};

export type Post = {
  id: string;
  user_id: string;
  title: string;
  content: string;
  created_at: string;
  updated_at: string;
};

export type Media = {
  id: string;
  user_id: string;
  url: string;
  type: string;
  created_at: string;
  updated_at: string;
};

export type AuthResponse = {
  user: User;
  access_token: string;
  refresh_token: string;
};

export type ApiError = {
  message: string;
  status: number;
};