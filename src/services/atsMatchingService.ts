import { OpenAIService, GPTATSAnalysis } from './openAIService';

export interface ATSBreakdown {
  skillMatch: number;
  keywordMatch: number;
  titleAlignment: number;
  formatCheck: 'Good' | 'Fair' | 'Poor';
}

export interface GPTAnalysisResult {
  aiAnalysis: GPTATSAnalysis;
  isAIGenerated: boolean;
  error?: string;
  confidence: number; // AI analysis confidence score
  processingTime: number; // Time taken for analysis
}
export interface ATSMatchResult {
  overallScore: number;
  breakdown: ATSBreakdown;
  gptAnalysis?: GPTAnalysisResult;
  keywordMatches: {
    matched: string[];
    missing: string[];
    total: number;
    matchPercentage: number;
  };
  skillsAnalysis: {
    matchedSkills: Array<{
      skill: string;
      category: 'technical' | 'soft' | 'industry';
      importance: 'high' | 'medium' | 'low';
      frequency: number;
      points: number;
    }>;
    missingSkills: Array<{
      skill: string;
      category: 'technical' | 'soft' | 'industry';
      importance: 'high' | 'medium' | 'low';
      suggestions: string[];
      pointsLost: number;
    }>;
  };
  titleAnalysis: {
    jobTitles: string[];
    resumeTitles: string[];
    matchingTitles: string[];
    alignmentScore: number;
  };
  formatAnalysis: {
    hasBulletPoints: boolean;
    hasStandardSections: boolean;
    hasQuantifiedResults: boolean;
    hasContactInfo: boolean;
    overallFormatScore: 'Good' | 'Fair' | 'Poor';
  };
  experienceMatch: {
    score: number;
    feedback: string;
  };
  educationMatch: {
    score: number;
    feedback: string;
  };
  recommendations: string[];
  detailedKeywords: {
    nouns: { matched: string[]; missing: string[] };
    verbs: { matched: string[]; missing: string[] };
    phrases: { matched: string[]; missing: string[] };
  };
}

export class ATSMatchingService {
  private static technicalSkills = [
    'javascript', 'typescript', 'python', 'java', 'react', 'angular', 'vue', 'node.js',
    'express', 'spring', 'django', 'flask', 'sql', 'mongodb', 'postgresql', 'aws',
    'azure', 'docker', 'kubernetes', 'git', 'html', 'css', 'sass', 'tailwind',
    'webpack', 'vite', 'jest', 'cypress', 'selenium', 'agile', 'scrum', 'ci/cd',
    'devops', 'machine learning', 'ai', 'data science', 'analytics', 'tableau',
    'power bi', 'excel', 'figma', 'sketch', 'photoshop', 'redux', 'graphql',
    'rest api', 'microservices', 'terraform', 'jenkins', 'github', 'linux'
  ];

  private static softSkills = [
    'leadership', 'communication', 'teamwork', 'problem solving', 'analytical',
    'creative', 'adaptable', 'organized', 'detail-oriented', 'collaborative',
    'innovative', 'strategic', 'mentoring', 'project management', 'time management',
    'critical thinking', 'presentation', 'negotiation', 'customer service',
    'conflict resolution', 'decision making', 'cross-functional', 'stakeholder management'
  ];

  private static industrySkills = [
    'fintech', 'healthcare', 'e-commerce', 'saas', 'b2b', 'b2c', 'startup',
    'enterprise', 'mobile', 'web development', 'frontend', 'backend', 'full stack',
    'data engineering', 'cybersecurity', 'blockchain', 'iot', 'ar/vr', 'cloud computing'
  ];

  private static jobTitles = [
    'software engineer', 'frontend developer', 'backend developer', 'full stack developer',
    'data scientist', 'product manager', 'ui/ux designer', 'devops engineer',
    'senior developer', 'lead developer', 'engineering manager', 'tech lead',
    'software architect', 'qa engineer', 'data analyst', 'machine learning engineer',
    'cloud engineer', 'mobile developer', 'react developer', 'python developer'
  ];

  private static actionVerbs = [
    'developed', 'created', 'built', 'designed', 'implemented', 'managed', 'led',
    'optimized', 'improved', 'increased', 'reduced', 'delivered', 'architected',
    'collaborated', 'mentored', 'analyzed', 'automated', 'streamlined', 'enhanced',
    'maintained', 'deployed', 'tested', 'debugged', 'integrated', 'coordinated'
  ];

