import React from 'react';
import { Brain, Code, Users, Star } from 'lucide-react';
import { ExtractedSkills, SkillMatch } from '../services/skillExtraction';

interface ExtractedSkillsSectionProps {
  extractedSkills: ExtractedSkills | null;
  isExtracting: boolean;
}

export const ExtractedSkillsSection: React.FC<ExtractedSkillsSectionProps> = ({ 
  extractedSkills, 
  isExtracting 
}) => {
  if (!isExtracting && !extractedSkills) {
    return null;
  }

  const getConfidenceColor = (confidence: number) => {
    if (confidence >= 80) return 'bg-green-100 text-green-800 border-green-200';
    if (confidence >= 60) return 'bg-yellow-100 text-yellow-800 border-yellow-200';
    return 'bg-red-100 text-red-800 border-red-200';
  };

  const getConfidenceIcon = (confidence: number) => {
    if (confidence >= 80) return <Star className="h-3 w-3 fill-current" />;
    if (confidence >= 60) return <Star className="h-3 w-3" />;
    return null;
  };

  const SkillsList: React.FC<{ skills: SkillMatch[]; title: string; icon: React.ReactNode; color: string }> = ({ 
    skills, 
    title, 
    icon, 
    color 
  }) => (
    <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-200">
      <div className="flex items-center space-x-2 mb-4">
        {icon}
        <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
        <span className={`px-2 py-1 text-xs font-medium rounded-full ${color}`}>
          {skills.length} found
        </span>
      </div>
      
      {skills.length === 0 ? (
        <p className="text-gray-500 text-sm italic">No {title.toLowerCase()} detected in resume</p>
      ) : (
        <div className="space-y-3">
          {skills.slice(0, 10).map((skill, index) => (
            <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors duration-200">
              <div className="flex-1">
                <div className="flex items-center space-x-2 mb-1">
                  <span className="font-medium text-gray-900">{skill.name}</span>
                  {getConfidenceIcon(skill.confidence)}
                </div>
                <div className="flex items-center space-x-3">
                  <span className="text-xs text-gray-500">{skill.category}</span>
                  <span className="text-xs text-gray-400">•</span>
                  <span className="text-xs text-gray-500">
                    {skill.mentions} mention{skill.mentions !== 1 ? 's' : ''}
                  </span>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <span className={`px-2 py-1 text-xs font-medium rounded-full border ${getConfidenceColor(skill.confidence)}`}>
                  {skill.confidence}%
                </span>
              </div>
            </div>
          ))}
          
          {skills.length > 10 && (
            <div className="text-center">
              <button className="text-sm text-indigo-600 hover:text-indigo-700 font-medium">
                Show {skills.length - 10} more skills
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );

  return (
    <div className="space-y-6">
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl shadow-lg p-6 border border-blue-200">
        <div className="flex items-center space-x-2 mb-4">
          <Brain className="h-6 w-6 text-indigo-600" />
          <h2 className="text-lg font-semibold text-gray-900">Skills Extraction Analysis</h2>
        </div>
        
        {isExtracting ? (
          <div className="flex items-center justify-center py-8">
            <div className="text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600 mx-auto mb-3"></div>
              <p className="text-sm text-gray-600">Analyzing skills from resume...</p>
            </div>
          </div>
        ) : extractedSkills ? (
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-white p-4 rounded-lg border border-indigo-200">
                <div className="flex items-center space-x-2 mb-2">
                  <Code className="h-5 w-5 text-blue-600" />
                  <span className="font-medium text-gray-900">Hard Skills</span>
                </div>
                <p className="text-2xl font-bold text-blue-600">{extractedSkills.hardSkills.length}</p>
                <p className="text-sm text-gray-600">Technical abilities</p>
              </div>
              
              <div className="bg-white p-4 rounded-lg border border-indigo-200">
                <div className="flex items-center space-x-2 mb-2">
                  <Users className="h-5 w-5 text-purple-600" />
                  <span className="font-medium text-gray-900">Soft Skills</span>
                </div>
                <p className="text-2xl font-bold text-purple-600">{extractedSkills.softSkills.length}</p>
                <p className="text-sm text-gray-600">Interpersonal abilities</p>
              </div>
              
              <div className="bg-white p-4 rounded-lg border border-indigo-200">
                <div className="flex items-center space-x-2 mb-2">
                  <Brain className="h-5 w-5 text-indigo-600" />
                  <span className="font-medium text-gray-900">Total Skills</span>
                </div>
                <p className="text-2xl font-bold text-indigo-600">{extractedSkills.totalSkills}</p>
                <p className="text-sm text-gray-600">Skills identified</p>
              </div>
            </div>
            
            <div className="bg-white p-4 rounded-lg border border-indigo-200">
              <h4 className="font-medium text-indigo-900 mb-2">Analysis Summary</h4>
              <p className="text-sm text-indigo-800">
                Extracted {extractedSkills.totalSkills} skills from your resume. 
                {extractedSkills.hardSkills.length > extractedSkills.softSkills.length 
                  ? ' Strong technical profile with emphasis on hard skills.' 
                  : extractedSkills.softSkills.length > extractedSkills.hardSkills.length
                  ? ' Well-rounded profile with strong interpersonal skills.'
                  : ' Balanced mix of technical and interpersonal abilities.'
                }
              </p>
            </div>
          </div>
        ) : null}
      </div>
      
      {extractedSkills && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <SkillsList 
            skills={extractedSkills.hardSkills}
            title="Hard Skills"
            icon={<Code className="h-6 w-6 text-blue-600" />}
            color="bg-blue-100 text-blue-800"
          />
          <SkillsList 
            skills={extractedSkills.softSkills}
            title="Soft Skills"
            icon={<Users className="h-6 w-6 text-purple-600" />}
            color="bg-purple-100 text-purple-800"
          />
        </div>
      )}
    </div>
  );
};