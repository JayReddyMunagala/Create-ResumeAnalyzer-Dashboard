import { ExtractedSkills } from './skillExtraction';

export interface JobRole {
  title: string;
  match: number;
  company: string;
  location: string;
  salary: string;
  requirements: string[];
  missing: string[];
  description: string;
  experienceLevel: 'Junior' | 'Mid' | 'Senior' | 'Lead';
  demandLevel: 'High' | 'Medium' | 'Low';
  remoteAvailable: boolean;
  industryGrowth: string;
  marketTrends: string[];
}

export interface JobRoleSuggestionResult {
  suggestedRoles: JobRole[];
  topSkillCategories: string[];
  overallProfile: string;
  marketInsights: {
    highDemandSkills: string[];
    emergingTrends: string[];
    salaryTrends: string;
    remoteOpportunities: number;
  };
}

export class JobRoleSuggestionService {
  private static currentMarketTrends = [
    'AI/ML Integration', 'Cloud-Native Development', 'DevOps Automation',
    'Remote-First Culture', 'Microservices Architecture', 'Data Privacy',
    'Sustainability Tech', 'Edge Computing', 'Cybersecurity Focus'
  ];

  private static highDemandSkills2024 = [
    'React', 'TypeScript', 'Python', 'AWS', 'Kubernetes', 'Docker',
    'GraphQL', 'Next.js', 'Node.js', 'PostgreSQL', 'Redis', 'Terraform',
    'CI/CD', 'Machine Learning', 'Data Analysis', 'Cybersecurity'
  ];

