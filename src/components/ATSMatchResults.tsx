import React from 'react';
import { 
  Zap, 
  CheckCircle, 
  XCircle, 
  TrendingUp, 
  AlertTriangle, 
  Target,
  Award,
  BookOpen,
  FileText,
  Settings,
  Users,
  Briefcase
} from 'lucide-react';
import { ATSMatchResult } from '../services/atsMatchingService';

interface ATSMatchResultsProps {
  result: ATSMatchResult;
  isVisible: boolean;
}

export const ATSMatchResults: React.FC<ATSMatchResultsProps> = ({ result, isVisible }) => {
  if (!isVisible) return null;

  // Use GPT analysis scores if available, otherwise fall back to local analysis
  const displayScore = result.gptAnalysis?.aiAnalysis.overallScore || result.overallScore;
  const gptBreakdown = result.gptAnalysis?.aiAnalysis.breakdown;

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-600 bg-green-100 border-green-200';
    if (score >= 60) return 'text-yellow-600 bg-yellow-100 border-yellow-200';
    return 'text-red-600 bg-red-100 border-red-200';
  };

  const getFormatColor = (format: string) => {
    if (format === 'Good') return 'text-green-600 bg-green-100 border-green-200';
    if (format === 'Fair') return 'text-yellow-600 bg-yellow-100 border-yellow-200';
    return 'text-red-600 bg-red-100 border-red-200';
  };

  const getScoreIcon = (score: number) => {
    if (score >= 80) return <CheckCircle className="h-6 w-6 text-green-600" />;
    if (score >= 60) return <AlertTriangle className="h-6 w-6 text-yellow-600" />;
    return <XCircle className="h-6 w-6 text-red-600" />;
  };

  const getImportanceColor = (importance: string) => {
    switch (importance) {
      case 'high': return 'bg-red-100 text-red-700 border-red-200';
      case 'medium': return 'bg-yellow-100 text-yellow-700 border-yellow-200';
      case 'low': return 'bg-green-100 text-green-700 border-green-200';
      default: return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'technical': return <Settings className="h-4 w-4" />;
      case 'soft': return <Users className="h-4 w-4" />;
      case 'industry': return <Briefcase className="h-4 w-4" />;
      default: return <BookOpen className="h-4 w-4" />;
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      {/* GPT Analysis Section */}
      {result.gptAnalysis && (
        <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl shadow-lg p-6 border border-purple-200">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-purple-100 rounded-lg">
                <Zap className="h-6 w-6 text-purple-600" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-gray-900">GPT-Powered ATS Analysis</h2>
                <p className="text-sm text-purple-600">
                  {result.gptAnalysis.isAIGenerated ? 'Live AI Analysis' : 'Mock AI Analysis (Add OpenAI API key for real analysis)'}
                </p>
              </div>
            </div>
            <div className={`px-6 py-3 rounded-full text-3xl font-bold border ${getScoreColor(displayScore)}`}>
              {displayScore}%
            </div>
          </div>

          {result.gptAnalysis.error ? (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
              <p className="text-red-800 font-medium">AI Analysis Error</p>
              <p className="text-red-600 text-sm">{result.gptAnalysis.error}</p>
            </div>
          ) : (
            <>
              {/* GPT Breakdown */}
              {gptBreakdown && (
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                  <div className="bg-white p-4 rounded-lg border border-purple-200">
                    <div className="flex items-center space-x-2 mb-2">
                      <FileText className="h-5 w-5 text-blue-600" />
                      <span className="font-medium text-gray-900">Keyword Match</span>
                    </div>
                    <p className="text-2xl font-bold text-blue-600">{gptBreakdown.keywordMatch}%</p>
                    <p className="text-sm text-gray-600">AI keyword analysis</p>
                  </div>
                  
                  <div className="bg-white p-4 rounded-lg border border-purple-200">
                    <div className="flex items-center space-x-2 mb-2">
                      <Award className="h-5 w-5 text-green-600" />
                      <span className="font-medium text-gray-900">Title Match</span>
                    </div>
                    <p className="text-2xl font-bold text-green-600">{gptBreakdown.titleMatch}%</p>
                    <p className="text-sm text-gray-600">Role alignment</p>
                  </div>
                  
                  <div className="bg-white p-4 rounded-lg border border-purple-200">
                    <div className="flex items-center space-x-2 mb-2">
                      <Zap className="h-5 w-5 text-orange-600" />
                      <span className="font-medium text-gray-900">Formatting</span>
                    </div>
                    <p className="text-2xl font-bold text-orange-600">{gptBreakdown.formatting}%</p>
                    <p className="text-sm text-gray-600">ATS readability</p>
                  </div>
                  
                  <div className="bg-white p-4 rounded-lg border border-purple-200">
                    <div className="flex items-center space-x-2 mb-2">
                      <Target className="h-5 w-5 text-purple-600" />
                      <span className="font-medium text-gray-900">Skill Overlap</span>
                    </div>
                    <p className="text-2xl font-bold text-purple-600">{gptBreakdown.skillOverlap}%</p>
                    <p className="text-sm text-gray-600">Skills alignment</p>
                  </div>
                </div>
              )}

              {/* AI Explanation */}
              <div className="bg-white p-4 rounded-lg border border-purple-200 mb-4">
                <h4 className="font-medium text-gray-900 mb-2 flex items-center space-x-2">
                  <Zap className="h-4 w-4 text-purple-600" />
                  <span>AI Analysis Explanation</span>
                </h4>
                <p className="text-gray-700 text-sm leading-relaxed">
                  {result.gptAnalysis.aiAnalysis.explanation}
                </p>
              </div>

              {/* AI Suggestions */}
              <div className="bg-white p-4 rounded-lg border border-purple-200">
                <h4 className="font-medium text-gray-900 mb-3 flex items-center space-x-2">
                  <TrendingUp className="h-4 w-4 text-purple-600" />
                  <span>AI-Generated Improvement Suggestions</span>
                </h4>
                <div className="space-y-2">
                  {result.gptAnalysis.aiAnalysis.suggestions.map((suggestion, index) => (
                    <div key={index} className="flex items-start space-x-3 p-2 bg-purple-50 rounded-lg">
                      <div className="w-5 h-5 bg-purple-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                        <span className="text-xs font-bold text-purple-600">{index + 1}</span>
                      </div>
                      <span className="text-sm text-gray-700">{suggestion}</span>
                    </div>
                  ))}
                </div>
              </div>
            </>
          )}
        </div>
      )}

      {/* Overall Score Header */}
      <div className="bg-gradient-to-br from-indigo-50 to-purple-50 rounded-xl shadow-lg p-6 border border-indigo-200">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-3">
            {getScoreIcon(displayScore)}
            <h2 className="text-2xl font-bold text-gray-900">Detailed Technical Analysis</h2>
          </div>
          <div className={`px-6 py-3 rounded-full text-3xl font-bold border ${getScoreColor(result.overallScore)}`}>
            {result.overallScore}%
          </div>
        </div>
        
        {/* Detailed Breakdown */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-white p-4 rounded-lg border border-indigo-200">
            <div className="flex items-center space-x-2 mb-2">
              <Target className="h-5 w-5 text-blue-600" />
              <span className="font-medium text-gray-900">Skill Match</span>
            </div>
            <p className="text-2xl font-bold text-blue-600">{result.breakdown.skillMatch}%</p>
            <p className="text-sm text-gray-600">Skills alignment</p>
          </div>
          
          <div className="bg-white p-4 rounded-lg border border-indigo-200">
            <div className="flex items-center space-x-2 mb-2">
              <FileText className="h-5 w-5 text-green-600" />
              <span className="font-medium text-gray-900">Keyword Match</span>
            </div>
            <p className="text-2xl font-bold text-green-600">{result.breakdown.keywordMatch}%</p>
            <p className="text-sm text-gray-600">Keyword density</p>
          </div>
          
          <div className="bg-white p-4 rounded-lg border border-indigo-200">
            <div className="flex items-center space-x-2 mb-2">
              <Award className="h-5 w-5 text-purple-600" />
              <span className="font-medium text-gray-900">Title Alignment</span>
            </div>
            <p className="text-2xl font-bold text-purple-600">{result.breakdown.titleAlignment}%</p>
            <p className="text-sm text-gray-600">Role relevance</p>
          </div>
          
          <div className="bg-white p-4 rounded-lg border border-indigo-200">
            <div className="flex items-center space-x-2 mb-2">
              <Zap className="h-5 w-5 text-orange-600" />
              <span className="font-medium text-gray-900">Format Check</span>
            </div>
            <p className={`text-2xl font-bold ${result.breakdown.formatCheck === 'Good' ? 'text-green-600' : result.breakdown.formatCheck === 'Fair' ? 'text-yellow-600' : 'text-red-600'}`}>
              {result.breakdown.formatCheck}
            </p>
            <p className="text-sm text-gray-600">ATS compatibility</p>
          </div>
        </div>
      </div>

      {/* Detailed Keyword Analysis */}
      <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-200">
        <div className="flex items-center space-x-2 mb-6">
          <FileText className="h-6 w-6 text-indigo-600" />
          <h3 className="text-lg font-semibold text-gray-900">Detailed Keyword Analysis</h3>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Nouns */}
          <div className="space-y-3">
            <h4 className="font-medium text-gray-900 flex items-center space-x-2">
              <Settings className="h-4 w-4 text-blue-600" />
              <span>Technical Nouns</span>
            </h4>
            <div className="space-y-2">
              <div>
                <p className="text-sm font-medium text-green-700 mb-1">Matched ({result.detailedKeywords.nouns.matched.length})</p>
                <div className="flex flex-wrap gap-1">
                  {result.detailedKeywords.nouns.matched.slice(0, 8).map((noun, index) => (
                    <span key={index} className="px-2 py-1 bg-green-100 text-green-700 rounded text-xs">
                      {noun}
                    </span>
                  ))}
                </div>
              </div>
              <div>
                <p className="text-sm font-medium text-red-700 mb-1">Missing ({result.detailedKeywords.nouns.missing.length})</p>
                <div className="flex flex-wrap gap-1">
                  {result.detailedKeywords.nouns.missing.slice(0, 6).map((noun, index) => (
                    <span key={index} className="px-2 py-1 bg-red-100 text-red-700 rounded text-xs">
                      {noun}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Verbs */}
          <div className="space-y-3">
            <h4 className="font-medium text-gray-900 flex items-center space-x-2">
              <TrendingUp className="h-4 w-4 text-green-600" />
              <span>Action Verbs</span>
            </h4>
            <div className="space-y-2">
              <div>
                <p className="text-sm font-medium text-green-700 mb-1">Matched ({result.detailedKeywords.verbs.matched.length})</p>
                <div className="flex flex-wrap gap-1">
                  {result.detailedKeywords.verbs.matched.slice(0, 8).map((verb, index) => (
                    <span key={index} className="px-2 py-1 bg-green-100 text-green-700 rounded text-xs">
                      {verb}
                    </span>
                  ))}
                </div>
              </div>
              <div>
                <p className="text-sm font-medium text-red-700 mb-1">Missing ({result.detailedKeywords.verbs.missing.length})</p>
                <div className="flex flex-wrap gap-1">
                  {result.detailedKeywords.verbs.missing.slice(0, 6).map((verb, index) => (
                    <span key={index} className="px-2 py-1 bg-red-100 text-red-700 rounded text-xs">
                      {verb}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Phrases */}
          <div className="space-y-3">
            <h4 className="font-medium text-gray-900 flex items-center space-x-2">
              <BookOpen className="h-4 w-4 text-purple-600" />
              <span>Key Phrases</span>
            </h4>
            <div className="space-y-2">
              <div>
                <p className="text-sm font-medium text-green-700 mb-1">Matched ({result.detailedKeywords.phrases.matched.length})</p>
                <div className="flex flex-wrap gap-1">
                  {result.detailedKeywords.phrases.matched.map((phrase, index) => (
                    <span key={index} className="px-2 py-1 bg-green-100 text-green-700 rounded text-xs">
                      {phrase}
                    </span>
                  ))}
                </div>
              </div>
              <div>
                <p className="text-sm font-medium text-red-700 mb-1">Missing ({result.detailedKeywords.phrases.missing.length})</p>
                <div className="flex flex-wrap gap-1">
                  {result.detailedKeywords.phrases.missing.map((phrase, index) => (
                    <span key={index} className="px-2 py-1 bg-red-100 text-red-700 rounded text-xs">
                      {phrase}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Skills Analysis with Points */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Matched Skills */}
        <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-200">
          <div className="flex items-center space-x-2 mb-4">
            <CheckCircle className="h-6 w-6 text-green-600" />
            <h3 className="text-lg font-semibold text-gray-900">Matched Skills</h3>
            <span className="px-2 py-1 text-xs bg-green-100 text-green-700 rounded-full font-medium">
              {result.skillsAnalysis.matchedSkills.reduce((sum, skill) => sum + skill.points, 0)} points earned
            </span>
          </div>
          
          <div className="space-y-3 max-h-64 overflow-y-auto">
            {result.skillsAnalysis.matchedSkills.map((skill, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-green-50 rounded-lg border border-green-200">
                <div className="flex items-center space-x-2">
                  {getCategoryIcon(skill.category)}
                  <span className="font-medium text-green-900">{skill.skill}</span>
                  <span className="text-xs text-green-600">({skill.frequency}x)</span>
                </div>
                <div className="flex items-center space-x-2">
                  <span className={`px-2 py-1 text-xs font-medium rounded-full border ${getImportanceColor(skill.importance)}`}>
                    {skill.importance}
                  </span>
                  <span className="px-2 py-1 text-xs bg-green-200 text-green-800 rounded-full font-bold">
                    +{skill.points}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Missing Skills */}
        <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-200">
          <div className="flex items-center space-x-2 mb-4">
            <XCircle className="h-6 w-6 text-red-600" />
            <h3 className="text-lg font-semibold text-gray-900">Missing Skills</h3>
            <span className="px-2 py-1 text-xs bg-red-100 text-red-700 rounded-full font-medium">
              -{result.skillsAnalysis.missingSkills.reduce((sum, skill) => sum + skill.pointsLost, 0)} points lost
            </span>
          </div>
          
          <div className="space-y-3 max-h-64 overflow-y-auto">
            {result.skillsAnalysis.missingSkills.map((skill, index) => (
              <div key={index} className="p-3 bg-red-50 rounded-lg border border-red-200">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center space-x-2">
                    {getCategoryIcon(skill.category)}
                    <span className="font-medium text-red-900">{skill.skill}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className={`px-2 py-1 text-xs font-medium rounded-full border ${getImportanceColor(skill.importance)}`}>
                      {skill.importance}
                    </span>
                    <span className="px-2 py-1 text-xs bg-red-200 text-red-800 rounded-full font-bold">
                      -{skill.pointsLost}
                    </span>
                  </div>
                </div>
                <div className="text-xs text-red-700">
                  <ul className="space-y-1">
                    {skill.suggestions.slice(0, 2).map((suggestion, i) => (
                      <li key={i} className="flex items-start space-x-1">
                        <span>•</span>
                        <span>{suggestion}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Title Analysis */}
      {result.titleAnalysis.jobTitles.length > 0 && (
        <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-200">
          <div className="flex items-center space-x-2 mb-4">
            <Award className="h-6 w-6 text-purple-600" />
            <h3 className="text-lg font-semibold text-gray-900">Title Alignment Analysis</h3>
            <span className={`px-3 py-1 rounded-full text-sm font-medium border ${getScoreColor(result.titleAnalysis.alignmentScore)}`}>
              {result.titleAnalysis.alignmentScore}% match
            </span>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            <div>
              <h4 className="font-medium text-gray-900 mb-2">Job Requires</h4>
              <div className="space-y-1">
                {result.titleAnalysis.jobTitles.map((title, index) => (
                  <span key={index} className="block px-2 py-1 bg-blue-100 text-blue-700 rounded text-sm">
                    {title}
                  </span>
                ))}
              </div>
            </div>
            
            <div>
              <h4 className="font-medium text-gray-900 mb-2">Resume Shows</h4>
              <div className="space-y-1">
                {result.titleAnalysis.resumeTitles.map((title, index) => (
                  <span key={index} className="block px-2 py-1 bg-gray-100 text-gray-700 rounded text-sm">
                    {title}
                  </span>
                ))}
              </div>
            </div>
            
            <div>
              <h4 className="font-medium text-gray-900 mb-2">Matches</h4>
              <div className="space-y-1">
                {result.titleAnalysis.matchingTitles.map((title, index) => (
                  <span key={index} className="block px-2 py-1 bg-green-100 text-green-700 rounded text-sm">
                    {title}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Format Analysis */}
      <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-200">
        <div className="flex items-center space-x-2 mb-4">
          <Zap className="h-6 w-6 text-orange-600" />
          <h3 className="text-lg font-semibold text-gray-900">Format Analysis</h3>
          <span className={`px-3 py-1 rounded-full text-sm font-medium border ${getFormatColor(result.formatAnalysis.overallFormatScore)}`}>
            {result.formatAnalysis.overallFormatScore}
          </span>
        </div>
        
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="flex items-center space-x-2">
            {result.formatAnalysis.hasBulletPoints ? 
              <CheckCircle className="h-5 w-5 text-green-600" /> : 
              <XCircle className="h-5 w-5 text-red-600" />
            }
            <span className="text-sm text-gray-700">Bullet Points</span>
          </div>
          
          <div className="flex items-center space-x-2">
            {result.formatAnalysis.hasStandardSections ? 
              <CheckCircle className="h-5 w-5 text-green-600" /> : 
              <XCircle className="h-5 w-5 text-red-600" />
            }
            <span className="text-sm text-gray-700">Standard Sections</span>
          </div>
          
          <div className="flex items-center space-x-2">
            {result.formatAnalysis.hasQuantifiedResults ? 
              <CheckCircle className="h-5 w-5 text-green-600" /> : 
              <XCircle className="h-5 w-5 text-red-600" />
            }
            <span className="text-sm text-gray-700">Quantified Results</span>
          </div>
          
          <div className="flex items-center space-x-2">
            {result.formatAnalysis.hasContactInfo ? 
              <CheckCircle className="h-5 w-5 text-green-600" /> : 
              <XCircle className="h-5 w-5 text-red-600" />
            }
            <span className="text-sm text-gray-700">Contact Info</span>
          </div>
        </div>
      </div>

      {/* Recommendations */}
      <div className="bg-gradient-to-r from-orange-50 to-red-50 rounded-xl shadow-lg p-6 border border-orange-200">
        <div className="flex items-center space-x-2 mb-4">
          <TrendingUp className="h-6 w-6 text-orange-600" />
          <h3 className="text-lg font-semibold text-gray-900">Priority Recommendations</h3>
        </div>
        
        <div className="space-y-3">
          {result.recommendations.map((recommendation, index) => (
            <div key={index} className="flex items-start space-x-3 p-3 bg-white rounded-lg border border-orange-200">
              <div className="w-6 h-6 bg-orange-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                <span className="text-sm font-bold text-orange-600">{index + 1}</span>
              </div>
              <span className="text-sm text-gray-700">{recommendation}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Experience & Education */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-200">
          <div className="flex items-center space-x-2 mb-3">
            <TrendingUp className="h-5 w-5 text-blue-600" />
            <h4 className="font-medium text-gray-900">Experience Match</h4>
            <span className={`px-2 py-1 text-xs font-medium rounded-full border ${getScoreColor(result.experienceMatch.score)}`}>
              {result.experienceMatch.score}%
            </span>
          </div>
          <p className="text-sm text-gray-700">{result.experienceMatch.feedback}</p>
        </div>
        
        <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-200">
          <div className="flex items-center space-x-2 mb-3">
            <Award className="h-5 w-5 text-purple-600" />
            <h4 className="font-medium text-gray-900">Education Match</h4>
            <span className={`px-2 py-1 text-xs font-medium rounded-full border ${getScoreColor(result.educationMatch.score)}`}>
              {result.educationMatch.score}%
            </span>
          </div>
          <p className="text-sm text-gray-700">{result.educationMatch.feedback}</p>
        </div>
      </div>
    </div>
  );
};