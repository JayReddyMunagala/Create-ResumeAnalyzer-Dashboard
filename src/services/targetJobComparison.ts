import { ExtractedSkills } from './skillExtraction';

export interface TargetJobComparison {
  jobTitle: string;
  matchPercentage: number;
  matchingSkills: string[];
  missingRequiredSkills: string[];
  missingPreferredSkills: string[];
  experienceLevel: 'Junior' | 'Mid' | 'Senior' | 'Lead';
  salaryRange: string;
  description: string;
  skillsChecklist: SkillChecklistItem[];
}

export interface SkillChecklistItem {
  skill: string;
  category: 'required' | 'preferred';
  hasSkill: boolean;
  importance: 'high' | 'medium' | 'low';
  learningTime: string;
  resources: string[];
}

export interface JobOption {
  title: string;
  category: string;
  popularity: number;
}

export class TargetJobComparisonService {
  private static jobDatabase = {
    'Frontend Developer': {
      requiredSkills: ['JavaScript', 'HTML', 'CSS', 'React'],
      preferredSkills: ['TypeScript', 'Vue.js', 'Angular', 'Tailwind CSS', 'SASS', 'Webpack', 'Jest'],
      category: 'Frontend Development',
      description: 'Build user interfaces and experiences for web applications using modern frontend technologies',
      popularity: 95,
      experienceLevels: {
        Junior: { minSkills: 3, salary: '$60,000 - $80,000' },
        Mid: { minSkills: 5, salary: '$80,000 - $110,000' },
        Senior: { minSkills: 7, salary: '$110,000 - $140,000' },
        Lead: { minSkills: 9, salary: '$140,000 - $180,000' }
      }
    },
    'Full Stack Developer': {
      requiredSkills: ['JavaScript', 'React', 'Node.js', 'HTML', 'CSS', 'SQL'],
      preferredSkills: ['TypeScript', 'Express.js', 'MongoDB', 'PostgreSQL', 'AWS', 'Docker', 'GraphQL'],
      category: 'Full Stack Development',
      description: 'Develop both frontend and backend components of web applications with end-to-end responsibility',
      popularity: 90,
      experienceLevels: {
        Junior: { minSkills: 4, salary: '$70,000 - $90,000' },
        Mid: { minSkills: 6, salary: '$90,000 - $120,000' },
        Senior: { minSkills: 8, salary: '$120,000 - $150,000' },
        Lead: { minSkills: 10, salary: '$150,000 - $190,000' }
      }
    },
    'Backend Developer': {
      requiredSkills: ['Node.js', 'JavaScript', 'SQL', 'REST API'],
      preferredSkills: ['TypeScript', 'Python', 'Express.js', 'MongoDB', 'PostgreSQL', 'Docker', 'AWS', 'GraphQL'],
      category: 'Backend Development',
      description: 'Design and implement server-side logic, APIs, and database architecture',
      popularity: 85,
      experienceLevels: {
        Junior: { minSkills: 3, salary: '$65,000 - $85,000' },
        Mid: { minSkills: 5, salary: '$85,000 - $115,000' },
        Senior: { minSkills: 7, salary: '$115,000 - $145,000' },
        Lead: { minSkills: 9, salary: '$145,000 - $185,000' }
      }
    },
    'React Developer': {
      requiredSkills: ['React', 'JavaScript', 'HTML', 'CSS'],
      preferredSkills: ['TypeScript', 'Next.js', 'Redux', 'Jest', 'Webpack', 'GraphQL', 'Material-UI'],
      category: 'Frontend Development',
      description: 'Specialize in building React-based applications and component libraries',
      popularity: 88,
      experienceLevels: {
        Junior: { minSkills: 3, salary: '$65,000 - $85,000' },
        Mid: { minSkills: 5, salary: '$85,000 - $115,000' },
        Senior: { minSkills: 7, salary: '$115,000 - $145,000' },
        Lead: { minSkills: 9, salary: '$145,000 - $185,000' }
      }
    },
    'DevOps Engineer': {
      requiredSkills: ['Docker', 'AWS', 'Linux', 'Git'],
      preferredSkills: ['Kubernetes', 'Jenkins', 'Terraform', 'Ansible', 'Python', 'CI/CD', 'Nginx'],
      category: 'DevOps & Infrastructure',
      description: 'Manage infrastructure, deployment pipelines, and system reliability',
      popularity: 80,
      experienceLevels: {
        Junior: { minSkills: 3, salary: '$70,000 - $90,000' },
        Mid: { minSkills: 5, salary: '$90,000 - $125,000' },
        Senior: { minSkills: 7, salary: '$125,000 - $160,000' },
        Lead: { minSkills: 9, salary: '$160,000 - $200,000' }
      }
    },
    'Data Scientist': {
      requiredSkills: ['Python', 'SQL', 'Pandas', 'NumPy'],
      preferredSkills: ['TensorFlow', 'PyTorch', 'Scikit-learn', 'Jupyter', 'R', 'Tableau', 'Apache Spark'],
      category: 'Data Science & Analytics',
      description: 'Analyze data to derive insights and build predictive models',
      popularity: 75,
      experienceLevels: {
        Junior: { minSkills: 3, salary: '$75,000 - $95,000' },
        Mid: { minSkills: 5, salary: '$95,000 - $130,000' },
        Senior: { minSkills: 7, salary: '$130,000 - $170,000' },
        Lead: { minSkills: 9, salary: '$170,000 - $220,000' }
      }
    },
    'Mobile Developer': {
      requiredSkills: ['React Native', 'JavaScript', 'Mobile Development'],
      preferredSkills: ['Swift', 'Kotlin', 'Flutter', 'TypeScript', 'iOS', 'Android', 'Firebase'],
      category: 'Mobile Development',
      description: 'Build mobile applications for iOS and Android platforms',
      popularity: 70,
      experienceLevels: {
        Junior: { minSkills: 2, salary: '$65,000 - $85,000' },
        Mid: { minSkills: 4, salary: '$85,000 - $115,000' },
        Senior: { minSkills: 6, salary: '$115,000 - $145,000' },
        Lead: { minSkills: 8, salary: '$145,000 - $185,000' }
      }
    },
    'Cloud Engineer': {
      requiredSkills: ['AWS', 'Cloud Platforms', 'Linux'],
      preferredSkills: ['Azure', 'Google Cloud', 'Docker', 'Kubernetes', 'Terraform', 'Python'],
      category: 'Cloud & Infrastructure',
      description: 'Design and manage cloud infrastructure and services',
      popularity: 82,
      experienceLevels: {
        Junior: { minSkills: 2, salary: '$70,000 - $90,000' },
        Mid: { minSkills: 4, salary: '$90,000 - $125,000' },
        Senior: { minSkills: 6, salary: '$125,000 - $160,000' },
        Lead: { minSkills: 8, salary: '$160,000 - $200,000' }
      }
    },
    'QA Engineer': {
      requiredSkills: ['Testing', 'JavaScript', 'Quality Assurance'],
      preferredSkills: ['Jest', 'Cypress', 'Selenium', 'Playwright', 'Automation', 'Python'],
      category: 'Quality Assurance',
      description: 'Ensure software quality through testing and automation',
      popularity: 65,
      experienceLevels: {
        Junior: { minSkills: 2, salary: '$55,000 - $75,000' },
        Mid: { minSkills: 4, salary: '$75,000 - $100,000' },
        Senior: { minSkills: 6, salary: '$100,000 - $130,000' },
        Lead: { minSkills: 8, salary: '$130,000 - $160,000' }
      }
    },
    'Product Manager': {
      requiredSkills: ['Project Management', 'Communication', 'Strategic Planning'],
      preferredSkills: ['Agile', 'Scrum', 'Leadership', 'User Experience', 'Analytics', 'Roadmapping'],
      category: 'Product Management',
      description: 'Guide product development and strategy from conception to launch',
      popularity: 72,
      experienceLevels: {
        Junior: { minSkills: 2, salary: '$80,000 - $100,000' },
        Mid: { minSkills: 4, salary: '$100,000 - $135,000' },
        Senior: { minSkills: 6, salary: '$135,000 - $170,000' },
        Lead: { minSkills: 8, salary: '$170,000 - $220,000' }
      }
    }
  };

