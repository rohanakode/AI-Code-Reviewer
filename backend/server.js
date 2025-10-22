import "dotenv/config";
import express from "express";
import cors from "cors";
import fetch from "node-fetch";

const app = express();
const PORT = process.env.PORT || 3001;
const GEMINI_API_KEY = process.env.GEMINI_API_KEY;

if (!GEMINI_API_KEY) {
  console.error("❌ ERROR: GEMINI_API_KEY not found!");
  console.error("💡 Make sure you have a .env file with:");
  console.error("   GEMINI_API_KEY=your_actual_key_here");
  process.exit(1);
}

console.log("✅ API Key loaded from .env file");

app.use(cors());
app.use(express.json());

app.post("/api/review", async (req, res) => {
  try {
    const { code, language } = req.body;

    if (!code || !language) {
      return res.status(400).json({ error: "Missing code or language" });
    }

    console.log(`📝 Analyzing ${language} code...`);

    const prompt = `You are an expert code reviewer. Analyze this ${language} code and find issues.

Code:
\`\`\`${language}
${code}
\`\`\`

Return ONLY valid JSON in this exact format (no markdown, no extra text):
{
  "issues": [
    {
      "line": 1,
      "severity": "critical",
      "category": "bug",
      "title": "Issue title",
      "problem": "What is wrong",
      "why": "Why it matters",
      "fix": "How to fix"
    }
  ],
  "fixedCode": "corrected code here",
  "summary": {
    "critical": 0,
    "warnings": 0,
    "suggestions": 0
  }
}

If code is perfect, return empty issues array.`;

    const geminiResponse = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${GEMINI_API_KEY}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }],
          generationConfig: {
            temperature: 0.4,
            maxOutputTokens: 8192,

            response_mime_type: "application/json",
          },

          safetySettings: [
            {
              category: "HARM_CATEGORY_HARASSMENT",
              threshold: "BLOCK_NONE",
            },
            {
              category: "HARM_CATEGORY_HATE_SPEECH",
              threshold: "BLOCK_NONE",
            },
            {
              category: "HARM_CATEGORY_SEXUALLY_EXPLICIT",
              threshold: "BLOCK_NONE",
            },
            {
              category: "HARM_CATEGORY_DANGEROUS_CONTENT",
              threshold: "BLOCK_NONE",
            },
          ],
        }),
      }
    );

    if (!geminiResponse.ok) {
      const errorData = await geminiResponse.json();
      console.error("❌ Gemini API Error:", errorData);
      return res.status(500).json({
        error: "AI analysis failed",
        details: errorData.error?.message,
      });
    }

    const data = await geminiResponse.json();
    const aiText = data.candidates?.[0]?.content?.parts?.[0]?.text;

    if (!aiText) {
      console.error(
        "❌ No content in AI response! This means it was blocked or empty. Full API response:"
      );
      console.log(JSON.stringify(data, null, 2));
      return res.status(500).json({ error: "No response from AI" });
    }

    let reviewData;
    try {
      reviewData = JSON.parse(aiText);
    } catch (parseError) {
      console.error("JSON Parse Error:", parseError.message);

      console.error("AI returned this (which is not valid JSON):", aiText);
      return res.status(500).json({
        error: "Failed to parse AI response",
        details: "AI returned invalid JSON",
      });
    }

    const formattedReview = {
      issues: reviewData.issues || [],
      fixedCode: reviewData.fixedCode || code,
      summary: reviewData.summary || {
        critical:
          reviewData.issues?.filter((i) => i.severity === "critical").length ||
          0,
        warnings:
          reviewData.issues?.filter((i) => i.severity === "warning").length ||
          0,
        suggestions:
          reviewData.issues?.filter((i) => i.severity === "suggestion")
            .length || 0,
      },
    };

    console.log("✅ Analysis complete!");
    res.json(formattedReview);
  } catch (error) {
    console.error("❌ Server Error:", error);
    res.status(500).json({
      error: "Server error",
      details: error.message,
    });
  }
});

app.get("/health", (req, res) => {
  res.json({
    status: "OK",
    message: "Code Reviewer API is running!",
    timestamp: new Date().toISOString(),
  });
});


app.listen(PORT, () => {
  console.log("-----------------------------------------");
  console.log(`AI Code Reviewer Backend - Running`);
  
});
