import React from 'react';
import { FileText, AlertCircle, CheckCircle, Copy } from 'lucide-react';
import { TextExtractionResult } from '../services/textExtraction';

interface TextPreviewProps {
  extractionResult: TextExtractionResult | null;
  isExtracting: boolean;
  fileName?: string;
}

export const TextPreview: React.FC<TextPreviewProps> = ({ 
  extractionResult, 
  isExtracting, 
  fileName 
}) => {
  const copyToClipboard = async () => {
    if (extractionResult?.text) {
      try {
        await navigator.clipboard.writeText(extractionResult.text);
        // You could add a toast notification here
      } catch (err) {
        console.error('Failed to copy text:', err);
      }
    }
  };

  if (!isExtracting && !extractionResult) {
    return null;
  }

  return (
    <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-200">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-2">
          <FileText className="h-5 w-5 text-indigo-600" />
          <h3 className="font-semibold text-gray-900">Text Preview</h3>
          {fileName && (
            <span className="text-sm text-gray-500">({fileName})</span>
          )}
        </div>
        
        {extractionResult && !extractionResult.error && (
          <div className="flex items-center space-x-3">
            <span className="text-sm text-gray-600">
              {extractionResult.wordCount.toLocaleString()} words
            </span>
            <button
              onClick={copyToClipboard}
              className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors duration-200"
              title="Copy to clipboard"
            >
              <Copy className="h-4 w-4" />
            </button>
          </div>
        )}
      </div>

      <div className="min-h-[200px] max-h-[400px] overflow-y-auto">
        {isExtracting ? (
          <div className="flex items-center justify-center h-48">
            <div className="text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600 mx-auto mb-3"></div>
              <p className="text-sm text-gray-600">Extracting text from resume...</p>
            </div>
          </div>
        ) : extractionResult?.error ? (
          <div className="flex items-center space-x-2 p-4 bg-red-50 border border-red-200 rounded-lg">
            <AlertCircle className="h-5 w-5 text-red-600 flex-shrink-0" />
            <div>
              <p className="text-sm font-medium text-red-800">Extraction Failed</p>
              <p className="text-sm text-red-600 mt-1">{extractionResult.error}</p>
            </div>
          </div>
        ) : extractionResult?.text ? (
          <div>
            <div className="flex items-center space-x-2 mb-3 p-2 bg-green-50 border border-green-200 rounded-lg">
              <CheckCircle className="h-4 w-4 text-green-600" />
              <span className="text-sm font-medium text-green-800">Text extracted successfully</span>
            </div>
            
            <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
              <pre className="whitespace-pre-wrap text-sm text-gray-700 font-mono leading-relaxed">
                {extractionResult.text}
              </pre>
            </div>
          </div>
        ) : null}
      </div>
    </div>
  );
};