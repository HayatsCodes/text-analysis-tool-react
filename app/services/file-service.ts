import { api } from './api';

interface ProcessWordFrequencyParams {
  column_name: string;
  selection_type?: 'top_n' | 'manual';
  max_words?: number;
  cloud_shape?: 'rectangle' | 'circle' | 'triangle' | 'diamond';
  cloud_color?: 'blue' | 'green' | 'red' | 'purple' | 'orange' | 'teal';
}

export interface ProcessLDAParams {
  visualizationStyle: string;
  column: string;
  minTopics: string;
  maxTopics: string;
  minDocFreq: string;
  maxDocFreq: string;
}

export interface EditLDAKeywordsParams {
  topic_id: number;
  edited_words?: Array<{ original: string; new: string }>;
  removed_words?: string[];
  chart_style?: string;
  network_style?: string;
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
    // formData.append('selection_type', selection_type);
    // formData.append('max_words', max_words.toString());
    // formData.append('cloud_shape', cloud_shape);
    // formData.append('cloud_color', cloud_color);

    return api.post('/analyse/analyze', formData);
  },

  processLDA: async (params: ProcessLDAParams) => {
    const payload = {
      chart_style: 'default',
      network_style: params.visualizationStyle,
      max_topic: parseInt(params.maxTopics, 10),
      min_topic: parseInt(params.minTopics, 10),
      no_above: parseFloat(params.maxDocFreq),
      no_below: parseInt(params.minDocFreq, 10),
      text_column: params.column,
    };

    return api.post('/analyse/process', payload); // Send payload as JSON
  },

  editLDAKeywords: async (params: EditLDAKeywordsParams) => {
    // Construct payload, ensuring optional fields are only included if provided
    const payload: Record<string, any> = {
      topic_id: params.topic_id,
    };
    if (params.edited_words && params.edited_words.length > 0) {
      payload.edited_words = params.edited_words;
    }
    if (params.removed_words && params.removed_words.length > 0) {
      payload.removed_words = params.removed_words;
    }
    if (params.chart_style) {
      payload.chart_style = params.chart_style;
    }
    if (params.network_style) {
      payload.network_style = params.network_style;
    }
    
    // console.log("Sending payload to /api/analyse/edit_keywords:", payload);
    // Replace with actual API call if console logging is not the final step
    return api.post('/analyse/edit_keywords', payload);
    // For now, just logging and returning a mock response
    // return Promise.resolve({ success: true, message: "Keywords processed (mock response)", data: payload });
  }
}; 