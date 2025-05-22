import { api } from './api';

interface ProcessWordFrequencyParams {
  column_name: string;
  selection_type?: 'top_n' | 'manual';
  max_words?: number;
  cloud_shape?: 'rectangle' | 'circle' | 'triangle' | 'diamond';
  cloud_color?: 'blue' | 'green' | 'red' | 'purple' | 'orange' | 'teal';
}

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
    // custom_filename: string;
  }) => {
    const formData = new FormData();
    Object.entries(data).forEach(([key, value]) => {
      formData.append(key, value);
    });

    return api.post('/process', formData, {
    
    });
  },

  analyzeWordFrequency: async ({
    column_name,
    selection_type = 'top_n',
    max_words = 50,
    cloud_shape = 'rectangle',
    cloud_color = 'blue'
  }: ProcessWordFrequencyParams) => {
    const formData = new FormData();
    
    // Add required parameters
    formData.append('column_name', column_name);
    formData.append('selection_type', selection_type);
    formData.append('max_words', max_words.toString());
    formData.append('cloud_shape', cloud_shape);
    formData.append('cloud_color', cloud_color);

    return api.post('/analyse/analyze', formData);
  }
}; 