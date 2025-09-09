import { GoogleGenerativeAI } from "@google/generative-ai";
import {
  Question,
  Answer,
  CareerRecommendation,
  CareerCategory,
  GeminiResponse,
} from "@/types/career";

// Note: Make sure to add GEMINI_API_KEY to your .env.local file
import { EXPO_PUBLIC_GEMINI_API_KEY } from "@env";

const GEMINI_API_KEY = EXPO_PUBLIC_GEMINI_API_KEY || "";

if (!GEMINI_API_KEY) {
  console.warn(
    "Gemini API key not found. Please add EXPO_PUBLIC_GEMINI_API_KEY to your .env.local file",
  );
}

const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);

class GeminiService {
  private model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

  async generateCareerQuestions(
    previousAnswers: Answer[] = [],
    questionCount: number = 5,
  ): Promise<Question[]> {
    try {
      const contextPrompt =
        previousAnswers.length > 0
          ? `Based on these previous answers: ${JSON.stringify(previousAnswers)}, generate follow-up questions to better understand their interests.`
          : "Generate initial career assessment questions for a student to discover their career interests.";

      const prompt = `
        You are Captain Sky, an experienced aviator and career counselor. ${contextPrompt}

        Generate exactly ${questionCount} multiple choice questions (4 options each) to help identify a student's career interests and aptitudes.

        Cover these categories: aviation, technology, healthcare, business, creative, engineering, education, science, social_services, sports.

        Make questions engaging and scenario-based. Each question should help identify personality traits, interests, and natural abilities.

        Return ONLY a valid JSON array in this exact format:
        [
          {
            "id": "unique_id_1",
            "question": "Question text here?",
            "options": ["Option A", "Option B", "Option C", "Option D"],
            "category": "aviation"
          }
        ]

        Categories must be one of: aviation, technology, healthcare, business, creative, engineering, education, science, social_services, sports.

        Make questions relatable to students and focus on discovering their natural inclinations.
      `;

      const result = await this.model.generateContent(prompt);
      const response = await result.response;
      const text = response.text().trim();

      // Clean up the response to extract JSON
      const jsonMatch = text.match(/\[[\s\S]*\]/);
      if (!jsonMatch) {
        throw new Error("Invalid response format from Gemini API");
      }

      const questions = JSON.parse(jsonMatch[0]) as Question[];

      // Validate and ensure proper typing
      return questions.map((q, index) => ({
        id: q.id || `q_${Date.now()}_${index}`,
        question: q.question,
        options: q.options,
        category: q.category as CareerCategory,
      }));
    } catch (error) {
      console.error("Error generating questions:", error);
      // Return fallback questions if API fails
      return this.getFallbackQuestions().slice(0, questionCount);
    }
  }

  async generateCareerRecommendations(
    answers: Answer[],
  ): Promise<CareerRecommendation[]> {
    try {
      const answerSummary = answers.map((a) => ({
        category: a.category,
        selectedOption: a.selectedOption,
      }));

      const prompt = `
        You are Captain Sky, an expert career counselor. Analyze these career assessment answers and provide personalized recommendations.

        Answers: ${JSON.stringify(answerSummary)}

        Based on the pattern of answers, generate 3-5 career recommendations that match their interests and aptitudes.

        Return ONLY a valid JSON array in this exact format:
        [
          {
            "title": "Career Title",
            "description": "Brief description of what this career involves",
            "matchPercentage": 85,
            "requiredSkills": ["Skill 1", "Skill 2", "Skill 3"],
            "educationPath": ["Education step 1", "Education step 2"],
            "averageSalary": "$50,000 - $80,000",
            "jobOutlook": "Growing/Stable/Declining - brief explanation",
            "category": "aviation"
          }
        ]

        Categories must be one of: aviation, technology, healthcare, business, creative, engineering, education, science, social_services, sports.
        Match percentages should be realistic (60-95%). Focus on careers that align with their demonstrated interests.
      `;

      const result = await this.model.generateContent(prompt);
      const response = await result.response;
      const text = response.text().trim();

      const jsonMatch = text.match(/\[[\s\S]*\]/);
      if (!jsonMatch) {
        throw new Error("Invalid response format from Gemini API");
      }

      const recommendations = JSON.parse(
        jsonMatch[0],
      ) as CareerRecommendation[];

      return recommendations.map((rec) => ({
        ...rec,
        category: rec.category as CareerCategory,
        matchPercentage: Math.min(Math.max(rec.matchPercentage, 60), 95), // Ensure reasonable range
      }));
    } catch (error) {
      console.error("Error generating recommendations:", error);
      return this.getFallbackRecommendations();
    }
  }

