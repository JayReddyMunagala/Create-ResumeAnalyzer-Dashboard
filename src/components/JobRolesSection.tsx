import React from 'react';
import { Briefcase, Star, ArrowRight, ExternalLink, TrendingUp, MapPin, DollarSign, Zap } from 'lucide-react';
import { JobRole } from '../services/jobRoleSuggestion';

interface JobRolesSectionProps {
  suggestedRoles: JobRole[];
  isLoading?: boolean;
}

export const JobRolesSection: React.FC<JobRolesSectionProps> = ({ 
  suggestedRoles, 
  isLoading = false 
}) => {
  const jobRoles = suggestedRoles.length > 0 ? suggestedRoles : [];

  const getMatchColor = (match: number) => {
    if (match >= 90) return 'text-green-600 bg-green-100';
    if (match >= 80) return 'text-yellow-600 bg-yellow-100';
    return 'text-red-600 bg-red-100';
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

  const getDemandColor = (demand: string) => {
    switch (demand) {
      case 'High': return 'bg-green-100 text-green-700 border-green-200';
      case 'Medium': return 'bg-yellow-100 text-yellow-700 border-yellow-200';
      case 'Low': return 'bg-gray-100 text-gray-700 border-gray-200';
      default: return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  const handleJobRedirect = (job: JobRole) => {
    // Create search query combining job title and location
    const searchQuery = `${job.title} ${job.location === 'Remote' ? 'remote' : job.location}`.trim();
    const encodedQuery = encodeURIComponent(searchQuery);
    
    // Generate URLs for different job boards
    const jobBoardUrls = [
      `https://www.linkedin.com/jobs/search/?keywords=${encodedQuery}`,
      `https://www.indeed.com/jobs?q=${encodedQuery}`,
      `https://www.glassdoor.com/Job/jobs.htm?sc.keyword=${encodedQuery}`,
    ];
    
    // Randomly select a job board or use LinkedIn as default
    const selectedUrl = jobBoardUrls[0]; // Using LinkedIn as primary
    
    // Open in new tab
    window.open(selectedUrl, '_blank', 'noopener,noreferrer');
  };

  if (isLoading) {
    return (
      <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-200">
        <div className="flex items-center space-x-2 mb-6">
          <Briefcase className="h-6 w-6 text-indigo-600" />
          <h2 className="text-lg font-semibold text-gray-900">Suggested Job Roles</h2>
        </div>
        <div className="space-y-4">
          {[1, 2, 3].map((index) => (
            <div key={index} className="p-4 border border-gray-200 rounded-lg animate-pulse">
              <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
              <div className="h-3 bg-gray-200 rounded w-1/2 mb-2"></div>
              <div className="h-3 bg-gray-200 rounded w-1/4"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (jobRoles.length === 0) {
    return (
      <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-200">
        <div className="flex items-center space-x-2 mb-6">
          <Briefcase className="h-6 w-6 text-indigo-600" />
          <h2 className="text-lg font-semibold text-gray-900">Suggested Job Roles</h2>
        </div>
        <div className="text-center py-8">
          <Briefcase className="h-12 w-12 text-gray-300 mx-auto mb-4" />
          <p className="text-gray-500">Upload and analyze a resume to see job role suggestions</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-200">
      <div className="flex items-center space-x-2 mb-6">
        <Briefcase className="h-6 w-6 text-indigo-600" />
        <h2 className="text-lg font-semibold text-gray-900">Suggested Job Roles</h2>
      </div>
      
      <div className="space-y-4">
        {jobRoles.map((job, index) => (
          <div key={index} className="p-5 border border-gray-200 rounded-lg hover:shadow-lg transition-all duration-200 group bg-white">
            <div className="flex justify-between items-start mb-3">
              <div>
                <div className="flex items-center space-x-2 mb-2">
                  <h3 className="font-semibold text-gray-900 group-hover:text-indigo-600 transition-colors">
                    {job.title}
                  </h3>
                  <span className={`px-2 py-1 text-xs font-medium rounded-full ${getExperienceLevelColor(job.experienceLevel)}`}>
                    {job.experienceLevel}
                  </span>
                  <span className={`px-2 py-1 text-xs font-medium rounded-full border ${getDemandColor(job.demandLevel)}`}>
                    {job.demandLevel} Demand
                  </span>
                </div>
                
                <div className="flex items-center space-x-4 text-sm text-gray-600 mb-2">
                  <span className="font-medium">{job.company}</span>
                  <div className="flex items-center space-x-1">
                    <MapPin className="h-3 w-3" />
                    <span>{job.location}</span>
                    {job.remoteAvailable && job.location !== 'Remote' && (
                      <span className="px-1.5 py-0.5 text-xs bg-blue-100 text-blue-700 rounded">Remote OK</span>
                    )}
                  </div>
                </div>
                
                <div className="flex items-center space-x-4 mb-2">
                  <div className="flex items-center space-x-1 text-sm font-medium text-green-600">
                    <DollarSign className="h-3 w-3" />
                    <span>{job.salary}</span>
                  </div>
                  <div className="flex items-center space-x-1 text-xs text-blue-600">
                    <TrendingUp className="h-3 w-3" />
                    <span>{job.industryGrowth}</span>
                  </div>
                </div>
                
                <p className="text-sm text-gray-700 mb-2">{job.description}</p>
              </div>
              <div className="flex items-center space-x-2">
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${getMatchColor(job.match)}`}>
                  {job.match}% match
                </span>
                <Star className="h-4 w-4 text-yellow-500 fill-current" />
              </div>
            </div>
            
            <div className="space-y-2">
              <div>
                <span className="text-xs font-medium text-gray-500 uppercase tracking-wide">Matching Skills</span>
                <div className="flex flex-wrap gap-1 mt-1">
                  {job.requirements.map((skill, skillIndex) => (
                    <span key={skillIndex} className="px-2 py-1 text-xs bg-green-100 text-green-700 rounded-full">
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
              
              {job.missing.length > 0 && (
                <div>
                  <span className="text-xs font-medium text-gray-500 uppercase tracking-wide">Skills to Learn</span>
                  <div className="flex flex-wrap gap-1 mt-1">
                    {job.missing.map((skill, skillIndex) => (
                      <span key={skillIndex} className="px-2 py-1 text-xs bg-orange-100 text-orange-700 rounded-full">
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
              )}
              
              {/* Market Trends */}
              <div>
                <span className="text-xs font-medium text-gray-500 uppercase tracking-wide">Market Trends</span>
                <div className="flex flex-wrap gap-1 mt-1">
                  {job.marketTrends.slice(0, 3).map((trend, trendIndex) => (
                    <span key={trendIndex} className="px-2 py-1 text-xs bg-purple-100 text-purple-700 rounded-full flex items-center space-x-1">
                      <Zap className="h-2 w-2" />
                      <span>{trend}</span>
                    </span>
                  ))}
                </div>
              </div>
            </div>
            
            <div className="flex items-center justify-between mt-4 pt-3 border-t border-gray-100">
              <div className="text-xs text-gray-500">
                Growth: {job.industryGrowth} • {job.remoteAvailable ? 'Remote Available' : 'On-site'} • {job.demandLevel} Market Demand
              </div>
              <button 
                onClick={() => handleJobRedirect(job)}
                className="flex items-center space-x-1 text-sm text-indigo-600 hover:text-indigo-700 font-medium transition-colors duration-200 hover:bg-indigo-50 px-3 py-1.5 rounded-lg"
              >
                <span>Apply Now</span>
                <ExternalLink className="h-3 w-3" />
              </button>
            </div>
          </div>
        ))}
      </div>
      
      {/* Enhanced Market Insights */}
      <div className="mt-6 p-4 bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-lg">
        <div className="flex items-center space-x-2 mb-2">
          <TrendingUp className="h-5 w-5 text-blue-600" />
          <h4 className="font-semibold text-blue-900">2024-2025 Market Insights</h4>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
          <div>
            <p className="text-blue-800 mb-1">
              <strong>High Growth Roles:</strong> {jobRoles.filter(job => job.demandLevel === 'High').length} of {jobRoles.length} suggestions
            </p>
            <p className="text-blue-700">
              Remote opportunities available for {Math.round((jobRoles.filter(job => job.remoteAvailable).length / jobRoles.length) * 100)}% of suggested roles
            </p>
          </div>
          <div>
            <p className="text-blue-800 mb-1">
              <strong>Emerging Trends:</strong> AI/ML integration, cloud-native development, remote-first culture
            </p>
            <p className="text-blue-700">
              Average industry growth: {jobRoles.reduce((sum, job) => {
                const match = job.industryGrowth.match(/(\d+)%/);
                return sum + (match ? parseInt(match[1]) : 10);
              }, 0) / jobRoles.length}% annually
            </p>
          </div>
        </div>
      </div>
      
      <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded-lg">
        <p className="text-sm text-green-800">
          <strong>Ready to apply?</strong> Click "Apply Now" to search for similar positions on LinkedIn and other major job boards. All salary ranges are based on current market data for 2024-2025.
        </p>
      </div>
    </div>
  );
};