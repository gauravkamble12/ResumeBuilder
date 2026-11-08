import { api } from "../../../services/api";

/**
 * @description service to generate interview report based on user self declaration, resume and job description
 */
export const generateInterviewReport = async ({ jobDescription, selfDescription, resumeFile }) => {
    const formData = new FormData();
    formData.append("jobDescription", jobDescription);
    formData.append("selfDescription", selfDescription);
    if (resumeFile) {
        formData.append("resume", resumeFile);
    }

    const response = await api.post("/api/interview/", formData);
    return response.data;
};

/** 
 * @description service to get interview report by interviewid
 */
export const getInterviewReportByID = async (interviewId) => {
    const response = await api.get(`/api/interview/report/${interviewId}`);
    return response.data;
};

/**
 * @description service to get all interview reports of logged in user
 */
export const getAllInterviewReports = async () => {
    const response = await api.get("/api/interview/");
    return response.data;
};

/**
 * @description service to get available industry-standard resume templates
 */
export const getResumeTemplates = async () => {
    const response = await api.get("/api/interview/resume/templates");
    return response.data;
};

/**
 * @description service to download generated strictly 1-page resume PDF for an interview report
 */
export const getResumePdf = async (interviewReportId, template = "harvard") => {
    const response = await api.get(`/api/interview/resume/pdf/${interviewReportId}?template=${template}`, {
        responseType: "blob"
    });
    return response.data;
};

/**
 * @description service to fetch resume HTML preview
 */
export const getResumePreview = async (interviewReportId, template = "harvard") => {
    const response = await api.get(`/api/interview/resume/preview/${interviewReportId}?template=${template}`);
    return response.data;
};
