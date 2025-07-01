import React, { useState, useEffect } from 'react';
import { 
  Clock, 
  FileText, 
  Trash2, 
  Eye, 
  ArrowLeft, 
  Download,
  Search,
  Calendar,
  BarChart3,
  Target,
  Sparkles,
  AlertCircle,
  CheckCircle
} from 'lucide-react';
import { AnalysisHistoryService, StoredAnalysis } from '../services/analysisHistory';

interface AnalysisHistoryProps {
  onBack: () => void;
  onLoadAnalysis: (analysis: StoredAnalysis) => void;
}

export const AnalysisHistory: React.FC<AnalysisHistoryProps> = ({ onBack, onLoadAnalysis }) => {
  const [analyses, setAnalyses] = useState<StoredAnalysis[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedAnalysis, setSelectedAnalysis] = useState<StoredAnalysis | null>(null);
  const [storageInfo, setStorageInfo] = useState({ used: 0, available: 0, analysisCount: 0 });

  useEffect(() => {
    loadAnalyses();
    updateStorageInfo();
  }, []);

  const loadAnalyses = () => {
    const allAnalyses = AnalysisHistoryService.getAllAnalyses();
    setAnalyses(allAnalyses);
  };

  const updateStorageInfo = () => {
    const info = AnalysisHistoryService.getStorageInfo();
    setStorageInfo(info);
  };

  const handleDeleteAnalysis = (id: string, event: React.MouseEvent) => {
    event.stopPropagation();
    if (window.confirm('Are you sure you want to delete this analysis?')) {
      AnalysisHistoryService.deleteAnalysis(id);
      loadAnalyses();
      updateStorageInfo();
      if (selectedAnalysis?.id === id) {
        setSelectedAnalysis(null);
      }
    }
  };

  const handleClearAll = () => {
    if (window.confirm('Are you sure you want to delete all analysis history?')) {
      AnalysisHistoryService.clearAllAnalyses();
      loadAnalyses();
      updateStorageInfo();
      setSelectedAnalysis(null);
    }
  };

  const handleLoadAnalysis = (analysis: StoredAnalysis) => {
    onLoadAnalysis(analysis);
    onBack();
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
  };

  const filteredAnalyses = analyses.filter(analysis =>
    analysis.fileName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    formatDate(analysis.analyzedAt).toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getMatchColor = (match: number) => {
    if (match >= 80) return 'text-green-600 bg-green-100';
    if (match >= 60) return 'text-yellow-600 bg-yellow-100';
    return 'text-red-600 bg-red-100';
  };

  if (selectedAnalysis) {
    return <AnalysisDetailView analysis={selectedAnalysis} onBack={() => setSelectedAnalysis(null)} />;
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center space-x-4">
          <button
            onClick={onBack}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors duration-200"
          >
            <ArrowLeft className="h-5 w-5 text-gray-600" />
          </button>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Analysis History</h1>
            <p className="text-gray-600">View and manage your previous resume analyses</p>
          </div>
        </div>
        
        {analyses.length > 0 && (
          <button
            onClick={handleClearAll}
            className="px-4 py-2 text-red-600 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors duration-200 font-medium"
          >
            Clear All
          </button>
        )}
      </div>

      {/* Storage Info */}
      <div className="bg-gray-50 rounded-lg p-4 mb-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <BarChart3 className="h-4 w-4 text-gray-600" />
            <span className="text-sm font-medium text-gray-700">Storage Usage</span>
          </div>
          <span className="text-sm text-gray-600">
            {storageInfo.analysisCount} analyses • {formatFileSize(storageInfo.used)} used
          </span>
        </div>
      </div>

      {/* Search */}
      {analyses.length > 0 && (
        <div className="relative mb-6">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search by filename or date..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
          />
        </div>
      )}

      {/* Analysis List */}
      {filteredAnalyses.length === 0 ? (
        <div className="text-center py-12">
          <Clock className="h-12 w-12 text-gray-300 mx-auto mb-4" />
          {analyses.length === 0 ? (
            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">No Analysis History</h3>
              <p className="text-gray-600 mb-4">Upload and analyze a resume to start building your history</p>
              <button
                onClick={onBack}
                className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors duration-200"
              >
                Analyze Resume
              </button>
            </div>
          ) : (
            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">No matching analyses</h3>
              <p className="text-gray-600">Try adjusting your search term</p>
            </div>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {filteredAnalyses.map((analysis) => (
            <AnalysisCard
              key={analysis.id}
              analysis={analysis}
              onView={(analysis) => setSelectedAnalysis(analysis)}
              onLoad={handleLoadAnalysis}
              onDelete={handleDeleteAnalysis}
              formatDate={formatDate}
              formatFileSize={formatFileSize}
              getMatchColor={getMatchColor}
            />
          ))}
        </div>
      )}
    </div>
  );
};

interface AnalysisCardProps {
  analysis: StoredAnalysis;
  onView: (analysis: StoredAnalysis) => void;
  onLoad: (analysis: StoredAnalysis) => void;
  onDelete: (id: string, event: React.MouseEvent) => void;
  formatDate: (date: string) => string;
  formatFileSize: (bytes: number) => string;
  getMatchColor: (match: number) => string;
}

const AnalysisCard: React.FC<AnalysisCardProps> = ({
  analysis,
  onView,
  onLoad,
  onDelete,
  formatDate,
  formatFileSize,
  getMatchColor
}) => {
  const topJobMatch = analysis.jobSuggestions[0];
  const hasAISuggestions = Boolean(analysis.aiSuggestions);
  const hasJobComparisons = analysis.targetJobComparisons.length > 0;

  return (
    <div className="bg-white rounded-xl shadow-lg border border-gray-200 hover:shadow-xl transition-shadow duration-200">
      <div className="p-6">
        {/* Header */}
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-start space-x-3">
            <div className="p-2 bg-indigo-100 rounded-lg">
              <FileText className="h-5 w-5 text-indigo-600" />
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 truncate max-w-[200px]">
                {analysis.fileName}
              </h3>
              <div className="flex items-center space-x-2 text-sm text-gray-500">
                <Calendar className="h-3 w-3" />
                <span>{formatDate(analysis.analyzedAt)}</span>
              </div>
            </div>
          </div>
          
          <button
            onClick={(e) => onDelete(analysis.id, e)}
            className="p-1 hover:bg-red-100 rounded-full transition-colors duration-200 group"
          >
            <Trash2 className="h-4 w-4 text-gray-400 group-hover:text-red-600" />
          </button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 gap-4 mb-4">
          <div className="bg-gray-50 rounded-lg p-3">
            <div className="flex items-center space-x-2 mb-1">
              <BarChart3 className="h-4 w-4 text-blue-600" />
              <span className="text-xs font-medium text-gray-700">Skills</span>
            </div>
            <p className="text-lg font-bold text-blue-600">{analysis.skills.totalSkills}</p>
          </div>
          
          <div className="bg-gray-50 rounded-lg p-3">
            <div className="flex items-center space-x-2 mb-1">
              <Target className="h-4 w-4 text-green-600" />
              <span className="text-xs font-medium text-gray-700">Jobs</span>
            </div>
            <p className="text-lg font-bold text-green-600">{analysis.jobSuggestions.length}</p>
          </div>
        </div>

        {/* Top Job Match */}
        {topJobMatch && (
          <div className="bg-gradient-to-r from-indigo-50 to-purple-50 rounded-lg p-3 mb-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-900">{topJobMatch.title}</p>
                <p className="text-xs text-gray-600">{topJobMatch.company}</p>
              </div>
              <span className={`px-2 py-1 rounded-full text-xs font-medium ${getMatchColor(topJobMatch.match)}`}>
                {topJobMatch.match}% match
              </span>
            </div>
          </div>
        )}

        {/* Features */}
        <div className="flex items-center space-x-4 mb-4 text-xs">
          {hasAISuggestions && (
            <div className="flex items-center space-x-1 text-purple-600">
              <Sparkles className="h-3 w-3" />
              <span>AI Tips</span>
            </div>
          )}
          {hasJobComparisons && (
            <div className="flex items-center space-x-1 text-blue-600">
              <Target className="h-3 w-3" />
              <span>{analysis.targetJobComparisons.length} Comparisons</span>
            </div>
          )}
          <div className="flex items-center space-x-1 text-gray-500">
            <FileText className="h-3 w-3" />
            <span>{formatFileSize(analysis.fileSize)}</span>
          </div>
        </div>

        {/* Actions */}
        <div className="flex space-x-2">
          <button
            onClick={() => onView(analysis)}
            className="flex-1 px-3 py-2 text-sm bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors duration-200 flex items-center justify-center space-x-1"
          >
            <Eye className="h-4 w-4" />
            <span>View Details</span>
          </button>
          <button
            onClick={() => onLoad(analysis)}
            className="flex-1 px-3 py-2 text-sm bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors duration-200 flex items-center justify-center space-x-1"
          >
            <Download className="h-4 w-4" />
            <span>Load Analysis</span>
          </button>
        </div>
      </div>
    </div>
  );
};

interface AnalysisDetailViewProps {
  analysis: StoredAnalysis;
  onBack: () => void;
}

const AnalysisDetailView: React.FC<AnalysisDetailViewProps> = ({ analysis, onBack }) => {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex items-center space-x-4 mb-8">
        <button
          onClick={onBack}
          className="p-2 hover:bg-gray-100 rounded-lg transition-colors duration-200"
        >
          <ArrowLeft className="h-5 w-5 text-gray-600" />
        </button>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">{analysis.fileName}</h1>
          <p className="text-gray-600">Analyzed on {formatDate(analysis.analyzedAt)}</p>
        </div>
      </div>

      <div className="space-y-6">
        {/* Overview */}
        <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Analysis Overview</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-indigo-50 rounded-lg p-4">
              <div className="flex items-center space-x-2 mb-2">
                <FileText className="h-5 w-5 text-indigo-600" />
                <span className="font-medium text-indigo-900">Document</span>
              </div>
              <p className="text-indigo-800 font-semibold">{analysis.wordCount} words</p>
            </div>
            <div className="bg-blue-50 rounded-lg p-4">
              <div className="flex items-center space-x-2 mb-2">
                <BarChart3 className="h-5 w-5 text-blue-600" />
                <span className="font-medium text-blue-900">Skills Found</span>
              </div>
              <p className="text-blue-800 font-semibold">{analysis.skills.totalSkills} total</p>
            </div>
            <div className="bg-green-50 rounded-lg p-4">
              <div className="flex items-center space-x-2 mb-2">
                <Target className="h-5 w-5 text-green-600" />
                <span className="font-medium text-green-900">Job Matches</span>
              </div>
              <p className="text-green-800 font-semibold">{analysis.jobSuggestions.length} suggestions</p>
            </div>
          </div>
        </div>

        {/* AI Suggestions */}
        {analysis.aiSuggestions && (
          <div className="bg-gradient-to-br from-purple-50 to-indigo-50 rounded-xl shadow-lg p-6 border border-purple-200">
            <div className="flex items-center space-x-2 mb-4">
              <Sparkles className="h-6 w-6 text-purple-600" />
              <h2 className="text-lg font-semibold text-gray-900">AI Suggestions</h2>
            </div>
            <div className="bg-white p-4 rounded-lg border border-purple-200">
              <p className="text-gray-700 leading-relaxed">{analysis.aiSuggestions}</p>
            </div>
          </div>
        )}

        {/* Job Suggestions */}
        <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Job Suggestions</h2>
          <div className="space-y-3">
            {analysis.jobSuggestions.slice(0, 5).map((job, index) => (
              <div key={index} className="p-4 border border-gray-200 rounded-lg">
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <h3 className="font-semibold text-gray-900">{job.title}</h3>
                    <p className="text-sm text-gray-600">{job.company} • {job.location}</p>
                  </div>
                  <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm font-medium">
                    {job.match}% match
                  </span>
                </div>
                <p className="text-sm text-gray-600 mb-2">{job.description}</p>
                <p className="text-sm font-medium text-green-600">{job.salary}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Job Comparisons */}
        {analysis.targetJobComparisons.length > 0 && (
          <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Target Job Comparisons</h2>
            <div className="space-y-4">
              {analysis.targetJobComparisons.map((comparison, index) => (
                <div key={index} className="p-4 border border-gray-200 rounded-lg">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="font-semibold text-gray-900">{comparison.jobTitle}</h3>
                    <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium">
                      {comparison.matchPercentage}% match
                    </span>
                  </div>
                  <p className="text-sm text-gray-600 mb-2">
                    Analyzed on {formatDate(comparison.analyzedAt)}
                  </p>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {comparison.missingRequiredSkills.length > 0 && (
                      <div>
                        <p className="text-sm font-medium text-red-700 mb-1">Missing Required Skills:</p>
                        <div className="flex flex-wrap gap-1">
                          {comparison.missingRequiredSkills.map((skill, skillIndex) => (
                            <span key={skillIndex} className="px-2 py-1 bg-red-100 text-red-700 rounded text-xs">
                              {skill}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                    {comparison.missingPreferredSkills.length > 0 && (
                      <div>
                        <p className="text-sm font-medium text-orange-700 mb-1">Missing Preferred Skills:</p>
                        <div className="flex flex-wrap gap-1">
                          {comparison.missingPreferredSkills.map((skill, skillIndex) => (
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
      </div>
    </div>
  );
};