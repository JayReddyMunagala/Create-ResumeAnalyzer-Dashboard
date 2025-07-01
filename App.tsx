import React from 'react';
import { useState } from 'react';
import { Header } from './components/Header';
import { FileUpload } from './components/FileUpload';
import { DualTextInput } from './components/DualTextInput';
import { TextPreview } from './components/TextPreview';
import { ExtractedSkillsSection } from './components/ExtractedSkillsSection';
import { AnalysisResults } from './components/AnalysisResults';
import { ATSMatchResults } from './components/ATSMatchResults';
import { Loader2, FileText, Zap } from 'lucide-react';
import { TextExtractionService, TextExtractionResult } from './services/textExtraction';
import { SkillExtractionService, ExtractedSkills } from './services/skillExtraction';
import { JobRoleSuggestionService, JobRoleSuggestionResult } from './services/jobRoleSuggestion';
import { TargetJobComparisonService, TargetJobComparison, JobOption } from './services/targetJobComparison';
import { TargetJobSelector } from './components/TargetJobSelector';
import { TargetJobComparison as TargetJobComparisonComponent } from './components/TargetJobComparison';
import { AISuggestions } from './components/AISuggestions';
import { LoadingOverlay } from './components/LoadingOverlay';
import { ToastContainer, useToast } from './components/Toast';
import { AnalysisHistory } from './components/AnalysisHistory';
import { AnalysisHistoryService, StoredAnalysis } from './services/analysisHistory';
import { ATSMatchingService, ATSMatchResult } from './services/atsMatchingService';

type AnalysisMode = 'file-upload' | 'ats-matching';

