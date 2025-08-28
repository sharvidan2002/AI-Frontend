import React, { useState } from 'react';
import { BookOpen, Upload, Sparkles } from 'lucide-react';
import ImageUpload from './components/ImageUpload';
import AnalysisResults from './components/AnalysisResults';
import ChatInterface from './components/ChatInterface';

function App() {
  const [currentDocument, setCurrentDocument] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);

  const handleDocumentUploaded = (documentData) => {
    setCurrentDocument(documentData);
    setIsProcessing(false);
  };

  const handleProcessingStart = () => {
    setIsProcessing(true);
  };

  const handleNewUpload = () => {
    setCurrentDocument(null);
    setIsProcessing(false);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-md border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="bg-blue-600 p-3 rounded-2xl shadow-lg">
                <BookOpen className="w-8 h-8 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-blue-600">AI Study Helper</h1>
                <p className="text-sm text-gray-600 mt-0.5">
                  Upload, analyze, and learn from your study materials with advanced AI technology
                </p>
              </div>
            </div>
            {currentDocument && (
              <button
                onClick={handleNewUpload}
                className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-300"
              >
                New Upload
              </button>
            )}
          </div>
        </div>
      </header>

      <main className="max-w-full mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {!currentDocument && !isProcessing ? (
          /* Upload Section */
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-bold mb-6 text-black">
                Upload Your Study Material
              </h2>

              <p className="text-lg leading-relaxed max-w-3xl mx-auto text-gray-600">
                Transform your handwritten notes, textbook pages, and diagrams into interactive learning experiences.
                Get AI-powered analysis, comprehensive summaries, personalized quiz questions, and more to enhance your studying.
              </p>
            </div>

            <div className="mb-16">
              <ImageUpload
                onUploadSuccess={handleDocumentUploaded}
                onProcessingStart={handleProcessingStart}
              />
            </div>

            {/* Feature Highlights */}
            <div className="grid md:grid-cols-3 gap-8">
              <div className="group text-center bg-white shadow-xl border border-blue-100 rounded-2xl p-8 hover:shadow-2xl hover:-translate-y-2 transition-all duration-500">
                <div className="w-16 h-16 bg-blue-600 rounded-xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300">
                  <BookOpen className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl font-bold mb-4 text-gray-900">Smart Analysis</h3>
                <p className="text-gray-600 leading-relaxed">
                  Advanced AI extracts and analyzes content from any document format,
                  providing detailed insights and summaries.
                </p>
              </div>

              <div className="group text-center bg-white shadow-xl border border-blue-100 rounded-2xl p-8 hover:shadow-2xl hover:-translate-y-2 transition-all duration-500">
                <div className="w-16 h-16 bg-blue-600 rounded-xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300">
                  <Sparkles className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl font-bold mb-4 text-gray-900">Quiz Generation</h3>
                <p className="text-gray-600 leading-relaxed">
                  Automatically generate personalized practice questions and quizzes
                  based on your study materials.
                </p>
              </div>

              <div className="group text-center bg-white shadow-xl border border-blue-100 rounded-2xl p-8 hover:shadow-2xl hover:-translate-y-2 transition-all duration-500">
                <div className="w-16 h-16 bg-blue-600 rounded-xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300">
                  <BookOpen className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl font-bold mb-4 text-gray-900">Interactive Learning</h3>
                <p className="text-gray-600 leading-relaxed">
                  Ask questions about your documents and get instant,
                  context-aware answers to deepen your understanding.
                </p>
              </div>
            </div>
          </div>
        ) : isProcessing ? (
          /* Processing State */
          <div className="max-w-3xl mx-auto text-center">
            <div className="bg-white shadow-2xl rounded-2xl p-12 border border-blue-100">
              <div className="mb-8">
                <div className="inline-flex items-center justify-center w-20 h-20 bg-blue-100 rounded-full mb-6">
                  <div className="w-10 h-10 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
                </div>

                <h3 className="text-3xl font-bold mb-4 text-blue-600">
                  Processing Your Document
                </h3>

                <p className="text-lg leading-relaxed text-gray-600">
                  Our AI is working hard to extract text, analyze content, generate quiz questions,
                  and find relevant resources. This may take a few moments...
                </p>
              </div>

              <div className="bg-blue-50 rounded-xl p-6 border border-blue-200">
                <div className="flex items-center justify-center space-x-3">
                  <div className="flex space-x-1">
                    <div className="w-2 h-2 bg-blue-600 rounded-full animate-bounce" style={{animationDelay: '0ms'}}></div>
                    <div className="w-2 h-2 bg-blue-600 rounded-full animate-bounce" style={{animationDelay: '150ms'}}></div>
                    <div className="w-2 h-2 bg-blue-600 rounded-full animate-bounce" style={{animationDelay: '300ms'}}></div>
                  </div>
                  <span className="text-base font-semibold text-gray-700">Analyzing your document...</span>
                </div>
              </div>
            </div>
          </div>
        ) : (
          /* Dashboard with Results and Chat */
          <div className="space-y-8">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold mb-4 text-blue-600">Analysis Complete</h2>
              <p className="text-lg text-gray-600">
                Here's everything we discovered in your document
              </p>
            </div>

            <div className="grid lg:grid-cols-3 gap-8">
              {/* Left Column - Analysis Results */}
              <div className="lg:col-span-2 space-y-6">
                <AnalysisResults document={currentDocument} />
              </div>

              {/* Right Column - Chat Interface */}
              <div className="lg:col-span-1">
                <div className="sticky top-8">
                  <ChatInterface document={currentDocument} />
                </div>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-200 shadow-lg mt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center space-y-6">
            <div className="flex items-center justify-center space-x-3">
              <div className="bg-blue-600 p-2 rounded-lg shadow-lg">
                <BookOpen className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold text-blue-600">AI Study Helper</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;