  private static skillLearningData = {
    'JavaScript': { time: '2-3 months', resources: ['MDN Web Docs', 'freeCodeCamp', 'JavaScript.info'] },
    'TypeScript': { time: '3-4 weeks', resources: ['TypeScript Handbook', 'Execute Program', 'Type Challenges'] },
    'React': { time: '2-3 months', resources: ['React Documentation', 'React Tutorial', 'Epic React'] },
    'Node.js': { time: '1-2 months', resources: ['Node.js Documentation', 'Node.js Course', 'Express.js Guide'] },
    'Python': { time: '2-3 months', resources: ['Python.org Tutorial', 'Automate the Boring Stuff', 'Python Crash Course'] },
    'AWS': { time: '3-6 months', resources: ['AWS Training', 'Cloud Practitioner Course', 'AWS Documentation'] },
    'Docker': { time: '3-4 weeks', resources: ['Docker Documentation', 'Docker Mastery Course', 'Docker Tutorial'] },
    'SQL': { time: '4-6 weeks', resources: ['W3Schools SQL', 'SQL Bolt', 'PostgreSQL Tutorial'] },
    'GraphQL': { time: '2-3 weeks', resources: ['GraphQL.org', 'Apollo GraphQL Course', 'The Road to GraphQL'] },
    'MongoDB': { time: '2-3 weeks', resources: ['MongoDB University', 'MongoDB Documentation', 'Mongoose Guide'] },
    'Next.js': { time: '2-4 weeks', resources: ['Next.js Documentation', 'Vercel Learn', 'Next.js Handbook'] },
    'Vue.js': { time: '1-2 months', resources: ['Vue.js Documentation', 'Vue Mastery', 'Vue School'] },
    'Angular': { time: '2-3 months', resources: ['Angular Documentation', 'Angular University', 'Angular Tutorial'] },
    'Kubernetes': { time: '2-4 months', resources: ['Kubernetes Documentation', 'CNCF Training', 'Kubernetes Course'] },
    'Jest': { time: '1-2 weeks', resources: ['Jest Documentation', 'Testing JavaScript', 'Jest Tutorial'] },
    'Cypress': { time: '1-2 weeks', resources: ['Cypress Documentation', 'Cypress Real World App', 'Testing Course'] }
  };