  async generateAviatorMessage(
    context: "welcome" | "question" | "encouragement" | "completion",
    questionIndex?: number,
  ): Promise<string> {
    try {
      let promptContext = "";

      switch (context) {
        case "welcome":
          promptContext =
            "Welcome a new student to the career assessment. Be friendly and encouraging.";
          break;
        case "question":
          promptContext = `Introduce question ${questionIndex}. Keep it brief and encouraging.`;
          break;
        case "encouragement":
          promptContext =
            "Encourage the student to continue. They might be taking time to think.";
          break;
        case "completion":
          promptContext =
            "Congratulate them on completing the assessment. Build excitement for results.";
          break;
      }

      const prompt = `
        You are Captain Sky, a friendly and experienced aviator who helps students discover their career paths.
        ${promptContext}

        Respond in character with 1-2 sentences. Be warm, professional, and inspiring. Use aviation metaphors occasionally but don't overdo it.

        Return only the message text, no quotes or formatting.
      `;

      const result = await this.model.generateContent(prompt);
      const response = await result.response;
      return response
        .text()
        .trim()
        .replace(/^["']|["']$/g, ""); // Remove quotes if present
    } catch (error) {
      console.error("Error generating aviator message:", error);
      return this.getFallbackAviatorMessage(context);
    }
  }

  private getFallbackQuestions(): Question[] {
    return [
      {
        id: "fallback_1",
        question: "When working on a project, what energizes you most?",
        options: [
          "Solving complex technical problems",
          "Leading and coordinating the team",
          "Creating something beautiful or innovative",
          "Helping others achieve their goals",
        ],
        category: CareerCategory.TECHNOLOGY,
      },
      {
        id: "fallback_2",
        question: "Which scenario sounds most appealing to you?",
        options: [
          "Flying an aircraft through challenging weather",
          "Designing the next generation of spacecraft",
          "Teaching others about aviation safety",
          "Managing airport operations",
        ],
        category: CareerCategory.AVIATION,
      },
      {
        id: "fallback_3",
        question: "What type of environment do you thrive in?",
        options: [
          "Fast-paced, high-stakes situations",
          "Quiet spaces for deep focus and analysis",
          "Collaborative team environments",
          "Dynamic settings with variety and travel",
        ],
        category: CareerCategory.BUSINESS,
      },
      {
        id: "fallback_4",
        question: "When facing a challenge, your first instinct is to:",
        options: [
          "Research and analyze all possible solutions",
          "Brainstorm creative alternatives",
          "Consult with experts and mentors",
          "Take immediate action based on experience",
        ],
        category: CareerCategory.SCIENCE,
      },
      {
        id: "fallback_5",
        question: "What motivates you most in your ideal career?",
        options: [
          "Making a positive impact on people's lives",
          "Pushing the boundaries of what's possible",
          "Building and growing successful ventures",
          "Expressing creativity and artistic vision",
        ],
        category: CareerCategory.CREATIVE,
      },
    ];
  }

  private getFallbackRecommendations(): CareerRecommendation[] {
    return [
      {
        title: "Commercial Airline Pilot",
        description:
          "Operate aircraft for airlines, ensuring safe passenger and cargo transportation.",
        matchPercentage: 85,
        requiredSkills: [
          "Flight skills",
          "Decision making",
          "Communication",
          "Attention to detail",
        ],
        educationPath: [
          "Commercial pilot license",
          "Airline transport pilot license",
          "Type ratings",
        ],
        averageSalary: "$80,000 - $200,000",
        jobOutlook: "Growing - airline industry expansion expected",
        category: CareerCategory.AVIATION,
      },
      {
        title: "Aerospace Engineer",
        description:
          "Design and develop aircraft, spacecraft, and aviation systems.",
        matchPercentage: 75,
        requiredSkills: [
          "Engineering principles",
          "CAD software",
          "Problem solving",
          "Mathematics",
        ],
        educationPath: [
          "Bachelor in Aerospace Engineering",
          "Professional Engineer license",
        ],
        averageSalary: "$70,000 - $130,000",
        jobOutlook: "Stable - continued demand for aviation innovation",
        category: CareerCategory.ENGINEERING,
      },
    ];
  }

  private getFallbackAviatorMessage(context: string): string {
    const messages = {
      welcome:
        "Welcome aboard! I'm Captain Sky, and I'm here to help you discover your perfect career path. Ready for takeoff?",
      question:
        "Great thinking! Take your time with this one - every good pilot knows the importance of careful consideration.",
      encouragement:
        "You're doing fantastic! Keep going - we're building a clear picture of your ideal career.",
      completion:
        "Outstanding work! You've completed your career assessment. Let's see what exciting opportunities await you!",
    };

    return (
      messages[context as keyof typeof messages] || "Keep up the great work!"
    );
  }
}

export default new GeminiService();
