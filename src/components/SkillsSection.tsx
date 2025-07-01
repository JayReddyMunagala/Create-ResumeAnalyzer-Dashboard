import React from 'react';
import { Target, TrendingUp } from 'lucide-react';

export const SkillsSection: React.FC = () => {
  const skills = [
    { name: 'JavaScript', level: 95, category: 'Programming' },
    { name: 'React', level: 90, category: 'Frontend' },
    { name: 'Node.js', level: 85, category: 'Backend' },
    { name: 'TypeScript', level: 80, category: 'Programming' },
    { name: 'Python', level: 75, category: 'Programming' },
    { name: 'SQL', level: 70, category: 'Database' },
    { name: 'AWS', level: 65, category: 'Cloud' },
    { name: 'Docker', level: 60, category: 'DevOps' },
  ];

  const getSkillColor = (level: number) => {
    if (level >= 80) return 'bg-green-500';
    if (level >= 60) return 'bg-yellow-500';
    return 'bg-red-500';
  };

  return (
    <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-200">
      <div className="flex items-center space-x-2 mb-6">
        <Target className="h-6 w-6 text-indigo-600" />
        <h2 className="text-lg font-semibold text-gray-900">Extracted Skills</h2>
      </div>
      
      <div className="space-y-4">
        {skills.map((skill, index) => (
          <div key={index} className="group">
            <div className="flex justify-between items-center mb-1">
              <div className="flex items-center space-x-2">
                <span className="font-medium text-gray-900">{skill.name}</span>
                <span className="px-2 py-1 text-xs bg-gray-100 text-gray-600 rounded-full">
                  {skill.category}
                </span>
              </div>
              <span className="text-sm font-medium text-gray-600">{skill.level}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className={`h-2 rounded-full transition-all duration-500 ease-out ${getSkillColor(skill.level)}`}
                style={{ width: `${skill.level}%` }}
              />
            </div>
          </div>
        ))}
      </div>

      <div className="mt-6 p-4 bg-indigo-50 rounded-lg">
        <div className="flex items-center space-x-2 text-indigo-800">
          <TrendingUp className="h-4 w-4" />
          <span className="text-sm font-medium">Skill Analysis</span>
        </div>
        <p className="text-sm text-indigo-700 mt-1">
          Strong technical foundation with 8 key skills identified. Programming and frontend skills are your top strengths.
        </p>
      </div>
    </div>
  );
};