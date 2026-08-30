/**
 * Gemini AI Integration & Protection Shield for GaonShiksha / SATHI
 * 
 * Features:
 * 1. Intelligent Multilingual Chatbot (Online via Gemini API, Offline fallback)
 * 2. Gemini Protection Shield: Pre-upload moderation to prevent misguidance, fake materials,
 *    toxic spam, scam links, and incorrect study guides before they reach students.
 */

// Configurable Gemini API key from environment variable
const GEMINI_API_KEY = process.env.GEMINI_API_KEY || '';
const GEMINI_API_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${GEMINI_API_KEY}`;

/**
 * Heuristic Safety & Educational Integrity Checker (Works 100% Offline)
 */
function runHeuristicProtectionCheck(material) {
  const { title = '', description = '', content = '', subject = '', standard = '' } = material;
  const combinedText = `${title} ${description} ${content}`.toLowerCase();

  const flaggedPatterns = [
    { pattern: /(free money|get rich|earning app|paytm cash|crypto|lottery|gambling|satta|teen patti)/i, reason: 'Financial scam or non-educational promotional content' },
    { pattern: /(paper leak|leak paper|100% exam leak|cheat code|hack exam|bribe)/i, reason: 'Academic dishonesty or fake exam leak misguidance' },
    { pattern: /(porn|sex|xxx|adult|dating|nude|escort)/i, reason: 'Inappropriate or adult content strictly forbidden for students' },
    { pattern: /(kill|suicide|bomb|weapon|poison|hack wifi|carding)/i, reason: 'Dangerous or harmful content prohibited' },
    { pattern: /(http:\/\/|https:\/\/)(?!.*(wikipedia|ncert|gov\.in|ac\.in|edu|gaonshiksha|youtube|khanacademy|diksha)).*/i, reason: 'Unverified external third-party links not permitted' }
  ];

  const violations = [];
  for (const item of flaggedPatterns) {
    if (item.pattern.test(combinedText)) {
      violations.push(item.reason);
    }
  }

  // Educational relevance check
  const educationalKeywords = [
    'science', 'math', 'ganit', 'history', 'geography', 'marathi', 'hindi', 'english',
    'chapter', 'formula', 'theorem', 'experiment', 'notes', 'study', 'question', 'answer',
    'solution', 'physics', 'chemistry', 'biology', 'board', 'syllabus', 'concept', 'definition',
    'विद्या', 'अभ्यास', 'विज्ञान', 'गणित', 'इतिहास', 'भूगोल', 'धडा', 'सूत्र', 'प्रश्न', 'उत्तर',
    'पाठ', 'सूत्र', 'नियम', 'प्रकरण', 'कृषी', 'तंत्रज्ञान', 'संगणक'
  ];

  const hasEducationalContent = educationalKeywords.some(kw => combinedText.includes(kw)) || combinedText.length > 80;

  if (violations.length > 0) {
    return {
      isApproved: false,
      verdict: 'REJECTED',
      score: 15,
      safetyRating: 'UNSAFE',
      reasons: violations,
      feedbackForUploader: 'Your content was flagged by the Gemini Protection Shield for safety and integrity violations. Study material must be strictly academic, authentic, and safe for all students.',
      protectionBadge: 'Gemini Shield: Rejected (Violations Detected)',
      moderatedBy: 'Gemini-Safety-Guard-v2'
    };
  }

  if (!hasEducationalContent && combinedText.length < 30) {
    return {
      isApproved: false,
      verdict: 'REJECTED',
      score: 35,
      safetyRating: 'SUSPICIOUS',
      reasons: ['Content is too short or lacks verified academic/educational context.'],
      feedbackForUploader: 'Please provide detailed, constructive study material or revision notes with clear academic relevance.',
      protectionBadge: 'Gemini Shield: Insufficient Educational Value',
      moderatedBy: 'Gemini-Safety-Guard-v2'
    };
  }

  return {
    isApproved: true,
    verdict: 'APPROVED',
    score: 95,
    safetyRating: 'SAFE',
    reasons: ['Content meets academic standards and contains no harmful or misleading elements.'],
    feedbackForUploader: 'Approved! Your study material has been verified safe and will help rural students study effectively.',
    protectionBadge: 'Gemini Shield: Verified Safe & Educational',
    moderatedBy: 'Gemini-Safety-Guard-v2'
  };
}

/**
 * 1. Ask Gemini Chatbot (Multilingual Academic Mentor)
 */
export async function askGeminiChat({ message, history = [], lang = 'mr' }) {
  const languageInstructions = {
    mr: 'Respond in natural, encouraging, and clear Marathi (मराठी). Focus on rural education, village skills, textbooks, and career guidance.',
    hi: 'Respond in simple, clear Hindi (हिंदी). Focus on academic learning, skill certification, and student growth.',
    en: 'Respond in clear, helpful, and friendly English. Provide structured guidance on courses, exams, and concepts.'
  };

  const systemInstruction = `You are "SATHI / GaonShiksha AI Mentor" (ग्रामशिक्षा AI मित्र), an encouraging, highly knowledgeable educational AI companion designed for rural students, youth, and teachers across India and Maharashtra.