  private static jobRoleDatabase = {
    'Frontend Developer': {
      requiredSkills: ['JavaScript', 'HTML', 'CSS', 'React'],
      preferredSkills: ['TypeScript', 'Vue.js', 'Angular', 'Tailwind CSS', 'SASS'],
      experienceLevels: {
        Junior: { minSkills: 3, salary: '$60,000 - $80,000' },
        Mid: { minSkills: 5, salary: '$80,000 - $110,000' },
        Senior: { minSkills: 7, salary: '$110,000 - $140,000' },
        Lead: { minSkills: 9, salary: '$140,000 - $180,000' }
      },
      description: 'Build user interfaces and experiences for web applications',
      demandLevel: 'High',
      remoteAvailable: true,
      industryGrowth: '+12% annually',
      marketTrends: ['React 18+', 'TypeScript adoption', 'Micro-frontends', 'Web3 integration']
    },
    'Full Stack Developer': {
      requiredSkills: ['JavaScript', 'React', 'Node.js', 'HTML', 'CSS'],
      preferredSkills: ['TypeScript', 'Express.js', 'MongoDB', 'PostgreSQL', 'AWS'],
      experienceLevels: {
        Junior: { minSkills: 4, salary: '$70,000 - $90,000' },
        Mid: { minSkills: 6, salary: '$90,000 - $120,000' },
        Senior: { minSkills: 8, salary: '$120,000 - $150,000' },
        Lead: { minSkills: 10, salary: '$150,000 - $190,000' }
      },
      description: 'Develop both frontend and backend components of web applications',
      demandLevel: 'High',
      remoteAvailable: true,
      industryGrowth: '+15% annually',
      marketTrends: ['Full-stack frameworks', 'Serverless architecture', 'JAMstack', 'API-first design']
    },
    'Backend Developer': {
      requiredSkills: ['Node.js', 'JavaScript', 'SQL', 'REST API'],
      preferredSkills: ['TypeScript', 'Python', 'Express.js', 'MongoDB', 'PostgreSQL', 'Docker'],
      experienceLevels: {
        Junior: { minSkills: 3, salary: '$65,000 - $85,000' },
        Mid: { minSkills: 5, salary: '$85,000 - $115,000' },
        Senior: { minSkills: 7, salary: '$115,000 - $145,000' },
        Lead: { minSkills: 9, salary: '$145,000 - $185,000' }
      },
      description: 'Design and implement server-side logic and database architecture',
      demandLevel: 'High',
      remoteAvailable: true,
      industryGrowth: '+10% annually',
      marketTrends: ['Microservices', 'Event-driven architecture', 'GraphQL APIs', 'Database optimization']
    },
    'React Developer': {
      requiredSkills: ['React', 'JavaScript', 'HTML', 'CSS'],
      preferredSkills: ['TypeScript', 'Next.js', 'Redux', 'Jest', 'Webpack'],
      experienceLevels: {
        Junior: { minSkills: 3, salary: '$65,000 - $85,000' },
        Mid: { minSkills: 5, salary: '$85,000 - $115,000' },
        Senior: { minSkills: 7, salary: '$115,000 - $145,000' },
        Lead: { minSkills: 9, salary: '$145,000 - $185,000' }
      },
      description: 'Specialize in building React-based applications and components',
      demandLevel: 'High',
      remoteAvailable: true,
      industryGrowth: '+18% annually',
      marketTrends: ['React Server Components', 'Next.js 14+', 'State management evolution', 'Performance optimization']
    },
    'DevOps Engineer': {
      requiredSkills: ['Docker', 'AWS', 'Linux', 'Git'],
      preferredSkills: ['Kubernetes', 'Jenkins', 'Terraform', 'Ansible', 'Python'],
      experienceLevels: {
        Junior: { minSkills: 3, salary: '$70,000 - $90,000' },
        Mid: { minSkills: 5, salary: '$90,000 - $125,000' },
        Senior: { minSkills: 7, salary: '$125,000 - $160,000' },
        Lead: { minSkills: 9, salary: '$160,000 - $200,000' }
      },
      description: 'Manage infrastructure, deployment pipelines, and system reliability',
      demandLevel: 'High',
      remoteAvailable: true,
      industryGrowth: '+20% annually',
      marketTrends: ['Platform engineering', 'GitOps', 'Observability', 'FinOps practices']
    },
    'Data Scientist': {
      requiredSkills: ['Python', 'SQL', 'Pandas', 'NumPy'],
      preferredSkills: ['TensorFlow', 'PyTorch', 'Scikit-learn', 'Jupyter', 'R'],
      experienceLevels: {
        Junior: { minSkills: 3, salary: '$75,000 - $95,000' },
        Mid: { minSkills: 5, salary: '$95,000 - $130,000' },
        Senior: { minSkills: 7, salary: '$130,000 - $170,000' },
        Lead: { minSkills: 9, salary: '$170,000 - $220,000' }
      },
      description: 'Analyze data to derive insights and build predictive models',
      demandLevel: 'High',
      remoteAvailable: true,
      industryGrowth: '+22% annually',
      marketTrends: ['LLM integration', 'MLOps', 'Real-time analytics', 'Ethical AI']
    },
    'Mobile Developer': {
      requiredSkills: ['React Native', 'JavaScript', 'Mobile Development'],
      preferredSkills: ['Swift', 'Kotlin', 'Flutter', 'TypeScript', 'iOS', 'Android'],
      experienceLevels: {
        Junior: { minSkills: 2, salary: '$65,000 - $85,000' },
        Mid: { minSkills: 4, salary: '$85,000 - $115,000' },
        Senior: { minSkills: 6, salary: '$115,000 - $145,000' },
        Lead: { minSkills: 8, salary: '$145,000 - $185,000' }
      },
      description: 'Build mobile applications for iOS and Android platforms',
      demandLevel: 'Medium',
      remoteAvailable: true,
      industryGrowth: '+8% annually',
      marketTrends: ['Cross-platform development', 'React Native 0.73+', 'Flutter adoption', 'Mobile-first design']
    },
    'Cloud Engineer': {
      requiredSkills: ['AWS', 'Cloud Platforms', 'Linux'],
      preferredSkills: ['Azure', 'Google Cloud', 'Docker', 'Kubernetes', 'Terraform'],
      experienceLevels: {
        Junior: { minSkills: 2, salary: '$70,000 - $90,000' },
        Mid: { minSkills: 4, salary: '$90,000 - $125,000' },
        Senior: { minSkills: 6, salary: '$125,000 - $160,000' },
        Lead: { minSkills: 8, salary: '$160,000 - $200,000' }
      },
      description: 'Design and manage cloud infrastructure and services',
      demandLevel: 'High',
      remoteAvailable: true,
      industryGrowth: '+25% annually',
      marketTrends: ['Multi-cloud strategies', 'Serverless computing', 'Edge computing', 'Cloud security']
    },
    'QA Engineer': {
      requiredSkills: ['Testing', 'JavaScript', 'Quality Assurance'],
      preferredSkills: ['Jest', 'Cypress', 'Selenium', 'Playwright', 'Automation'],
      experienceLevels: {
        Junior: { minSkills: 2, salary: '$55,000 - $75,000' },
        Mid: { minSkills: 4, salary: '$75,000 - $100,000' },
        Senior: { minSkills: 6, salary: '$100,000 - $130,000' },
        Lead: { minSkills: 8, salary: '$130,000 - $160,000' }
      },
      description: 'Ensure software quality through testing and automation',
      demandLevel: 'Medium',
      remoteAvailable: true,
      industryGrowth: '+7% annually',
      marketTrends: ['Shift-left testing', 'AI-powered testing', 'Test automation', 'API testing']
    },
    'Product Manager': {
      requiredSkills: ['Project Management', 'Communication', 'Strategic Planning'],
      preferredSkills: ['Agile', 'Scrum', 'Leadership', 'User Experience', 'Analytics'],
      experienceLevels: {
        Junior: { minSkills: 2, salary: '$80,000 - $100,000' },
        Mid: { minSkills: 4, salary: '$100,000 - $135,000' },
        Senior: { minSkills: 6, salary: '$135,000 - $170,000' },
        Lead: { minSkills: 8, salary: '$170,000 - $220,000' }
      },
      description: 'Guide product development and strategy from conception to launch',
      demandLevel: 'High',
      remoteAvailable: true,
      industryGrowth: '+14% annually',
      marketTrends: ['AI-driven insights', 'Data-driven decisions', 'User-centric design', 'Agile methodologies']
    }
  };

