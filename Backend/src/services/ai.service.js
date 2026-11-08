require("dotenv").config();
const { GoogleGenAI } = require("@google/genai");
const { z } = require("zod");
const puppeteer = require("puppeteer");
const { AVAILABLE_TEMPLATES, renderResumeHtml } = require("./resumeTemplates");

const ai = new GoogleGenAI({
    apiKey: process.env.GOOGLE_GENAI_API_KEY
});

// Candidate models ordered by priority. If the primary model encounters rate limits
// (429) or high demand / server overload (503/UNAVAILABLE), the system retries with
// exponential backoff and automatically falls back down the chain.
const CANDIDATE_MODELS = [
    "gemini-2.5-flash",
    "gemini-3.5-flash-lite",
    "gemini-3.5-flash",
    "gemini-flash-lite-latest"
];

/**
 * Safely parse JSON returned by Gemini, stripping any markdown code fences if present.
 */
function cleanAndParseJson(text) {
    if (!text || typeof text !== "string") {
        throw new Error("Empty response received from AI model");
    }
    let cleaned = text.trim();
    if (cleaned.startsWith("```json")) {
        cleaned = cleaned.replace(/^```json\s*/i, "").replace(/\s*```$/, "");
    } else if (cleaned.startsWith("```")) {
        cleaned = cleaned.replace(/^```\s*/, "").replace(/\s*```$/, "");
    }
    return JSON.parse(cleaned);
}

/**
 * Robust caller for Gemini API that handles:
 * - 429 Too Many Requests (Rate limits / Quota)
 * - 503 Service Unavailable / Model Overloaded (High demand)
 * - Retries with exponential backoff and jitter
 * - Automatic model failover down CANDIDATE_MODELS
 */
async function callGeminiWithRetryAndFallback(generateOptions, { maxRetries = 2 } = {}) {
    let lastError = null;

    for (const model of CANDIDATE_MODELS) {
        for (let attempt = 0; attempt <= maxRetries; attempt++) {
            try {
                const response = await ai.models.generateContent({
                    model,
                    ...generateOptions
                });
                return { response, modelUsed: model };
            } catch (err) {
                lastError = err;
                const errMsg = (err?.message || "").toLowerCase();
                const errStatus = err?.status || err?.code || 0;

                const isOverloadedOrRateLimited =
                    errStatus === 429 ||
                    errStatus === 503 ||
                    errStatus === 500 ||
                    errMsg.includes("resource_exhausted") ||
                    errMsg.includes("quota") ||
                    errMsg.includes("rate limit") ||
                    errMsg.includes("high demand") ||
                    errMsg.includes("overloaded") ||
                    errMsg.includes("unavailable") ||
                    errMsg.includes("try again later");

                console.warn(
                    `[Gemini] Model "${model}" attempt ${attempt + 1}/${maxRetries + 1} failed: ${err.message || err}`
                );

                if (isOverloadedOrRateLimited && attempt < maxRetries) {
                    const backoffMs = 1200 * Math.pow(2, attempt) + Math.floor(Math.random() * 400);
                    console.log(`[Gemini] Waiting ${backoffMs}ms before retry due to high demand / rate limit...`);
                    await new Promise(res => setTimeout(res, backoffMs));
                } else {
                    // Stop retrying this specific model and fall back to the next model
                    break;
                }
            }
        }
        console.warn(`[Gemini] Falling back from model "${model}" to next candidate...`);
    }

    throw new Error(
        `Gemini AI service is currently experiencing very high demand. Please try again in a few moments. (Details: ${
            lastError?.message || "All fallback models unavailable"
        })`
    );
}

async function invokeGeminiAi() {
    const { response } = await callGeminiWithRetryAndFallback({
        contents: "Hello gemini! Explain what is Interview?"
    });
    console.log(response.text);
    return response.text;
}