  static getAvailableJobs(): JobOption[] {
    return Object.entries(this.jobDatabase).map(([title, data]) => ({
      title,
      category: data.category,
      popularity: data.popularity
    })).sort((a, b) => b.popularity - a.popularity);
  }

  static compareWithTargetJob(jobTitle: string, extractedSkills: ExtractedSkills): TargetJobComparison {
    const jobData = this.jobDatabase[jobTitle as keyof typeof this.jobDatabase];
    if (!jobData) {
      throw new Error(`Job title "${jobTitle}" not found in database`);
    }

    const userSkills = [
      ...extractedSkills.hardSkills.map(s => s.name),
      ...extractedSkills.softSkills.map(s => s.name)
    ];

    // Find matching skills
    const matchingSkills = [...jobData.requiredSkills, ...jobData.preferredSkills].filter(jobSkill =>
      userSkills.some(userSkill => 
        this.skillsMatch(userSkill, jobSkill)
      )
    );

    // Find missing skills
    const missingRequiredSkills = jobData.requiredSkills.filter(reqSkill =>
      !userSkills.some(userSkill => this.skillsMatch(userSkill, reqSkill))
    );

    const missingPreferredSkills = jobData.preferredSkills.filter(prefSkill =>
      !userSkills.some(userSkill => this.skillsMatch(userSkill, prefSkill))
    );

    // Calculate match percentage
    const requiredMatches = jobData.requiredSkills.filter(reqSkill =>
      userSkills.some(userSkill => this.skillsMatch(userSkill, reqSkill))
    );

    const matchPercentage = Math.round(
      ((requiredMatches.length / jobData.requiredSkills.length) * 70 +
       (matchingSkills.length / (jobData.requiredSkills.length + jobData.preferredSkills.length)) * 30)
    );

    // Determine experience level
    const experienceLevel = this.determineExperienceLevel(matchingSkills.length, jobData);

    // Create skills checklist
    const skillsChecklist = this.createSkillsChecklist(
      jobData.requiredSkills,
      jobData.preferredSkills,
      userSkills
    );

    return {
      jobTitle,
      matchPercentage,
      matchingSkills,
      missingRequiredSkills,
      missingPreferredSkills,
      experienceLevel,
      salaryRange: jobData.experienceLevels[experienceLevel].salary,
      description: jobData.description,
      skillsChecklist
    };
  }

  private static skillsMatch(userSkill: string, jobSkill: string): boolean {
    const userLower = userSkill.toLowerCase();
    const jobLower = jobSkill.toLowerCase();
    return userLower.includes(jobLower) || jobLower.includes(userLower);
  }

  private static determineExperienceLevel(skillCount: number, jobData: any): 'Junior' | 'Mid' | 'Senior' | 'Lead' {
    let level: 'Junior' | 'Mid' | 'Senior' | 'Lead' = 'Junior';
    
    Object.entries(jobData.experienceLevels).forEach(([levelName, data]: [string, any]) => {
      if (skillCount >= data.minSkills) {
        level = levelName as 'Junior' | 'Mid' | 'Senior' | 'Lead';
      }
    });

    return level;
  }

  private static createSkillsChecklist(
    requiredSkills: string[],
    preferredSkills: string[],
    userSkills: string[]
  ): SkillChecklistItem[] {
    const checklist: SkillChecklistItem[] = [];

    // Add required skills
    requiredSkills.forEach(skill => {
      const hasSkill = userSkills.some(userSkill => this.skillsMatch(userSkill, skill));
      const learningData = this.skillLearningData[skill as keyof typeof this.skillLearningData];
      
      checklist.push({
        skill,
        category: 'required',
        hasSkill,
        importance: 'high',
        learningTime: learningData?.time || '2-4 weeks',
        resources: learningData?.resources || ['Official Documentation', 'Online Tutorials', 'Practice Projects']
      });
    });

    // Add preferred skills
    preferredSkills.forEach(skill => {
      const hasSkill = userSkills.some(userSkill => this.skillsMatch(userSkill, skill));
      const learningData = this.skillLearningData[skill as keyof typeof this.skillLearningData];
      
      checklist.push({
        skill,
        category: 'preferred',
        hasSkill,
        importance: 'medium',
        learningTime: learningData?.time || '1-3 weeks',
        resources: learningData?.resources || ['Official Documentation', 'Online Tutorials', 'Practice Projects']
      });
    });

    return checklist;
  }
}