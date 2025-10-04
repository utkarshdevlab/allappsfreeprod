'use client';

import { useState, useRef } from 'react';

interface ResumeAnalysis {
  overallScore: number;
  atsScore: number;
  sections: {
    contact: { score: number; issues: string[]; suggestions: string[] };
    summary: { score: number; issues: string[]; suggestions: string[] };
    experience: { score: number; issues: string[]; suggestions: string[] };
    education: { score: number; issues: string[]; suggestions: string[] };
    skills: { score: number; issues: string[]; suggestions: string[] };
    formatting: { score: number; issues: string[]; suggestions: string[] };
  };
  keywords: {
    found: string[];
    missing: string[];
    density: number;
  };
  strengths: string[];
  improvements: string[];
  atsCompatibility: {
    score: number;
    issues: string[];
    recommendations: string[];
  };
  readability: {
    score: number;
    grade: string;
    suggestions: string[];
  };
}

const industryKeywords: Record<string, string[]> = {
  'Software Engineering': ['JavaScript', 'Python', 'React', 'Node.js', 'AWS', 'Docker', 'Git', 'API', 'Agile', 'CI/CD', 'TypeScript', 'SQL', 'MongoDB', 'Kubernetes', 'Microservices'],
  'Data Science': ['Python', 'R', 'Machine Learning', 'SQL', 'TensorFlow', 'PyTorch', 'Pandas', 'NumPy', 'Statistics', 'Data Visualization', 'Deep Learning', 'NLP', 'Big Data', 'Spark'],
  'Product Management': ['Roadmap', 'Stakeholder', 'Agile', 'Scrum', 'User Stories', 'Analytics', 'A/B Testing', 'Product Strategy', 'KPIs', 'Cross-functional', 'Market Research', 'Prioritization'],
  'Marketing': ['SEO', 'SEM', 'Content Marketing', 'Social Media', 'Analytics', 'Campaign', 'Brand', 'Digital Marketing', 'Email Marketing', 'ROI', 'Lead Generation', 'Marketing Automation'],
  'Sales': ['B2B', 'B2C', 'CRM', 'Pipeline', 'Lead Generation', 'Negotiation', 'Account Management', 'Sales Strategy', 'Quota', 'Revenue', 'Client Relations', 'Prospecting'],
  'Design': ['UI/UX', 'Figma', 'Adobe', 'Prototyping', 'Wireframing', 'User Research', 'Design Systems', 'Sketch', 'InVision', 'Responsive Design', 'Typography', 'Color Theory'],
  'Finance': ['Financial Analysis', 'Excel', 'Budgeting', 'Forecasting', 'Accounting', 'Financial Modeling', 'Risk Management', 'Compliance', 'GAAP', 'Audit', 'Investment', 'Portfolio'],
  'HR': ['Recruitment', 'Talent Acquisition', 'Employee Relations', 'Performance Management', 'HRIS', 'Onboarding', 'Benefits', 'Compensation', 'Training', 'Diversity', 'Compliance'],
  'General': ['Leadership', 'Communication', 'Problem Solving', 'Team Collaboration', 'Project Management', 'Time Management', 'Critical Thinking', 'Adaptability', 'Innovation']
};