  private static technicalNouns = [
    'application', 'system', 'database', 'api', 'framework', 'library', 'platform',
    'infrastructure', 'architecture', 'deployment', 'testing', 'performance',
    'security', 'scalability', 'algorithm', 'data structure', 'optimization',
    'integration', 'automation', 'monitoring', 'analytics', 'dashboard'
  ];

  static async analyzeMatch(resumeText: string, jobDescription: string): Promise<ATSMatchResult> {
    const resumeLower = resumeText.toLowerCase();
    const jobLower = jobDescription.toLowerCase();

    // Get GPT analysis
    let gptAnalysis: GPTAnalysisResult | undefined;
    const analysisStartTime = Date.now();
    try {
      const aiResult = await OpenAIService.generateATSAnalysis(resumeText, jobDescription);
      const processingTime = Date.now() - analysisStartTime;
      
      gptAnalysis = {
        aiAnalysis: aiResult,
        isAIGenerated: !!import.meta.env.VITE_OPENAI_API_KEY,
        confidence: this.calculateAIConfidence(aiResult, resumeText, jobDescription),
        processingTime
      };
    } catch (error) {
      gptAnalysis = {
        aiAnalysis: {
          overallScore: 0,
          breakdown: { keywordMatch: 0, titleMatch: 0, formatting: 0, skillOverlap: 0 },
          suggestions: [],
          explanation: ''
        },
        isAIGenerated: false,
        error: error instanceof Error ? error.message : 'Failed to generate AI analysis',
        confidence: 0,
        processingTime: Date.now() - analysisStartTime
      };
    }

    // Enhanced keyword extraction
    const detailedKeywords = this.extractDetailedKeywords(resumeLower, jobLower);
    
    // Calculate keyword match with frequency weighting
    const keywordMatches = this.analyzeKeywordMatchesWithFrequency(resumeLower, jobLower);

    // Analyze skills with points system
    const skillsAnalysis = this.analyzeSkillsWithPoints(resumeLower, jobLower);

    // Analyze title alignment
    const titleAnalysis = this.analyzeTitleAlignment(resumeLower, jobLower);

    // Analyze format
    const formatAnalysis = this.analyzeFormat(resumeText);

    // Calculate experience and education
    const experienceMatch = this.analyzeExperience(resumeLower, jobLower);
    const educationMatch = this.analyzeEducation(resumeLower, jobLower);

    // Calculate breakdown scores
    const breakdown: ATSBreakdown = {
      skillMatch: this.calculateSkillMatchPercentage(skillsAnalysis),
      keywordMatch: keywordMatches.matchPercentage,
      titleAlignment: titleAnalysis.alignmentScore,
      formatCheck: formatAnalysis.overallFormatScore
    };

    // Calculate overall score with weighted components
    const overallScore = this.calculateWeightedOverallScore(breakdown, experienceMatch.score, educationMatch.score);

    // Generate recommendations
    const recommendations = this.generateDetailedRecommendations(
      breakdown,
      skillsAnalysis,
      titleAnalysis,
      formatAnalysis,
      overallScore
    );

    return {
      overallScore,
      breakdown,
      gptAnalysis,
      keywordMatches,
      skillsAnalysis,
      titleAnalysis,
      formatAnalysis,
      experienceMatch,
      educationMatch,
      recommendations,
      detailedKeywords
    };
  }

  private static calculateAIConfidence(aiResult: GPTATSAnalysis, resumeText: string, jobDescription: string): number {
    // Calculate confidence based on analysis depth and consistency
    let confidence = 70; // Base confidence
    
    // Check if all required fields are present and reasonable
    if (aiResult.overallScore >= 0 && aiResult.overallScore <= 100) confidence += 10;
    if (aiResult.breakdown && Object.keys(aiResult.breakdown).length >= 4) confidence += 10;
    if (aiResult.suggestions && aiResult.suggestions.length >= 2) confidence += 5;
    if (aiResult.explanation && aiResult.explanation.length > 50) confidence += 5;
    
    // Check for logical consistency
    const avgBreakdown = Object.values(aiResult.breakdown || {}).reduce((a, b) => a + b, 0) / Object.keys(aiResult.breakdown || {}).length;
    if (Math.abs(aiResult.overallScore - avgBreakdown) < 15) confidence += 10; // Scores are consistent
    
    // Text length analysis (longer texts usually get more accurate analysis)
    const textComplexity = (resumeText.length + jobDescription.length) / 2000;
    if (textComplexity > 1) confidence += Math.min(textComplexity * 5, 15);
    
    return Math.min(confidence, 100);
  }

