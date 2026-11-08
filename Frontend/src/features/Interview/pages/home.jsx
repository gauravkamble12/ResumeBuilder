import { useState, useRef, useEffect } from "react"
import { useAuth } from "../../auth/hooks/useAuth"
import "../style/home.scss"
import { useInterview } from "../hooks/useInterview"
import { useNavigate } from "react-router"

export const Home = () => {
  const { user, handleLogout } = useAuth()
  const [jobDescription, setJobDescription] = useState("")
  const [selfDescription, setSelfDescription] = useState("")
  const [resume, setResume] = useState(null)
  const [error, setError] = useState("")
  const { loading, generateReport, reports, getReports } = useInterview()
  const resumeInputRef = useRef()
  const navigate = useNavigate()

  useEffect(() => {
    getReports()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const handleGenerateReport = async () => {
    setError("")
    const resumeFile = resumeInputRef.current?.files?.[0] || resume

    if (!jobDescription.trim()) {
      setError("Please provide a target job description.")
      return
    }

    if (!resumeFile && !selfDescription.trim()) {
      setError("Please provide either a resume or a self-description.")
      return
    }

    try {
      const data = await generateReport({ jobDescription, selfDescription, resumeFile })
      if (data?._id) {
        navigate(`/interview/${data._id}`)
      }
    } catch (err) {
      setError(err?.response?.data?.message || err?.message || "Failed to generate interview plan.")
    }
  }

  if (loading) {
    return (
      <main className="interview-home">
        <div className="loading-card-wrap">
          <div className="spinner" />
          <h2>Preparing Your Interview Plan</h2>
          <p>Analyzing job requirements, evaluating your profile, and crafting questions & roadmaps...</p>
          <span className="loading-pulse">This might take 10-15 seconds</span>
        </div>
      </main>
    )
  }

  return (
    <main className="interview-home">
      <header className="interview-header">
        <div className="top-bar">
          {user && (
            <span className="user-greeting">
              Welcome, <strong>{user.username}</strong>
            </span>
          )}
          <button className="logout-button" type="button" onClick={handleLogout}>
            Log out
          </button>
        </div>
        <span className="interview-eyebrow">YOUR NEXT OPPORTUNITY STARTS HERE</span>
        <h1>
          Create Your Custom <span>Interview Plan</span>
        </h1>
        <p>
          Let our AI analyze the job requirements and your unique profile to build a
          winning strategy.
        </p>
        <span className="header-indicator" aria-hidden="true" />
      </header>

      <section className="interview-card" aria-label="Interview plan details">
        <div className="job-description-panel">
          <label className="panel-title" htmlFor="jobDescription">
            <span className="title-icon job-icon" aria-hidden="true">▰</span>
            Target Job Description
            <span className="required-badge">REQUIRED</span>
          </label>
          <textarea
            id="jobDescription"
            name="jobDescription"
            maxLength={5000}
            value={jobDescription}
            onChange={(event) => setJobDescription(event.target.value)}
            placeholder={"Paste the full job description here...\ne.g. “Senior Frontend Engineer at Google requires proficiency in React, TypeScript, and large-scale system design...”"}
          />
          <span className="character-count">{jobDescription.length} / 5000 chars</span>
        </div>

        <div className="profile-panel">
          <h2 className="panel-title">
            <span className="title-icon profile-icon" aria-hidden="true">♟</span>
            Your Profile
          </h2>

          <div className="resume-field">
            <div className="field-label">
              <span>Upload Resume <span>(Optional)</span></span>
              {resume && (
                <button
                  type="button"
                  className="clear-resume-button"
                  onClick={() => {
                    setResume(null)
                    if (resumeInputRef.current) resumeInputRef.current.value = ""
                  }}
                >
                  Remove file
                </button>
              )}
            </div>
            <label className="resume-dropzone" htmlFor="resume">
              <span className="upload-icon" aria-hidden="true">↑</span>
              <strong>{resume ? resume.name : "Click to upload or drag & drop"}</strong>
              <span>PDF or DOCX, Max 5MB</span>
            </label>
            <input
              ref={resumeInputRef}
              className="resume-input"
              type="file"
              name="resume"
              id="resume"
              accept=".pdf,.doc,.docx"
              onChange={(event) => setResume(event.target.files?.[0] ?? null)}
            />
          </div>

          <div className="form-divider"><span>OR</span></div>

          <div className="self-description-field">
            <label className="field-label" htmlFor="selfDescription">
              Quick Self-Description
            </label>
            <textarea
              id="selfDescription"
              name="selfDescription"
              maxLength={2000}
              value={selfDescription}
              onChange={(event) => setSelfDescription(event.target.value)}
              placeholder="Briefly describe your experience, key skills, and areas of expertise. If you don’t have a resume handy..."
            />
          </div>

          <p className="form-hint">
            <span aria-hidden="true">i</span>
            Either a Resume or a Self-Description is required to generate a
            personalized plan.
          </p>

          {error && <p style={{ color: "#ef4444", fontSize: "0.9rem", margin: "0.5rem 0" }}>{error}</p>}

          <button 
            onClick={handleGenerateReport} 
            className="generate-button" 
            type="button"
            disabled={loading}
          >
            {loading ? "Generating Plan..." : "Generate My Interview Plan"} <span aria-hidden="true">→</span>
          </button>
        </div>
      </section>

      {/* Previous Reports History */}
      {reports && reports.length > 0 && (
        <section className="recent-reports-section" aria-label="Recent interview reports">
          <div className="section-header">
            <h2>
              <span className="history-icon" aria-hidden="true">⏱</span>
              Recent Interview Plans
            </h2>
            <span className="report-count">{reports.length} report{reports.length > 1 ? "s" : ""}</span>
          </div>

          <div className="reports-grid">
            {reports.map((report) => {
              const score = report.matchScore ?? 0
              const badgeClass = score >= 80 ? "high" : score >= 60 ? "mid" : "low"
              return (
                <div
                  key={report._id}
                  className="report-card"
                  onClick={() => navigate(`/interview/${report._id}`)}
                  role="button"
                  tabIndex={0}
                  onKeyDown={(e) => { if (e.key === 'Enter') navigate(`/interview/${report._id}`) }}
                >
                  <div className="report-card-top">
                    <h3>{report.title || "Interview Report"}</h3>
                    <span className={`match-badge ${badgeClass}`}>{score}% Match</span>
                  </div>
                  <div className="report-card-bottom">
                    <span>{report.createdAt ? new Date(report.createdAt).toLocaleDateString() : ""}</span>
                    <span className="view-btn">View Plan →</span>
                  </div>
                </div>
              )
            })}
          </div>
        </section>
      )}
    </main>
  )
}
