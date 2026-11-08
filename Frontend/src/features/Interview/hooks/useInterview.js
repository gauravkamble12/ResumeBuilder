import {
    getAllInterviewReports,
    generateInterviewReport,
    getInterviewReportByID,
    getResumePdf as getResumePdfApi,
    getResumeTemplates as getResumeTemplatesApi,
    getResumePreview as getResumePreviewApi
} from "../services/interview.api";
import { useContext, useState } from "react";
import { InterviewContext } from "../interview.context";

export const useInterview = () => {
    const context = useContext(InterviewContext);
    if (!context) {
        throw new Error("useInterview must be used within an InterviewProvider");
    }

    const { loading, setloading, report, setreport, reports, setreports } = context;
    const [downloadingPdf, setDownloadingPdf] = useState(false);
    const [previewLoading, setPreviewLoading] = useState(false);

    const generateReport = async ({ jobDescription, selfDescription, resumeFile }) => {
        setloading(true);
        try {
            const data = await generateInterviewReport({ jobDescription, selfDescription, resumeFile });
            const createdReport = data?.interviewReport || data?.InterviewReport || data;
            setreport(createdReport);
            return createdReport;
        } catch (err) {
            console.error("Error generating report:", err);
            throw err;
        } finally {
            setloading(false);
        }
    };

    const getReportById = async (interviewId) => {
        setloading(true);
        try {
            const data = await getInterviewReportByID(interviewId);
            const fetchedReport = data?.interviewReport || data?.InterviewReport || data;
            setreport(fetchedReport);
            return fetchedReport;
        } catch (err) {
            console.error("Error fetching report by ID:", err);
            throw err;
        } finally {
            setloading(false);
        }
    };

    const getReports = async () => {
        try {
            const data = await getAllInterviewReports();
            const fetchedReports = data?.interviewReports || data?.InterviewReports || [];
            setreports(fetchedReports);
            return fetchedReports;
        } catch (err) {
            console.error("Error fetching interview reports:", err);
            return [];
        }
    };

    const getResumeTemplates = async () => {
        try {
            const data = await getResumeTemplatesApi();
            return data?.templates || [];
        } catch (err) {
            console.error("Error fetching templates:", err);
            return [];
        }
    };

    const getResumePreview = async (interviewId, template = "harvard") => {
        setPreviewLoading(true);
        try {
            const data = await getResumePreviewApi(interviewId, template);
            return data;
        } catch (err) {
            console.error("Error fetching resume preview:", err);
            throw err;
        } finally {
            setPreviewLoading(false);
        }
    };

    const getResumePdf = async (interviewId, template = "harvard") => {
        setDownloadingPdf(true);
        try {
            const blobData = await getResumePdfApi(interviewId, template);
            const blob = new Blob([blobData], { type: "application/pdf" });
            const downloadUrl = window.URL.createObjectURL(blob);
            const link = document.createElement("a");
            link.href = downloadUrl;
            link.setAttribute("download", `resume_${template}_${interviewId}.pdf`);
            document.body.appendChild(link);
            link.click();
            link.parentNode.removeChild(link);
            window.URL.revokeObjectURL(downloadUrl);
            return true;
        } catch (err) {
            console.error("Error downloading resume PDF:", err);
            throw err;
        } finally {
            setDownloadingPdf(false);
        }
    };

    return {
        loading,
        downloadingPdf,
        previewLoading,
        report,
        reports,
        generateReport,
        getReportById,
        getReports,
        getResumeTemplates,
        getResumePreview,
        getResumePdf
    };
};