  private static extractDetailedKeywords(resumeText: string, jobDescription: string) {
    // Enhanced keyword extraction with semantic understanding
    const stopWords = new Set([
      'the', 'a', 'an', 'and', 'or', 'but', 'in', 'on', 'at', 'to', 'for', 'of', 'with',
      'by', 'is', 'are', 'was', 'were', 'be', 'been', 'have', 'has', 'had', 'will',
      'would', 'could', 'should', 'may', 'might', 'can', 'must', 'shall', 'this', 'that'
    ]);

    // Technical terms that should be weighted higher
    const highValueTerms = new Set([
      'react', 'python', 'javascript', 'typescript', 'aws', 'docker', 'kubernetes',
      'node.js', 'express', 'mongodb', 'postgresql', 'graphql', 'rest', 'api',
      'microservices', 'devops', 'ci/cd', 'terraform', 'jenkins', 'git', 'agile',
      'scrum', 'machine learning', 'data science', 'artificial intelligence'
    ]);
    const extractWords = (text: string) => {
      return text
        .replace(/[^\w\s]/g, ' ')
        .replace(/([a-z])([A-Z])/g, '$1 $2') // Split camelCase
        .split(/\s+/)
        .filter(word => word.length > 2 && !stopWords.has(word))
        .map(word => word.toLowerCase());
    };

    const jobWords = extractWords(jobDescription);
    const resumeWords = extractWords(resumeText);
    const resumeWordSet = new Set(resumeWords);

    // Extract nouns (technical terms and nouns from our database)
    const jobNouns = jobWords.filter(word => 
      this.technicalNouns.includes(word) || 
      this.technicalSkills.includes(word) ||
      highValueTerms.has(word) ||
      word.endsWith('ing') || 
      word.endsWith('tion') || 
      word.endsWith('ment')
    );
    
    const matchedNouns = jobNouns.filter(noun => resumeWordSet.has(noun));
    const missingNouns = jobNouns.filter(noun => !resumeWordSet.has(noun));

    // Extract verbs (action verbs)
    const jobVerbs = jobWords.filter(word => this.actionVerbs.includes(word));
    const matchedVerbs = jobVerbs.filter(verb => resumeWordSet.has(verb));
    const missingVerbs = jobVerbs.filter(verb => !resumeWordSet.has(verb));

    // Extract phrases (bi-grams and common tech phrases)
    const jobPhrases = this.extractPhrases(jobDescription);
    const resumePhrases = this.extractPhrases(resumeText);
    const resumePhraseSet = new Set(resumePhrases);
    
    const matchedPhrases = jobPhrases.filter(phrase => resumePhraseSet.has(phrase));
    const missingPhrases = jobPhrases.filter(phrase => !resumePhraseSet.has(phrase));

    // Weight keywords by importance
    const weightedMatched = matchedNouns.filter(noun => highValueTerms.has(noun));
    const weightedMissing = missingNouns.filter(noun => highValueTerms.has(noun));

    return {
      nouns: { 
        matched: [...new Set([...weightedMatched, ...matchedNouns])].slice(0, 12), 
        missing: [...new Set([...weightedMissing, ...missingNouns])].slice(0, 10) 
      },
      verbs: { 
        matched: [...new Set(matchedVerbs)], 
        missing: [...new Set(missingVerbs)].slice(0, 8) 
      },
      phrases: { 
        matched: [...new Set(matchedPhrases)], 
        missing: [...new Set(missingPhrases)].slice(0, 8) 
      }
    };
  }

  private static extractPhrases(text: string): string[] {
    const commonTechPhrases = [
      'machine learning', 'data science', 'web development', 'mobile development',
      'cloud computing', 'software engineering', 'project management', 'team leadership',
      'problem solving', 'code review', 'unit testing', 'integration testing',
      'continuous integration', 'continuous deployment', 'agile development',
      'scrum methodology', 'rest api', 'graphql api', 'database design',
      'system architecture', 'user experience', 'user interface',
      'artificial intelligence', 'natural language processing', 'computer vision',
      'deep learning', 'neural networks', 'distributed systems', 'event driven',
      'microservices architecture', 'serverless computing', 'edge computing',
      'devops practices', 'infrastructure as code', 'gitops', 'observability'
    ];

    const textLower = text.toLowerCase();
    return commonTechPhrases.filter(phrase => textLower.includes(phrase));
  }