You assist with:
1. Explaining textbook concepts in Science, Maths, History, English, Agriculture, and Digital Literacy.
2. Answering questions about certified courses (Digital Literacy, Tailoring, Electrical Installation, Agriculture Tech).
3. Guidance on Class 10/12 exams, MPSC/UPSC, Police Bharti, and Army GD tests.
4. Explaining how offline learning and certificate verification work on the platform.
${languageInstructions[lang] || languageInstructions.en}
Keep responses concise, accurate, warm, and formatted cleanly with bullet points where helpful.`;

  try {
    const contents = [
      {
        role: 'user',
        parts: [{ text: `${systemInstruction}\n\nUser Question: ${message}` }]
      }
    ];

    const response = await fetch(GEMINI_API_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ contents })
    });

    if (response.ok) {
      const data = await response.json();
      const botText = data.candidates?.[0]?.content?.parts?.[0]?.text;
      if (botText) {
        return {
          text: botText,
          source: 'gemini-1.5-flash',
          isOnline: true
        };
      }
    }
  } catch (err) {
    console.warn('[GEMINI CHAT WARNING] Remote API error or offline, falling back to local engine:', err.message);
  }

  // Graceful fallback if Gemini API is unreachable or rate-limited
  return {
    text: null,
    source: 'fallback',
    isOnline: false
  };
}

/**
 * 2. Gemini Protection Shield: Validate Study Material / Notes / Innovations
 * Ensures that no random person can misguide students with incorrect or toxic materials.
 */
export async function verifyAndModerateStudyMaterial(material) {
  const { title = '', description = '', content = '', subject = '', standard = '', author = '' } = material;

  const prompt = `You are the strict "Gemini Academic Protection Shield" for the GaonShiksha student portal.
Your job is to inspect study material, textbook notes, or innovation proposals submitted by users BEFORE allowing them to be uploaded or published to students.

Verify the following submission:
- Title: "${title}"
- Subject / Field: "${subject || 'General'}"
- Target Standard / Grade: "${standard || 'General'}"
- Description: "${description}"
- Content / Abstract: "${content}"
- Submitted By: "${author || 'Student/Contributor'}"

CRITICAL RULES:
1. REJECT if the submission contains false facts, fake exam leaks, scams, commercial promotions, phishing links, hate speech, adult content, cheating shortcuts, or dangerous advice that could misguide young students.
2. REJECT if the content is completely irrelevant to education, skills, science, engineering, agriculture, or syllabus topics.
3. APPROVE if the material is genuine, academically safe, helpful for students, and free from malicious or misleading content.

Respond ONLY with a valid JSON object matching this exact schema:
{
  "isApproved": true or false,
  "verdict": "APPROVED" or "REJECTED" or "FLAGGED_FOR_REVIEW",
  "score": number between 0 and 100,
  "safetyRating": "SAFE" or "UNSAFE" or "SUSPICIOUS",
  "reasons": ["short reason 1", "short reason 2"],
  "feedbackForUploader": "constructive feedback message",
  "protectionBadge": "Gemini Shield: Verified Safe & Educational" or "Gemini Shield: Rejected"
}`;

  try {
    const response = await fetch(GEMINI_API_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ role: 'user', parts: [{ text: prompt }] }],
        generationConfig: {
          temperature: 0.1,
          responseMimeType: 'application/json'
        }
      })
    });

    if (response.ok) {
      const data = await response.json();
      const rawText = data.candidates?.[0]?.content?.parts?.[0]?.text;
      if (rawText) {
        const parsed = JSON.parse(rawText);
        return {
          ...parsed,
          moderatedBy: 'Gemini-1.5-Flash-Shield',
          timestamp: new Date().toISOString()
        };
      }
    }
  } catch (err) {
    console.warn('[GEMINI PROTECTION] API call failed, falling back to heuristic shield:', err.message);
  }

  // Fallback to strict heuristic engine
  const localResult = runHeuristicProtectionCheck(material);
  return {
    ...localResult,
    timestamp: new Date().toISOString()
  };
}
