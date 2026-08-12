
export interface Course {
  id: number;
  title: string;
  description: string;
  icon: string;
}

export interface Teacher {
  id: number;
  name: string;
  role: string;
  experience: string;
  languages: string[];
  image: string;
}

export interface FAQItem {
  id: number;
  question: string;
  answer: string;
}

export interface BlogPost {
  id: number;
  title: string;
  excerpt: string;
  image: string;
  category: string;
  readTime: string;
}

// Cloudinary Types
export interface CloudinaryUploadResult {
  secure_url: string;
  public_id: string;
  resource_type: string;
  format: string;
  bytes: number;
  created_at: string;
}

export interface CloudinaryFileUpload {
  file: File;
  folder: string;
  resourceType?: 'auto' | 'image' | 'raw' | 'video';
}