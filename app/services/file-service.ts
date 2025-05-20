import { api } from './api';

export const fileService = {
  upload: async (file: File) => {
    const formData = new FormData();
    formData.append('file', file);
    
    return api.post('/upload', formData, {
     
    });
  },

  process: async (data: {
    column_name: string;
    language: string;
    analyzer: string;
    pos_tags: string;
    min_word_length: string;
    custom_filename: string;
  }) => {
    const formData = new FormData();
    Object.entries(data).forEach(([key, value]) => {
      formData.append(key, value);
    });

    return api.post('/process', formData, {
    
    });
  }
}; 