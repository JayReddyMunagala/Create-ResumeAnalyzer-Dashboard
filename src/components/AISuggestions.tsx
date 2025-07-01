import React, { useState, useEffect } from 'react';
import { Sparkles, Loader2, AlertCircle, RefreshCw, Target, TrendingUp, XCircle, CheckCircle } from 'lucide-react';
import { OpenAIService } from '../services/openAIService';

interface CareerCoachAnalysis {
  suitableJobTitles: string[];
  missingSkills: {
    jobTitle: string;
    requiredSkills: string[];
    preferredSkills: string[];
  }[];
  improvements: string[];
  overallAssessment: string;
}

interface AISuggestionsProps {
  resumeText: string | null;
  isVisible: boolean;
  onSuggestionsGenerated?: (suggestions: string) => void;
}

export const AISuggestions: React.FC<AISuggestionsProps> = ({ 
  resumeText, 
  isVisible, 
  onSuggestionsGenerated 
}) => {
  const [suggestions, setSuggestions] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'suggestions' | 'analysis'>('suggestions');
  const [careerAnalysis, setCareerAnalysis] = useState<CareerCoachAnalysis | null>(null);
  const [isLoadingAnalysis, setIsLoadingAnalysis] = useState(false);
  const [analysisError, setAnalysisError] = useState<string | null>(null);

  const generateSuggestions = async () => {
    if (!resumeText) return;

    setIsLoading(true);
    setError(null);
    
    try {
      const result = await OpenAIService.generateResumeTips(resumeText);
      setSuggestions(result);
      onSuggestionsGenerated?.(result);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to generate suggestions');
    } finally {
      setIsLoading(false);
    }
  };

  const generateCareerAnalysis = async () => {
    if (!resumeText) return;

    setIsLoadingAnalysis(true);
    setAnalysisError(null);
    
    try {
      const result = await OpenAIService.generateCareerCoachAnalysis(resumeText);
      setCareerAnalysis(result);
    } catch (err) {
      setAnalysisError(err instanceof Error ? err.message : 'Failed to generate career analysis');
    } finally {
      setIsLoadingAnalysis(false);
    }
  };

  useEffect(() => {
    if (isVisible && resumeText && !suggestions && !isLoading) {
      generateSuggestions();
    }
  }, [isVisible, resumeText]);

  if (!isVisible || !resumeText) {
    return null;
  }

  return (
    <div className="bg-gradient-to-br from-purple-50 to-indigo-50 rounded-xl shadow-lg p-6 border border-purple-200">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-2">
          <div className="p-2 bg-purple-100 rounded-lg">
            <Sparkles className="h-5 w-5 text-purple-600" />
          </div>
          <h2 className="text-lg font-semibold text-gray-900">AI Career Coaching</h2>
          <span className="px-2 py-1 text-xs bg-purple-100 text-purple-700 rounded-full font-medium">
            Powered by AI
          </span>
        </div>
        
        <div className="flex items-center space-x-2">
          {activeTab === 'analysis' && careerAnalysis && !isLoadingAnalysis && (
            <button
              onClick={generateCareerAnalysis}
              disabled={isLoadingAnalysis}
              className="p-2 text-purple-600 hover:text-purple-700 hover:bg-purple-100 rounded-lg transition-colors duration-200"
              title="Generate new analysis"
            >
              <RefreshCw className="h-4 w-4" />
            </button>
          )}
          {activeTab === 'suggestions' && suggestions && !isLoading && (
            <button
              onClick={generateSuggestions}
              disabled={isLoading}
              className="p-2 text-purple-600 hover:text-purple-700 hover:bg-purple-100 rounded-lg transition-colors duration-200"
              title="Generate new suggestions"
            >
              <RefreshCw className="h-4 w-4" />
            </button>
          )}
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="flex space-x-1 mb-4 bg-white p-1 rounded-lg">
        <button
          onClick={() => setActiveTab('suggestions')}
          className={`flex-1 px-3 py-2 text-sm font-medium rounded-md transition-colors duration-200 ${
            activeTab === 'suggestions'
              ? 'bg-purple-100 text-purple-700'
              : 'text-gray-600 hover:text-gray-800 hover:bg-gray-50'
          }`}
        >
          Quick Tips
        </button>
        <button
          onClick={() => {
            setActiveTab('analysis');
            if (!careerAnalysis && !isLoadingAnalysis) {
              generateCareerAnalysis();
            }
          }}
          className={`flex-1 px-3 py-2 text-sm font-medium rounded-md transition-colors duration-200 ${
            activeTab === 'analysis'
              ? 'bg-purple-100 text-purple-700'
              : 'text-gray-600 hover:text-gray-800 hover:bg-gray-50'
          }`}
        >
          Career Analysis
        </button>
      </div>

      <div className="min-h-[200px]">
        {activeTab === 'suggestions' ? (
          <SuggestionsTab 
            suggestions={suggestions}
            isLoading={isLoading}
            error={error}
            onRetry={generateSuggestions}
          />
        ) : (
          <CareerAnalysisTab
            analysis={careerAnalysis}
            isLoading={isLoadingAnalysis}
            error={analysisError}
            onRetry={generateCareerAnalysis}
          />
        )}
      </div>

      {/* Setup Instructions for Real OpenAI Integration */}
      {!import.meta.env.VITE_OPENAI_API_KEY && (suggestions || careerAnalysis) && (
        <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
          <div className="flex items-start space-x-2">
            <AlertCircle className="h-4 w-4 text-blue-600 mt-0.5 flex-shrink-0" />
            <div>
              <p className="text-xs font-medium text-blue-800">Using Mock AI Response</p>
              <p className="text-xs text-blue-600 mt-1">
                To enable real OpenAI analysis, add your API key to <code className="bg-blue-100 px-1 rounded">.env</code> as <code className="bg-blue-100 px-1 rounded">VITE_OPENAI_API_KEY</code>
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

interface SuggestionsTabProps {
  suggestions: string;
  isLoading: boolean;
  error: string | null;
  onRetry: () => void;
}

const SuggestionsTab: React.FC<SuggestionsTabProps> = ({ suggestions, isLoading, error, onRetry }) => {
  return (
    <div>
      {isLoading ? (
        <div className="flex items-center space-x-3 py-4">
          <Loader2 className="h-5 w-5 animate-spin text-purple-600" />
          <div>
            <p className="text-sm font-medium text-purple-800">Analyzing your resume...</p>
            <p className="text-xs text-purple-600">Generating personalized tips for tech roles</p>
          </div>
        </div>
      ) : error ? (
        <div className="flex items-start space-x-3 p-4 bg-red-50 border border-red-200 rounded-lg">
          <AlertCircle className="h-5 w-5 text-red-600 flex-shrink-0 mt-0.5" />
          <div>
            <p className="text-sm font-medium text-red-800">Unable to generate suggestions</p>
            <p className="text-xs text-red-600 mt-1">{error}</p>
            <button
              onClick={onRetry}
              className="mt-2 text-xs text-red-700 hover:text-red-800 font-medium underline"
            >
              Try again
            </button>
          </div>
        </div>
      ) : suggestions ? (
        <div className="space-y-4">
          <div className="bg-white p-4 rounded-lg border border-purple-200 shadow-sm">
            <div className="prose prose-sm max-w-none">
              {suggestions.split('\n').map((paragraph, index) => {
                if (paragraph.trim() === '') return null;
                
                // Handle bold headers
                if (paragraph.includes('**')) {
                  const parts = paragraph.split('**');
                  return (
                    <p key={index} className="mb-3">
                      {parts.map((part, i) => 
                        i % 2 === 1 ? (
                          <strong key={i} className="text-gray-900 font-semibold">{part}</strong>
                        ) : (
                          <span key={i} className="text-gray-700">{part}</span>
                        )
                      )}
                    </p>
                  );
                }
                
                return (
                  <p key={index} className="text-gray-700 mb-2 leading-relaxed">
                    {paragraph}
                  </p>
                );
              })}
            </div>
          </div>
          
          <div className="flex items-center space-x-2 text-xs text-purple-600">
            <Sparkles className="h-3 w-3" />
            <span>Tips are personalized based on your resume content and current tech industry trends</span>
          </div>
        </div>
      ) : (
        <div className="flex items-center justify-center py-8">
          <div className="text-center">
            <Sparkles className="h-8 w-8 text-purple-300 mx-auto mb-2" />
            <p className="text-sm text-purple-600">Ready to analyze your resume</p>
          </div>
        </div>
      )}
    </div>
  );
};

interface CareerAnalysisTabProps {
  analysis: CareerCoachAnalysis | null;
  isLoading: boolean;
  error: string | null;
  onRetry: () => void;
}

const CareerAnalysisTab: React.FC<CareerAnalysisTabProps> = ({ analysis, isLoading, error, onRetry }) => {
  if (isLoading) {
    return (
      <div className="flex items-center space-x-3 py-8">
        <Loader2 className="h-6 w-6 animate-spin text-purple-600" />
        <div>
          <p className="text-sm font-medium text-purple-800">Conducting comprehensive career analysis...</p>
          <p className="text-xs text-purple-600">Analyzing job fit, skills gaps, and growth opportunities</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-start space-x-3 p-4 bg-red-50 border border-red-200 rounded-lg">
        <AlertCircle className="h-5 w-5 text-red-600 flex-shrink-0 mt-0.5" />
        <div>
          <p className="text-sm font-medium text-red-800">Unable to generate career analysis</p>
          <p className="text-xs text-red-600 mt-1">{error}</p>
          <button
            onClick={onRetry}
            className="mt-2 text-xs text-red-700 hover:text-red-800 font-medium underline"
          >
            Try again
          </button>
        </div>
      </div>
    );
  }

  if (!analysis) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center">
          <Target className="h-10 w-10 text-purple-300 mx-auto mb-3" />
          <p className="text-sm text-purple-600">Career analysis will appear here</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Job Title Suitability */}
      <div className="bg-white rounded-lg border border-purple-200 p-4">
        <div className="flex items-center space-x-2 mb-3">
          <Target className="h-5 w-5 text-indigo-600" />
          <h3 className="font-semibold text-gray-900">Suitable Job Titles</h3>
        </div>
        <div className="flex flex-wrap gap-2">
          {analysis.suitableJobTitles.map((title, index) => (
            <span key={index} className="px-3 py-1 bg-indigo-100 text-indigo-800 rounded-full text-sm font-medium">
              {title}
            </span>
          ))}
        </div>
      </div>

      {/* Skills Gap Analysis */}
      {analysis.missingSkills.length > 0 && (
        <div className="bg-white rounded-lg border border-purple-200 p-4">
          <div className="flex items-center space-x-2 mb-3">
            <TrendingUp className="h-5 w-5 text-orange-600" />
            <h3 className="font-semibold text-gray-900">Skills Gap Analysis</h3>
          </div>
          <div className="space-y-4">
            {analysis.missingSkills.map((skillGap, index) => (
              <div key={index} className="border border-gray-200 rounded-lg p-3">
                <h4 className="font-medium text-gray-900 mb-2">{skillGap.jobTitle}</h4>
                <div className="space-y-2">
                  {skillGap.requiredSkills.length > 0 && (
                    <div>
                      <p className="text-xs font-medium text-red-700 mb-1">Missing Required Skills:</p>
                      <div className="flex flex-wrap gap-1">
                        {skillGap.requiredSkills.map((skill, skillIndex) => (
                          <span key={skillIndex} className="px-2 py-1 bg-red-100 text-red-700 rounded text-xs flex items-center space-x-1">
                            <XCircle className="h-3 w-3" />
                            <span>{skill}</span>
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                  {skillGap.preferredSkills.length > 0 && (
                    <div>
                      <p className="text-xs font-medium text-orange-700 mb-1">Missing Preferred Skills:</p>
                      <div className="flex flex-wrap gap-1">
                        {skillGap.preferredSkills.map((skill, skillIndex) => (
                          <span key={skillIndex} className="px-2 py-1 bg-orange-100 text-orange-700 rounded text-xs">
                            {skill}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Improvements */}
      <div className="bg-white rounded-lg border border-purple-200 p-4">
        <div className="flex items-center space-x-2 mb-3">
          <CheckCircle className="h-5 w-5 text-green-600" />
          <h3 className="font-semibold text-gray-900">Actionable Improvements</h3>
        </div>
        <ul className="space-y-2">
          {analysis.improvements.map((improvement, index) => (
            <li key={index} className="flex items-start space-x-2 text-sm text-gray-700">
              <div className="w-5 h-5 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                <span className="text-xs font-bold text-green-600">{index + 1}</span>
              </div>
              <span>{improvement}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* Overall Assessment */}
      <div className="bg-gradient-to-r from-green-50 to-blue-50 rounded-lg border border-green-200 p-4">
        <div className="flex items-center space-x-2 mb-3">
          <Sparkles className="h-5 w-5 text-green-600" />
          <h3 className="font-semibold text-gray-900">Overall Assessment</h3>
        </div>
        <p className="text-sm text-gray-700 leading-relaxed">{analysis.overallAssessment}</p>
      </div>
    </div>
  );
};