export default function ResumeChecker() {
  const [resumeText, setResumeText] = useState('');
  const [jobDescription, setJobDescription] = useState('');
  const [selectedIndustry, setSelectedIndustry] = useState('General');
  const [analysis, setAnalysis] = useState<ResumeAnalysis | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [uploadedFileName, setUploadedFileName] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Extract text from uploaded file
  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadedFileName(file.name);

    if (file.type === 'application/pdf') {
      // For PDF, we'll use a simple text extraction (in production, use pdf.js)
      const reader = new FileReader();
      reader.onload = async (event) => {
        const text = event.target?.result as string;
        // Simple PDF text extraction (this is a placeholder)
        setResumeText(text);
      };
      reader.readAsText(file);
    } else if (file.type.includes('text') || file.name.endsWith('.txt')) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setResumeText(event.target?.result as string);
      };
      reader.readAsText(file);
    } else {
      alert('Please upload a PDF or TXT file');
    }
  };

  // Analyze resume
  const analyzeResume = () => {
    if (!resumeText.trim()) {
      alert('Please paste your resume text or upload a file');
      return;
    }

    setIsAnalyzing(true);

    // Simulate analysis delay
    setTimeout(() => {
      const analysis = performAnalysis(resumeText, jobDescription, selectedIndustry);
      setAnalysis(analysis);
      setIsAnalyzing(false);
    }, 1500);
  };

  // Main analysis function
  const performAnalysis = (resume: string, jobDesc: string, industry: string): ResumeAnalysis => {
    const resumeLower = resume.toLowerCase();
    const words = resume.split(/\s+/).length;
    const lines = resume.split('\n').length;

    // Keyword analysis
    const relevantKeywords = [...industryKeywords[industry], ...(jobDesc ? extractKeywords(jobDesc) : [])];
    const foundKeywords = relevantKeywords.filter(kw => resumeLower.includes(kw.toLowerCase()));
    const missingKeywords = relevantKeywords.filter(kw => !resumeLower.includes(kw.toLowerCase())).slice(0, 10);
    const keywordDensity = (foundKeywords.length / relevantKeywords.length) * 100;

    // Section detection
    const hasContact = /email|phone|linkedin|github|portfolio/i.test(resume);
    const hasSummary = /summary|objective|profile|about/i.test(resume);
    const hasExperience = /experience|work history|employment/i.test(resume);
    const hasEducation = /education|degree|university|college/i.test(resume);
    const hasSkills = /skills|technologies|competencies/i.test(resume);

    // ATS compatibility checks
    const atsIssues: string[] = [];
    const atsRecommendations: string[] = [];
    let atsScore = 100;

    if (/\t/.test(resume)) {
      atsIssues.push('Contains tabs - may cause parsing issues');
      atsRecommendations.push('Replace tabs with spaces');
      atsScore -= 5;
    }
    if (/[│┤├┼─]/g.test(resume)) {
      atsIssues.push('Contains table borders or special characters');
      atsRecommendations.push('Use simple formatting without tables or special characters');
      atsScore -= 10;
    }
    if (resume.split('\n').some(line => line.length > 100)) {
      atsIssues.push('Some lines are too long');
      atsRecommendations.push('Keep lines under 100 characters for better ATS parsing');
      atsScore -= 5;
    }
    if (!/\d{3}[-.]?\d{3}[-.]?\d{4}/.test(resume)) {
      atsIssues.push('Phone number format may not be recognized');
      atsRecommendations.push('Use standard phone format: (123) 456-7890 or 123-456-7890');
      atsScore -= 5;
    }

    // Contact section analysis
    const contactScore = hasContact ? 90 : 40;
    const contactIssues: string[] = [];
    const contactSuggestions: string[] = [];
    
    if (!/@/.test(resume)) {
      contactIssues.push('Email address not found');
      contactSuggestions.push('Add a professional email address');
    }
    if (!/linkedin\.com/i.test(resume)) {
      contactSuggestions.push('Consider adding your LinkedIn profile');
    }
    if (!/github\.com/i.test(resume) && industry === 'Software Engineering') {
      contactSuggestions.push('Add your GitHub profile to showcase your projects');
    }

    // Summary section analysis
    const summaryScore = hasSummary ? 85 : 50;
    const summaryIssues: string[] = [];
    const summarySuggestions: string[] = [];
    
    if (!hasSummary) {
      summaryIssues.push('Professional summary not found');
      summarySuggestions.push('Add a compelling 2-3 sentence professional summary');
    } else {
      const summaryMatch = resume.match(/(?:summary|objective|profile)[:\s]+([\s\S]{0,500}?)(?:\n\n|\n[A-Z])/i);
      if (summaryMatch && summaryMatch[1].split(' ').length < 20) {
        summaryIssues.push('Summary is too brief');
        summarySuggestions.push('Expand your summary to 40-80 words highlighting key achievements');
      }
    }

    // Experience section analysis
    const experienceScore = hasExperience ? 85 : 30;
    const experienceIssues: string[] = [];
    const experienceSuggestions: string[] = [];
    
    if (!hasExperience) {
      experienceIssues.push('Work experience section not found');
      experienceSuggestions.push('Add your work experience with bullet points');
    } else {
      const bulletPoints = (resume.match(/[•\-\*]\s/g) || []).length;
      if (bulletPoints < 5) {
        experienceIssues.push('Limited use of bullet points');
        experienceSuggestions.push('Use 3-5 bullet points per role to highlight achievements');
      }
      if (!/\d+%|\$\d+|increased|improved|reduced|achieved/i.test(resume)) {
        experienceIssues.push('Lacks quantifiable achievements');
        experienceSuggestions.push('Add metrics and numbers to demonstrate impact (e.g., "Increased sales by 25%")');
      }
    }

    // Education section analysis
    const educationScore = hasEducation ? 90 : 60;
    const educationIssues: string[] = [];
    const educationSuggestions: string[] = [];
    
    if (!hasEducation) {
      educationIssues.push('Education section not clearly identified');
      educationSuggestions.push('Add your educational background with degree and institution');
    }

    // Skills section analysis
    const skillsScore = hasSkills ? 85 : 50;
    const skillsIssues: string[] = [];
    const skillsSuggestions: string[] = [];
    
    if (!hasSkills) {
      skillsIssues.push('Skills section not found');
      skillsSuggestions.push('Add a dedicated skills section with relevant technical and soft skills');
    } else if (foundKeywords.length < relevantKeywords.length * 0.3) {
      skillsIssues.push('Skills section lacks industry-relevant keywords');
      skillsSuggestions.push(`Include more ${industry} keywords: ${missingKeywords.slice(0, 5).join(', ')}`);
    }

    // Formatting analysis
    let formattingScore = 100;
    const formattingIssues: string[] = [];
    const formattingSuggestions: string[] = [];
    
    if (words < 200) {
      formattingIssues.push('Resume is too short');
      formattingSuggestions.push('Aim for 400-800 words for a comprehensive resume');
      formattingScore -= 20;
    } else if (words > 1000) {
      formattingIssues.push('Resume is too long');
      formattingSuggestions.push('Keep resume concise - aim for 1-2 pages (400-800 words)');
      formattingScore -= 10;
    }
    
    if (lines < 20) {
      formattingIssues.push('Resume appears too condensed');
      formattingSuggestions.push('Use proper spacing and line breaks for readability');
      formattingScore -= 10;
    }

    // Readability analysis
    const avgWordLength = resume.split(/\s+/).reduce((sum, word) => sum + word.length, 0) / words;
    const readabilityScore = Math.max(0, Math.min(100, 100 - (avgWordLength - 5) * 10));
    const readabilityGrade = readabilityScore > 80 ? 'Excellent' : readabilityScore > 60 ? 'Good' : readabilityScore > 40 ? 'Fair' : 'Needs Improvement';
    const readabilitySuggestions: string[] = [];
    
    if (avgWordLength > 6) {
      readabilitySuggestions.push('Use simpler, more concise language');
    }
    if (!/[.!?]/.test(resume)) {
      readabilitySuggestions.push('Use proper punctuation for better readability');
    }

    // Calculate overall score
    const sectionScores = [contactScore, summaryScore, experienceScore, educationScore, skillsScore, formattingScore];
    const overallScore = Math.round(sectionScores.reduce((a, b) => a + b, 0) / sectionScores.length);

    // Strengths and improvements
    const strengths: string[] = [];
    const improvements: string[] = [];

    if (contactScore > 80) strengths.push('✓ Complete contact information');
    if (summaryScore > 80) strengths.push('✓ Strong professional summary');
    if (experienceScore > 80) strengths.push('✓ Well-documented work experience');
    if (skillsScore > 80) strengths.push('✓ Comprehensive skills section');
    if (keywordDensity > 50) strengths.push('✓ Good keyword optimization');
    if (atsScore > 90) strengths.push('✓ Excellent ATS compatibility');

    if (contactScore < 70) improvements.push('⚠ Enhance contact information');
    if (summaryScore < 70) improvements.push('⚠ Add or improve professional summary');
    if (experienceScore < 70) improvements.push('⚠ Strengthen work experience section');
    if (skillsScore < 70) improvements.push('⚠ Expand skills section');
    if (keywordDensity < 30) improvements.push('⚠ Add more industry-relevant keywords');
    if (atsScore < 80) improvements.push('⚠ Improve ATS compatibility');

    return {
      overallScore,
      atsScore,
      sections: {
        contact: { score: contactScore, issues: contactIssues, suggestions: contactSuggestions },
        summary: { score: summaryScore, issues: summaryIssues, suggestions: summarySuggestions },
        experience: { score: experienceScore, issues: experienceIssues, suggestions: experienceSuggestions },
        education: { score: educationScore, issues: educationIssues, suggestions: educationSuggestions },
        skills: { score: skillsScore, issues: skillsIssues, suggestions: skillsSuggestions },
        formatting: { score: formattingScore, issues: formattingIssues, suggestions: formattingSuggestions }
      },
      keywords: {
        found: foundKeywords,
        missing: missingKeywords,
        density: Math.round(keywordDensity)
      },
      strengths,
      improvements,
      atsCompatibility: {
        score: atsScore,
        issues: atsIssues,
        recommendations: atsRecommendations
      },
      readability: {
        score: Math.round(readabilityScore),
        grade: readabilityGrade,
        suggestions: readabilitySuggestions
      }
    };
  };

  // Extract keywords from job description
  const extractKeywords = (text: string): string[] => {
    const words = text.toLowerCase().split(/\W+/);
    const commonWords = new Set(['the', 'a', 'an', 'and', 'or', 'but', 'in', 'on', 'at', 'to', 'for', 'of', 'with', 'by', 'from', 'as', 'is', 'was', 'are', 'were', 'be', 'been', 'being', 'have', 'has', 'had', 'do', 'does', 'did', 'will', 'would', 'should', 'could', 'may', 'might', 'must', 'can']);
    
    const wordFreq = new Map<string, number>();
    words.forEach(word => {
      if (word.length > 3 && !commonWords.has(word)) {
        wordFreq.set(word, (wordFreq.get(word) || 0) + 1);
      }
    });

    return Array.from(wordFreq.entries())
      .sort((a, b) => b[1] - a[1])
      .slice(0, 20)
      .map(([word]) => word);
  };

  // Get score color
  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-600';
    if (score >= 60) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getScoreBgColor = (score: number) => {
    if (score >= 80) return 'bg-green-100';
    if (score >= 60) return 'bg-yellow-100';
    return 'bg-red-100';
  };

  return (
    <div className="space-y-6">
      {/* Input Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Resume Input */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-gray-900">📄 Your Resume</h3>
            <button
              onClick={() => fileInputRef.current?.click()}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium text-sm"
            >
              📤 Upload File
            </button>
            <input
              ref={fileInputRef}
              type="file"
              accept=".pdf,.txt,.doc,.docx"
              onChange={handleFileUpload}
              className="hidden"
            />
          </div>
          
          {uploadedFileName && (
            <div className="flex items-center space-x-2 text-sm text-green-600 bg-green-50 px-3 py-2 rounded-lg">
              <span>✓</span>
              <span>{uploadedFileName}</span>
            </div>
          )}

          <textarea
            value={resumeText}
            onChange={(e) => setResumeText(e.target.value)}
            placeholder="Paste your resume text here or upload a file above..."
            rows={15}
            className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent font-mono text-sm"
          />
          
          <div className="text-sm text-gray-500">
            {resumeText.split(/\s+/).filter(w => w).length} words • {resumeText.length} characters
          </div>
        </div>

        {/* Job Description Input (Optional) */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-gray-900">💼 Job Description (Optional)</h3>
          <textarea
            value={jobDescription}
            onChange={(e) => setJobDescription(e.target.value)}
            placeholder="Paste the job description here for tailored analysis and keyword matching..."
            rows={10}
            className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent font-mono text-sm"
          />

          {/* Industry Selection */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              🏢 Industry / Field
            </label>
            <select
              value={selectedIndustry}
              onChange={(e) => setSelectedIndustry(e.target.value)}
              className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            >
              {Object.keys(industryKeywords).map(industry => (
                <option key={industry} value={industry}>{industry}</option>
              ))}
            </select>
          </div>

          {/* Analyze Button */}
          <button
            onClick={analyzeResume}
            disabled={isAnalyzing || !resumeText.trim()}
            className="w-full px-6 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl hover:from-blue-700 hover:to-purple-700 font-bold text-lg disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-lg hover:shadow-xl"
          >
            {isAnalyzing ? '⏳ Analyzing...' : '🚀 Analyze Resume'}
          </button>
        </div>
      </div>

      {/* Analysis Results */}
      {analysis && (
        <div className="space-y-6 mt-8">
          {/* Overall Score */}
          <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl p-8 text-white">
            <div className="text-center">
              <h2 className="text-2xl font-bold mb-4">Resume Score</h2>
              <div className="relative inline-block">
                <svg className="w-48 h-48">
                  <circle
                    cx="96"
                    cy="96"
                    r="88"
                    stroke="rgba(255,255,255,0.2)"
                    strokeWidth="12"
                    fill="none"
                  />
                  <circle
                    cx="96"
                    cy="96"
                    r="88"
                    stroke="white"
                    strokeWidth="12"
                    fill="none"
                    strokeDasharray={`${(analysis.overallScore / 100) * 553} 553`}
                    strokeLinecap="round"
                    transform="rotate(-90 96 96)"
                  />
                </svg>
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-center">
                    <div className="text-6xl font-black">{analysis.overallScore}</div>
                    <div className="text-xl font-medium">/ 100</div>
                  </div>
                </div>
              </div>
              <p className="text-xl mt-4">
                {analysis.overallScore >= 80 ? '🎉 Excellent Resume!' : 
                 analysis.overallScore >= 60 ? '👍 Good Resume!' : 
                 '💪 Room for Improvement'}
              </p>
            </div>
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-white rounded-xl p-6 border-2 border-gray-200 text-center">
              <div className={`text-4xl font-bold ${getScoreColor(analysis.atsScore)}`}>
                {analysis.atsScore}%
              </div>
              <div className="text-sm text-gray-600 mt-2">ATS Compatible</div>
            </div>
            <div className="bg-white rounded-xl p-6 border-2 border-gray-200 text-center">
              <div className="text-4xl font-bold text-blue-600">
                {analysis.keywords.density}%
              </div>
              <div className="text-sm text-gray-600 mt-2">Keyword Match</div>
            </div>
            <div className="bg-white rounded-xl p-6 border-2 border-gray-200 text-center">
              <div className={`text-4xl font-bold ${getScoreColor(analysis.readability.score)}`}>
                {analysis.readability.grade}
              </div>
              <div className="text-sm text-gray-600 mt-2">Readability</div>
            </div>
            <div className="bg-white rounded-xl p-6 border-2 border-gray-200 text-center">
              <div className="text-4xl font-bold text-green-600">
                {analysis.strengths.length}
              </div>
              <div className="text-sm text-gray-600 mt-2">Strengths Found</div>
            </div>
          </div>

          {/* Strengths & Improvements */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Strengths */}
            <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-2xl p-6 border-2 border-green-200">
              <h3 className="text-xl font-bold text-green-900 mb-4 flex items-center">
                <span className="text-2xl mr-2">💪</span>
                Strengths
              </h3>
              <ul className="space-y-2">
                {analysis.strengths.map((strength, idx) => (
                  <li key={idx} className="text-green-800 font-medium">
                    {strength}
                  </li>
                ))}
                {analysis.strengths.length === 0 && (
                  <li className="text-green-700">Keep working on your resume to build strengths!</li>
                )}
              </ul>
            </div>

            {/* Improvements */}
            <div className="bg-gradient-to-br from-orange-50 to-orange-100 rounded-2xl p-6 border-2 border-orange-200">
              <h3 className="text-xl font-bold text-orange-900 mb-4 flex items-center">
                <span className="text-2xl mr-2">🎯</span>
                Areas to Improve
              </h3>
              <ul className="space-y-2">
                {analysis.improvements.map((improvement, idx) => (
                  <li key={idx} className="text-orange-800 font-medium">
                    {improvement}
                  </li>
                ))}
                {analysis.improvements.length === 0 && (
                  <li className="text-orange-700">Great job! Your resume looks solid.</li>
                )}
              </ul>
            </div>
          </div>

          {/* Section Scores */}
          <div className="bg-white rounded-2xl p-6 border-2 border-gray-200">
            <h3 className="text-xl font-bold text-gray-900 mb-6">📊 Section Analysis</h3>
            <div className="space-y-4">
              {Object.entries(analysis.sections).map(([section, data]) => (
                <div key={section} className="border-b border-gray-200 pb-4 last:border-0">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-semibold text-gray-900 capitalize">{section}</h4>
                    <span className={`px-3 py-1 rounded-full text-sm font-bold ${getScoreBgColor(data.score)} ${getScoreColor(data.score)}`}>
                      {data.score}/100
                    </span>
                  </div>
                  
                  {/* Progress Bar */}
                  <div className="w-full bg-gray-200 rounded-full h-2 mb-3">
                    <div
                      className={`h-2 rounded-full ${data.score >= 80 ? 'bg-green-500' : data.score >= 60 ? 'bg-yellow-500' : 'bg-red-500'}`}
                      style={{ width: `${data.score}%` }}
                    />
                  </div>

                  {data.issues.length > 0 && (
                    <div className="mb-2">
                      <p className="text-sm font-medium text-red-600 mb-1">Issues:</p>
                      <ul className="list-disc list-inside text-sm text-red-700 space-y-1">
                        {data.issues.map((issue, idx) => (
                          <li key={idx}>{issue}</li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {data.suggestions.length > 0 && (
                    <div>
                      <p className="text-sm font-medium text-blue-600 mb-1">Suggestions:</p>
                      <ul className="list-disc list-inside text-sm text-blue-700 space-y-1">
                        {data.suggestions.map((suggestion, idx) => (
                          <li key={idx}>{suggestion}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Keywords Analysis */}
          <div className="bg-white rounded-2xl p-6 border-2 border-gray-200">
            <h3 className="text-xl font-bold text-gray-900 mb-6">🔑 Keyword Analysis</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Found Keywords */}
              <div>
                <h4 className="font-semibold text-green-700 mb-3 flex items-center">
                  <span className="text-xl mr-2">✓</span>
                  Found Keywords ({analysis.keywords.found.length})
                </h4>
                <div className="flex flex-wrap gap-2">
                  {analysis.keywords.found.slice(0, 20).map((keyword, idx) => (
                    <span key={idx} className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm font-medium">
                      {keyword}
                    </span>
                  ))}
                </div>
              </div>

              {/* Missing Keywords */}
              <div>
                <h4 className="font-semibold text-orange-700 mb-3 flex items-center">
                  <span className="text-xl mr-2">⚠</span>
                  Missing Keywords ({analysis.keywords.missing.length})
                </h4>
                <div className="flex flex-wrap gap-2">
                  {analysis.keywords.missing.map((keyword, idx) => (
                    <span key={idx} className="px-3 py-1 bg-orange-100 text-orange-800 rounded-full text-sm font-medium">
                      {keyword}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* ATS Compatibility */}
          <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-2xl p-6 border-2 border-purple-200">
            <h3 className="text-xl font-bold text-purple-900 mb-4 flex items-center">
              <span className="text-2xl mr-2">🤖</span>
              ATS Compatibility Score: {analysis.atsCompatibility.score}%
            </h3>
            
            {analysis.atsCompatibility.issues.length > 0 && (
              <div className="mb-4">
                <p className="font-semibold text-purple-800 mb-2">Issues Detected:</p>
                <ul className="list-disc list-inside text-purple-700 space-y-1">
                  {analysis.atsCompatibility.issues.map((issue, idx) => (
                    <li key={idx}>{issue}</li>
                  ))}
                </ul>
              </div>
            )}

            {analysis.atsCompatibility.recommendations.length > 0 && (
              <div>
                <p className="font-semibold text-purple-800 mb-2">Recommendations:</p>
                <ul className="list-disc list-inside text-purple-700 space-y-1">
                  {analysis.atsCompatibility.recommendations.map((rec, idx) => (
                    <li key={idx}>{rec}</li>
                  ))}
                </ul>
              </div>
            )}

            {analysis.atsCompatibility.score >= 90 && (
              <p className="text-purple-800 font-medium mt-4">
                ✨ Excellent! Your resume is highly compatible with ATS systems.
              </p>
            )}
          </div>

          {/* Export Options */}
          <div className="bg-gradient-to-r from-gray-50 to-gray-100 rounded-2xl p-6 border-2 border-gray-200">
            <h3 className="text-lg font-bold text-gray-900 mb-4">📥 Export Report</h3>
            <div className="flex flex-wrap gap-3">
              <button
                onClick={() => {
                  const report = JSON.stringify(analysis, null, 2);
                  const blob = new Blob([report], { type: 'application/json' });
                  const url = URL.createObjectURL(blob);
                  const a = document.createElement('a');
                  a.href = url;
                  a.download = 'resume-analysis.json';
                  a.click();
                }}
                className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium"
              >
                📄 Download JSON
              </button>
              <button
                onClick={() => {
                  const reportText = `
RESUME ANALYSIS REPORT
======================

Overall Score: ${analysis.overallScore}/100
ATS Compatibility: ${analysis.atsScore}%
Keyword Match: ${analysis.keywords.density}%

STRENGTHS:
${analysis.strengths.map(s => `- ${s}`).join('\n')}

IMPROVEMENTS NEEDED:
${analysis.improvements.map(i => `- ${i}`).join('\n')}

SECTION SCORES:
${Object.entries(analysis.sections).map(([section, data]) => 
  `${section.toUpperCase()}: ${data.score}/100`
).join('\n')}
                  `.trim();
                  
                  const blob = new Blob([reportText], { type: 'text/plain' });
                  const url = URL.createObjectURL(blob);
                  const a = document.createElement('a');
                  a.href = url;
                  a.download = 'resume-analysis.txt';
                  a.click();
                }}
                className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 font-medium"
              >
                📝 Download TXT
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Features List */}
      {!analysis && (
        <div className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-2xl p-8 border-2 border-blue-200">
          <h3 className="text-2xl font-bold text-blue-900 mb-6 text-center">✨ Premium Features (100% Free!)</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {[
              '🎯 Overall Resume Score',
              '🤖 ATS Compatibility Check',
              '🔑 Keyword Optimization',
              '📊 Section-by-Section Analysis',
              '💼 Industry-Specific Keywords',
              '📈 Readability Score',
              '✅ Formatting Analysis',
              '⚠️ Issue Detection',
              '💡 Actionable Suggestions',
              '📥 Downloadable Reports',
              '🔒 100% Private (No Storage)',
              '🚀 Instant Results'
            ].map((feature, idx) => (
              <div key={idx} className="flex items-center space-x-2 text-blue-800 font-medium">
                <span>{feature}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