  private static analyzeKeywordMatchesWithFrequency(resumeText: string, jobDescription: string) {
    // Enhanced frequency analysis with contextual weighting
    const resumeWords = this.extractWords(resumeText);
    const jobWords = this.extractWords(jobDescription);
    
    // Create context awareness - keywords near "required" or "must" are weighted higher
    const highPriorityContext = /(?:required|must have|essential|critical|mandatory|key requirement)/i;
    const mediumPriorityContext = /(?:preferred|nice to have|desired|plus|advantage)/i;
    
    // Count frequency of job keywords
    const jobWordFreq: { [key: string]: number } = {};
    const jobWordPriority: { [key: string]: number } = {}; // 1=low, 2=medium, 3=high
    
    jobWords.forEach(word => {
      jobWordFreq[word] = (jobWordFreq[word] || 0) + 1;
      
      // Determine priority based on context
      const wordIndex = jobDescription.toLowerCase().indexOf(word);
      const surrounding = jobDescription.substring(Math.max(0, wordIndex - 100), wordIndex + 100);
      
      if (highPriorityContext.test(surrounding)) {
        jobWordPriority[word] = 3;
      } else if (mediumPriorityContext.test(surrounding)) {
        jobWordPriority[word] = 2;
      } else {
        jobWordPriority[word] = 1;
      }
    });

    // Count frequency of resume keywords
    const resumeWordFreq: { [key: string]: number } = {};
    resumeWords.forEach(word => {
      resumeWordFreq[word] = (resumeWordFreq[word] || 0) + 1;
    });

    // Calculate weighted matches based on frequency
    let totalPoints = 0;
    let earnedPoints = 0;
    const matched: string[] = [];
    const missing: string[] = [];

    Object.entries(jobWordFreq).forEach(([word, jobFreq]) => {
      const resumeFreq = resumeWordFreq[word] || 0;
      const priority = jobWordPriority[word] || 1;
      const wordPoints = Math.min(jobFreq * priority * 2, 15); // Higher cap for important words
      totalPoints += wordPoints;

      if (resumeFreq > 0) {
        const earnedWordPoints = Math.min(resumeFreq, jobFreq) * priority * 2;
        earnedPoints += earnedWordPoints;
        matched.push(word);
      } else {
        missing.push(word);
      }
    });

    const matchPercentage = totalPoints > 0 ? Math.round((earnedPoints / totalPoints) * 100) : 0;

    return {
      matched: [...new Set(matched)],
      missing: [...new Set(missing)].slice(0, 20),
      total: Object.keys(jobWordFreq).length,
      matchPercentage
    };
  }

  private static analyzeSkillsWithPoints(resumeText: string, jobDescription: string) {
    const matchedSkills: Array<{
      skill: string;
      category: 'technical' | 'soft' | 'industry';
      importance: 'high' | 'medium' | 'low';
      frequency: number;
      points: number;
    }> = [];

    const missingSkills: Array<{
      skill: string;
      category: 'technical' | 'soft' | 'industry';
      importance: 'high' | 'medium' | 'low';
      suggestions: string[];
      pointsLost: number;
    }> = [];

    // Analyze technical skills with points
    this.technicalSkills.forEach(skill => {
      const jobMentions = this.countMentions(jobDescription, skill);
      const resumeMentions = this.countMentions(resumeText, skill);
      const importance = this.getSkillImportance(skill, jobDescription);

      if (jobMentions > 0) {
        const basePoints = importance === 'high' ? 15 : importance === 'medium' ? 10 : 5;
        const frequencyMultiplier = Math.min(jobMentions, 3);
        const maxPoints = basePoints * frequencyMultiplier;

        if (resumeMentions > 0) {
          const earnedPoints = Math.min(resumeMentions, jobMentions) * basePoints;
          matchedSkills.push({
            skill,
            category: 'technical',
            importance,
            frequency: resumeMentions,
            points: earnedPoints
          });
        } else {
          missingSkills.push({
            skill,
            category: 'technical',
            importance,
            suggestions: this.getSkillSuggestions(skill),
            pointsLost: maxPoints
          });
        }
      }
    });

    // Analyze soft skills with points
    this.softSkills.forEach(skill => {
      const jobMentions = this.countMentions(jobDescription, skill);
      const resumeMentions = this.countMentions(resumeText, skill);
      const importance = this.getSkillImportance(skill, jobDescription);

      if (jobMentions > 0) {
        const basePoints = importance === 'high' ? 10 : importance === 'medium' ? 7 : 4;
        const maxPoints = basePoints * Math.min(jobMentions, 2);

        if (resumeMentions > 0) {
          const earnedPoints = Math.min(resumeMentions, jobMentions) * basePoints;
          matchedSkills.push({
            skill,
            category: 'soft',
            importance,
            frequency: resumeMentions,
            points: earnedPoints
          });
        } else {
          missingSkills.push({
            skill,
            category: 'soft',
            importance,
            suggestions: this.getSoftSkillSuggestions(skill),
            pointsLost: maxPoints
          });
        }
      }
    });

    return {
      matchedSkills: matchedSkills.slice(0, 20),
      missingSkills: missingSkills.slice(0, 10)
    };
  }

