import React, { useState } from 'react';
import { Target, ChevronDown, Search, Star, TrendingUp } from 'lucide-react';
import { JobOption } from '../services/targetJobComparison';

interface TargetJobSelectorProps {
  availableJobs: JobOption[];
  onJobSelect: (jobTitle: string) => void;
  selectedJob: string | null;
  isLoading?: boolean;
}

export const TargetJobSelector: React.FC<TargetJobSelectorProps> = ({
  availableJobs,
  onJobSelect,
  selectedJob,
  isLoading = false
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  const filteredJobs = availableJobs.filter(job =>
    job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    job.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const groupedJobs = filteredJobs.reduce((acc, job) => {
    if (!acc[job.category]) {
      acc[job.category] = [];
    }
    acc[job.category].push(job);
    return acc;
  }, {} as Record<string, JobOption[]>);

  const handleJobSelect = (jobTitle: string) => {
    onJobSelect(jobTitle);
    setIsOpen(false);
    setSearchTerm('');
  };

  const getPopularityColor = (popularity: number) => {
    if (popularity >= 85) return 'text-green-600';
    if (popularity >= 70) return 'text-yellow-600';
    return 'text-gray-600';
  };

  const getPopularityIcon = (popularity: number) => {
    if (popularity >= 85) return <TrendingUp className="h-3 w-3" />;
    if (popularity >= 70) return <Star className="h-3 w-3" />;
    return null;
  };

  return (
    <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-200">
      <div className="flex items-center space-x-2 mb-4">
        <Target className="h-6 w-6 text-indigo-600" />
        <h2 className="text-lg font-semibold text-gray-900">Target Job Analysis</h2>
      </div>

      <p className="text-sm text-gray-600 mb-4">
        Select a job title to see how your skills match against the requirements and get a personalized learning plan.
      </p>

      <div className="relative">
        <button
          onClick={() => setIsOpen(!isOpen)}
          disabled={isLoading}
          className="w-full flex items-center justify-between p-3 border border-gray-300 rounded-lg hover:border-indigo-400 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <span className={selectedJob ? 'text-gray-900' : 'text-gray-500'}>
            {selectedJob || 'Choose a target job role...'}
          </span>
          <ChevronDown className={`h-4 w-4 text-gray-400 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
        </button>

        {isOpen && (
          <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg z-50 max-h-96 overflow-hidden">
            <div className="p-3 border-b border-gray-200">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search job roles..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                />
              </div>
            </div>

            <div className="max-h-64 overflow-y-auto">
              {Object.entries(groupedJobs).map(([category, jobs]) => (
                <div key={category}>
                  <div className="px-3 py-2 bg-gray-50 border-b border-gray-100">
                    <h4 className="text-xs font-medium text-gray-700 uppercase tracking-wide">
                      {category}
                    </h4>
                  </div>
                  {jobs.map((job) => (
                    <button
                      key={job.title}
                      onClick={() => handleJobSelect(job.title)}
                      className="w-full px-3 py-3 text-left hover:bg-gray-50 border-b border-gray-100 last:border-b-0 transition-colors duration-150"
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-medium text-gray-900">{job.title}</span>
                        <div className="flex items-center space-x-1">
                          {getPopularityIcon(job.popularity)}
                          <span className={`text-xs font-medium ${getPopularityColor(job.popularity)}`}>
                            {job.popularity}%
                          </span>
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              ))}

              {filteredJobs.length === 0 && (
                <div className="px-3 py-8 text-center text-gray-500">
                  <Search className="h-8 w-8 mx-auto mb-2 text-gray-300" />
                  <p className="text-sm">No job roles found matching "{searchTerm}"</p>
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {selectedJob && !isLoading && (
        <div className="mt-4 p-3 bg-indigo-50 border border-indigo-200 rounded-lg">
          <div className="flex items-center space-x-2 text-indigo-800">
            <Target className="h-4 w-4" />
            <span className="text-sm font-medium">Analyzing: {selectedJob}</span>
          </div>
          <p className="text-xs text-indigo-600 mt-1">
            Scroll down to see your detailed skills comparison and learning plan.
          </p>
        </div>
      )}
    </div>
  );
};