import React from 'react';
import { Loader2, FileText, Brain, Briefcase, Sparkles } from 'lucide-react';

interface LoadingOverlayProps {
  isVisible: boolean;
  stage: 'extracting' | 'analyzing' | 'generating' | 'completing';
  fileName?: string;
}

export const LoadingOverlay: React.FC<LoadingOverlayProps> = ({ 
  isVisible, 
  stage, 
  fileName 
}) => {
  if (!isVisible) return null;

  const getStageInfo = () => {
    switch (stage) {
      case 'extracting':
        return {
          icon: <FileText className="h-8 w-8 text-indigo-600" />,
          title: 'Extracting Text',
          message: `Reading content from ${fileName || 'your resume'}...`,
          progress: 25
        };
      case 'analyzing':
        return {
          icon: <Brain className="h-8 w-8 text-purple-600" />,
          title: 'Analyzing Skills',
          message: 'Identifying your technical and soft skills...',
          progress: 50
        };
      case 'generating':
        return {
          icon: <Briefcase className="h-8 w-8 text-blue-600" />,
          title: 'Generating Suggestions',
          message: 'Finding relevant job roles and opportunities...',
          progress: 75
        };
      case 'completing':
        return {
          icon: <Sparkles className="h-8 w-8 text-green-600" />,
          title: 'Finalizing Analysis',
          message: 'Preparing your personalized career insights...',
          progress: 95
        };
      default:
        return {
          icon: <Loader2 className="h-8 w-8 text-indigo-600" />,
          title: 'Processing',
          message: 'Please wait...',
          progress: 50
        };
    }
  };

  const stageInfo = getStageInfo();

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl shadow-2xl p-8 max-w-md w-full mx-4">
        <div className="text-center">
          {/* Icon with animation */}
          <div className="flex items-center justify-center mb-6">
            <div className="relative">
              {stageInfo.icon}
              <div className="absolute inset-0 animate-ping">
                <Loader2 className="h-8 w-8 text-gray-300 animate-spin" />
              </div>
            </div>
          </div>
          
          {/* Title and message */}
          <h3 className="text-xl font-semibold text-gray-900 mb-2">
            {stageInfo.title}
          </h3>
          <p className="text-gray-600 mb-6">
            {stageInfo.message}
          </p>
          
          {/* Progress bar */}
          <div className="w-full bg-gray-200 rounded-full h-2 mb-4">
            <div 
              className="bg-indigo-600 h-2 rounded-full transition-all duration-500 ease-out"
              style={{ width: `${stageInfo.progress}%` }}
            />
          </div>
          
          {/* Progress percentage */}
          <div className="flex items-center justify-between text-sm text-gray-500">
            <span>Analyzing resume...</span>
            <span>{stageInfo.progress}%</span>
          </div>
        </div>
      </div>
    </div>
  );
};