const express = require("express");
const authMiddleware = require("../middleware/auth.middleware");
const interviewRouter = express.Router();
const interviewController = require("../controller/interview.controller");
const upload = require("../middleware/file.middleware");

/**
 * @route POST /api/interview/
 * @description generate new interview report on the basis of user self description, resume pdf and job description
 * @access private
 */
interviewRouter.post("/", authMiddleware.authUser, upload.single("resume"), interviewController.generateInterViewReportController);

/**
 * @route GET /api/interview/resume/templates
 * @description get list of available ATS resume templates
 * @access private
 */
interviewRouter.get("/resume/templates", authMiddleware.authUser, interviewController.getResumeTemplatesController);

/**
 * @route GET /api/interview/resume/preview/:interviewReportId
 * @description get rendered resume HTML preview for the chosen template
 * @access private
 */
interviewRouter.get("/resume/preview/:interviewReportId", authMiddleware.authUser, interviewController.getResumePreviewController);

/**
 * @route GET /api/interview/report/:interviewId
 * @description get interview report by interviewId
 * @access private
 */
interviewRouter.get("/report/:interviewId", authMiddleware.authUser, interviewController.getInterviewReportByIdController);

/**
 * @route GET /api/interview/
 * @description get all interview reports of logged in user
 * @access private
 */
interviewRouter.get("/", authMiddleware.authUser, interviewController.getAllInterviewReportController);

/**
 * @route GET/POST /api/interview/resume/pdf/:interviewReportId
 * @description generate strictly 1-page pdf on the basis of user self description, resume content and job description using selected template
 * @access private 
 */
interviewRouter.get("/resume/pdf/:interviewReportId", authMiddleware.authUser, interviewController.generateResumePdfController);
interviewRouter.post("/resume/pdf/:interviewReportId", authMiddleware.authUser, interviewController.generateResumePdfController);

module.exports = interviewRouter;