const interviewReportSchema = z.object({
    matchScore: z.number().describe("A score between 0 and 100 indicating how well the candidate's profile matches the job description"),
    technicalQuestions: z.array(z.object({
        question: z.string().describe("The technical question can be asked in the interview"),
        intention: z.string().describe("The intention of interviewer behind asking this question"),
        answer: z.string().describe("How to answer this question, what points to cover, what approach to take etc.")
    })).describe("Technical questions that can be asked in the interview along with their intention and how to answer them"),
    behavioralQuestions: z.array(z.object({
        question: z.string().describe("The behavioral question can be asked in the interview"),
        intention: z.string().describe("The intention of interviewer behind asking this question"),
        answer: z.string().describe("How to answer this question, what points to cover, what approach to take etc.")
    })).describe("Behavioral questions that can be asked in the interview along with intention and model answer"),
    skillGaps: z.array(z.object({
        skill: z.string().describe("The skill which the candidate is lacking"),
        severity: z.enum(["low", "medium", "high"]).describe("How severe this skill gap is")
    })).describe("List of skill gaps in the candidate's profile along with their severity"),
    preparationPlan: z.array(z.object({
        day: z.number().describe("The day number in the preparation plan, starting from 1"),
        focus: z.string().describe("The main focus of this day in the preparation plan, e.g. data structures, system design, mock interview"),
        tasks: z.array(z.string()).describe("List of tasks to be done on this day to follow the preparation plan")
    })).describe("A day-wise preparation plan for the candidate to follow in order to prepare for the interview"),
    title: z.string().describe("The title of the job for which the interview report is created")
});

async function generateInterviewReport({ resume, selfDescription, jobDescription }) {
    const prompt = `Generate an interview preparation report for a candidate based on the following details:
Resume: ${resume || "Not provided"}
Self Description: ${selfDescription || "Not provided"}
Job Description: ${jobDescription || "Not provided"}
`;

    const { response } = await callGeminiWithRetryAndFallback({
        contents: prompt,
        config: {
            responseMimeType: "application/json",
            responseSchema: z.toJSONSchema(interviewReportSchema, { target: "openapi-3.0" })
        }
    });

    return cleanAndParseJson(response.text);
}

// ── Structured Schema for strictly 1-page ATS resumes ────────────────────────
const structuredResumeSchema = z.object({
    fullName: z.string().describe("Candidate's full name"),
    title: z.string().describe("Target professional job title, tailored directly to the target role"),
    contact: z.object({
        email: z.string().describe("Professional email address"),
        phone: z.string().describe("Phone number"),
        location: z.string().describe("City, State or Country"),
        linkedin: z.string().optional().describe("LinkedIn profile URL or handle"),
        github: z.string().optional().describe("GitHub profile URL or handle"),
        portfolio: z.string().optional().describe("Portfolio or personal site URL")
    }),
    summary: z.string().describe("A high-impact, 2 to 3 sentence professional summary tailored specifically to the target job description keywords and required experience"),
    skills: z.array(z.object({
        category: z.string().describe("Skill category name, e.g. 'Languages', 'Frameworks & Libraries', 'Databases & Cloud', 'Developer Tools'"),
        items: z.array(z.string()).describe("Array of specific skills, strictly relevant to the target job")
    })).describe("3 to 4 categorized technical skills groups"),
    experience: z.array(z.object({
        role: z.string().describe("Job title / role"),
        company: z.string().describe("Company or organization name"),
        location: z.string().optional().describe("Location (e.g. Pune, India or Remote)"),
        dates: z.string().describe("Employment dates (e.g. Jan 2024 - Jun 2024)"),
        bullets: z.array(z.string()).describe("2 to 3 concise bullet points using action verbs and the Google XYZ formula: 'Accomplished [X] as measured by [Y], by doing [Z]'. Keep each bullet 1-2 lines.")
    })).describe("Top 2 to 3 most relevant work experiences (strictly limited to maintain 1-page layout)"),
    projects: z.array(z.object({
        name: z.string().describe("Project title"),
        techStack: z.string().describe("Technologies used, e.g. React.js, Node.js, MongoDB"),
        link: z.string().optional().describe("Live demo or repository link"),
        bullets: z.array(z.string()).describe("2 concise bullet points demonstrating technical depth and impact")
    })).describe("Top 2 relevant projects"),
    education: z.array(z.object({
        degree: z.string().describe("Degree and field of study, e.g. B.E. in Computer Engineering"),
        institution: z.string().describe("College / University name"),
        location: z.string().optional().describe("City, Country"),
        year: z.string().describe("Graduation year or date range, e.g. 2022 - 2026"),
        details: z.string().optional().describe("CGPA/GPA, honors, or relevant coursework")
    })).describe("Education entries (1 to 2 entries maximum)"),
    certifications: z.array(z.string()).optional().describe("1 to 2 relevant certifications or honors (optional)")
});

/**
 * Synthesizes candidate background + target job description into structured,
 * highly tailored resume data using Gemini AI with resilience & fallbacks.
 */