  private static analyzeTitleAlignment(resumeText: string, jobDescription: string) {
    const jobTitles = this.jobTitles.filter(title => jobDescription.includes(title));
    const resumeTitles = this.jobTitles.filter(title => resumeText.includes(title));
    
    const matchingTitles = jobTitles.filter(title => resumeTitles.includes(title));
    
    // Calculate alignment score based on title matches and related titles
    let alignmentScore = 0;
    
    if (jobTitles.length === 0) {
      alignmentScore = 75; // Default if no clear titles in job description
    } else {
      const directMatches = matchingTitles.length;
      const relatedMatches = this.findRelatedTitleMatches(jobTitles, resumeTitles);
      
      const totalMatches = directMatches + (relatedMatches * 0.7);
      alignmentScore = Math.round((totalMatches / jobTitles.length) * 100);
      alignmentScore = Math.min(alignmentScore, 100);
    }

    return {
      jobTitles,
      resumeTitles,
      matchingTitles,
      alignmentScore
    };
  }

  private static findRelatedTitleMatches(jobTitles: string[], resumeTitles: string[]): number {
    const titleRelations: { [key: string]: string[] } = {
      'software engineer': ['developer', 'programmer', 'software developer'],
      'frontend developer': ['ui developer', 'web developer', 'react developer'],
      'backend developer': ['server developer', 'api developer', 'python developer'],
      'full stack developer': ['software engineer', 'web developer'],
      'data scientist': ['data analyst', 'machine learning engineer'],
      'devops engineer': ['cloud engineer', 'infrastructure engineer']
    };

    let relatedMatches = 0;
    jobTitles.forEach(jobTitle => {
      const related = titleRelations[jobTitle] || [];
      const hasRelated = related.some(relatedTitle => 
        resumeTitles.some(resumeTitle => resumeTitle.includes(relatedTitle) || relatedTitle.includes(resumeTitle))
      );
      if (hasRelated) relatedMatches++;
    });

    return relatedMatches;
  }

  private static analyzeFormat(resumeText: string) {
    const hasBulletPoints = /[•\-\*]/.test(resumeText);
    const hasContactInfo = /@/.test(resumeText) || /\(\d{3}\)/.test(resumeText);
    const hasQuantifiedResults = /\d+%|\$\d+|\d+k|\d+\+/.test(resumeText);
    
    const standardSections = ['experience', 'education', 'skills', 'work', 'employment'];
    const hasStandardSections = standardSections.some(section => 
      resumeText.toLowerCase().includes(section)
    );

    const formatScore = [hasBulletPoints, hasContactInfo, hasQuantifiedResults, hasStandardSections]
      .filter(Boolean).length;

    let overallFormatScore: 'Good' | 'Fair' | 'Poor';
    if (formatScore >= 3) overallFormatScore = 'Good';
    else if (formatScore >= 2) overallFormatScore = 'Fair';
    else overallFormatScore = 'Poor';

    return {
      hasBulletPoints,
      hasStandardSections,
      hasQuantifiedResults,
      hasContactInfo,
      overallFormatScore
    };
  }

