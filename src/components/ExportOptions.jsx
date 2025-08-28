import React, { useState, useEffect } from 'react';
import { exportAPI, downloadFile } from '../services/api';
import { EXPORT_TYPES, UI_MESSAGES } from '../utils/constants';

const ExportOptions = ({ documentId }) => {
  const [exportOptions, setExportOptions] = useState(null);
  const [loading, setLoading] = useState(true);
  const [exporting, setExporting] = useState({});
  const [error, setError] = useState('');

  useEffect(() => {
    loadExportOptions();
  }, [documentId]);

  const loadExportOptions = async () => {
    try {
      setLoading(true);
      const response = await exportAPI.getExportOptions(documentId);

      if (response.success) {
        setExportOptions(response.data.exportOptions);
      } else {
        setError(response.message || 'Failed to load export options');
      }
    } catch (error) {
      console.error('Export options error:', error);
      setError(error.message || 'Failed to load export options');
    } finally {
      setLoading(false);
    }
  };

  const handleExport = async (exportType) => {
    try {
      setExporting(prev => ({ ...prev, [exportType]: true }));
      setError('');

      const blob = await exportAPI.exportDocument(documentId, exportType);

      // Generate filename
      const timestamp = new Date().toISOString().split('T')[0];
      const filename = `study-material-${exportType}-${timestamp}.pdf`;

      // Download file
      downloadFile(blob, filename);

    } catch (error) {
      console.error('Export error:', error);
      setError(error.message || UI_MESSAGES.EXPORT_ERROR);
    } finally {
      setExporting(prev => ({ ...prev, [exportType]: false }));
    }
  };

  if (loading) {
    return (
      <div className="text-center py-8">
        <div className="loading-spinner mx-auto mb-4"></div>
        <p className="text-gray-medium">Loading export options...</p>
      </div>
    );
  }

  if (!exportOptions) {
    return (
      <div className="text-center py-8">
        <div className="text-6xl mb-4">💾</div>
        <h3 className="text-xl font-semibold text-gray-600 mb-2">Export Options Unavailable</h3>
        <p className="text-gray-500">Unable to load export options at this time.</p>
        {error && (
          <div className="mt-4 bg-red-50 border border-red-200 rounded-lg p-3">
            <p className="text-red-600 text-sm">{error}</p>
          </div>
        )}
      </div>
    );
  }

  const exportCards = [
    {
      type: EXPORT_TYPES.COMPLETE,
      title: 'Complete Study Pack',
      icon: '📚',
      description: 'Everything in one PDF - analysis, quiz, videos, and more',
      includes: exportOptions.complete?.includes || [],
      available: exportOptions.complete?.available || false,
      color: 'blue'
    },
    {
      type: EXPORT_TYPES.SUMMARY,
      title: 'Summary & Notes',
      icon: '📝',
      description: 'Key points, summary, and main concepts',
      includes: exportOptions.summary?.includes || [],
      available: exportOptions.summary?.available || false,
      color: 'green'
    },
    {
      type: EXPORT_TYPES.QUIZ,
      title: 'Quiz Questions',
      icon: '❓',
      description: 'All quiz questions with answers and explanations',
      includes: exportOptions.quiz?.includes || [],
      available: exportOptions.quiz?.available || false,
      color: 'purple'
    }
  ];

  const getColorClasses = (color, available) => {
    if (!available) {
      return 'border-gray-200 bg-gray-50 text-gray-400';
    }

    const colors = {
      blue: 'border-blue-200 bg-blue-50 hover:border-blue-300',
      green: 'border-green-200 bg-green-50 hover:border-green-300',
      purple: 'border-purple-200 bg-purple-50 hover:border-purple-300',
      yellow: 'border-yellow-200 bg-yellow-50 hover:border-yellow-300',
      indigo: 'border-indigo-200 bg-indigo-50 hover:border-indigo-300'
    };

    return colors[color] || 'border-gray-200 bg-gray-50 hover:border-gray-300';
  };

  return (
    <div className="space-y-6 w-full">
      {/* Header */}
      <div>
        <h3 className="text-2xl font-semibold text-pure-black">💾 Export to PDF</h3>
        <p className="text-gray-medium mt-1">
          Download your study materials in different formats for offline use
        </p>
      </div>

      {/* Error Display */}
      {error && (
        <div className="bg-red-50 border-l-4 border-red-400 p-4">
          <p className="text-red-700 text-sm">{error}</p>
        </div>
      )}

      {/* Export Cards - single column full width */}
      <div className="grid grid-cols-1 gap-6 w-full">
        {exportCards.map((card) => (
          <div
            key={card.type}
            className={`w-full border-2 rounded-lg p-6 transition-all duration-200 flex flex-col justify-between ${getColorClasses(card.color, card.available)}`}
          >
            <div className="flex items-start justify-between mb-4 w-full">
              <div className="flex items-center gap-3">
                <span className="text-3xl">{card.icon}</span>
                <div>
                  <h4 className="text-lg font-semibold text-pure-black">
                    {card.title}
                  </h4>
                  <p className="text-sm text-gray-600 mt-1">
                    {card.description}
                  </p>
                </div>
              </div>

              {!card.available && (
                <span className="bg-gray-200 text-gray-500 text-xs px-2 py-1 rounded-full">
                  Unavailable
                </span>
              )}
            </div>

            {/* Includes */}
            {card.includes.length > 0 && (
              <div className="mb-4">
                <p className="text-sm font-medium text-gray-700 mb-2">Includes:</p>
                <ul className="text-sm text-gray-600 space-y-1">
                  {card.includes.map((item, index) => (
                    <li key={index} className="flex items-center gap-2">
                      <span className="w-1.5 h-1.5 bg-gray-400 rounded-full"></span>
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Export Button */}
            <div className="mt-2">
              <button
                onClick={() => handleExport(card.type)}
                disabled={!card.available || exporting[card.type]}
                className={`w-full py-3 px-4 rounded-lg font-medium transition-all duration-200 ${
                  card.available && !exporting[card.type]
                    ? 'bg-pure-black text-pearl hover:bg-soft-black'
                    : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                }`}
              >
                {exporting[card.type] ? (
                  <div className="flex items-center justify-center gap-2">
                    <div className="w-4 h-4 border-2 border-gray-400 border-t-transparent rounded-full animate-spin"></div>
                    Exporting...
                  </div>
                ) : (
                  `Export ${card.title}`
                )}
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Export Info */}
      <div className="bg-gray-50 rounded-lg p-6 w-full">
        <h4 className="font-semibold text-pure-black mb-4">📋 Export Information</h4>

        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <h5 className="font-medium text-gray-800 mb-2">File Details</h5>
            <ul className="text-sm text-gray-600 space-y-1">
              <li>• Format: PDF document</li>
              <li>• Quality: High-resolution text</li>
              <li>• Compatibility: All devices</li>
              <li>• Size: Optimized for sharing</li>
            </ul>
          </div>

          <div>
            <h5 className="font-medium text-gray-800 mb-2">Usage Tips</h5>
            <ul className="text-sm text-gray-600 space-y-1">
              <li>• Save for offline studying</li>
              <li>• Print for physical notes</li>
              <li>• Share with classmates</li>
              <li>• Archive for future reference</li>
            </ul>
          </div>
        </div>

        <div className="mt-4 pt-4 border-t border-gray-200">
          <p className="text-xs text-gray-500">
            PDFs are generated on-demand and include all the latest content from your analysis.
            Downloads will start automatically when ready.
          </p>
        </div>
      </div>

    </div>
  );
};

export default ExportOptions;
