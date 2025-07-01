export interface StoredAnalysis {
  id: string;
  fileName: string;
  analyzedAt: string;
  fileSize: number;
  extractedText: string;
  wordCount: number;
  skills: {
    hardSkills: Array<{
      name: string;
      category: string;
      confidence: number;
      mentions: number;
    }>;
    softSkills: Array<{
      name: string;
      category: string;
      confidence: number;
      mentions: number;
    }>;
    totalSkills: number;
  };
  jobSuggestions: Array<{
    title: string;
    match: number;
    company: string;
    location: string;
    salary: string;
    requirements: string[];
    missing: string[];
    description: string;
    experienceLevel: string;
  }>;
  aiSuggestions?: string;
  targetJobComparisons: Array<{
    jobTitle: string;
    matchPercentage: number;
    analyzedAt: string;
    missingRequiredSkills: string[];
    missingPreferredSkills: string[];
  }>;
}

export class AnalysisHistoryService {
  private static readonly STORAGE_KEY = 'resume_analysis_history';
  private static readonly MAX_ANALYSES = 10; // Limit to prevent localStorage overflow

  static saveAnalysis(analysis: Omit<StoredAnalysis, 'id' | 'analyzedAt'>): string {
    try {
      const analyses = this.getAllAnalyses();
      
      const newAnalysis: StoredAnalysis = {
        ...analysis,
        id: this.generateId(),
        analyzedAt: new Date().toISOString(),
        targetJobComparisons: []
      };

      // Add to beginning of array (most recent first)
      analyses.unshift(newAnalysis);

      // Keep only the most recent analyses
      const trimmedAnalyses = analyses.slice(0, this.MAX_ANALYSES);

      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(trimmedAnalyses));
      
      return newAnalysis.id;
    } catch (error) {
      console.error('Failed to save analysis:', error);
      throw new Error('Failed to save analysis to history');
    }
  }

  static getAllAnalyses(): StoredAnalysis[] {
    try {
      const stored = localStorage.getItem(this.STORAGE_KEY);
      return stored ? JSON.parse(stored) : [];
    } catch (error) {
      console.error('Failed to load analyses:', error);
      return [];
    }
  }

  static getAnalysis(id: string): StoredAnalysis | null {
    const analyses = this.getAllAnalyses();
    return analyses.find(analysis => analysis.id === id) || null;
  }

  static deleteAnalysis(id: string): boolean {
    try {
      const analyses = this.getAllAnalyses();
      const filteredAnalyses = analyses.filter(analysis => analysis.id !== id);
      
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(filteredAnalyses));
      return true;
    } catch (error) {
      console.error('Failed to delete analysis:', error);
      return false;
    }
  }

  static clearAllAnalyses(): boolean {
    try {
      localStorage.removeItem(this.STORAGE_KEY);
      return true;
    } catch (error) {
      console.error('Failed to clear analyses:', error);
      return false;
    }
  }

  static updateAnalysisWithJobComparison(
    analysisId: string, 
    jobComparison: {
      jobTitle: string;
      matchPercentage: number;
      missingRequiredSkills: string[];
      missingPreferredSkills: string[];
    }
  ): boolean {
    try {
      const analyses = this.getAllAnalyses();
      const analysisIndex = analyses.findIndex(analysis => analysis.id === analysisId);
      
      if (analysisIndex === -1) return false;

      const analysis = analyses[analysisIndex];
      
      // Remove existing comparison for the same job if it exists
      analysis.targetJobComparisons = analysis.targetJobComparisons.filter(
        comp => comp.jobTitle !== jobComparison.jobTitle
      );
      
      // Add new comparison
      analysis.targetJobComparisons.push({
        ...jobComparison,
        analyzedAt: new Date().toISOString()
      });

      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(analyses));
      return true;
    } catch (error) {
      console.error('Failed to update analysis with job comparison:', error);
      return false;
    }
  }

  static updateAnalysisWithAISuggestions(analysisId: string, aiSuggestions: string): boolean {
    try {
      const analyses = this.getAllAnalyses();
      const analysisIndex = analyses.findIndex(analysis => analysis.id === analysisId);
      
      if (analysisIndex === -1) return false;

      analyses[analysisIndex].aiSuggestions = aiSuggestions;
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(analyses));
      return true;
    } catch (error) {
      console.error('Failed to update analysis with AI suggestions:', error);
      return false;
    }
  }

  private static generateId(): string {
    return Math.random().toString(36).substr(2, 9) + Date.now().toString(36);
  }

  static getStorageInfo(): { used: number; available: number; analysisCount: number } {
    try {
      const analyses = this.getAllAnalyses();
      const stored = localStorage.getItem(this.STORAGE_KEY) || '[]';
      const usedBytes = new Blob([stored]).size;
      
      // Rough estimate of available localStorage space (usually 5-10MB)
      const availableBytes = 5 * 1024 * 1024; // 5MB estimate
      
      return {
        used: usedBytes,
        available: availableBytes,
        analysisCount: analyses.length
      };
    } catch (error) {
      return { used: 0, available: 0, analysisCount: 0 };
    }
  }
}