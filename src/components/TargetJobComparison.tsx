import React, { useState } from 'react';
import { 
  CheckCircle, 
  XCircle, 
  Clock, 
  BookOpen, 
  Target, 
  TrendingUp, 
  Award,
  AlertCircle,
  ExternalLink,
  Filter
} from 'lucide-react';
import { TargetJobComparison as JobComparison, SkillChecklistItem } from '../services/targetJobComparison';

interface TargetJobComparisonProps {
  comparison: JobComparison | null;
  isLoading: boolean;
}

export const TargetJobComparison: React.FC<TargetJobComparisonProps> = ({ 
  comparison, 
  isLoading 
}) => {
  const [filter, setFilter] = useState<'all' | 'missing' | 'have'>('all');

  if (isLoading) {
    return (
      <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-200">
        <div className="flex items-center space-x-2 mb-6">
          <Target className="h-6 w-6 text-indigo-600" />
          <h2 className="text-lg font-semibold text-gray-900">Skills Comparison</h2>
        </div>
        <div className="space-y-4">
          {[1, 2, 3, 4].map((index) => (
            <div key={index} className="animate-pulse">
              <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
              <div className="h-3 bg-gray-200 rounded w-1/2"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (!comparison) {
    return (
      <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-200">
        <div className="flex items-center space-x-2 mb-6">
          <Target className="h-6 w-6 text-indigo-600" />
          <h2 className="text-lg font-semibold text-gray-900">Skills Comparison</h2>
        </div>
        <div className="text-center py-8">
          <Target className="h-12 w-12 text-gray-300 mx-auto mb-4" />
          <p className="text-gray-500">Select a target job role to see your skills comparison</p>
        </div>
      </div>
    );
  }

  const getMatchColor = (percentage: number) => {
    if (percentage >= 80) return 'text-green-600 bg-green-100 border-green-200';
    if (percentage >= 60) return 'text-yellow-600 bg-yellow-100 border-yellow-200';
    return 'text-red-600 bg-red-100 border-red-200';
  };

  const getExperienceLevelColor = (level: string) => {
    switch (level) {
      case 'Lead': return 'bg-purple-100 text-purple-700';
      case 'Senior': return 'bg-blue-100 text-blue-700';
      case 'Mid': return 'bg-green-100 text-green-700';
      case 'Junior': return 'bg-yellow-100 text-yellow-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  const filteredChecklist = comparison.skillsChecklist.filter(item => {
    if (filter === 'missing') return !item.hasSkill;
    if (filter === 'have') return item.hasSkill;
    return true;
  });

  const requiredSkillsHave = comparison.skillsChecklist.filter(item => 
    item.category === 'required' && item.hasSkill
  ).length;
  
  const requiredSkillsTotal = comparison.skillsChecklist.filter(item => 
    item.category === 'required'
  ).length;

  const missingRequiredCount = comparison.missingRequiredSkills.length;
  const missingPreferredCount = comparison.missingPreferredSkills.length;

  return (
    <div className="space-y-6">
      {/* Overview Card */}
      <div className="bg-gradient-to-br from-indigo-50 to-purple-50 rounded-xl shadow-lg p-6 border border-indigo-200">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-2">
            <Target className="h-6 w-6 text-indigo-600" />
            <h2 className="text-lg font-semibold text-gray-900">Skills Analysis for {comparison.jobTitle}</h2>
          </div>
          <span className={`px-3 py-1 rounded-full text-sm font-medium border ${getMatchColor(comparison.matchPercentage)}`}>
            {comparison.matchPercentage}% match
          </span>
        </div>

        <p className="text-gray-700 mb-4">{comparison.description}</p>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-white p-4 rounded-lg border border-indigo-200">
            <div className="flex items-center space-x-2 mb-2">
              <Award className="h-5 w-5 text-indigo-600" />
              <span className="font-medium text-gray-900">Experience Level</span>
            </div>
            <span className={`px-2 py-1 text-sm font-medium rounded-full ${getExperienceLevelColor(comparison.experienceLevel)}`}>
              {comparison.experienceLevel}
            </span>
          </div>

          <div className="bg-white p-4 rounded-lg border border-indigo-200">
            <div className="flex items-center space-x-2 mb-2">
              <TrendingUp className="h-5 w-5 text-green-600" />
              <span className="font-medium text-gray-900">Salary Range</span>
            </div>
            <p className="text-sm font-medium text-green-600">{comparison.salaryRange}</p>
          </div>

          <div className="bg-white p-4 rounded-lg border border-indigo-200">
            <div className="flex items-center space-x-2 mb-2">
              <CheckCircle className="h-5 w-5 text-blue-600" />
              <span className="font-medium text-gray-900">Required Skills</span>
            </div>
            <p className="text-sm">
              <span className="font-semibold text-blue-600">{requiredSkillsHave}</span>
              <span className="text-gray-600"> of {requiredSkillsTotal}</span>
            </p>
          </div>

          <div className="bg-white p-4 rounded-lg border border-indigo-200">
            <div className="flex items-center space-x-2 mb-2">
              <AlertCircle className="h-5 w-5 text-orange-600" />
              <span className="font-medium text-gray-900">Missing Skills</span>
            </div>
            <p className="text-sm">
              <span className="font-semibold text-orange-600">{missingRequiredCount + missingPreferredCount}</span>
              <span className="text-gray-600"> to learn</span>
            </p>
          </div>
        </div>
      </div>

      {/* Skills Checklist */}
      <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-200">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-2">
            <BookOpen className="h-6 w-6 text-indigo-600" />
            <h3 className="text-lg font-semibold text-gray-900">Skills Checklist</h3>
          </div>
          
          <div className="flex items-center space-x-2">
            <Filter className="h-4 w-4 text-gray-400" />
            <select
              value={filter}
              onChange={(e) => setFilter(e.target.value as 'all' | 'missing' | 'have')}
              className="text-sm border border-gray-300 rounded-md px-3 py-1 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              <option value="all">All Skills ({comparison.skillsChecklist.length})</option>
              <option value="missing">Missing ({comparison.skillsChecklist.filter(s => !s.hasSkill).length})</option>
              <option value="have">Have ({comparison.skillsChecklist.filter(s => s.hasSkill).length})</option>
            </select>
          </div>
        </div>

        <div className="space-y-3">
          {filteredChecklist.map((item, index) => (
            <SkillChecklistItemComponent key={index} item={item} />
          ))}
        </div>

        {filteredChecklist.length === 0 && (
          <div className="text-center py-8 text-gray-500">
            <CheckCircle className="h-12 w-12 mx-auto mb-4 text-gray-300" />
            <p>No skills match the current filter</p>
          </div>
        )}
      </div>

      {/* Action Plan */}
      {missingRequiredCount > 0 && (
        <div className="bg-gradient-to-r from-orange-50 to-red-50 rounded-xl shadow-lg p-6 border border-orange-200">
          <div className="flex items-center space-x-2 mb-4">
            <AlertCircle className="h-6 w-6 text-orange-600" />
            <h3 className="text-lg font-semibold text-gray-900">Priority Learning Plan</h3>
          </div>
          
          <p className="text-gray-700 mb-4">
            You're missing {missingRequiredCount} required skill{missingRequiredCount !== 1 ? 's' : ''} for this role. 
            Focus on these first to maximize your job readiness:
          </p>
          
          <div className="space-y-2">
            {comparison.missingRequiredSkills.slice(0, 3).map((skill, index) => {
              const skillItem = comparison.skillsChecklist.find(item => item.skill === skill);
              return (
                <div key={index} className="flex items-center justify-between p-3 bg-white rounded-lg border border-orange-200">
                  <div className="flex items-center space-x-3">
                    <div className="w-6 h-6 bg-orange-100 rounded-full flex items-center justify-center">
                      <span className="text-xs font-semibold text-orange-600">{index + 1}</span>
                    </div>
                    <span className="font-medium text-gray-900">{skill}</span>
                    <span className="px-2 py-1 text-xs bg-red-100 text-red-700 rounded-full">Required</span>
                  </div>
                  <div className="flex items-center space-x-2 text-sm text-gray-600">
                    <Clock className="h-4 w-4" />
                    <span>{skillItem?.learningTime || '2-4 weeks'}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};

const SkillChecklistItemComponent: React.FC<{ item: SkillChecklistItem }> = ({ item }) => {
  const [showResources, setShowResources] = useState(false);

  const getCategoryColor = (category: string) => {
    return category === 'required' 
      ? 'bg-red-100 text-red-700' 
      : 'bg-blue-100 text-blue-700';
  };

  const getImportanceColor = (importance: string) => {
    switch (importance) {
      case 'high': return 'bg-red-100 text-red-700';
      case 'medium': return 'bg-yellow-100 text-yellow-700';
      case 'low': return 'bg-green-100 text-green-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  return (
    <div className={`p-4 border rounded-lg transition-all duration-200 ${
      item.hasSkill 
        ? 'bg-green-50 border-green-200 hover:bg-green-100' 
        : 'bg-gray-50 border-gray-200 hover:bg-gray-100'
    }`}>
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          {item.hasSkill ? (
            <CheckCircle className="h-5 w-5 text-green-600" />
          ) : (
            <XCircle className="h-5 w-5 text-gray-400" />
          )}
          <span className={`font-medium ${item.hasSkill ? 'text-green-900' : 'text-gray-900'}`}>
            {item.skill}
          </span>
          <span className={`px-2 py-1 text-xs font-medium rounded-full ${getCategoryColor(item.category)}`}>
            {item.category}
          </span>
          <span className={`px-2 py-1 text-xs font-medium rounded-full ${getImportanceColor(item.importance)}`}>
            {item.importance}
          </span>
        </div>
        
        {!item.hasSkill && (
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-1 text-sm text-gray-600">
              <Clock className="h-4 w-4" />
              <span>{item.learningTime}</span>
            </div>
            <button
              onClick={() => setShowResources(!showResources)}
              className="flex items-center space-x-1 text-sm text-indigo-600 hover:text-indigo-700 font-medium"
            >
              <BookOpen className="h-4 w-4" />
              <span>Resources</span>
            </button>
          </div>
        )}
      </div>
      
      {!item.hasSkill && showResources && (
        <div className="mt-3 p-3 bg-white rounded-lg border border-gray-200">
          <h5 className="text-sm font-medium text-gray-900 mb-2">Learning Resources:</h5>
          <ul className="space-y-1">
            {item.resources.map((resource, index) => (
              <li key={index} className="flex items-center space-x-2 text-sm text-gray-600">
                <ExternalLink className="h-3 w-3" />
                <span>{resource}</span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};