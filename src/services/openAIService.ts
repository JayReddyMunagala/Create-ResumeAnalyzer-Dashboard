export interface AIResumeAnalysis {
  suggestions: string;
  isLoading: boolean;
  error?: string;
}

export interface CareerCoachAnalysis {
  suitableJobTitles: string[];
  missingSkills: {
    jobTitle: string;
    requiredSkills: string[];
    preferredSkills: string[];
  }[];
  improvements: string[];
  overallAssessment: string;
}

export interface GPTATSAnalysis {
  overallScore: number;
  breakdown: {
    keywordMatch: number;
    titleMatch: number;
    formatting: number;
    skillOverlap: number;
  };
  suggestions: string[];
  explanation: string;
}

export class OpenAIService {
  private static readonly API_KEY = import.meta.env.VITE_OPENAI_API_KEY;
  private static readonly API_URL = 'https://api.openai.com/v1/chat/completions';
  private static readonly MODEL = import.meta.env.VITE_OPENAI_MODEL || 'gpt-3.5-turbo';

  static async generateResumeTips(resumeText: string): Promise<string> {
    // If no API key is provided, return mock response
    if (!this.API_KEY) {
      return this.getMockResponse(resumeText);
    }

    try {
      const response = await fetch(this.API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.API_KEY}`
        },
        body: JSON.stringify({
          model: this.MODEL,
          messages: [
            {
              role: 'system',
              content: `You are an expert career coach with 20+ years of experience in tech industry hiring, ATS systems, and current market trends. You have deep knowledge of what modern employers are looking for in 2024-2025.

Analyze the provided resume and provide comprehensive, actionable career guidance. Consider current market trends, remote work preferences, AI/ML demand, and emerging technologies. Structure your response as follows:

1. **Current Market Fit**: Analyze how well this profile fits current job market demands (2024-2025)
2. **Job Title Suitability**: List 4-6 specific job titles with market demand analysis and salary ranges
3. **Skills Gap Analysis**: Identify high-priority skills missing for target roles, including emerging technologies
4. **Market Positioning**: Suggest how to position this profile for maximum market appeal
5. **Industry Trends**: Include relevant 2024-2025 tech industry trends affecting this profile
6. **Actionable Improvements**: Provide specific, measurable improvements with timeline estimates

Focus on current market realities, remote/hybrid work trends, AI integration, cloud technologies, and emerging roles. Be specific about certifications, learning paths, and industry-specific advice.`
            },
            {
              role: 'user',
              content: `Analyze this resume for 2024-2025 job market positioning. Consider current tech trends, salary expectations, remote work opportunities, and emerging technologies:

${resumeText}

Provide comprehensive market analysis and career guidance based on current industry demands.`
            }
          ],
          max_tokens: 1000,
          temperature: 0.4
        })
      });

      if (!response.ok) {
        throw new Error(`OpenAI API error: ${response.status}`);
      }

      const data = await response.json();
      return data.choices[0]?.message?.content || 'Unable to generate suggestions at this time.';
    } catch (error) {
      console.error('OpenAI API error:', error);
      throw new Error('Failed to generate AI suggestions. Please try again later.');
    }
  }
  static async generateCareerCoachAnalysis(resumeText: string): Promise<CareerCoachAnalysis> {
    // If no API key is provided, return mock response
    if (!this.API_KEY) {
      return this.getMockCareerAnalysis(resumeText);
    }

    try {
      const response = await fetch(this.API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.API_KEY}`
        },
        body: JSON.stringify({
          model: this.MODEL,
          messages: [
            {
              role: 'system',
              content: `You are an expert ATS specialist and career coach with deep knowledge of modern Applicant Tracking Systems used by Fortune 500 companies, tech startups, and consulting firms. You understand how different ATS systems parse resumes and rank candidates.

Analyze resumes against job descriptions with the precision of a senior technical recruiter who has reviewed 10,000+ resumes. Consider:
- Exact keyword matching patterns used by ATS systems
- Semantic similarity and context understanding
- Industry-specific terminology and acronyms
- Experience level indicators and career progression
- Technical skill depth vs breadth analysis
- Current market standards and expectations

Respond with a JSON object containing:
{
  "suitableJobTitles": ["job1", "job2", "job3", "job4", "job5"],
  "missingSkills": [
    {
      "jobTitle": "Job Title",
      "requiredSkills": ["critical_skill1", "critical_skill2"],
      "preferredSkills": ["nice_to_have1", "nice_to_have2"],
      "emergingSkills": ["future_skill1", "future_skill2"]
    }
  ],
  "improvements": [
    {
      "category": "Keywords",
      "action": "specific improvement",
      "impact": "expected result",
      "priority": "high/medium/low"
    }
  ],
  "marketAnalysis": {
    "demandLevel": "high/medium/low",
    "competitiveness": "assessment of competition",
    "salaryRange": "$X,XXX - $X,XXX",
    "workArrangement": "remote/hybrid/onsite preferences"
  },
  "overallAssessment": "detailed analysis of market fit and potential"
}

Focus on accuracy, market relevance, and actionable insights. Consider 2024-2025 job market conditions.`
            },
            {
              role: 'user',
              content: `Conduct comprehensive career analysis for current market conditions:

RESUME:
${resumeText}

Provide detailed analysis considering current tech industry trends, remote work standards, and 2024-2025 hiring patterns.`
            }
          ],
          max_tokens: 1200,
          temperature: 0.3
        })
      });

      if (!response.ok) {
        throw new Error(`OpenAI API error: ${response.status}`);
      }

      const data = await response.json();
      const content = data.choices[0]?.message?.content;
      
      try {
        return JSON.parse(content);
      } catch (parseError) {
        // If JSON parsing fails, fall back to mock response
        return this.getMockCareerAnalysis(resumeText);
      }
    } catch (error) {
      console.error('OpenAI API error:', error);
      throw new Error('Failed to generate career analysis. Please try again later.');
    }
  }

  static async generateATSAnalysis(resumeText: string, jobDescription: string): Promise<GPTATSAnalysis> {
    // If no API key is provided, return mock response
    if (!this.API_KEY) {
      return this.getMockATSAnalysis(resumeText, jobDescription);
    }

    try {
      const response = await fetch(this.API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.API_KEY}`
        },
        body: JSON.stringify({
          model: this.MODEL,
          messages: [
            {
              role: 'system',
              content: `You are a senior ATS systems engineer with expertise in how modern recruiting platforms (Workday, Greenhouse, Lever, BambooHR, etc.) actually parse and score resumes. You understand the exact algorithms and weighting used by these systems.

Perform analysis with the precision of a real ATS system:
- Exact keyword frequency matching (including variations, synonyms, acronyms)
- Section-based parsing accuracy (experience, skills, education)
- Format compatibility scoring (ATS readability)
- Experience level calculation based on years, titles, and responsibilities
- Education requirement matching with degree equivalency consideration
- Industry-specific terminology recognition
- Geographic and remote work preference alignment

Respond with a JSON object containing:
{
  "overallScore": number (0-100),
  "breakdown": {
    "keywordMatch": number (0-100),     // Exact keyword frequency analysis
    "titleMatch": number (0-100),       // Job title and role alignment 
    "formatting": number (0-100),       // ATS parsing compatibility
    "skillOverlap": number (0-100),     // Technical + soft skills alignment
    "experienceLevel": number (0-100),  // Years and seniority match
    "educationMatch": number (0-100)    // Degree/certification requirements
  },
  "detailedAnalysis": {
    "strongMatches": ["specific strong points"],
    "criticalGaps": ["must-fix issues"],
    "competitiveAdvantages": ["standout elements"],
    "atsCompatibility": ["formatting recommendations"]
  },
  "suggestions": [
    {
      "type": "keyword/format/experience",
      "priority": "high/medium/low",
      "action": "specific improvement",
      "expectedImpact": "score improvement estimate"
    }
  ],
  "explanation": "Detailed explanation of ATS scoring methodology and results",
  "passLikelihood": number (0-100)  // Probability of passing ATS screening
}

Base analysis on real ATS behavior patterns and current industry standards. Be precise about technical requirements vs nice-to-haves.`
            },
            {
              role: 'user',
              content: `Perform comprehensive ATS analysis simulating how modern recruiting systems (Workday, Greenhouse, Lever) would process this application. Consider exact keyword matching, parsing accuracy, and scoring algorithms:

RESUME:
${resumeText}

JOB DESCRIPTION:
${jobDescription}

Provide detailed ATS compatibility analysis with specific improvement recommendations and expected impact on pass-through rates.`
            }
          ],
          max_tokens: 1500,
          temperature: 0.3
        })
      });

      if (!response.ok) {
        throw new Error(`OpenAI API error: ${response.status}`);
      }

      const data = await response.json();
      const content = data.choices[0]?.message?.content;
      
      try {
        return JSON.parse(content);
      } catch (parseError) {
        // If JSON parsing fails, fall back to mock response
        return this.getMockATSAnalysis(resumeText, jobDescription);
      }
    } catch (error) {
      console.error('OpenAI API error:', error);
      throw new Error('Failed to generate ATS analysis. Please try again later.');
    }
  }

  private static getMockResponse(resumeText: string): string {
    // Analyze the resume text to provide relevant mock suggestions
    const hasReact = resumeText.toLowerCase().includes('react');
    const hasProjects = resumeText.toLowerCase().includes('project');
    const hasLeadership = resumeText.toLowerCase().includes('lead') || resumeText.toLowerCase().includes('manage');
    const hasPython = resumeText.toLowerCase().includes('python');
    const hasSQL = resumeText.toLowerCase().includes('sql');
    const hasAWS = resumeText.toLowerCase().includes('aws') || resumeText.toLowerCase().includes('cloud');
    const wordCount = resumeText.split(/\s+/).length;

    // Enhanced career coaching response
    let response = "**Job Title Suitability:** Based on your experience, you're well-positioned for ";
    
    const jobTitles = [];
    if (hasReact) jobTitles.push("Frontend Developer", "React Developer");
    if (hasPython && hasSQL) jobTitles.push("Data Analyst", "Backend Developer");
    if (hasAWS) jobTitles.push("Cloud Engineer", "DevOps Engineer");
    if (hasLeadership) jobTitles.push("Senior Developer", "Tech Lead");
    if (jobTitles.length === 0) jobTitles.push("Software Developer", "Junior Developer");
    
    response += jobTitles.slice(0, 3).join(", ") + " roles. ";

    response += "\n\n**Skills Gap Analysis:** To strengthen your candidacy, consider adding ";
    const missingSkills = [];
    if (!hasReact && !resumeText.toLowerCase().includes('vue') && !resumeText.toLowerCase().includes('angular')) {
      missingSkills.push("modern frontend frameworks (React/Vue/Angular)");
    }
    if (!hasSQL) missingSkills.push("SQL and database management");
    if (!hasAWS && !resumeText.toLowerCase().includes('docker')) {
      missingSkills.push("cloud platforms (AWS/Azure) and containerization");
    }
    if (!resumeText.toLowerCase().includes('git')) missingSkills.push("version control (Git)");
    
    response += (missingSkills.length > 0 ? missingSkills.slice(0, 2).join(" and ") : "more specific technical projects") + ". ";

    response += "\n\n**Actionable Improvements:** ";
    const improvements = [];
    if (wordCount < 200) {
      improvements.push("Expand your experience descriptions with specific metrics and quantifiable achievements");
    }
    if (!hasProjects) {
      improvements.push("Add a projects section showcasing 2-3 technical projects with GitHub links");
    }
    improvements.push("Include specific technologies, tools, and programming languages you've used");
    if (!resumeText.toLowerCase().includes('certif')) {
      improvements.push("Consider pursuing relevant certifications (AWS, Google Cloud, or technology-specific)");
    }

    response += improvements.slice(0, 3).join("; ") + ". ";

    response += "\n\n**Overall Assessment:** You have a solid foundation for a tech career! ";
    if (hasReact || hasPython || hasSQL) {
      response += "Your technical skills show promise, and with some strategic additions, you'll be competitive for mid-level positions. ";
    }
    response += "Focus on showcasing real-world applications of your skills and you'll see great results in your job search.";

    return response;
  }

  private static getMockCareerAnalysis(resumeText: string): CareerCoachAnalysis {
    const hasReact = resumeText.toLowerCase().includes('react');
    const hasPython = resumeText.toLowerCase().includes('python');
    const hasSQL = resumeText.toLowerCase().includes('sql');
    const hasAWS = resumeText.toLowerCase().includes('aws');
    const hasLeadership = resumeText.toLowerCase().includes('lead') || resumeText.toLowerCase().includes('manage');
    const hasProjects = resumeText.toLowerCase().includes('project');

    // Determine suitable job titles
    const suitableJobTitles = [];
    if (hasReact) {
      suitableJobTitles.push("Frontend Developer", "React Developer");
    }
    if (hasPython && hasSQL) {
      suitableJobTitles.push("Full Stack Developer", "Backend Developer");
    }
    if (hasPython && !hasSQL) {
      suitableJobTitles.push("Python Developer", "Software Engineer");
    }
    if (hasAWS) {
      suitableJobTitles.push("Cloud Engineer", "DevOps Engineer");
    }
    if (hasLeadership && (hasReact || hasPython)) {
      suitableJobTitles.push("Senior Developer", "Tech Lead");
    }
    if (suitableJobTitles.length === 0) {
      suitableJobTitles.push("Junior Software Developer", "Software Engineer", "Web Developer");
    }

    // Generate missing skills for each job type
    const missingSkills = [];
    
    if (suitableJobTitles.includes("Frontend Developer") || suitableJobTitles.includes("React Developer")) {
      const missing = [];
      const preferred = [];
      if (!resumeText.toLowerCase().includes('typescript')) missing.push("TypeScript");
      if (!resumeText.toLowerCase().includes('css') && !resumeText.toLowerCase().includes('sass')) missing.push("Advanced CSS/SASS");
      if (!resumeText.toLowerCase().includes('jest') && !resumeText.toLowerCase().includes('test')) preferred.push("Jest/Testing");
      if (!resumeText.toLowerCase().includes('webpack') && !resumeText.toLowerCase().includes('vite')) preferred.push("Build Tools (Webpack/Vite)");
      
      missingSkills.push({
        jobTitle: "Frontend Developer",
        requiredSkills: missing.slice(0, 2),
        preferredSkills: preferred.slice(0, 2)
      });
    }

    if (suitableJobTitles.includes("Full Stack Developer") || suitableJobTitles.includes("Backend Developer")) {
      const missing = [];
      const preferred = [];
      if (!hasSQL) missing.push("SQL/Database Management");
      if (!resumeText.toLowerCase().includes('api') && !resumeText.toLowerCase().includes('rest')) missing.push("REST API Development");
      if (!resumeText.toLowerCase().includes('docker')) preferred.push("Docker/Containerization");
      if (!hasAWS && !resumeText.toLowerCase().includes('cloud')) preferred.push("Cloud Platforms (AWS/Azure)");
      
      missingSkills.push({
        jobTitle: "Full Stack Developer",
        requiredSkills: missing.slice(0, 2),
        preferredSkills: preferred.slice(0, 2)
      });
    }

    // Generate improvement suggestions
    const improvements = [];
    if (!hasProjects) {
      improvements.push("Create a portfolio with 3-4 technical projects showcasing different skills");
    }
    if (resumeText.split(/\s+/).length < 200) {
      improvements.push("Expand experience descriptions with specific metrics and quantifiable achievements");
    }
    if (!resumeText.toLowerCase().includes('github')) {
      improvements.push("Include GitHub profile link and ensure repositories are well-documented");
    }
    if (!resumeText.toLowerCase().includes('certif')) {
      improvements.push("Consider pursuing relevant certifications (AWS Cloud Practitioner, Google Cloud, etc.)");
    }
    improvements.push("Use action verbs and quantify impact (e.g., 'Improved performance by 40%', 'Led team of 5 developers')");

    // Overall assessment
    let overallAssessment = "You have a solid technical foundation";
    if (hasReact && hasPython) {
      overallAssessment += " with versatile full-stack capabilities. Your diverse skill set positions you well for senior developer roles with continued growth.";
    } else if (hasReact) {
      overallAssessment += " with strong frontend expertise. You're well-positioned for React-focused roles and can grow into full-stack positions.";
    } else if (hasPython) {
      overallAssessment += " with backend/data capabilities. Consider expanding into frontend technologies or specializing deeper in data engineering.";
    } else {
      overallAssessment += ". Focus on building projects with modern technologies to demonstrate practical application of your skills.";
    }

    return {
      suitableJobTitles: suitableJobTitles.slice(0, 4),
      missingSkills: missingSkills.slice(0, 2),
      improvements: improvements.slice(0, 4),
      overallAssessment
    };
  }

  private static getMockATSAnalysis(resumeText: string, jobDescription: string): GPTATSAnalysis {
    // Enhanced mock analysis with more sophisticated logic
    const hasReact = resumeText.toLowerCase().includes('react') && jobDescription.toLowerCase().includes('react');
    const hasPython = resumeText.toLowerCase().includes('python') && jobDescription.toLowerCase().includes('python');
    const hasJavaScript = resumeText.toLowerCase().includes('javascript') && jobDescription.toLowerCase().includes('javascript');
    const hasTypeScript = resumeText.toLowerCase().includes('typescript') && jobDescription.toLowerCase().includes('typescript');
    const hasAWS = resumeText.toLowerCase().includes('aws') && jobDescription.toLowerCase().includes('aws');
    const hasDocker = resumeText.toLowerCase().includes('docker') && jobDescription.toLowerCase().includes('docker');
    const hasKubernetes = resumeText.toLowerCase().includes('kubernetes') && jobDescription.toLowerCase().includes('kubernetes');
    const hasExperience = resumeText.toLowerCase().includes('experience') || resumeText.toLowerCase().includes('year');
    const hasBullets = /[•\-\*]/.test(resumeText);
    const hasQuantifiedResults = /\d+%|\$\d+|\d+k|\d+\+/.test(resumeText);
    const hasEducation = /bachelor|master|degree|university|college/.test(resumeText.toLowerCase());
    const hasRemoteExperience = /remote|distributed|virtual/.test(resumeText.toLowerCase());
    
    // Enhanced keyword matching with weighted scoring
    const resumeWords = resumeText.toLowerCase().split(/\s+/);
    const jobWords = jobDescription.toLowerCase().split(/\s+/);
    
    // Filter for meaningful keywords (technical terms, skills, etc.)
    const meaningfulWords = jobWords.filter(word => 
      word.length > 3 && 
      !['the', 'and', 'for', 'with', 'will', 'you', 'our', 'this', 'that', 'have', 'been', 'from'].includes(word)
    );
    
    const commonWords = resumeWords.filter(word => meaningfulWords.includes(word));
    const keywordDensity = commonWords.length / meaningfulWords.length;
    const keywordMatch = Math.min(Math.round(keywordDensity * 120), 100);
    
    // Enhanced skill overlap calculation
    let skillOverlap = 40; // Base score
    if (hasReact) skillOverlap += 20;
    if (hasPython) skillOverlap += 18;
    if (hasJavaScript) skillOverlap += 15;
    if (hasTypeScript) skillOverlap += 12;
    if (hasAWS) skillOverlap += 15;
    if (hasDocker) skillOverlap += 10;
    if (hasKubernetes) skillOverlap += 12;
    if (hasExperience) skillOverlap += 10;
    if (hasRemoteExperience && jobDescription.toLowerCase().includes('remote')) skillOverlap += 8;
    skillOverlap = Math.min(skillOverlap, 100);
    
    // Enhanced title matching with role hierarchy consideration
    const jobTitles = ['developer', 'engineer', 'analyst', 'manager', 'specialist'];
    const seniorityTerms = ['senior', 'lead', 'principal', 'staff', 'junior', 'entry'];
    
    const titleMatches = jobTitles.filter(title => 
      resumeText.toLowerCase().includes(title) && jobDescription.toLowerCase().includes(title)
    );
    
    const seniorityMatches = seniorityTerms.filter(term =>
      resumeText.toLowerCase().includes(term) && jobDescription.toLowerCase().includes(term)
    );
    
    let titleMatch = Math.min(titleMatches.length * 25 + 40, 90);
    if (seniorityMatches.length > 0) titleMatch += 10;
    titleMatch = Math.min(titleMatch, 100);
    
    // Enhanced formatting analysis
    let formatting = 60; // Base score
    if (hasBullets) formatting += 15;
    if (hasQuantifiedResults) formatting += 15;
    if (resumeText.includes('@') || /\(\d{3}\)/.test(resumeText)) formatting += 10;
    
    // Check for standard sections
    const sections = ['experience', 'education', 'skills', 'projects'];
    const sectionCount = sections.filter(section => 
      resumeText.toLowerCase().includes(section)
    ).length;
    formatting += sectionCount * 2;
    
    formatting = Math.min(formatting, 100);
    
    // Education matching
    const educationRequired = jobDescription.toLowerCase().includes('degree') || 
                            jobDescription.toLowerCase().includes('bachelor') ||
                            jobDescription.toLowerCase().includes('master');
    
    let educationScore = 80; // Default
    if (educationRequired && hasEducation) educationScore = 100;
    else if (educationRequired && !hasEducation) educationScore = 40;
    
    // Experience level calculation
    const jobYearsMatch = jobDescription.match(/(\d+)\+?\s*years?\s*(?:of\s*)?experience/i);
    const resumeYearsMatch = resumeText.match(/(\d+)\+?\s*years?\s*(?:of\s*)?experience/i);
    
    const requiredYears = jobYearsMatch ? parseInt(jobYearsMatch[1]) : 3;
    const candidateYears = resumeYearsMatch ? parseInt(resumeYearsMatch[1]) : 2;
    
    let experienceLevel = 70;
    if (candidateYears >= requiredYears) experienceLevel = 100;
    else if (candidateYears >= requiredYears * 0.8) experienceLevel = 85;
    else if (candidateYears >= requiredYears * 0.6) experienceLevel = 70;
    else experienceLevel = 50;
    
    // Weighted overall score calculation
    const overallScore = Math.round(
      skillOverlap * 0.28 +
      keywordMatch * 0.25 +
      titleMatch * 0.18 +
      formatting * 0.12 +
      experienceLevel * 0.12 +
      educationScore * 0.05
    );
    
    // Enhanced suggestions based on gaps
    const suggestions = [];
    if (keywordMatch < 65) suggestions.push("Increase keyword density by incorporating more job-specific terminology");
    if (skillOverlap < 65) suggestions.push("Add missing technical skills and highlight relevant experience");
    if (titleMatch < 70) suggestions.push("Align job titles and role descriptions with target position");
    if (formatting < 75) suggestions.push("Improve ATS compatibility with better formatting and standard sections");
    if (experienceLevel < 80) suggestions.push("Emphasize relevant experience and quantify achievements");
    if (educationRequired && !hasEducation) suggestions.push("Highlight relevant certifications or equivalent experience");
    
    if (suggestions.length === 0) {
      suggestions.push("Excellent match! Consider fine-tuning keywords for optimal ATS performance");
    }
    
    return {
      overallScore,
      breakdown: {
        keywordMatch,
        titleMatch,
        formatting,
        skillOverlap,
        experienceLevel,
        educationMatch: educationScore
      },
      suggestions: suggestions.slice(0, 4),
      explanation: `This enhanced analysis simulates modern ATS processing using weighted scoring across multiple dimensions. ${overallScore >= 85 ? 'Excellent ATS compatibility with high pass-through probability.' : overallScore >= 70 ? 'Good ATS score with optimization opportunities for better ranking.' : overallScore >= 50 ? 'Moderate ATS compatibility requiring focused improvements.' : 'Significant ATS optimization needed to improve screening success rate.'} Current market analysis suggests ${overallScore >= 75 ? 'strong' : overallScore >= 60 ? 'moderate' : 'limited'} competitiveness for similar roles.`
    };
  }
}