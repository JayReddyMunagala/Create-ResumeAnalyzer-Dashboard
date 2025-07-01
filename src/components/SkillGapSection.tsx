import React from 'react';
import { AlertTriangle, BookOpen, Clock } from 'lucide-react';

export const SkillGapSection: React.FC = () => {
  const skillGaps = [
    {
      skill: 'GraphQL',
      priority: 'High',
      reason: 'Required for 78% of targeted positions',
      timeToLearn: '2-3 weeks',
      resources: ['Apollo GraphQL Course', 'GraphQL Documentation'],
      difficulty: 'Medium'
    },
    {
      skill: 'MongoDB',
      priority: 'Medium',
      reason: 'Mentioned in 65% of full-stack roles',
      timeToLearn: '1-2 weeks',
      resources: ['MongoDB University', 'Mongoose ODM Guide'],
      difficulty: 'Easy'
    },
    {
      skill: 'Next.js',
      priority: 'Medium',
      reason: 'Popular React framework in modern applications',
      timeToLearn: '2-4 weeks',
      resources: ['Next.js Documentation', 'Vercel Learn'],
      difficulty: 'Medium'
    },
    {
      skill: 'Kubernetes',
      priority: 'Low',
      reason: 'Valuable for senior DevOps positions',
      timeToLearn: '4-6 weeks',
      resources: ['Kubernetes Documentation', 'CNCF Training'],
      difficulty: 'Hard'
    }
  ];

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'High': return 'bg-red-100 text-red-800 border-red-200';
      case 'Medium': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'Low': return 'bg-green-100 text-green-800 border-green-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getDifficultyIcon = (difficulty: string) => {
    const baseClasses = "h-4 w-4";
    switch (difficulty) {
      case 'Easy': return <div className={`${baseClasses} bg-green-500 rounded-full`} />;
      case 'Medium': return <div className={`${baseClasses} bg-yellow-500 rounded-full`} />;
      case 'Hard': return <div className={`${baseClasses} bg-red-500 rounded-full`} />;
      default: return <div className={`${baseClasses} bg-gray-500 rounded-full`} />;
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-200">
      <div className="flex items-center space-x-2 mb-6">
        <AlertTriangle className="h-6 w-6 text-indigo-600" />
        <h2 className="text-lg font-semibold text-gray-900">Skill Gap Analysis</h2>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {skillGaps.map((gap, index) => (
          <div key={index} className="p-4 border border-gray-200 rounded-lg hover:shadow-md transition-shadow duration-200">
            <div className="flex justify-between items-start mb-3">
              <h3 className="font-semibold text-gray-900">{gap.skill}</h3>
              <span className={`px-2 py-1 text-xs font-medium rounded-full border ${getPriorityColor(gap.priority)}`}>
                {gap.priority}
              </span>
            </div>
            
            <p className="text-sm text-gray-600 mb-3">{gap.reason}</p>
            
            <div className="space-y-2">
              <div className="flex items-center space-x-2 text-sm">
                <Clock className="h-4 w-4 text-gray-400" />
                <span className="text-gray-700">Learn in: {gap.timeToLearn}</span>
              </div>
              
              <div className="flex items-center space-x-2 text-sm">
                {getDifficultyIcon(gap.difficulty)}
                <span className="text-gray-700">Difficulty: {gap.difficulty}</span>
              </div>
            </div>
            
            <div className="mt-3">
              <div className="flex items-center space-x-1 text-sm text-gray-600 mb-2">
                <BookOpen className="h-4 w-4" />
                <span>Learning Resources:</span>
              </div>
              <ul className="space-y-1">
                {gap.resources.map((resource, resourceIndex) => (
                  <li key={resourceIndex} className="text-sm text-indigo-600 hover:text-indigo-700 cursor-pointer">
                    • {resource}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        ))}
      </div>
      
      <div className="mt-6 p-4 bg-amber-50 border border-amber-200 rounded-lg">
        <div className="flex items-start space-x-2">
          <AlertTriangle className="h-5 w-5 text-amber-600 mt-0.5" />
          <div>
            <h4 className="font-medium text-amber-800">Priority Recommendation</h4>
            <p className="text-sm text-amber-700 mt-1">
              Focus on learning GraphQL first as it's required for most of your target positions. This skill can increase your job match rate by up to 15%.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};