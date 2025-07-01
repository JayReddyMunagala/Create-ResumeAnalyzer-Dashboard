import React from 'react';
import { FileText, Sparkles, Clock, Zap } from 'lucide-react';

interface HeaderProps {
  onShowHistory?: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onShowHistory }) => {
  return (
    <header className="bg-white border-b border-gray-200 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-indigo-600 rounded-lg">
              <FileText className="h-6 w-6 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-gray-900">ResumeAnalyzer</h1>
              <p className="text-sm text-gray-500">AI-Powered Career Intelligence & ATS Optimization</p>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            {onShowHistory && (
              <button
                onClick={onShowHistory}
                className="flex items-center space-x-2 px-3 py-2 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-lg transition-colors duration-200"
              >
                <Clock className="h-4 w-4" />
                <span className="text-sm font-medium">History</span>
              </button>
            )}
            <div className="flex items-center space-x-2 text-sm text-gray-600">
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-1">
                  <Sparkles className="h-4 w-4" />
                  <span>AI Analysis</span>
                </div>
                <div className="flex items-center space-x-1">
                  <Zap className="h-4 w-4" />
                  <span>ATS Matching</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};