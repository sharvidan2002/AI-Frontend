import React, { useState } from 'react';
import QuizSection from './QuizSection';
import YouTubeVideos from './YouTubeVideos';
import ExportOptions from './ExportOptions';

const AnalysisResults = ({ document }) => {
  const [activeTab, setActiveTab] = useState('overview');

  if (!document) {
    return null;
  }

  const tabs = [
    { id: 'overview', label: 'Overview', icon: '📋' },
    { id: 'quiz', label: 'Quiz', icon: '❓' },
    { id: 'videos', label: 'Videos', icon: '📺' },
    { id: 'export', label: 'Export', icon: '💾' }
  ];

  const renderTabContent = () => {
    switch (activeTab) {
      case 'overview':
        return <OverviewTab document={document} />;
      case 'quiz':
        return <QuizSection questions={document.quizQuestions || []} />;
      case 'videos':
        return <YouTubeVideos videos={document.youtubeVideos || []} />;
      case 'export':
        return <ExportOptions documentId={document.documentId} />;
      default:
        return <OverviewTab document={document} />;
    }
  };

  // make this container full width so it doesn't get constrained when the chat moved to a bubble
  return (
    <div className="w-screen max-w-none px-6 md:px-12 py-8">
      {/* Navigation Tabs */}
      <div className="bg-white rounded-2xl border border-blue-100 shadow-xl overflow-hidden">
        <div className="flex border-b border-blue-200">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex-1 flex items-center justify-center gap-3 px-6 py-4 font-semibold transition-all duration-300 transform ${
                activeTab === tab.id
                  ? 'bg-blue-600 text-white border-b-2 border-blue-700 shadow-lg scale-105'
                  : 'text-gray-600 hover:bg-blue-50 hover:text-blue-600 hover:scale-105'
              }`}
            >
              <span className="text-xl">{tab.icon}</span>
              {tab.label}
            </button>
          ))}
        </div>

        {/* Tab Content */}
        <div className="p-8">
          {renderTabContent()}
        </div>
      </div>
    </div>
  );
};

// Overview Tab Component
const OverviewTab = ({ document }) => {
  // eslint-disable-next-line no-empty-pattern
  const [] = useState(false);

  return (
    <div className="space-y-10">
      {/* Summary Section */}
      {document.analysis?.summary && (
        <div>
          <h3 className="text-2xl font-bold text-black mb-6 flex items-center gap-3">
            <span className="text-2xl">📝</span> Summary
          </h3>
          <div className="p-2">
            <p className="text-gray-800 leading-relaxed text-lg">{document.analysis.summary}</p>
          </div>
        </div>
      )}

      {/* Key Points */}
      {document.analysis?.keyPoints?.length > 0 && (
        <div>
          <h3 className="text-2xl font-bold text-black mb-2 flex items-center gap-3">
            <span className="text-2xl">🎯</span> Key Points
          </h3>
          <ul className="space-y-2">
            {document.analysis.keyPoints.map((point, index) => (
              <li key={index} className="flex items-start gap-2 p-4   transition-shadow duration-300">
                <span className="flex-shrink-0 w-6 h-6 bg-blue-600 text-white text-sm font-bold rounded-full flex items-center justify-center mt-1 shadow-md">
                  {index + 1}
                </span>
                <span className="text-gray-800 leading-relaxed text-lg">{point}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Main Concepts */}
      {document.analysis?.concepts?.length > 0 && (
        <div>
          <h3 className="text-2xl font-bold text-black mb-6 flex items-center gap-3">
            <span className="text-2xl">💡</span> Main Concepts
          </h3>
          <div className="flex flex-wrap gap-3">
            {document.analysis.concepts.map((concept, index) => (
              <span
                key={index}
                className="bg-white text-black px-4 py-2 rounded-full text-base font-semibold shadow-md hover:bg-blue-200 hover:shadow-lg transition-all duration-300 transform hover:scale-105"
              >
                {concept}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Detailed Explanation */}
      {document.analysis?.explanation && (
        <div>
          <h3 className="text-2xl font-bold text-black mb-6 flex items-center gap-3">
            <span className="text-2xl">📚</span> Detailed Explanation
          </h3>
          <div className="">
            <p className="text-gray-800 leading-relaxed whitespace-pre-wrap text-lg">
              {document.analysis.explanation}
            </p>
          </div>
        </div>
      )}

    </div>
  );
};

export default AnalysisResults;