async function generateStructuredResumeData({ resume, selfDescription, jobDescription }) {
    const prompt = `You are a Principal Technical Recruiter and Executive Resume Writer at a top-tier tech firm (FAANG/Fortune 500).
Your mission is to transform the candidate's raw profile into an outstanding, ATS-optimized, high-converting resume tailored directly to the target job description.

CRITICAL 1-PAGE DENSITY INSTRUCTIONS:
1. The resume MUST STRICTLY fit onto ONE SINGLE A4 PAGE.
2. Select only the top 2-3 most relevant experiences. Write exactly 2-3 concise, high-impact bullet points for each.
3. Every bullet point MUST follow the Google XYZ formula: "Accomplished [X] as measured by [Y], by doing [Z]" with metrics (%, $, time saved, latency reduction, user scale).
4. Feature only the top 2 most impressive projects with 2 concise bullet points each.
5. Categorize skills cleanly into 3-4 compact groups (Languages, Frameworks, Databases & Tools).
6. Craft an impactful 2-3 sentence Professional Summary embedding critical keywords from the target job description.
7. Omit unnecessary fluff, repetition, or irrelevant past activities.

Candidate Resume:
${resume || "Not provided"}

Candidate Self-Description:
${selfDescription || "Not provided"}

Target Job Description:
${jobDescription || "Not provided"}

Return ONLY the JSON conforming to the schema.`;

    const { response, modelUsed } = await callGeminiWithRetryAndFallback({
        contents: prompt,
        config: {
            responseMimeType: "application/json",
            responseSchema: z.toJSONSchema(structuredResumeSchema, { target: "openapi-3.0" })
        }
    });

    console.log(`[Resume] Structured resume data successfully generated using ${modelUsed}`);
    return cleanAndParseJson(response.text);
}

/**
 * Puppeteer PDF generator strictly tuned for single-page A4 output.
 */
async function generatePdfFromHtml(htmlContent) {
    let browser;
    try {
        browser = await puppeteer.launch({
            headless: "new",
            args: [
                "--no-sandbox",
                "--disable-setuid-sandbox",
                "--disable-dev-shm-usage",
                "--disable-gpu",
                "--no-first-run",
                "--no-zygote"
            ]
        });
        const page = await browser.newPage();

        // Standard A4 at 96 DPI is ~794px x 1123px
        await page.setViewport({
            width: 794,
            height: 1123,
            deviceScaleFactor: 2
        });

        await page.setContent(htmlContent, { waitUntil: "networkidle0" });

        const pdfBuffer = await page.pdf({
            format: "A4",
            printBackground: true,
            pageRanges: "1", // STRICTLY 1 PAGE ONLY
            preferCSSPageSize: true,
            margin: {
                top: "8mm",
                bottom: "8mm",
                left: "10mm",
                right: "10mm"
            }
        });

        return pdfBuffer;
    } finally {
        if (browser) {
            await browser.close();
        }
    }
}

/**
 * Generates an ATS-optimized single-page PDF resume using the chosen company template.
 * @param {Object} options
 * @param {string} [options.resume] - Raw resume text from PDF or user
 * @param {string} [options.selfDescription] - User self-description
 * @param {string} [options.jobDescription] - Target job description
 * @param {string} [options.template] - 'harvard' | 'modern' | 'executive' | 'compact'
 */
async function generateResumepdf({ resume, selfDescription, jobDescription, template = "harvard" }) {
    // 1. Synthesize and tailor candidate information to the target job
    const resumeData = await generateStructuredResumeData({
        resume,
        selfDescription,
        jobDescription
    });

    // 2. Render HTML using the chosen industry standard template
    const htmlContent = renderResumeHtml(resumeData, template);

    // 3. Render strictly 1-page PDF using Puppeteer
    const pdfBuffer = await generatePdfFromHtml(htmlContent);

    return {
        pdfBuffer,
        htmlContent,
        resumeData
    };
}

/**
 * Generates only the HTML preview for the frontend.
 */
async function generateResumeHtmlOnly({ resume, selfDescription, jobDescription, template = "harvard" }) {
    const resumeData = await generateStructuredResumeData({
        resume,
        selfDescription,
        jobDescription
    });
    const htmlContent = renderResumeHtml(resumeData, template);
    return { htmlContent, resumeData };
}

module.exports = {
    AVAILABLE_TEMPLATES,
    generateInterviewReport,
    generateStructuredResumeData,
    generateResumepdf,
    generateResumeHtmlOnly,
    renderResumeHtml,
    generatePdfFromHtml,
    invokeGeminiAi
};
