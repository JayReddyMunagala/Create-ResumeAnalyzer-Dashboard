import React from 'react';
import { Sparkles, TrendingUp, Users, Award } from 'lucide-react';

export const SummarySection: React.FC = () => {
  const insights = [
    {
      icon: <TrendingUp className="h-5 w-5 text-green-600" />,
      title: "Strong Technical Profile",
      description: "8 core skills identified with 80%+ proficiency in modern technologies"
    },
    {
      icon: <Users className="h-5 w-5 text-blue-600" />,
      title: "Team Leadership Ready",
      description: "Experience indicators suggest readiness for senior development roles"
    },
    {
      icon: <Award className="h-5 w-5 text-purple-600" />,
      title: "High Market Demand",
      description: "Skills align with 92% of current job market requirements"
    }
  ];

  return (
    <div className="bg-gradient-to-br from-indigo-50 to-purple-50 rounded-xl shadow-lg p-6 border border-indigo-200">
      <div className="flex items-center space-x-2 mb-6">
        <Sparkles className="h-6 w-6 text-indigo-600" />
        <h2 className="text-lg font-semibold text-gray-900">AI-Generated Career Summary</h2>
      </div>
      
      <div className="space-y-6">
        <div className="prose max-w-none">
          <p className="text-gray-700 leading-relaxed">
            Based on the analysis of your resume, you present as a <strong>highly skilled software developer</strong> with 
            strong expertise in modern web technologies. Your skill profile indicates <strong>5+ years of experience</strong> 
            with a focus on full-stack development using React, Node.js, and JavaScript ecosystems.
          </p>
          
          <p className="text-gray-700 leading-relaxed mt-4">
            Your technical foundation is <strong>well-suited for senior developer positions</strong>, with particular 
            strength in frontend technologies. The combination of React, TypeScript, and modern development tools 
            positions you competitively for roles at growth-stage companies and established tech organizations.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
          {insights.map((insight, index) => (
            <div key={index} className="bg-white p-4 rounded-lg border border-gray-200">
              <div className="flex items-center space-x-2 mb-2">
                {insight.icon}
                <h4 className="font-medium text-gray-900 text-sm">{insight.title}</h4>
              </div>
              <p className="text-xs text-gray-600">{insight.description}</p>
            </div>
          ))}
        </div>
        
        <div className="bg-white p-4 rounded-lg border border-indigo-200">
          <h4 className="font-medium text-indigo-900 mb-2">Key Recommendations</h4>
          <ul className="space-y-1 text-sm text-indigo-800">
            <li>• Target senior frontend or full-stack developer positions</li>
            <li>• Emphasize React and TypeScript expertise in applications</li>
            <li>• Consider learning GraphQL to boost competitiveness by 15%</li>
            <li>• Highlight any team leadership or mentoring experience</li>
          </ul>
        </div>
      </div>
    </div>
  );
};