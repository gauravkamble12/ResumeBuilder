const { PDFParse } = require("pdf-parse");
const {
    generateInterviewReport,
    generateResumepdf,
    generateResumeHtmlOnly,
    AVAILABLE_TEMPLATES
} = require("../services/ai.service");
const interviewReportModel = require("../models/interviewReport.models");

async function generateInterViewReportController(req, res) {
    try {
        let resumeContent = "";
        if (req.file) {
            const parser = new PDFParse({ data: req.file.buffer });
            resumeContent = (await parser.getText()).text;
            await parser.destroy();
        }

        const { selfDescription, jobDescription } = req.body;

        if (!resumeContent && !selfDescription) {
            return res.status(400).json({
                message: "Either a Resume file or a Self-Description is required"
            });
        }

        const interviewReportByAi = await generateInterviewReport({
            resume: resumeContent,
            selfDescription,
            jobDescription
        });

        const interviewReport = await interviewReportModel.create({
            user: req.user.id,
            resume: resumeContent,
            selfDescription,
            jobDescription,
            ...interviewReportByAi
        });

        res.status(200).json({
            message: "interview report generated successfully",
            interviewReport
        });
    } catch (err) {
        console.error("Error generating interview report:", err);
        res.status(500).json({
            message: err.message || "Internal server error"
        });
    }
}

async function getInterviewReportByIdController(req, res) {
    try {
        const { interviewId } = req.params;
        const interviewReport = await interviewReportModel.findOne({
            _id: interviewId,
            user: req.user.id
        });

        if (!interviewReport) {
            return res.status(404).json({
                message: "Interview report not found"
            });
        }

        res.status(200).json({
            message: "interview report fetched successfully",
            interviewReport
        });
    } catch (err) {
        res.status(500).json({
            message: err.message || "Internal server error"
        });
    }
}

async function getAllInterviewReportController(req, res) {
    try {
        const interviewReports = await interviewReportModel
            .find({ user: req.user.id })
            .sort({ createdAt: -1 })
            .select("-resume -selfDescription -jobDescription -__v -technicalQuestions -behavioralQuestions -skillGaps -preparationPlan");

        res.status(200).json({
            message: "Interview reports fetched successfully",
            interviewReports
        });
    } catch (err) {
        res.status(500).json({
            message: err.message || "Internal server error"
        });
    }
}

/**
 * @description Controller to get the available industry-standard resume templates
 */
async function getResumeTemplatesController(req, res) {
    try {
        return res.status(200).json({
            message: "Resume templates fetched successfully",
            templates: AVAILABLE_TEMPLATES
        });
    } catch (err) {
        return res.status(500).json({
            message: err.message || "Failed to fetch resume templates"
        });
    }
}

/**
 * @description Controller to preview the generated resume HTML based on selected template
 */
async function getResumePreviewController(req, res) {
    try {
        const { interviewReportId } = req.params;
        const interviewReport = await interviewReportModel.findOne({
            _id: interviewReportId,
            user: req.user.id
        });

        if (!interviewReport) {
            return res.status(404).json({
                message: "Interview report not found"
            });
        }

        const template = req.query.template || req.body?.template || "harvard";
        const { resume, jobDescription, selfDescription } = interviewReport;

        const { htmlContent, resumeData } = await generateResumeHtmlOnly({
            resume,
            jobDescription,
            selfDescription,
            template
        });

        if (req.query.format === "html") {
            res.setHeader("Content-Type", "text/html");
            return res.send(htmlContent);
        }

        return res.status(200).json({
            message: "Resume preview generated successfully",
            template,
            html: htmlContent,
            resumeData
        });
    } catch (err) {
        console.error("Resume preview error:", err);
        return res.status(500).json({
            message: err.message || "Failed to generate resume preview"
        });
    }
}

/**
 * @description controller to generate strictly 1-page resume PDF based on chosen template
 */
async function generateResumePdfController(req, res) {
    try {
        const { interviewReportId } = req.params;
        const interviewReport = await interviewReportModel.findOne({
            _id: interviewReportId,
            user: req.user.id
        });

        if (!interviewReport) {
            return res.status(404).json({
                message: "Interview report not found"
            });
        }

        const template = req.query.template || req.body?.template || "harvard";
        const { resume, jobDescription, selfDescription } = interviewReport;

        const { pdfBuffer } = await generateResumepdf({
            resume,
            jobDescription,
            selfDescription,
            template
        });

        res.setHeader("Content-Type", "application/pdf");
        res.setHeader("Content-Disposition", `attachment; filename="resume_${template}_${interviewReportId}.pdf"`);
        return res.send(Buffer.from(pdfBuffer));
    } catch (err) {
        console.error("Resume PDF generation error:", err);
        res.status(500).json({
            message: err.message || "Failed to generate resume PDF"
        });
    }
}

module.exports = {
    generateInterViewReportController,
    getInterviewReportByIdController,
    getAllInterviewReportController,
    getResumeTemplatesController,
    getResumePreviewController,
    generateResumePdfController
};