  private static companies = [
    'Google', 'Meta', 'Apple', 'Microsoft', 'Amazon', 'Netflix', 'Spotify', 'Stripe',
    'Shopify', 'Airbnb', 'Uber', 'Lyft', 'Twitter', 'LinkedIn', 'Dropbox', 'Slack',
    'Zoom', 'Adobe', 'Salesforce', 'Oracle', 'IBM', 'Intel', 'NVIDIA', 'Tesla',
    'TechFlow Inc.', 'InnovateCorp', 'DataDriven LLC', 'CloudFirst Systems', 'DevOps Pro',
    'StartupHub', 'ScaleUp Technologies', 'NextGen Solutions', 'DigitalEdge Co.'
  ];

  private static locations = [
    'San Francisco, CA', 'New York, NY', 'Seattle, WA', 'Austin, TX', 'Boston, MA',
    'Los Angeles, CA', 'Chicago, IL', 'Denver, CO', 'Atlanta, GA', 'Remote',
    'Toronto, Canada', 'London, UK', 'Berlin, Germany', 'Amsterdam, Netherlands'
  ];

  static suggestJobRoles(extractedSkills: ExtractedSkills): JobRoleSuggestionResult {
    const userSkills = [
      ...extractedSkills.hardSkills.map(s => s.name),
      ...extractedSkills.softSkills.map(s => s.name)
    ];

    const jobMatches: Array<JobRole & { score: number }> = [];

    // Analyze each job role
    Object.entries(this.jobRoleDatabase).forEach(([jobTitle, jobData]) => {
      const { match, missing, experienceLevel } = this.calculateJobMatch(userSkills, jobData);
      
      if (match > 25) { // Slightly lower threshold for more opportunities
        const randomCompany = this.companies[Math.floor(Math.random() * this.companies.length)];
        const randomLocation = this.locations[Math.floor(Math.random() * this.locations.length)];
        
        // Determine if role should be remote based on current market trends
        const isRemote = jobData.remoteAvailable && Math.random() > 0.3;
        const location = isRemote ? 'Remote' : randomLocation;
        
        jobMatches.push({
          title: jobTitle,
          match,
          company: randomCompany,
          location,
          salary: jobData.experienceLevels[experienceLevel].salary,
          requirements: jobData.requiredSkills.filter(skill => userSkills.includes(skill)),
          missing,
          description: jobData.description,
          experienceLevel,
          demandLevel: jobData.demandLevel,
          remoteAvailable: jobData.remoteAvailable,
          industryGrowth: jobData.industryGrowth,
          marketTrends: jobData.marketTrends,
          score: match + (jobData.requiredSkills.length - missing.length) * 5
        });
      }
    });

    // Sort by score and take top 5
    jobMatches.sort((a, b) => b.score - a.score);
    const suggestedRoles = jobMatches.slice(0, 6).map(({ score, ...role }) => role);

    // Analyze skill categories
    const topSkillCategories = this.getTopSkillCategories(extractedSkills);
    const overallProfile = this.generateProfileDescription(extractedSkills, suggestedRoles);
    
    // Generate market insights
    const marketInsights = this.generateMarketInsights(extractedSkills, suggestedRoles);

    return {
      suggestedRoles,
      topSkillCategories,
      overallProfile,
      marketInsights
    };
  }