function App() {
  // Original file upload analysis state
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [extractionResult, setExtractionResult] = useState<TextExtractionResult | null>(null);
  const [extractedSkills, setExtractedSkills] = useState<ExtractedSkills | null>(null);
  const [jobSuggestions, setJobSuggestions] = useState<JobRoleSuggestionResult | null>(null);
  const [availableJobs, setAvailableJobs] = useState<JobOption[]>([]);
  const [selectedTargetJob, setSelectedTargetJob] = useState<string | null>(null);
  const [targetJobComparison, setTargetJobComparison] = useState<TargetJobComparison | null>(null);
  const [isExtracting, setIsExtracting] = useState(false);
  const [isExtractingSkills, setIsExtractingSkills] = useState(false);
  const [isGeneratingJobs, setIsGeneratingJobs] = useState(false);
  const [isComparingJob, setIsComparingJob] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const [loadingStage, setLoadingStage] = useState<'extracting' | 'analyzing' | 'generating' | 'completing'>('extracting');
  const [showHistory, setShowHistory] = useState(false);
  const [currentAnalysisId, setCurrentAnalysisId] = useState<string | null>(null);

  // ATS matching state
  const [atsResult, setAtsResult] = useState<ATSMatchResult | null>(null);
  const [isATSAnalyzing, setIsATSAnalyzing] = useState(false);
  const [showATSResults, setShowATSResults] = useState(false);

  // UI state
  const [analysisMode, setAnalysisMode] = useState<AnalysisMode>('file-upload');
  const { toasts, showToast, closeToast } = useToast();

  const handleAnalyze = async () => {
    if (!selectedFile) return;
    
    setIsAnalyzing(true);
    setLoadingStage('completing');
    
    // Simulate final analysis processing
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    setIsAnalyzing(false);
    setShowResults(true);
    
    // Show success toast
    showToast('Analysis complete! Your personalized career insights are ready.', 'success');
    
    // Save analysis to history
    if (extractedSkills && extractionResult && jobSuggestions) {
      try {
        const analysisId = AnalysisHistoryService.saveAnalysis({
          fileName: selectedFile.name,
          fileSize: selectedFile.size,
          extractedText: extractionResult.text,
          wordCount: extractionResult.wordCount,
          skills: {
            hardSkills: extractedSkills.hardSkills,
            softSkills: extractedSkills.softSkills,
            totalSkills: extractedSkills.totalSkills
          },
          jobSuggestions: jobSuggestions.suggestedRoles
        });
        setCurrentAnalysisId(analysisId);
        showToast('Analysis saved to history', 'info', 2000);
      } catch (error) {
        console.error('Failed to save analysis:', error);
      }
    }
  };

  const handleFileSelect = async (file: File | null) => {
    setSelectedFile(file);
    setExtractionResult(null);
    setExtractedSkills(null);
    setJobSuggestions(null);
    setSelectedTargetJob(null);
    setTargetJobComparison(null);
    
    if (!file) {
      setShowResults(false);
      closeToast('extracting');
      return;
    }
    
    // Extract text from the uploaded file
    setIsExtracting(true);
    setLoadingStage('extracting');
    try {
      const result = await TextExtractionService.extractText(file);
      setExtractionResult(result);
      
      // If text extraction was successful, extract skills
      if (result.text && !result.error) {
        showToast('Text extracted successfully!', 'success', 2000);
        
        setIsExtractingSkills(true);
        setLoadingStage('analyzing');
        // Add a small delay to show the extraction process
        await new Promise(resolve => setTimeout(resolve, 1000));
        const skills = SkillExtractionService.extractSkills(result.text);
        setExtractedSkills(skills);
        setIsExtractingSkills(false);
        
        showToast(`Found ${skills.totalSkills} skills in your resume`, 'success', 2000);
        
        // Generate job suggestions based on extracted skills
        setIsGeneratingJobs(true);
        setLoadingStage('generating');
        await new Promise(resolve => setTimeout(resolve, 1500));
        const suggestions = JobRoleSuggestionService.suggestJobRoles(skills);
        setJobSuggestions(suggestions);
        setIsGeneratingJobs(false);
        
        showToast(`Generated ${suggestions.suggestedRoles.length} job role suggestions`, 'info', 2000);
        
        // Load available jobs for target selection
        const jobs = TargetJobComparisonService.getAvailableJobs();
        setAvailableJobs(jobs);
      } else if (result.error) {
        showToast('Failed to extract text from resume', 'error');
      }
    } catch (error) {
      console.error('Text extraction failed:', error);
      setExtractionResult({
        text: '',
        wordCount: 0,
        error: 'An unexpected error occurred during text extraction.'
      });
      showToast('An unexpected error occurred during text extraction', 'error');
    } finally {
      setIsExtracting(false);
    }
  };

  const handleTargetJobSelect = async (jobTitle: string) => {
    if (!extractedSkills) return;
    
    setSelectedTargetJob(jobTitle);
    setIsComparingJob(true);
    
    // Add a small delay to show loading state
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    try {
      const comparison = TargetJobComparisonService.compareWithTargetJob(jobTitle, extractedSkills);
      setTargetJobComparison(comparison);
      showToast(`Skills comparison complete for ${jobTitle}`, 'success', 2000);
      
      // Update analysis history with job comparison
      if (currentAnalysisId) {
        AnalysisHistoryService.updateAnalysisWithJobComparison(currentAnalysisId, {
          jobTitle,
          matchPercentage: comparison.matchPercentage,
          missingRequiredSkills: comparison.missingRequiredSkills,
          missingPreferredSkills: comparison.missingPreferredSkills
        });
      }
    } catch (error) {
      console.error('Job comparison failed:', error);
      setTargetJobComparison(null);
      showToast('Failed to compare skills with target job', 'error');
    } finally {
      setIsComparingJob(false);
    }
  };

  const handleATSAnalyze = async (resumeText: string, jobDescription: string) => {
    setIsATSAnalyzing(true);
    setShowATSResults(false);
    
    try {
      // Add a small delay to show loading state
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      const result = await ATSMatchingService.analyzeMatch(resumeText, jobDescription);
      setAtsResult(result);
      setShowATSResults(true);
      
      // Generate detailed score message
      const aiScore = result.gptAnalysis?.aiAnalysis.overallScore || result.overallScore;
      const scoreMessage = aiScore >= 80 
        ? `Excellent ATS match! AI-powered analysis complete with ${aiScore}% compatibility.`
        : aiScore >= 60 
        ? `Good ATS match. AI analysis shows ${aiScore}% compatibility with optimization opportunities.`
        : `Needs optimization. AI analysis indicates ${aiScore}% match with significant improvement areas.`;
        
      showToast(scoreMessage, aiScore >= 60 ? 'success' : 'info');
    } catch (error) {
      console.error('ATS analysis failed:', error);
      showToast('Failed to analyze ATS match. Please try again.', 'error');
    } finally {
      setIsATSAnalyzing(false);
    }
  };
  
  const handleLoadFromHistory = (analysis: StoredAnalysis) => {
    // Clear current state
    setSelectedFile(null);
    setExtractionResult(null);
    setExtractedSkills(null);
    setJobSuggestions(null);
    setSelectedTargetJob(null);
    setTargetJobComparison(null);
    setShowResults(false);
    setShowATSResults(false);
    setAtsResult(null);
    
    // Load analysis data
    setExtractionResult({
      text: analysis.extractedText,
      wordCount: analysis.wordCount
    });
    
    setExtractedSkills({
      hardSkills: analysis.skills.hardSkills,
      softSkills: analysis.skills.softSkills,
      totalSkills: analysis.skills.totalSkills
    });
    
    setJobSuggestions({
      suggestedRoles: analysis.jobSuggestions,
      topSkillCategories: [],
      overallProfile: ''
    });
    
    setCurrentAnalysisId(analysis.id);
    setShowResults(true);
    setAnalysisMode('file-upload');
    
    // Load available jobs for target selection
    const jobs = TargetJobComparisonService.getAvailableJobs();
    setAvailableJobs(jobs);
    
    showToast(`Loaded analysis: ${analysis.fileName}`, 'success');
  };
  
  const handleAISuggestionsGenerated = (suggestions: string) => {
    if (currentAnalysisId) {
      AnalysisHistoryService.updateAnalysisWithAISuggestions(currentAnalysisId, suggestions);
    }
  };

  const resetAllStates = () => {
    // Reset file upload states
    setSelectedFile(null);
    setExtractionResult(null);
    setExtractedSkills(null);
    setJobSuggestions(null);
    setSelectedTargetJob(null);
    setTargetJobComparison(null);
    setShowResults(false);
    setCurrentAnalysisId(null);
    
    // Reset ATS states
    setAtsResult(null);
    setShowATSResults(false);
  };

  const handleModeChange = (mode: AnalysisMode) => {
    setAnalysisMode(mode);
    resetAllStates();
  };
  
  if (showHistory) {
    return (
      <AnalysisHistory 
        onBack={() => setShowHistory(false)}
        onLoadAnalysis={handleLoadFromHistory}
      />
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header onShowHistory={() => setShowHistory(true)} />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="space-y-8">
          {/* Mode Selection */}
          <div className="max-w-2xl mx-auto">
            <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-200">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Choose Analysis Mode</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <button
                  onClick={() => handleModeChange('file-upload')}
                  className={`p-4 rounded-lg border-2 transition-all duration-200 ${
                    analysisMode === 'file-upload'
                      ? 'border-indigo-500 bg-indigo-50 text-indigo-700'
                      : 'border-gray-200 hover:border-indigo-300 hover:bg-gray-50'
                  }`}
                >
                  <div className="flex items-center space-x-3">
                    <FileText className="h-6 w-6" />
                    <div className="text-left">
                      <h3 className="font-medium">File Upload Analysis</h3>
                      <p className="text-sm text-gray-600">Upload PDF/DOCX for comprehensive analysis</p>
                    </div>
                  </div>
                </button>
                
                <button
                  onClick={() => handleModeChange('ats-matching')}
                  className={`p-4 rounded-lg border-2 transition-all duration-200 ${
                    analysisMode === 'ats-matching'
                      ? 'border-purple-500 bg-purple-50 text-purple-700'
                      : 'border-gray-200 hover:border-purple-300 hover:bg-gray-50'
                  }`}
                >
                  <div className="flex items-center space-x-3">
                    <Zap className="h-6 w-6" />
                    <div className="text-left">
                      <h3 className="font-medium">ATS Match Analysis</h3>
                      <p className="text-sm text-gray-600">Compare resume text with job description</p>
                    </div>
                  </div>
                </button>
              </div>
            </div>
          </div>

          {/* File Upload Mode */}
          {analysisMode === 'file-upload' && (
            <>
              {/* Upload Section */}
              <div className="max-w-2xl mx-auto">
                <FileUpload onFileSelect={handleFileSelect} selectedFile={selectedFile} />
                
                {/* Text Preview Section */}
                <div className="mt-6">
                  <TextPreview 
                    extractionResult={extractionResult}
                    isExtracting={isExtracting}
                    fileName={selectedFile?.name}
                  />
                </div>
                
                {/* Skills Extraction Section */}
                <div className="mt-6">
                  <ExtractedSkillsSection 
                    extractedSkills={extractedSkills}
                    isExtracting={isExtractingSkills}
                  />
                </div>
                
                {selectedFile && extractionResult && !extractionResult.error && extractedSkills && (
                  <div className="mt-6 flex justify-center">
                    <button
                      onClick={handleAnalyze}
                      disabled={isAnalyzing}
                      className="px-8 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 font-medium flex items-center space-x-2"
                    >
                      {isAnalyzing ? (
                        <>
                          <Loader2 className="h-5 w-5 animate-spin" />
                          <span>Analyzing Resume...</span>
                        </>
                      ) : (
                        <span>Analyze Resume</span>
                      )}
                    </button>
                  </div>
                )}
              </div>
              
              {/* Results Section */}
              <AnalysisResults 
                isVisible={showResults} 
                jobSuggestions={jobSuggestions}
                isGeneratingJobs={isGeneratingJobs}
              />
              
              {/* AI Suggestions Section */}
              {showResults && extractionResult && !extractionResult.error && (
                <AISuggestions 
                  resumeText={extractionResult.text}
                  isVisible={showResults}
                  onSuggestionsGenerated={handleAISuggestionsGenerated}
                />
              )}
              
              {/* Target Job Selection and Comparison */}
              {extractedSkills && (
                <div className="space-y-6">
                  <TargetJobSelector
                    availableJobs={availableJobs}
                    onJobSelect={handleTargetJobSelect}
                    selectedJob={selectedTargetJob}
                    isLoading={isComparingJob}
                  />
                  
                  <TargetJobComparisonComponent
                    comparison={targetJobComparison}
                    isLoading={isComparingJob}
                  />
                </div>
              )}
            </>
          )}

          {/* ATS Matching Mode */}
          {analysisMode === 'ats-matching' && (
            <>
              {/* Dual Text Input Section */}
              <div className="max-w-2xl mx-auto">
                <DualTextInput 
                  onAnalyze={handleATSAnalyze}
                  isAnalyzing={isATSAnalyzing}
                />
              </div>
              
              {/* ATS Results Section */}
              {atsResult && (
                <ATSMatchResults 
                  result={atsResult}
                  isVisible={showATSResults}
                />
              )}
            </>
          )}
        </div>
      </main>
      
      {/* Loading Overlay */}
      <LoadingOverlay 
        isVisible={isExtracting || isExtractingSkills || isGeneratingJobs || isAnalyzing}
        stage={loadingStage}
        fileName={selectedFile?.name}
      />
      
      {/* Toast Notifications */}
      <ToastContainer toasts={toasts} onClose={closeToast} />
    </div>
  );
}

export default App;