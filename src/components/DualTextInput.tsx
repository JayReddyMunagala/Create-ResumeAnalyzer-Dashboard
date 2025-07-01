import React, { useState, useRef } from 'react';
import { FileText, Target, Zap, Upload, X, Loader2 } from 'lucide-react';
import { TextExtractionService, TextExtractionResult } from '../services/textExtraction';

interface DualTextInputProps {
  onAnalyze: (resumeText: string, jobDescription: string) => void;
  isAnalyzing: boolean;
}

export const DualTextInput: React.FC<DualTextInputProps> = ({ onAnalyze, isAnalyzing }) => {
  const [resumeText, setResumeText] = useState('');
  const [jobDescription, setJobDescription] = useState('');
  const [resumeFile, setResumeFile] = useState<File | null>(null);
  const [jobFile, setJobFile] = useState<File | null>(null);
  const [isExtractingResume, setIsExtractingResume] = useState(false);
  const [isExtractingJob, setIsExtractingJob] = useState(false);
  
  const resumeFileInputRef = useRef<HTMLInputElement>(null);
  const jobFileInputRef = useRef<HTMLInputElement>(null);

  const handleSubmit = () => {
    if (resumeText.trim() && jobDescription.trim()) {
      onAnalyze(resumeText.trim(), jobDescription.trim());
    }
  };

  const isSubmitDisabled = !resumeText.trim() || !jobDescription.trim() || isAnalyzing;

  const getWordCount = (text: string) => {
    return text.trim().split(/\s+/).filter(word => word.length > 0).length;
  };

  const isValidFileType = (file: File) => {
    const validTypes = ['application/pdf', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
    return validTypes.includes(file.type);
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const handleResumeFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      const file = files[0];
      if (isValidFileType(file)) {
        setResumeFile(file);
        setIsExtractingResume(true);
        
        try {
          const result = await TextExtractionService.extractText(file);
          if (result.text && !result.error) {
            setResumeText(result.text);
          } else {
            console.error('Resume extraction error:', result.error);
            // Reset file on error
            setResumeFile(null);
            if (resumeFileInputRef.current) {
              resumeFileInputRef.current.value = '';
            }
          }
        } catch (error) {
          console.error('Resume extraction failed:', error);
          setResumeFile(null);
          if (resumeFileInputRef.current) {
            resumeFileInputRef.current.value = '';
          }
        } finally {
          setIsExtractingResume(false);
        }
      }
    }
  };

  const handleJobFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      const file = files[0];
      if (isValidFileType(file)) {
        setJobFile(file);
        setIsExtractingJob(true);
        
        try {
          const result = await TextExtractionService.extractText(file);
          if (result.text && !result.error) {
            setJobDescription(result.text);
          } else {
            console.error('Job description extraction error:', result.error);
            // Reset file on error
            setJobFile(null);
            if (jobFileInputRef.current) {
              jobFileInputRef.current.value = '';
            }
          }
        } catch (error) {
          console.error('Job description extraction failed:', error);
          setJobFile(null);
          if (jobFileInputRef.current) {
            jobFileInputRef.current.value = '';
          }
        } finally {
          setIsExtractingJob(false);
        }
      }
    }
  };

  const removeResumeFile = () => {
    setResumeFile(null);
    setResumeText('');
    if (resumeFileInputRef.current) {
      resumeFileInputRef.current.value = '';
    }
  };

  const removeJobFile = () => {
    setJobFile(null);
    setJobDescription('');
    if (jobFileInputRef.current) {
      jobFileInputRef.current.value = '';
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-200">
      <div className="flex items-center space-x-2 mb-6">
        <div className="p-2 bg-indigo-100 rounded-lg">
          <FileText className="h-5 w-5 text-indigo-600" />
        </div>
        <h2 className="text-lg font-semibold text-gray-900">ATS Match Analysis</h2>
        <span className="px-2 py-1 text-xs bg-indigo-100 text-indigo-700 rounded-full font-medium">
          AI-Powered
        </span>
      </div>

      <p className="text-sm text-gray-600 mb-6">
        Upload files or paste text for your resume and target job description to get an instant ATS (Applicant Tracking System) compatibility score.
      </p>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        {/* Resume Section */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <label className="text-sm font-medium text-gray-900 flex items-center space-x-2">
              <Upload className="h-4 w-4 text-gray-600" />
              <span>Resume</span>
            </label>
            <span className="text-xs text-gray-500">
              {getWordCount(resumeText)} words
            </span>
          </div>

          {/* Resume File Upload */}
          <div className="mb-3">
            {!resumeFile ? (
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center hover:border-indigo-400 transition-colors duration-200">
                <div className="flex flex-col items-center space-y-2">
                  <Upload className="h-6 w-6 text-gray-400" />
                  <p className="text-sm text-gray-600">Upload PDF or DOCX</p>
                  <button
                    onClick={() => resumeFileInputRef.current?.click()}
                    disabled={isExtractingResume || isAnalyzing}
                    className="px-3 py-1 bg-indigo-600 text-white rounded text-xs hover:bg-indigo-700 disabled:opacity-50 transition-colors duration-200"
                  >
                    {isExtractingResume ? 'Processing...' : 'Choose File'}
                  </button>
                </div>
                <input
                  ref={resumeFileInputRef}
                  type="file"
                  accept=".pdf,.docx"
                  onChange={handleResumeFileSelect}
                  className="hidden"
                />
              </div>
            ) : (
              <div className="flex items-center justify-between p-3 bg-green-50 border border-green-200 rounded-lg">
                <div className="flex items-center space-x-2">
                  <FileText className="h-4 w-4 text-green-600" />
                  <div>
                    <p className="text-sm font-medium text-green-900">{resumeFile.name}</p>
                    <p className="text-xs text-green-600">{formatFileSize(resumeFile.size)}</p>
                  </div>
                </div>
                {isExtractingResume ? (
                  <Loader2 className="h-4 w-4 animate-spin text-green-600" />
                ) : (
                  <button
                    onClick={removeResumeFile}
                    className="p-1 hover:bg-green-200 rounded-full transition-colors duration-200"
                  >
                    <X className="h-4 w-4 text-green-600" />
                  </button>
                )}
              </div>
            )}
          </div>

          {/* Resume Text Area */}
          <textarea
            value={resumeText}
            onChange={(e) => setResumeText(e.target.value)}
            placeholder="Or paste your complete resume text here including work experience, skills, education, and projects..."
            className="w-full h-64 p-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent resize-none text-sm"
            disabled={isAnalyzing || isExtractingResume}
          />
          <div className="flex items-center space-x-2 text-xs text-gray-500">
            <div className="w-2 h-2 bg-green-500 rounded-full"></div>
            <span>Upload file or paste text • Include all sections</span>
          </div>
        </div>

        {/* Job Description Section */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <label className="text-sm font-medium text-gray-900 flex items-center space-x-2">
              <Target className="h-4 w-4 text-gray-600" />
              <span>Job Description</span>
            </label>
            <span className="text-xs text-gray-500">
              {getWordCount(jobDescription)} words
            </span>
          </div>

          {/* Job Description File Upload */}
          <div className="mb-3">
            {!jobFile ? (
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center hover:border-indigo-400 transition-colors duration-200">
                <div className="flex flex-col items-center space-y-2">
                  <Upload className="h-6 w-6 text-gray-400" />
                  <p className="text-sm text-gray-600">Upload PDF or DOCX</p>
                  <button
                    onClick={() => jobFileInputRef.current?.click()}
                    disabled={isExtractingJob || isAnalyzing}
                    className="px-3 py-1 bg-indigo-600 text-white rounded text-xs hover:bg-indigo-700 disabled:opacity-50 transition-colors duration-200"
                  >
                    {isExtractingJob ? 'Processing...' : 'Choose File'}
                  </button>
                </div>
                <input
                  ref={jobFileInputRef}
                  type="file"
                  accept=".pdf,.docx"
                  onChange={handleJobFileSelect}
                  className="hidden"
                />
              </div>
            ) : (
              <div className="flex items-center justify-between p-3 bg-blue-50 border border-blue-200 rounded-lg">
                <div className="flex items-center space-x-2">
                  <FileText className="h-4 w-4 text-blue-600" />
                  <div>
                    <p className="text-sm font-medium text-blue-900">{jobFile.name}</p>
                    <p className="text-xs text-blue-600">{formatFileSize(jobFile.size)}</p>
                  </div>
                </div>
                {isExtractingJob ? (
                  <Loader2 className="h-4 w-4 animate-spin text-blue-600" />
                ) : (
                  <button
                    onClick={removeJobFile}
                    className="p-1 hover:bg-blue-200 rounded-full transition-colors duration-200"
                  >
                    <X className="h-4 w-4 text-blue-600" />
                  </button>
                )}
              </div>
            )}
          </div>

          {/* Job Description Text Area */}
          <textarea
            value={jobDescription}
            onChange={(e) => setJobDescription(e.target.value)}
            placeholder="Or paste the complete job description including requirements, responsibilities, qualifications, and preferred skills..."
            className="w-full h-64 p-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent resize-none text-sm"
            disabled={isAnalyzing || isExtractingJob}
          />
          <div className="flex items-center space-x-2 text-xs text-gray-500">
            <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
            <span>Upload file or paste text • Include requirements & skills</span>
          </div>
        </div>
      </div>

      {/* Submit Button */}
      <div className="flex flex-col items-center space-y-4">
        <button
          onClick={handleSubmit}
          disabled={isSubmitDisabled || isExtractingResume || isExtractingJob}
          className="px-8 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-lg hover:from-indigo-700 hover:to-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 font-medium flex items-center space-x-2 shadow-lg hover:shadow-xl"
        >
          {isAnalyzing ? (
            <>
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
              <span>Analyzing Match...</span>
            </>
          ) : isExtractingResume || isExtractingJob ? (
            <>
              <Loader2 className="h-5 w-5 animate-spin" />
              <span>Extracting Text...</span>
            </>
          ) : (
            <>
              <Zap className="h-5 w-5" />
              <span>Score ATS Match</span>
            </>
          )}
        </button>

        {isSubmitDisabled && !isAnalyzing && !isExtractingResume && !isExtractingJob && (
          <p className="text-sm text-gray-500">
            Please provide both resume and job description to continue
          </p>
        )}
      </div>

      {/* Info Section */}
      <div className="mt-6 p-4 bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-lg">
        <div className="flex items-start space-x-2">
          <Zap className="h-5 w-5 text-blue-600 mt-0.5 flex-shrink-0" />
          <div>
            <h4 className="font-medium text-blue-900 mb-1">Flexible Input Options</h4>
            <p className="text-sm text-blue-800 leading-relaxed">
              Upload PDF/DOCX files or paste text directly. Our AI analyzes keyword overlap, skill matching, and qualification alignment to give you a comprehensive ATS compatibility score with actionable optimization insights.
            </p>
          </div>
        </div>
      </div>

      {/* Processing Status */}
      {(isExtractingResume || isExtractingJob) && (
        <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
          <div className="flex items-center space-x-2">
            <Loader2 className="h-4 w-4 animate-spin text-yellow-600" />
            <span className="text-sm font-medium text-yellow-800">
              {isExtractingResume && isExtractingJob ? 'Extracting text from both files...' :
               isExtractingResume ? 'Extracting text from resume...' :
               'Extracting text from job description...'}
            </span>
          </div>
        </div>
      )}
    </div>
  );
};