  private static calculateSkillMatchPercentage(skillsAnalysis: any): number {
    const totalEarnedPoints = skillsAnalysis.matchedSkills.reduce((sum: number, skill: any) => sum + skill.points, 0);
    const totalLostPoints = skillsAnalysis.missingSkills.reduce((sum: number, skill: any) => sum + skill.pointsLost, 0);
    const totalPossiblePoints = totalEarnedPoints + totalLostPoints;

    return totalPossiblePoints > 0 ? Math.round((totalEarnedPoints / totalPossiblePoints) * 100) : 0;
  }

  private static calculateWeightedOverallScore(
    breakdown: ATSBreakdown,
    experienceScore: number,
    educationScore: number
  ): number {
    const formatScore = breakdown.formatCheck === 'Good' ? 90 : breakdown.formatCheck === 'Fair' ? 70 : 50;
    
    return Math.round(
      breakdown.skillMatch * 0.35 +        // 35% - Skills are most important
      breakdown.keywordMatch * 0.25 +      // 25% - Keywords for ATS parsing
      breakdown.titleAlignment * 0.20 +    // 20% - Title relevance
      formatScore * 0.10 +                 // 10% - Format for ATS compatibility
      experienceScore * 0.07 +             // 7% - Experience level
      educationScore * 0.03                // 3% - Education requirements
    );
  }

  private static generateDetailedRecommendations(
    breakdown: ATSBreakdown,
    skillsAnalysis: any,
    titleAnalysis: any,
    formatAnalysis: any,
    overallScore: number
  ): string[] {
    const recommendations: string[] = [];

    if (breakdown.skillMatch < 70) {
      recommendations.push(`Improve skill match (${breakdown.skillMatch}%): Add missing key skills to your resume`);
    }

    if (breakdown.keywordMatch < 65) {
      recommendations.push(`Increase keyword density (${breakdown.keywordMatch}%): Include more job-specific terminology`);
    }

    if (breakdown.titleAlignment < 75) {
      recommendations.push(`Improve title alignment (${breakdown.titleAlignment}%): Adjust job titles to match target role`);
    }

    if (formatAnalysis.overallFormatScore !== 'Good') {
      recommendations.push(`Improve resume format (${formatAnalysis.overallFormatScore}): Add bullet points and quantified achievements`);
    }

    if (skillsAnalysis.missingSkills.length > 3) {
      const topMissingSkills = skillsAnalysis.missingSkills
        .filter((skill: any) => skill.importance === 'high')
        .slice(0, 3)
        .map((skill: any) => skill.skill);
      
      if (topMissingSkills.length > 0) {
        recommendations.push(`Priority skills to add: ${topMissingSkills.join(', ')}`);
      }
    }

    recommendations.push('Use exact keywords from the job description');
    recommendations.push('Include quantified achievements with metrics');

    return recommendations.slice(0, 6);
  }

  // Helper methods
  private static extractWords(text: string): string[] {
    const stopWords = new Set([
      'the', 'a', 'an', 'and', 'or', 'but', 'in', 'on', 'at', 'to', 'for', 'of', 'with',
      'by', 'is', 'are', 'was', 'were', 'be', 'been', 'have', 'has', 'had', 'will'
    ]);

    return text
      .replace(/[^\w\s]/g, ' ')
      .split(/\s+/)
      .filter(word => word.length > 2 && !stopWords.has(word))
      .map(word => word.toLowerCase());
  }

  private static countMentions(text: string, skill: string): number {
    const skillLower = skill.toLowerCase();
    const regex = new RegExp(`\\b${skillLower.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\b`, 'gi');
    const matches = text.match(regex);
    return matches ? matches.length : 0;
  }

  private static getSkillImportance(skill: string, jobDescription: string): 'high' | 'medium' | 'low' {
    const text = jobDescription.toLowerCase();
    const skillLower = skill.toLowerCase();
    
    // Enhanced importance detection with more patterns
    const highImportancePatterns = [
      `required: ${skillLower}`, `must have ${skillLower}`, `essential: ${skillLower}`, 
      `required ${skillLower}`, `critical ${skillLower}`, `mandatory ${skillLower}`,
      `key requirement: ${skillLower}`, `${skillLower} required`, `${skillLower} essential`
    ];
    
    const mediumImportancePatterns = [
      `preferred: ${skillLower}`, `nice to have ${skillLower}`, `plus: ${skillLower}`,
      `desired ${skillLower}`, `advantage: ${skillLower}`, `${skillLower} preferred`,
      `experience with ${skillLower}`, `familiarity with ${skillLower}`
    ];

    if (highImportancePatterns.some(pattern => text.includes(pattern))) {
      return 'high';
    }
    if (mediumImportancePatterns.some(pattern => text.includes(pattern))) {
      return 'medium';
    }
    return 'low';
  }

