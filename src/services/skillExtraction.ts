export interface ExtractedSkills {
  hardSkills: SkillMatch[];
  softSkills: SkillMatch[];
  totalSkills: number;
}

export interface SkillMatch {
  name: string;
  category: string;
  confidence: number;
  mentions: number;
}

export class SkillExtractionService {
  private static hardSkillsDatabase = {
    'Programming Languages': [
      'JavaScript', 'TypeScript', 'Python', 'Java', 'C#', 'C++', 'C', 'Go', 'Rust', 'Swift', 'Kotlin',
      'PHP', 'Ruby', 'Scala', 'R', 'MATLAB', 'Perl', 'Objective-C', 'Dart', 'Elixir', 'Clojure'
    ],
    'Frontend Technologies': [
      'React', 'Vue.js', 'Angular', 'Next.js', 'Nuxt.js', 'Svelte', 'jQuery', 'Bootstrap', 'Tailwind CSS',
      'Material-UI', 'Chakra UI', 'HTML', 'CSS', 'SASS', 'LESS', 'Webpack', 'Vite', 'Parcel'
    ],
    'Backend Technologies': [
      'Node.js', 'Express.js', 'Nest.js', 'Django', 'Flask', 'FastAPI', 'Spring', 'ASP.NET', 'Laravel',
      'Ruby on Rails', 'Gin', 'Echo', 'Fiber', 'Koa.js', 'Hapi.js'
    ],
    'Databases': [
      'MySQL', 'PostgreSQL', 'MongoDB', 'Redis', 'SQLite', 'Oracle', 'SQL Server', 'MariaDB',
      'DynamoDB', 'Cassandra', 'Neo4j', 'InfluxDB', 'CouchDB', 'Firebase', 'Supabase'
    ],
    'Cloud Platforms': [
      'AWS', 'Azure', 'Google Cloud', 'GCP', 'Heroku', 'Netlify', 'Vercel', 'DigitalOcean',
      'Linode', 'Vultr', 'IBM Cloud', 'Oracle Cloud'
    ],
    'DevOps & Tools': [
      'Docker', 'Kubernetes', 'Jenkins', 'GitLab CI', 'GitHub Actions', 'CircleCI', 'Travis CI',
      'Terraform', 'Ansible', 'Puppet', 'Chef', 'Vagrant', 'Nginx', 'Apache', 'Linux', 'Ubuntu'
    ],
    'Databases & Query Languages': [
      'SQL', 'NoSQL', 'GraphQL', 'REST API', 'SOAP', 'gRPC', 'JSON', 'XML', 'YAML'
    ],
    'Testing': [
      'Jest', 'Mocha', 'Chai', 'Cypress', 'Selenium', 'Playwright', 'Puppeteer', 'JUnit',
      'PyTest', 'RSpec', 'PHPUnit', 'Vitest', 'Testing Library'
    ],
    'Version Control': [
      'Git', 'GitHub', 'GitLab', 'Bitbucket', 'SVN', 'Mercurial'
    ],
    'Mobile Development': [
      'React Native', 'Flutter', 'Ionic', 'Xamarin', 'Swift', 'Kotlin', 'Java Android'
    ],
    'Data Science & Analytics': [
      'Pandas', 'NumPy', 'Scikit-learn', 'TensorFlow', 'PyTorch', 'Keras', 'Jupyter',
      'Tableau', 'Power BI', 'Excel', 'SPSS', 'SAS', 'Apache Spark', 'Hadoop'
    ],
    'Design & UI/UX': [
      'Figma', 'Sketch', 'Adobe XD', 'Photoshop', 'Illustrator', 'InVision', 'Zeplin',
      'Framer', 'Principle', 'Wireframing', 'Prototyping'
    ]
  };

  private static softSkillsDatabase = {
    'Communication': [
      'Communication', 'Public Speaking', 'Presentation', 'Writing', 'Documentation',
      'Technical Writing', 'Verbal Communication', 'Written Communication', 'Storytelling'
    ],
    'Leadership': [
      'Leadership', 'Team Leadership', 'Project Management', 'People Management',
      'Mentoring', 'Coaching', 'Strategic Planning', 'Vision', 'Delegation'
    ],
    'Collaboration': [
      'Teamwork', 'Collaboration', 'Cross-functional', 'Stakeholder Management',
      'Partnership', 'Networking', 'Relationship Building', 'Interpersonal Skills'
    ],
    'Problem Solving': [
      'Problem Solving', 'Critical Thinking', 'Analytical', 'Troubleshooting',
      'Debugging', 'Root Cause Analysis', 'Decision Making', 'Strategic Thinking'
    ],
    'Adaptability': [
      'Adaptability', 'Flexibility', 'Learning Agility', 'Change Management',
      'Innovation', 'Creativity', 'Open-minded', 'Resilience'
    ],
    'Project Management': [
      'Project Management', 'Agile', 'Scrum', 'Kanban', 'Waterfall', 'Planning',
      'Organization', 'Time Management', 'Prioritization', 'Resource Management'
    ],
    'Quality & Process': [
      'Quality Assurance', 'Attention to Detail', 'Process Improvement',
      'Best Practices', 'Standards', 'Compliance', 'Optimization'
    ],
    'Customer Focus': [
      'Customer Service', 'Client Relations', 'User Experience', 'Customer Success',
      'Business Requirements', 'Stakeholder Engagement'
    ]
  };

  static extractSkills(text: string): ExtractedSkills {
    const normalizedText = text.toLowerCase();
    const hardSkills: SkillMatch[] = [];
    const softSkills: SkillMatch[] = [];

    // Extract hard skills
    Object.entries(this.hardSkillsDatabase).forEach(([category, skills]) => {
      skills.forEach(skill => {
        const mentions = this.countMentions(normalizedText, skill);
        if (mentions > 0) {
          const confidence = this.calculateConfidence(skill, mentions, text.length);
          hardSkills.push({
            name: skill,
            category,
            confidence,
            mentions
          });
        }
      });
    });

    // Extract soft skills
    Object.entries(this.softSkillsDatabase).forEach(([category, skills]) => {
      skills.forEach(skill => {
        const mentions = this.countMentions(normalizedText, skill);
        if (mentions > 0) {
          const confidence = this.calculateConfidence(skill, mentions, text.length);
          softSkills.push({
            name: skill,
            category,
            confidence,
            mentions
          });
        }
      });
    });

    // Sort by confidence and mentions
    hardSkills.sort((a, b) => b.confidence - a.confidence || b.mentions - a.mentions);
    softSkills.sort((a, b) => b.confidence - a.confidence || b.mentions - a.mentions);

    return {
      hardSkills,
      softSkills,
      totalSkills: hardSkills.length + softSkills.length
    };
  }

  private static countMentions(text: string, skill: string): number {
    const skillLower = skill.toLowerCase();
    const regex = new RegExp(`\\b${skillLower.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\b`, 'gi');
    const matches = text.match(regex);
    return matches ? matches.length : 0;
  }

  private static calculateConfidence(skill: string, mentions: number, textLength: number): number {
    // Base confidence on mentions and skill importance
    let confidence = Math.min(mentions * 20, 100);
    
    // Boost confidence for multiple mentions
    if (mentions > 1) {
      confidence = Math.min(confidence * 1.2, 100);
    }
    
    // Adjust for text length (longer texts might have more casual mentions)
    const textLengthFactor = Math.max(0.8, Math.min(1.2, 1000 / textLength));
    confidence *= textLengthFactor;
    
    return Math.round(Math.max(0, Math.min(100, confidence)));
  }
}