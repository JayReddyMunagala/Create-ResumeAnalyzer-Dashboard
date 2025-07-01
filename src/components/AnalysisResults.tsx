import React from 'react';
import { SkillsSection } from './SkillsSection';
import { JobRolesSection } from './JobRolesSection';
import { SkillGapSection } from './SkillGapSection';
import { SummarySection } from './SummarySection';
import { JobRoleSuggestionResult } from '../services/jobRoleSuggestion';

interface AnalysisResultsProps {
  isVisible: boolean;
  jobSuggestions: JobRoleSuggestionResult | null;
  isGeneratingJobs: boolean;
}

export const AnalysisResults: React.FC<AnalysisResultsProps> = ({ 
  isVisible, 
  jobSuggestions, 
  isGeneratingJobs 
}) => {
  if (!isVisible) return null;

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <SummarySection />
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <SkillsSection />
        <JobRolesSection 
          suggestedRoles={jobSuggestions?.suggestedRoles || []}
          isLoading={isGeneratingJobs}
        />
      </div>
      <SkillGapSection />
    </div>
  );
};