  private static getSkillSuggestions(skill: string): string[] {
    const suggestions: Record<string, string[]> = {
      'react': ['Add React projects with hooks and context', 'Mention component libraries and state management', 'Include React performance optimization'],
      'python': ['Include Python automation and data analysis projects', 'Highlight specific libraries (pandas, numpy, django)', 'Add machine learning or web scraping examples'],
      'aws': ['List specific AWS services (EC2, S3, Lambda, RDS)', 'Mention cloud architecture and infrastructure as code', 'Include cost optimization and security practices'],
      'docker': ['Describe containerization and orchestration projects', 'Include Docker Compose and multi-stage builds', 'Add container security and optimization'],
      'kubernetes': ['Include container orchestration experience', 'Mention helm charts and cluster management', 'Add monitoring and scaling strategies'],
      'typescript': ['Show TypeScript project examples', 'Mention type safety and developer experience improvements', 'Include advanced TypeScript patterns'],
      'graphql': ['Add GraphQL API development experience', 'Mention schema design and resolver optimization', 'Include client-side GraphQL usage']
    };

    return suggestions[skill] || [`Add ${skill} to skills section`, `Include ${skill} in project descriptions`];
  }

  private static getSoftSkillSuggestions(skill: string): string[] {
    const suggestions: Record<string, string[]> = {
      'leadership': ['Quantify team size and project outcomes', 'Include mentoring and coaching achievements', 'Show cross-functional collaboration results'],
      'communication': ['Highlight presentation and documentation skills', 'Include stakeholder management examples', 'Show technical writing and knowledge sharing'],
      'problem solving': ['Quantify problems solved with metrics', 'Describe analytical frameworks used', 'Include process improvement achievements'],
      'project management': ['Show project delivery success rates', 'Include budget and timeline management', 'Mention agile/scrum facilitation experience']
    };

    return suggestions[skill] || [`Demonstrate ${skill} with examples`, `Quantify ${skill} achievements`];
  }

  private static analyzeExperience(resumeText: string, jobDescription: string) {
    const jobYearsMatch = jobDescription.match(/(\d+)\+?\s*years?\s*(?:of\s*)?experience/i);
    const resumeYearsMatch = resumeText.match(/(\d+)\+?\s*years?\s*(?:of\s*)?experience/i);

    const requiredYears = jobYearsMatch ? parseInt(jobYearsMatch[1]) : 0;
    const candidateYears = resumeYearsMatch ? parseInt(resumeYearsMatch[1]) : 0;

    let score = 80;
    let feedback = 'Experience analysis completed';

    if (requiredYears > 0) {
      if (candidateYears >= requiredYears) {
        score = 100;
        feedback = `Meets experience requirement (${candidateYears}+ vs ${requiredYears}+ required)`;
      } else if (candidateYears >= requiredYears * 0.8) {
        score = 75;
        feedback = `Close to requirement (${candidateYears}+ vs ${requiredYears}+ required)`;
      } else {
        score = 50;
        feedback = `Below requirement (${candidateYears}+ vs ${requiredYears}+ required)`;
      }
    }

    return { score, feedback };
  }

  private static analyzeEducation(resumeText: string, jobDescription: string) {
    const degreeKeywords = ['bachelor', 'master', 'phd', 'degree', 'university'];
    const resumeHasDegree = degreeKeywords.some(keyword => resumeText.toLowerCase().includes(keyword));
    const jobRequiresDegree = degreeKeywords.some(keyword => jobDescription.toLowerCase().includes(keyword));

    let score = 80;
    let feedback = 'Education requirements analysis';

    if (jobRequiresDegree && resumeHasDegree) {
      score = 100;
      feedback = 'Education requirements met';
    } else if (jobRequiresDegree && !resumeHasDegree) {
      score = 60;
      feedback = 'Consider highlighting relevant certifications';
    }

    return { score, feedback };
  }
}