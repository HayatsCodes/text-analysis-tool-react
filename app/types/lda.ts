export interface LDAKeyword {
  id: string; // Unique ID for React key, e.g., `topicId_keywordIndex`
  text: string;
  weight: number;
}

export interface LDATopic {
  id: number; // This is the topic ID from the backend
  name: string; // e.g., "Topic 24"
  keywords: LDAKeyword[];
  originalWordsString?: string; // Keep original for potential re-processing if needed
}

export interface LDATopicResponseItem {
  id: number;
  words: string; // e.g., "0.033*\"keyword1\" + 0.031*\"keyword2\""
}

export interface LDATopicImage {
  id: number;
  path: string;
  url: string;
}

export interface LDAWordCloudPath {
  filename: string;
  path: string;
  topic_id: number;
}

// Structure of the JSON response from the LDA analysis API
export interface LDAResponse {
  optimal_topic_num: number;
  coherence_plot: string; // base64 encoded image
  perplexity_plot: string; // base64 encoded image
  topics: LDATopicResponseItem[];
  topic_images: LDATopicImage[];
  pyldavis_html: string;
  csv_download_url: string;
  csv_path: string;
  network_img_path: string;
  network_img_url: string;
  network_style: string;
  wordcloud_paths?: LDAWordCloudPath[]; // Added optional wordcloud_paths
}

// Processed data structure that the LDAKeywordEditor might use internally or expect
export interface ProcessedLDAData {
  optimalTopics: number;
  parsedTopics: LDATopic[];
} 