  private static calculateJobMatch(userSkills: string[], jobData: any) {
    const allJobSkills = [...jobData.requiredSkills, ...jobData.preferredSkills];
    const matchingSkills = userSkills.filter(skill => 
      allJobSkills.some(jobSkill => 
        skill.toLowerCase().includes(jobSkill.toLowerCase()) ||
        jobSkill.toLowerCase().includes(skill.toLowerCase())
      )
    );

    const requiredMatches = jobData.requiredSkills.filter(reqSkill =>
      userSkills.some(userSkill => 
        userSkill.toLowerCase().includes(reqSkill.toLowerCase()) ||
        reqSkill.toLowerCase().includes(userSkill.toLowerCase())
      )
    );

    const missing = jobData.requiredSkills.filter(reqSkill =>
      !userSkills.some(userSkill => 
        userSkill.toLowerCase().includes(reqSkill.toLowerCase()) ||
        reqSkill.toLowerCase().includes(userSkill.toLowerCase())
      )
    );

    // Calculate match percentage
    const requiredMatchPercentage = (requiredMatches.length / jobData.requiredSkills.length) * 100;
    const overallMatchPercentage = (matchingSkills.length / allJobSkills.length) * 100;
    const match = Math.round((requiredMatchPercentage * 0.7 + overallMatchPercentage * 0.3));

    // Determine experience level
    const totalRelevantSkills = matchingSkills.length;
    let experienceLevel: 'Junior' | 'Mid' | 'Senior' | 'Lead' = 'Junior';
    
    Object.entries(jobData.experienceLevels).forEach(([level, data]: [string, any]) => {
      if (totalRelevantSkills >= data.minSkills) {
        experienceLevel = level as 'Junior' | 'Mid' | 'Senior' | 'Lead';
      }
    });

    return { match, missing, experienceLevel };
  }

  private static getTopSkillCategories(extractedSkills: ExtractedSkills): string[] {
    const categoryCount: { [key: string]: number } = {};
    
    [...extractedSkills.hardSkills, ...extractedSkills.softSkills].forEach(skill => {
      categoryCount[skill.category] = (categoryCount[skill.category] || 0) + 1;
    });

    return Object.entries(categoryCount)
      .sort(([,a], [,b]) => b - a)
      .slice(0, 3)
      .map(([category]) => category);
  }

