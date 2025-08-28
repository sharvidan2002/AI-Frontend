import React, { useState, useRef } from 'react';
import { Upload, FileImage, AlertCircle, CheckCircle, X } from 'lucide-react';
import { documentAPI } from '../services/api';
import { UPLOAD_CONFIG, UI_MESSAGES } from '../utils/constants';

const ImageUpload = ({ onUploadSuccess, onProcessingStart }) => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [prompt, setPrompt] = useState('');
  const [dragOver, setDragOver] = useState(false);
  const [preview, setPreview] = useState(null);
  const [error, setError] = useState('');
  const fileInputRef = useRef();

  const handleFileSelect = (file) => {
    // Validate file type
    if (!UPLOAD_CONFIG.ACCEPTED_TYPES.includes(file.type)) {
      setError('Please select a valid image file (JPG, PNG, GIF, BMP, WebP, TIFF)');
      return;
    }

    // Validate file size
    if (file.size > UPLOAD_CONFIG.MAX_FILE_SIZE) {
      setError('File size must be less than 10MB');
      return;
    }

    setError('');
    setSelectedFile(file);

    // Create preview
    const reader = new FileReader();
    reader.onload = (e) => {
      setPreview(e.target.result);
    };
    reader.readAsDataURL(file);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragOver(false);

    const files = e.dataTransfer.files;
    if (files.length > 0) {
      handleFileSelect(files[0]);
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setDragOver(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setDragOver(false);
  };

  const handleFileInputChange = (e) => {
    const files = e.target.files;
    if (files.length > 0) {
      handleFileSelect(files[0]);
    }
  };

  const handleUpload = async () => {
    if (!selectedFile) {
      setError('Please select an image file');
      return;
    }

    if (!prompt.trim()) {
      setError('Please enter a prompt describing what you want to do with this image');
      return;
    }

    try {
      setError('');
      onProcessingStart();

      const response = await documentAPI.uploadDocument(selectedFile, prompt);

      if (response.success) {
        onUploadSuccess(response.data);
      } else {
        setError(response.message || UI_MESSAGES.UPLOAD_ERROR);
      }
    } catch (error) {
      console.error('Upload error:', error);
      setError(error.message || UI_MESSAGES.UPLOAD_ERROR);
    }
  };

  const clearSelection = () => {
    setSelectedFile(null);
    setPreview(null);
    setPrompt('');
    setError('');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className="bg-white shadow-2xl rounded-2xl border border-blue-100 p-6">
      <div className="space-y-8">
        {/* File Upload Area */}
        <div
          className={`relative border-2 border-dashed rounded-xl p-12 text-center cursor-pointer transition-all duration-500 transform hover:scale-[1.02] ${
            dragOver 
              ? 'border-blue-400 bg-blue-50 scale-[1.02] shadow-xl' 
              : preview 
                ? 'border-green-400 bg-green-50 shadow-xl' 
                : 'border-gray-300 bg-gray-50 hover:border-blue-300 hover:shadow-xl'
          }`}
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onClick={() => fileInputRef.current?.click()}
        >
          <input
            ref={fileInputRef}
            type="file"
            accept={UPLOAD_CONFIG.ACCEPTED_EXTENSIONS.join(',')}
            onChange={handleFileInputChange}
            className="hidden"
          />

          {preview ? (
            <div className="space-y-8">
              <div className="relative inline-block">
                <img
                  src={preview}
                  alt="Preview"
                  className="max-w-full max-h-96 mx-auto rounded-2xl shadow-2xl border-4 border-white ring-2 ring-emerald-200"
                />
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    clearSelection();
                  }}
                  className="absolute -top-2 -right-2 bg-red-500 hover:bg-red-600 text-white rounded-full p-2 shadow-lg transition-all duration-300 transform hover:scale-110"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
              
              <div className="bg-white rounded-xl p-4 shadow-lg border border-green-200">
                <div className="flex items-center justify-center space-x-2 text-green-600 mb-2">
                  <CheckCircle className="w-5 h-5" />
                  <span className="font-bold text-base">File Selected</span>
                </div>
                <p className="font-bold text-gray-800 text-lg">{selectedFile.name}</p>
                <p className="text-gray-600 mt-1">
                  Size: {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
                </p>
              </div>
            </div>
          ) : (
            <div className="space-y-8">
              <div className="flex justify-center">
                <div className="bg-blue-600 p-6 rounded-2xl shadow-lg">
                  <Upload className="w-12 h-12 text-white" />
                </div>
              </div>
              
              <div>
                <p className="text-gray-600 text-lg mb-4">
                  Drag and drop your document here, or click to browse
                </p>
                
                <div className="bg-white rounded-xl p-4 shadow-lg border border-blue-200 inline-block">
                  <div className="flex items-center space-x-2 text-gray-600">
                    <FileImage className="w-4 h-4 text-blue-600" />
                    <span>Supports: JPG, PNG, GIF, BMP, WebP, TIFF</span>
                  </div>
                  <p className="text-gray-500 text-xs mt-1">Maximum file size: 10MB</p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Prompt Input Section */}
        <div className="bg-blue-50 rounded-xl p-6 border border-blue-200 shadow-lg">
          <label className="flex items-center space-x-2 text-lg font-bold text-gray-800 mb-4">
            <span className="bg-blue-600 text-white rounded-full w-7 h-7 flex items-center justify-center text-sm font-bold shadow-md">2</span>
            <span>What would you like me to do with this document?</span>
            <span className="text-red-500">*</span>
          </label>
          
          <textarea
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="Enter your prompt"
            rows={1}
            className="w-full px-4 py-3 border border-blue-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-400 resize-none text-gray-800 placeholder-gray-500 bg-white shadow-md transition-all duration-300"
          />
          
          <div className="mt-3 flex items-start space-x-2">
            <AlertCircle className="w-4 h-4 text-blue-600 mt-0.5 flex-shrink-0" />
            <p className="text-sm text-gray-600">
              Be specific about your needs to get the best AI analysis and results.
            </p>
          </div>
        </div>

        {/* Error Display */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-xl p-4 shadow-lg">
            <div className="flex items-start space-x-3">
              <AlertCircle className="w-5 h-5 text-red-500 mt-0.5 flex-shrink-0" />
              <p className="text-red-700 font-bold">{error}</p>
            </div>
          </div>
        )}

        {/* Upload Button */}
        <button
          onClick={handleUpload}
          disabled={!selectedFile || !prompt.trim()}
          className={`w-full py-4 px-6 rounded-xl font-bold text-lg transition-all duration-500 shadow-lg transform ${
            selectedFile && prompt.trim()
              ? 'bg-blue-600 hover:bg-blue-700 text-white hover:shadow-2xl hover:-translate-y-1 hover:scale-[1.02]'
              : 'bg-gray-300 text-gray-500 cursor-not-allowed'
          }`}
        >
          {selectedFile && prompt.trim() ? 'Analyze Document' : 'Please select file and add instructions'}
        </button>

        {/* Tips Section */}
        <div className="bg-blue-50 rounded-xl p-6 border border-blue-200 shadow-lg">
          <div className="flex items-start space-x-3">
            <div className="bg-blue-600 rounded-full p-2 mt-1 shadow-md">
              <CheckCircle className="w-4 h-4 text-white" />
            </div>
            <div>
              <h4 className="font-bold text-gray-800 text-lg mb-3">Tips for Best Results</h4>
              <ul className="space-y-2">
                <li className="flex items-start space-x-2">
                  <span className="w-2 h-2 bg-blue-600 rounded-full mt-2 flex-shrink-0"></span>
                  <span className="text-gray-700">Ensure text is clearly visible and well-lit</span>
                </li>
                <li className="flex items-start space-x-2">
                  <span className="w-2 h-2 bg-blue-600 rounded-full mt-2 flex-shrink-0"></span>
                  <span className="text-gray-700">Avoid blurry or tilted images when possible</span>
                </li>
                <li className="flex items-start space-x-2">
                  <span className="w-2 h-2 bg-blue-600 rounded-full mt-2 flex-shrink-0"></span>
                  <span className="text-gray-700">Provide specific instructions in your prompt</span>
                </li>
                <li className="flex items-start space-x-2">
                  <span className="w-2 h-2 bg-blue-600 rounded-full mt-2 flex-shrink-0"></span>
                  <span className="text-gray-700">Handwritten notes work best when writing is neat</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ImageUpload;