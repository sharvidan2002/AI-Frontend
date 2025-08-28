import axios from 'axios';
import { API_BASE_URL, API_ENDPOINTS } from '../utils/constants.js';

// Create axios instance
const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 120000, // 2 minutes for file upload processing
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor
api.interceptors.request.use(
  (config) => {
    console.log(`API Request: ${config.method?.toUpperCase()} ${config.url}`);
    return config;
  },
  (error) => {
    console.error('API Request Error:', error);
    return Promise.reject(error);
  }
);

// Response interceptor
api.interceptors.response.use(
  (response) => {
    console.log(`API Response: ${response.status} ${response.config.url}`);
    return response.data;
  },
  (error) => {
    console.error('API Response Error:', error);

    if (error.response) {
      return Promise.reject({
        message: error.response.data?.message || 'Server error occurred',
        status: error.response.status,
        data: error.response.data
      });
    } else if (error.request) {
      return Promise.reject({
        message: 'Network error - please check your connection',
        status: 0
      });
    } else {
      return Promise.reject({
        message: error.message || 'Unknown error occurred',
        status: 0
      });
    }
  }
);

// Document API functions
export const documentAPI = {
  // Upload and analyze document
  uploadDocument: async (file, prompt) => {
    const formData = new FormData();
    formData.append('image', file);
    formData.append('prompt', prompt);

    return api.post(API_ENDPOINTS.UPLOAD_DOCUMENT, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
  },

  // Get all documents
  getAllDocuments: async (page = 1, limit = 10) => {
    return api.get(API_ENDPOINTS.GET_DOCUMENTS, {
      params: { page, limit }
    });
  },

  // Get specific document
  getDocument: async (documentId) => {
    return api.get(API_ENDPOINTS.GET_DOCUMENT(documentId));
  },

  // Delete document
  deleteDocument: async (documentId) => {
    return api.delete(API_ENDPOINTS.DELETE_DOCUMENT(documentId));
  },

  // Regenerate quiz questions
  regenerateQuiz: async (documentId) => {
    return api.post(API_ENDPOINTS.REGENERATE_QUIZ(documentId));
  }
};

// Chat API functions
export const chatAPI = {
  // Send message
  sendMessage: async (documentId, message) => {
    return api.post(API_ENDPOINTS.SEND_MESSAGE, {
      documentId,
      message
    });
  },

  // Get chat history
  getChatHistory: async (documentId) => {
    return api.get(API_ENDPOINTS.GET_CHAT_HISTORY(documentId));
  },

  // Clear chat history
  clearChatHistory: async (documentId) => {
    return api.delete(API_ENDPOINTS.CLEAR_CHAT_HISTORY(documentId));
  },

  // Get document context
  getDocumentContext: async (documentId) => {
    return api.get(API_ENDPOINTS.GET_DOCUMENT_CONTEXT(documentId));
  },

  // Get all chats
  getAllChats: async (page = 1, limit = 10) => {
    return api.get(API_ENDPOINTS.GET_ALL_CHATS, {
      params: { page, limit }
    });
  }
};

// Export API functions
export const exportAPI = {
  // Get export options
  getExportOptions: async (documentId) => {
    return api.get(API_ENDPOINTS.EXPORT_OPTIONS(documentId));
  },

  // Export document (returns blob for download)
  exportDocument: async (documentId, type = 'complete') => {
    const endpoint = type === 'complete' ? API_ENDPOINTS.EXPORT_DOCUMENT(documentId) :
                    type === 'summary' ? API_ENDPOINTS.EXPORT_SUMMARY(documentId) :
                    type === 'quiz' ? API_ENDPOINTS.EXPORT_QUIZ(documentId) :
                    type === 'notes' ? API_ENDPOINTS.EXPORT_NOTES(documentId) :
                    type === 'chat' ? API_ENDPOINTS.EXPORT_CHAT(documentId) :
                    API_ENDPOINTS.EXPORT_DOCUMENT(documentId);

    return api.get(endpoint, {
      responseType: 'blob',
      headers: {
        'Accept': 'application/pdf'
      }
    });
  }
};

// Utility function to download file
export const downloadFile = (blob, filename) => {
  const url = window.URL.createObjectURL(new Blob([blob]));
  const link = document.createElement('a');
  link.href = url;
  link.setAttribute('download', filename);
  document.body.appendChild(link);
  link.click();
  link.remove();
  window.URL.revokeObjectURL(url);
};

export default api;