  private static generateProfileDescription(extractedSkills: ExtractedSkills, suggestedRoles: JobRole[]): string {
    const totalSkills = extractedSkills.totalSkills;
    const hardSkillsCount = extractedSkills.hardSkills.length;
    const softSkillsCount = extractedSkills.softSkills.length;
    
    const topRole = suggestedRoles[0];
    const avgMatch = suggestedRoles.reduce((sum, role) => sum + role.match, 0) / suggestedRoles.length;

    let profile = '';

    if (hardSkillsCount > softSkillsCount * 1.5) {
      profile = `Technical specialist with ${totalSkills} identified skills. Strong in technical execution with ${hardSkillsCount} hard skills detected.`;
    } else if (softSkillsCount > hardSkillsCount) {
      profile = `Well-rounded professional with ${totalSkills} skills, emphasizing leadership and collaboration with ${softSkillsCount} soft skills.`;
    } else {
      profile = `Balanced professional profile with ${totalSkills} skills across technical and interpersonal domains.`;
    }

    if (topRole) {
      profile += ` Best suited for ${topRole.title} roles with ${Math.round(avgMatch)}% average match across suggested positions.`;
    }

    return profile;
  }

  private static generateMarketInsights(extractedSkills: ExtractedSkills, suggestedRoles: JobRole[]) {
    const userSkills = [
      ...extractedSkills.hardSkills.map(s => s.name),
      ...extractedSkills.softSkills.map(s => s.name)
    ];

    // Identify high-demand skills the user has
    const highDemandSkills = this.highDemandSkills2024.filter(skill =>
      userSkills.some(userSkill => 
        userSkill.toLowerCase().includes(skill.toLowerCase()) ||
        skill.toLowerCase().includes(userSkill.toLowerCase())
      )
    );

    // Identify emerging trends relevant to user
    const relevantTrends = this.currentMarketTrends.filter(trend => {
      const trendLower = trend.toLowerCase();
      return userSkills.some(skill => 
        trendLower.includes(skill.toLowerCase()) ||
        (trendLower.includes('ai') && (skill.toLowerCase().includes('python') || skill.toLowerCase().includes('machine learning'))) ||
        (trendLower.includes('cloud') && skill.toLowerCase().includes('aws')) ||
        (trendLower.includes('devops') && (skill.toLowerCase().includes('docker') || skill.toLowerCase().includes('kubernetes')))
      );
    });

    // Calculate remote opportunities percentage
    const remoteOpportunities = Math.round(
      (suggestedRoles.filter(role => role.remoteAvailable).length / suggestedRoles.length) * 100
    );

    // Generate salary trend analysis
    const salaryTrends = this.analyzeSalaryTrends(suggestedRoles);

    return {
      highDemandSkills: highDemandSkills.slice(0, 5),
      emergingTrends: relevantTrends.slice(0, 4),
      salaryTrends,
      remoteOpportunities
    };
  }

  private static analyzeSalaryTrends(suggestedRoles: JobRole[]): string {
    const highDemandRoles = suggestedRoles.filter(role => role.demandLevel === 'High');
    const avgGrowth = highDemandRoles.reduce((sum, role) => {
      const growthMatch = role.industryGrowth.match(/(\d+)%/);
      return sum + (growthMatch ? parseInt(growthMatch[1]) : 10);
    }, 0) / (highDemandRoles.length || 1);

    if (avgGrowth >= 15) {
      return `Strong upward trend with ${Math.round(avgGrowth)}% average growth. High-demand roles showing premium salary increases.`;
    } else if (avgGrowth >= 10) {
      return `Positive salary growth trend at ${Math.round(avgGrowth)}% annually. Competitive market for skilled professionals.`;
    } else {
      return `Stable market with ${Math.round(avgGrowth)}% growth. Focus on high-demand skills for better positioning.`;
    }
  }
}