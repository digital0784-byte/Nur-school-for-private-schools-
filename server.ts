import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";
import { authRouter } from "./server/auth";

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const PORT = 3000;

let aiClient: GoogleGenAI | null = null;
function getAI(): GoogleGenAI | null {
  if (!aiClient && process.env.GEMINI_API_KEY) {
    aiClient = new GoogleGenAI({
      apiKey: process.env.GEMINI_API_KEY,
      httpOptions: {
        headers: {
          "User-Agent": "aistudio-build",
        },
      },
    });
  }
  return aiClient;
}

async function startServer() {
  const app = express();
  app.use(express.json());

  // Auth routes
  app.use("/api/auth", authRouter);

  // Health check
  app.get("/api/health", (_req, res) => {
    res.json({
      status: "ok",
      timestamp: new Date().toISOString(),
      geminiConfigured: !!process.env.GEMINI_API_KEY,
    });
  });

  // AI Tutor Chat (handles both /api/ai/chat and /api/ai/tutor-chat)
  const handleTutorChat = async (req: express.Request, res: express.Response) => {
    try {
      const {
        message,
        history,
        conversationHistory,
        language = "am",
        subject = "General",
      } = req.body;
      const ai = getAI();

      if (!ai) {
        // High quality contextual fallback if API key is not yet set
        const isAmharic = language === "am";
        const reply = isAmharic
          ? `ሰላም! እኔ የ NUR School AI መምህር ነኝ። በጥያቄህ ላይ ልረዳህ ዝግጁ ነኝ። በርዕሰ ጉዳዩ (${subject}) ዙሪያ ማንኛውንም ጥያቄ ጠይቀኝ!`
          : `Hello! I am your NUR School AI Academic Tutor for ${subject}. I am here to break down concepts step-by-step, answer homework queries, and guide your learning. How can I help you today?`;
        return res.json({ reply, source: "offline-tutor" });
      }

      const systemInstruction = `You are "NUR AI Tutor", an intelligent, encouraging, highly articulate academic tutor for students at NUR School in Addis Ababa, Ethiopia.
Current Subject: ${subject}.
Target Language: ${language === "am" ? "Amharic (አማርኛ) or bilingual English-Amharic" : "English (with polite academic support)"}.
Your task:
1. Provide accurate, clear, pedagogical explanations with step-by-step breakdown.
2. Ask a quick follow-up check question to verify the student understood.
3. Keep the tone warm, uplifting, educational, and respectful.
4. Support Amharic script flawlessly when requested or when addressed in Amharic.`;

      // Build conversation contents
      const rawHistory = history || conversationHistory || [];
      const contents: Array<{ role: string; parts: Array<{ text: string }> }> = [];
      if (Array.isArray(rawHistory)) {
        for (const item of rawHistory.slice(-6)) {
          const itemText = item.text || item.content || "";
          const itemRole = (item.sender === "user" || item.role === "user") ? "user" : "model";
          if (itemText) {
            contents.push({
              role: itemRole,
              parts: [{ text: itemText }],
            });
          }
        }
      }
      contents.push({
        role: "user",
        parts: [{ text: message || "Hello tutor!" }],
      });

      const response = await ai.models.generateContent({
        model: "gemini-3.8-flash",
        contents,
        config: {
          systemInstruction,
          temperature: 0.7,
        },
      });

      return res.json({ reply: response.text, source: "gemini-3.8-flash" });
    } catch (err: any) {
      console.error("AI Chat Error:", err);
      return res.status(500).json({
        error: "Failed to generate AI response",
        details: err?.message || String(err),
      });
    }
  };

  app.post("/api/ai/chat", handleTutorChat);
  app.post("/api/ai/tutor-chat", handleTutorChat);

  // AI Quiz & Exam Generator for Teachers
  app.post("/api/ai/quiz-generator", async (req, res) => {
    try {
      const { subject, grade, topic, questionCount = 5, difficulty = "Medium", language = "en" } = req.body;
      const ai = getAI();

      if (!ai) {
        // Fallback structured quiz
        return res.json({
          title: `${subject} Quiz: ${topic}`,
          grade,
          topic,
          questions: [
            {
              id: "q1",
              questionText: `What is the foundational concept in ${topic}?`,
              options: [
                "Fundamental scientific principles and definitions",
                "Arbitrary assumptions without empirical verification",
                "Historical folklore",
                "Unrelated mathematical constants"
              ],
              correctAnswerIndex: 0,
              explanation: "Core concepts are founded upon rigorous empirical principles and systematic definitions.",
              points: 5
            },
            {
              id: "q2",
              questionText: `In the context of ${grade} ${subject}, why is understanding ${topic} crucial?`,
              options: [
                "It serves as a prerequisite for advanced problem-solving",
                "It has no practical application in modern education",
                "It is only relevant during final exams",
                "It was officially deprecated in the national curriculum"
              ],
              correctAnswerIndex: 0,
              explanation: "Foundational mastery directly empowers students to succeed in higher-level application and synthesis.",
              points: 5
            }
          ],
          source: "offline-generator"
        });
      }

      const prompt = `Generate a high-quality ${questionCount}-question multiple-choice exam/quiz for Grade ${grade} students in subject "${subject}" on the topic "${topic}".
Difficulty level: ${difficulty}.
Language: ${language === "am" ? "Amharic (with questions and options in Amharic)" : "English"}.

Return ONLY valid JSON matching this structure without Markdown backticks:
{
  "title": "${subject} - ${topic}",
  "grade": "${grade}",
  "topic": "${topic}",
  "questions": [
    {
      "id": "q1",
      "questionText": "Question text here",
      "options": ["Option A", "Option B", "Option C", "Option D"],
      "correctAnswerIndex": 0,
      "explanation": "Detailed pedagogical explanation of why this answer is correct",
      "points": 5
    }
  ]
}`;

      const response = await ai.models.generateContent({
        model: "gemini-3.8-flash",
        contents: prompt,
        config: {
          responseMimeType: "application/json",
          temperature: 0.6,
        },
      });

      let parsed: any;
      try {
        parsed = JSON.parse(response.text || "{}");
      } catch {
        parsed = { error: "Failed to parse JSON", raw: response.text };
      }

      return res.json({ ...parsed, source: "gemini-3.8-flash" });
    } catch (err: any) {
      console.error("AI Quiz Generator Error:", err);
      return res.status(500).json({
        error: "Failed to generate quiz",
        details: err?.message || String(err),
      });
    }
  });

  // AI Lesson Summarizer & Study Notes
  const handleLessonSummary = async (req: express.Request, res: express.Response) => {
    try {
      const {
        title,
        lessonTitle,
        content,
        lessonContent,
        subject,
        grade,
        language = "am",
      } = req.body;
      const effectiveTitle = title || lessonTitle || "Key Academic Topic";
      const effectiveContent = content || lessonContent || "Curriculum lesson study content.";
      const ai = getAI();

      if (!ai) {
        const isAmharic = language === "am";
        return res.json({
          summary: isAmharic
            ? `ይህ ትምህርት የ"${effectiveTitle}" ዋና ዋና ፅንሰ-ሀሳቦችን ያብራራል። ለተማሪዎች ቁልፍ ትርጓሜዎችን፣ የእለት ተእለት ምሳሌዎችን እና ለቀጣይ ምዘና የሚያዘጋጁ ነጥቦችን ያቀርባል።`
            : `This lesson covers key fundamentals of "${effectiveTitle}". It establishes core definitions, provides real-world applications, and prepares learners for upcoming assessments.`,
          keyTakeaways: isAmharic
            ? [
                "የዋና ዋና ሳይንሳዊ ትርጓሜዎች ማጠቃለያ",
                "ደረጃ በደረጃ የችግር አፈታት ዘዴዎች",
                "የራስ-ግምገማ እና የፈተና ዝግጅት ነጥቦች",
              ]
            : [
                "Comprehensive review of core theoretical definitions",
                "Practical step-by-step problem-solving methodology",
                "Self-assessment checkpoints and critical review questions",
              ],
          practiceQuestions: isAmharic
            ? [
                "ይህ ፅንሰ-ሀሳብ በእለት ተእለት ኑሮ ውስጥ እንዴት በተግባር ይውላል?",
                "በዚህ ርዕስ ውስጥ ዋና እና ንዑስ ነጥቦች ልዩነታቸው ምንድን ነው?",
              ]
            : [
                "How does this concept apply to real-world scenarios?",
                "What is the key difference between primary and secondary elements in this topic?",
              ],
          source: "offline-summary",
        });
      }

      const prompt = `Summarize the following educational lesson titled "${effectiveTitle}" for ${grade || "secondary"} students in subject "${subject || "General"}".
Language: ${language === "am" ? "Amharic (አማርኛ)" : "English"}.
Lesson Content:
${effectiveContent}

Return ONLY valid JSON with:
{
  "summary": "Clear executive summary of the lesson (3-4 sentences)",
  "keyTakeaways": ["Point 1", "Point 2", "Point 3", "Point 4"],
  "practiceQuestions": ["Practice question 1", "Practice question 2"]
}`;

      const response = await ai.models.generateContent({
        model: "gemini-3.8-flash",
        contents: prompt,
        config: {
          responseMimeType: "application/json",
          temperature: 0.5,
        },
      });

      let parsed: any;
      try {
        parsed = JSON.parse(response.text || "{}");
      } catch {
        parsed = { summary: response.text, keyTakeaways: [], practiceQuestions: [] };
      }

      return res.json({ ...parsed, source: "gemini-3.8-flash" });
    } catch (err: any) {
      console.error("AI Lesson Summary Error:", err);
      return res.status(500).json({
        error: "Failed to generate summary",
        details: err?.message || String(err),
      });
    }
  };

  app.post("/api/ai/lesson-summary", handleLessonSummary);
  app.post("/api/ai/lesson-summarizer", handleLessonSummary);

  // AI Parent Insights & Recommendations
  app.post("/api/ai/parent-insights", async (req, res) => {
    try {
      const {
        studentName = "Student",
        grade = "Grade 10",
        attendanceRate,
        attendance,
        gpa = "3.8",
        recentPerformance,
        subjectsData,
        language = "am",
      } = req.body;
      const effectiveAttendance = attendanceRate || attendance || "95%";
      const effectivePerformance = recentPerformance || subjectsData || [];
      const ai = getAI();
      const isAmharic = language === "am";

      if (!ai) {
        const overallSentiment = isAmharic
          ? "አበረታች እድገት እና ተከታታይ ጥረት"
          : "Positive Growth & Consistent Performance";
        const strengths = isAmharic
          ? [
              `${studentName} የ${effectiveAttendance} የመገኘት ምጣኔ በማሳየት ጠንካራ ትጋት አሳይቷል/ታለች።`,
              "በሳይንስ እና በቋንቋ ትምህርቶች ላይ ከፍተኛ ተሳትፎ እና ፈጣን የመረዳት አቅም አለው/አላት።",
            ]
          : [
              `${studentName} demonstrates strong diligence with an attendance rate of ${effectiveAttendance}.`,
              "Active engagement in STEM and language studies with solid analytical capability.",
            ];
        const areasForGrowth = isAmharic
          ? [
              "የቃላት እውቀትን እና የማንበብ ፍጥነትን ለማሳደግ በቀን 20 ደቂቃ ተጨማሪ የንባብ ልምምድ ማድረግ።",
              "የፈተና ሰዓት አጠቃቀም በራስ መተማመንን ለማሳደግ የጊዜ ቆጣሪ ጥያቄዎችን አዘውትሮ መስራት።",
            ]
          : [
              "Encourage 20 minutes daily reading to further enhance vocabulary and comprehension.",
              "Consistent practice with timed mock assessments to build exam pacing confidence.",
            ];
        const homeActionPlan = isAmharic
          ? [
              "ምሽት ላይ ለ45 ደቂቃ ያህል ከሞባይል እና ከቴሌቪዥን የራቀ ጸጥ ያለ የጥናት ሰዓት ማዘጋጀት።",
              "የሳምንቱን የመምህራን አስተያየት በመገምገም ለታየው ጥረት ተገቢውን ማበረታቻ መስጠት።",
            ]
          : [
              "Set aside a distraction-free 45-minute evening study block.",
              "Review weekly teacher remarks and congratulate ongoing perseverance.",
            ];

        const formattedInsights = isAmharic
          ? `🌟 አጠቃላይ እይታ: ${overallSentiment}\n\n💪 ጠንካራ ጎኖች:\n${strengths.map((s) => `• ${s}`).join("\n")}\n\n📈 የመሻሻያ መስኮች:\n${areasForGrowth.map((a) => `• ${a}`).join("\n")}\n\n🏠 የቤት ውስጥ ድርጊት መመሪያ:\n${homeActionPlan.map((h) => `• ${h}`).join("\n")}`
          : `🌟 Overall Outlook: ${overallSentiment}\n\n💪 Strengths:\n${strengths.map((s) => `• ${s}`).join("\n")}\n\n📈 Growth Areas:\n${areasForGrowth.map((a) => `• ${a}`).join("\n")}\n\n🏠 Home Action Plan:\n${homeActionPlan.map((h) => `• ${h}`).join("\n")}`;

        return res.json({
          overallSentiment,
          strengths,
          areasForGrowth,
          homeActionPlan,
          insights: formattedInsights,
          source: "offline-insights",
        });
      }

      const prompt = `You are an educational counselor providing a compassionate, insightful progress summary for the parents of ${studentName} (${grade}).
Academic profile:
- Attendance rate: ${effectiveAttendance}
- Current GPA: ${gpa}
- Performance: ${JSON.stringify(effectivePerformance)}
Target language: ${isAmharic ? "Amharic (አማርኛ)" : "English"}.

Return ONLY valid JSON matching:
{
  "overallSentiment": "Short encouraging headline",
  "strengths": ["Strength 1", "Strength 2"],
  "areasForGrowth": ["Area 1", "Area 2"],
  "homeActionPlan": ["Actionable tip for parents at home 1", "Actionable tip 2"]
}`;

      const response = await ai.models.generateContent({
        model: "gemini-3.8-flash",
        contents: prompt,
        config: {
          responseMimeType: "application/json",
          temperature: 0.6,
        },
      });

      let parsed: any;
      try {
        parsed = JSON.parse(response.text || "{}");
      } catch {
        parsed = {
          overallSentiment: isAmharic ? "አበረታች ውጤት" : "Steady Academic Progress",
          strengths: [isAmharic ? "በትምህርት ገበታ ላይ በትጋት መገኘት" : "Consistent classroom attendance."],
          areasForGrowth: [isAmharic ? "በተከታታይ የቤት ስራዎችን መስራት" : "Regular homework review."],
          homeActionPlan: [isAmharic ? "በየምሽቱ የልጁን ደብተር መመልከት" : "Review class notebook daily."],
        };
      }

      const formattedInsights = isAmharic
        ? `🌟 አጠቃላይ እይታ: ${parsed.overallSentiment || "አበረታች ውጤት"}\n\n💪 ጠንካራ ጎኖች:\n${(parsed.strengths || []).map((s: string) => `• ${s}`).join("\n")}\n\n📈 የመሻሻያ መስኮች:\n${(parsed.areasForGrowth || []).map((a: string) => `• ${a}`).join("\n")}\n\n🏠 የቤት ውስጥ ድርጊት መመሪያ:\n${(parsed.homeActionPlan || []).map((h: string) => `• ${h}`).join("\n")}`
        : `🌟 Overall Outlook: ${parsed.overallSentiment || "Steady Academic Progress"}\n\n💪 Strengths:\n${(parsed.strengths || []).map((s: string) => `• ${s}`).join("\n")}\n\n📈 Growth Areas:\n${(parsed.areasForGrowth || []).map((a: string) => `• ${a}`).join("\n")}\n\n🏠 Home Action Plan:\n${(parsed.homeActionPlan || []).map((h: string) => `• ${h}`).join("\n")}`;

      return res.json({
        ...parsed,
        insights: formattedInsights,
        source: "gemini-3.8-flash",
      });
    } catch (err: any) {
      console.error("AI Parent Insights Error:", err);
      return res.status(500).json({
        error: "Failed to generate parent insights",
        details: err?.message || String(err),
      });
    }
  });

  // Vite middleware in development or static dist in production
  if (process.env.NODE_ENV !== "production") {
    const { createServer: createViteServer } = await import("vite");
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (_req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`NUR School ERP & LMS Server active on http://0.0.0.0:${PORT}`);
  });
}

startServer().catch((err) => {
  console.error("Fatal server error:", err);
});
