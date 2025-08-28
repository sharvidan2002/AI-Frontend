// API Configuration
export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5001/api';

// API Endpoints
export const API_ENDPOINTS = {
  // Document endpoints
  UPLOAD_DOCUMENT: '/documents/upload',
  GET_DOCUMENTS: '/documents',
  GET_DOCUMENT: (id) => `/documents/${id}`,
  DELETE_DOCUMENT: (id) => `/documents/${id}`,
  REGENERATE_QUIZ: (id) => `/documents/${id}/regenerate-quiz`,

  // Chat endpoints
  SEND_MESSAGE: '/chat/send',
  GET_CHAT_HISTORY: (documentId) => `/chat/history/${documentId}`,
  CLEAR_CHAT_HISTORY: (documentId) => `/chat/history/${documentId}`,
  GET_DOCUMENT_CONTEXT: (documentId) => `/chat/context/${documentId}`,
  GET_ALL_CHATS: '/chat',

  // Export endpoints
  EXPORT_DOCUMENT: (id) => `/export/${id}`,
  EXPORT_SUMMARY: (id) => `/export/${id}/summary`,
  EXPORT_QUIZ: (id) => `/export/${id}/quiz`,
  EXPORT_NOTES: (id) => `/export/${id}/notes`,
  EXPORT_CHAT: (id) => `/export/${id}/chat`,
  EXPORT_OPTIONS: (id) => `/export/${id}/options`
};

// File Upload Configuration
export const UPLOAD_CONFIG = {
  MAX_FILE_SIZE: 10 * 1024 * 1024, // 10MB
  ACCEPTED_TYPES: ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/bmp', 'image/webp', 'image/tiff'],
  ACCEPTED_EXTENSIONS: ['.jpg', '.jpeg', '.png', '.gif', '.bmp', '.webp', '.tiff']
};

// UI Constants
export const UI_MESSAGES = {
  UPLOAD_SUCCESS: 'Document uploaded and analyzed successfully!',
  UPLOAD_ERROR: 'Failed to upload document. Please try again.',
  PROCESSING: 'Processing your document...',
  CHAT_PLACEHOLDER: 'Ask me anything about your uploaded document...',
  NO_DOCUMENTS: 'No documents uploaded yet.',
  NO_CHAT_HISTORY: 'No chat history available.',
  EXPORT_SUCCESS: 'Document exported successfully!',
  EXPORT_ERROR: 'Failed to export document.'
};

// Question Types
export const QUESTION_TYPES = {
  MCQ: 'mcq',
  SHORT_ANSWER: 'short_answer',
  FLASHCARD: 'flashcard'
};

// Export Types
export const EXPORT_TYPES = {
  COMPLETE: 'complete',
  SUMMARY: 'summary',
  QUIZ: 'quiz',
  NOTES: 'notes',
  CHAT: 'chat'
};