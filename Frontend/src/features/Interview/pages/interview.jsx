import { useState, useEffect } from 'react'
import '../style/interview.scss'
import { useInterview } from '../hooks/useInterview.js'
import { useParams, useNavigate } from 'react-router'

const NAV_ITEMS = [
    { id: 'technical', label: 'Technical Questions', icon: (<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="16 18 22 12 16 6" /><polyline points="8 6 2 12 8 18" /></svg>) },
    { id: 'behavioral', label: 'Behavioral Questions', icon: (<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" /></svg>) },
    { id: 'roadmap', label: 'Road Map', icon: (<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="3 11 22 2 13 21 11 13 3 11" /></svg>) },
]

const RESUME_TEMPLATES = [
    {
        id: 'harvard',
        name: 'Harvard ATS Classic',
        tagline: 'Universally preferred by Fortune 500, FAANG & Top Firms',
        badge: 'Recommended #1',
        badgeType: 'rec',
        atsScore: '99% ATS Pass Rate',
        desc: 'The gold standard single-column Ivy League format. Standard reverse-chronological order, standard typography, 100% parse accuracy across Taleo, Workday & Greenhouse.'
    },
    {
        id: 'modern',
        name: 'Silicon Valley Modern Tech',
        tagline: 'Best for Software Engineers, Full-Stack Devs & Startups',
        badge: 'Tech Standard',
        badgeType: 'tech',
        atsScore: '98% ATS Pass Rate',
        desc: 'Modern crisp layout with sleek slate accents, Google XYZ formula impact bullets, and categorized developer skill blocks.'
    },
    {
        id: 'executive',
        name: 'Executive Minimalist',
        tagline: 'Best for Senior, Corporate, Management & Leadership Roles',
        badge: 'Corporate Choice',
        badgeType: 'corp',
        atsScore: '99% ATS Pass Rate',
        desc: 'Minimalist executive aesthetic featuring a tailored Executive Summary aligning leadership experience with target company objectives.'
    },
    {
        id: 'compact',
        name: 'Clean High-Density ATS',
        tagline: 'Maximizes Space for Heavy Technical Portfolios',
        badge: 'High Density',
        badgeType: 'dense',
        atsScore: '97% ATS Pass Rate',
        desc: 'Ultra-compact single-page layout engineered for rich technical projects, internships, and extensive developer toolsets.'
    }
]

// ── Sub-components ────────────────────────────────────────────────────────────
const QuestionCard = ({ item, index }) => {
    const [ open, setOpen ] = useState(false)
    return (
        <div className='q-card'>
            <div className='q-card__header' onClick={() => setOpen(o => !o)}>
                <span className='q-card__index'>Q{index + 1}</span>
                <p className='q-card__question'>{item.question}</p>
                <span className={`q-card__chevron ${open ? 'q-card__chevron--open' : ''}`}>
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="6 9 12 15 18 9" /></svg>
                </span>
            </div>
            {open && (
                <div className='q-card__body'>
                    <div className='q-card__section'>
                        <span className='q-card__tag q-card__tag--intention'>Intention</span>
                        <p>{item.intention}</p>
                    </div>
                    <div className='q-card__section'>
                        <span className='q-card__tag q-card__tag--answer'>Model Answer</span>
                        <p>{item.answer}</p>
                    </div>
                </div>
            )}
        </div>
    )
}

const RoadMapDay = ({ day }) => (
    <div className='roadmap-day'>
        <div className='roadmap-day__header'>
            <span className='roadmap-day__badge'>Day {day.day}</span>
            <h3 className='roadmap-day__focus'>{day.focus}</h3>
        </div>
        <ul className='roadmap-day__tasks'>
            {(day.tasks || []).map((task, i) => (
                <li key={i}>
                    <span className='roadmap-day__bullet' />
                    {task}
                </li>
            ))}
        </ul>
    </div>
)

// ── Main Component ────────────────────────────────────────────────────────────
export const Interview = () => {
    const [ activeNav, setActiveNav ] = useState('technical')
    const [ showResumeModal, setShowResumeModal ] = useState(false)
    const [ selectedTemplate, setSelectedTemplate ] = useState('harvard')
    const [ previewHtml, setPreviewHtml ] = useState('')
    const [ previewError, setPreviewError ] = useState('')
    const [ downloadError, setDownloadError ] = useState('')
    const [ downloadSuccess, setDownloadSuccess ] = useState(false)

    const {
        report,
        getReportById,
        loading,
        downloadingPdf,
        previewLoading,
        getResumePdf,
        getResumePreview
    } = useInterview()

    const { interviewId } = useParams()
    const navigate = useNavigate()

    useEffect(() => {
        if (interviewId) {
            getReportById(interviewId)
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [ interviewId ])

    const handleOpenModal = () => {
        setShowResumeModal(true)
        setDownloadError('')
        setPreviewError('')
    }

    const handleCloseModal = () => {
        setShowResumeModal(false)
        setPreviewHtml('')
        setDownloadError('')
        setPreviewError('')
    }

    const handleDownloadResume = async (templateId = selectedTemplate) => {
        setDownloadError('')
        setDownloadSuccess(false)
        try {
            await getResumePdf(interviewId, templateId)
            setDownloadSuccess(true)
            setTimeout(() => setDownloadSuccess(false), 5000)
        } catch (err) {
            const rawMsg = err?.response?.data?.message || err?.message || ''
            if (rawMsg.includes('high demand') || rawMsg.includes('quota') || rawMsg.includes('RESOURCE_EXHAUSTED')) {
                setDownloadError('AI model is experiencing peak demand right now. Automatic retry and failover initiated. Please click Retry.')
            } else {
                setDownloadError(rawMsg || 'Failed to generate resume PDF. Please try again.')
            }
        }
    }

    const handlePreviewResume = async (templateId = selectedTemplate) => {
        setPreviewError('')
        setPreviewHtml('')
        try {
            const data = await getResumePreview(interviewId, templateId)
            if (data?.html) {
                setPreviewHtml(data.html)
            }
        } catch (err) {
            const rawMsg = err?.response?.data?.message || err?.message || ''
            if (rawMsg.includes('high demand') || rawMsg.includes('quota') || rawMsg.includes('RESOURCE_EXHAUSTED')) {
                setPreviewError('AI model is experiencing peak traffic. Please click Preview again to retry.')
            } else {
                setPreviewError(rawMsg || 'Failed to load resume preview.')
            }
        }
    }

    if (loading || !report) {
        return (
            <main className='loading-screen'>
                <h1>Loading your interview plan...</h1>
            </main>
        )
    }

    const technicalQuestions = report.technicalQuestions || []
    const behavioralQuestions = report.behavioralQuestions || report.behaviouralQuestions || []
    const preparationPlan = report.preparationPlan || []
    const skillGaps = report.skillGaps || []

    const scoreColor =
        (report.matchScore ?? 0) >= 80 ? 'score--high' :
            (report.matchScore ?? 0) >= 60 ? 'score--mid' : 'score--low'

    return (
        <div className='interview-page'>
            <div className='interview-layout'>

                {/* ── Left Nav ── */}
                <nav className='interview-nav'>
                    <div className="nav-content">
                        <button
                            type="button"
                            onClick={() => navigate('/')}
                            className="interview-nav__item"
                            style={{ marginBottom: '1rem', border: '1px solid rgba(255, 255, 255, 0.1)', cursor: 'pointer' }}
                        >
                            <span className="interview-nav__icon">
                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <line x1="19" y1="12" x2="5" y2="12"></line>
                                    <polyline points="12 19 5 12 12 5"></polyline>
                                </svg>
                            </span>
                            Back to Home
                        </button>

                        <p className='interview-nav__label'>Sections</p>
                        {NAV_ITEMS.map(item => (
                            <button
                                key={item.id}
                                className={`interview-nav__item ${activeNav === item.id ? 'interview-nav__item--active' : ''}`}
                                onClick={() => setActiveNav(item.id)}
                            >
                                <span className='interview-nav__icon'>{item.icon}</span>
                                {item.label}
                            </button>
                        ))}
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', marginTop: 'auto' }}>
                        <button
                            type="button"
                            onClick={handleOpenModal}
                            disabled={downloadingPdf}
                            className='button primary-button'
                            style={{
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                opacity: downloadingPdf ? 0.75 : 1,
                                cursor: downloadingPdf ? 'wait' : 'pointer',
                                width: '100%',
                                gap: '0.4rem',
                                padding: '0.75rem 0.6rem'
                            }}
                        >
                            <svg height="0.9rem" width="0.9rem" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
                                <path d="M10.6144 17.7956 11.492 15.7854C12.2731 13.9966 13.6789 12.5726 15.4325 11.7942L17.8482 10.7219C18.6162 10.381 18.6162 9.26368 17.8482 8.92277L15.5079 7.88394C13.7092 7.08552 12.2782 5.60881 11.5105 3.75894L10.6215 1.61673C10.2916.821765 9.19319.821767 8.8633 1.61673L7.97427 3.75892C7.20657 5.60881 5.77553 7.08552 3.97685 7.88394L1.63658 8.92277C.868537 9.26368.868536 10.381 1.63658 10.7219L4.0523 11.7942C5.80589 12.5726 7.21171 13.9966 7.99275 15.7854L8.8704 17.7956C9.20776 18.5682 10.277 18.5682 10.6144 17.7956ZM19.4014 22.6899 19.6482 22.1242C20.0882 21.1156 20.8807 20.3125 21.8695 19.8732L22.6299 19.5353C23.0412 19.3526 23.0412 18.7549 22.6299 18.5722L21.9121 18.2532C20.8978 17.8026 20.0911 16.9698 19.6586 15.9269L19.4052 15.3156C19.2285 14.8896 18.6395 14.8896 18.4628 15.3156L18.2094 15.9269C17.777 16.9698 16.9703 17.8026 15.956 18.2532L15.2381 18.5722C14.8269 18.7549 14.8269 19.3526 15.2381 19.5353L15.9985 19.8732C16.9874 20.3125 17.7798 21.1156 18.2198 22.1242L18.4667 22.6899C18.6473 23.104 19.2207 23.104 19.4014 22.6899Z"></path>
                            </svg>
                            {downloadingPdf ? "Generating PDF..." : "Generate 1-Page Resume"}
                        </button>
                        <span style={{ fontSize: '0.68rem', color: '#7d8590', textAlign: 'center' }}>
                            Strictly 1-Page ATS Format
                        </span>
                        {downloadSuccess && (
                            <p style={{ color: "#3fb950", fontSize: "0.72rem", margin: "0.3rem 0 0", textAlign: "center" }}>
                                1-Page Resume downloaded!
                            </p>
                        )}
                    </div>
                </nav>

                <div className='interview-divider' />

                {/* ── Center Content ── */}
                <main className='interview-content'>
                    {activeNav === 'technical' && (
                        <section>
                            <div className='content-header'>
                                <h2>Technical Questions</h2>
                                <span className='content-header__count'>{technicalQuestions.length} questions</span>
                            </div>
                            <div className='q-list'>
                                {technicalQuestions.map((q, i) => (
                                    <QuestionCard key={i} item={q} index={i} />
                                ))}
                            </div>
                        </section>
                    )}

                    {activeNav === 'behavioral' && (
                        <section>
                            <div className='content-header'>
                                <h2>Behavioral Questions</h2>
                                <span className='content-header__count'>{behavioralQuestions.length} questions</span>
                            </div>
                            <div className='q-list'>
                                {behavioralQuestions.map((q, i) => (
                                    <QuestionCard key={i} item={q} index={i} />
                                ))}
                            </div>
                        </section>
                    )}

                    {activeNav === 'roadmap' && (
                        <section>
                            <div className='content-header'>
                                <h2>Preparation Road Map</h2>
                                <span className='content-header__count'>{preparationPlan.length}-day plan</span>
                            </div>
                            <div className='roadmap-list'>
                                {preparationPlan.map((day) => (
                                    <RoadMapDay key={day.day} day={day} />
                                ))}
                            </div>
                        </section>
                    )}
                </main>

                <div className='interview-divider' />

                {/* ── Right Sidebar ── */}
                <aside className='interview-sidebar'>

                    {/* Match Score */}
                    <div className='match-score'>
                        <p className='match-score__label'>Match Score</p>
                        <div className={`match-score__ring ${scoreColor}`}>
                            <span className='match-score__value'>{report.matchScore}</span>
                            <span className='match-score__pct'>%</span>
                        </div>
                        <p className='match-score__sub'>
                            {(report.matchScore ?? 0) >= 80 ? 'Strong match for this role' : (report.matchScore ?? 0) >= 60 ? 'Moderate match for this role' : 'Skill gaps identified'}
                        </p>
                    </div>

                    <div className='sidebar-divider' />

                    {/* Skill Gaps */}
                    <div className='skill-gaps'>
                        <p className='skill-gaps__label'>Skill Gaps</p>
                        <div className='skill-gaps__list'>
                            {skillGaps.map((gap, i) => (
                                <span key={i} className={`skill-tag skill-tag--${gap.severity}`}>
                                    {gap.skill}
                                </span>
                            ))}
                        </div>
                    </div>

                    <div className='sidebar-divider' />

                    {/* Quick Resume Generator Box */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem', background: '#1c2230', padding: '0.9rem', borderRadius: '0.6rem', border: '1px solid #2a3348' }}>
                        <span style={{ fontSize: '0.72rem', fontWeight: '700', color: '#ff2d78', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                            Recruiter Standard
                        </span>
                        <h4 style={{ margin: 0, fontSize: '0.88rem', color: '#e6edf3' }}>
                            Strict 1-Page Resume
                        </h4>
                        <p style={{ margin: 0, fontSize: '0.75rem', color: '#7d8590', lineHeight: 1.35 }}>
                            Choose from Harvard, Modern Tech, and Executive templates tailored specifically to this job.
                        </p>
                        <button
                            type="button"
                            onClick={handleOpenModal}
                            className="button"
                            style={{
                                marginTop: '0.2rem',
                                padding: '0.5rem 0.8rem',
                                fontSize: '0.8rem',
                                background: 'rgba(255, 45, 120, 0.15)',
                                color: '#ff2d78',
                                border: '1px solid rgba(255, 45, 120, 0.3)',
                                borderRadius: '0.4rem',
                                cursor: 'pointer',
                                fontWeight: '600'
                            }}
                        >
                            Select Template →
                        </button>
                    </div>

                </aside>
            </div>

            {/* ── Template Selector Modal ── */}
            {showResumeModal && (
                <div className="resume-modal-overlay" onClick={handleCloseModal}>
                    <div className="resume-modal" onClick={e => e.stopPropagation()}>
                        <div className="resume-modal__header">
                            <div>
                                <h2>
                                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#ff2d78" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                                        <polyline points="14 2 14 8 20 8"></polyline>
                                        <line x1="16" y1="13" x2="8" y2="13"></line>
                                        <line x1="16" y1="17" x2="8" y2="17"></line>
                                        <polyline points="10 9 9 9 8 9"></polyline>
                                    </svg>
                                    Choose Company-Standard Resume Template
                                </h2>
                                <p>
                                    Select the template most preferred by recruiters. Our AI strictly formats and fits all content onto <strong>strictly 1 page</strong>.
                                </p>
                            </div>
                            <button type="button" className="resume-modal__close" onClick={handleCloseModal} aria-label="Close modal">
                                &times;
                            </button>
                        </div>

                        <div className="resume-modal__body">
                            {/* Resilience & High-Demand Banner */}
                            <div className="resilience-banner">
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"></polygon>
                                </svg>
                                <span>
                                    <strong>AI Resilience Activated:</strong> Built with multi-model failover and auto-retry to prevent rate limit and high-demand interruptions.
                                </span>
                            </div>

                            {/* Template Cards Grid */}
                            <div className="template-grid">
                                {RESUME_TEMPLATES.map(tmpl => {
                                    const isSelected = selectedTemplate === tmpl.id
                                    return (
                                        <div
                                            key={tmpl.id}
                                            className={`template-card ${isSelected ? 'template-card--selected' : ''}`}
                                            onClick={() => {
                                                setSelectedTemplate(tmpl.id)
                                                if (previewHtml) {
                                                    handlePreviewResume(tmpl.id)
                                                }
                                            }}
                                        >
                                            <div className="template-card__header">
                                                <h3 className="template-card__title">{tmpl.name}</h3>
                                                <span className={`template-card__badge template-card__badge--${tmpl.badgeType}`}>
                                                    {tmpl.badge}
                                                </span>
                                            </div>
                                            <p className="template-card__tagline">{tmpl.tagline}</p>
                                            <p className="template-card__desc">{tmpl.desc}</p>
                                            <div className="template-card__meta">
                                                <span className="template-card__ats">
                                                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                                                        <polyline points="20 6 9 17 4 12"></polyline>
                                                    </svg>
                                                    {tmpl.atsScore}
                                                </span>
                                                <span className="template-card__page">Strict 1 Page</span>
                                            </div>
                                        </div>
                                    )
                                })}
                            </div>

                            {/* Error Alert with Retry */}
                            {(downloadError || previewError) && (
                                <div className="demand-error-card">
                                    <strong>Notice:</strong>
                                    <span>{downloadError || previewError}</span>
                                    <div className="demand-error-card__actions">
                                        <button
                                            type="button"
                                            onClick={() => handleDownloadResume(selectedTemplate)}
                                            style={{
                                                background: '#ff4d4d',
                                                color: '#fff',
                                                border: 'none',
                                                padding: '0.35rem 0.8rem',
                                                borderRadius: '0.3rem',
                                                cursor: 'pointer',
                                                fontSize: '0.75rem',
                                                fontWeight: '600'
                                            }}
                                        >
                                            Retry Download
                                        </button>
                                        <button
                                            type="button"
                                            onClick={() => handlePreviewResume(selectedTemplate)}
                                            style={{
                                                background: 'transparent',
                                                color: '#ff7b72',
                                                border: '1px solid #ff7b72',
                                                padding: '0.35rem 0.8rem',
                                                borderRadius: '0.3rem',
                                                cursor: 'pointer',
                                                fontSize: '0.75rem'
                                            }}
                                        >
                                            Retry Preview
                                        </button>
                                    </div>
                                </div>
                            )}

                            {/* HTML Live Preview Box */}
                            {previewHtml && (
                                <div className="resume-preview-box">
                                    <div className="resume-preview-box__top">
                                        <span>Live 1-Page Layout Preview ({selectedTemplate.toUpperCase()} Template)</span>
                                        <button
                                            type="button"
                                            onClick={() => setPreviewHtml('')}
                                            style={{ background: 'none', border: 'none', color: '#7d8590', cursor: 'pointer', fontSize: '0.75rem' }}
                                        >
                                            Close Preview
                                        </button>
                                    </div>
                                    <iframe
                                        className="resume-preview-box__iframe"
                                        title="Resume Preview"
                                        srcDoc={previewHtml}
                                        sandbox="allow-same-origin"
                                    />
                                </div>
                            )}
                        </div>

                        <div className="resume-modal__footer">
                            <div style={{ display: 'flex', gap: '0.6rem', alignItems: 'center' }}>
                                <button
                                    type="button"
                                    onClick={() => handlePreviewResume(selectedTemplate)}
                                    disabled={previewLoading || downloadingPdf}
                                    style={{
                                        background: 'transparent',
                                        border: '1px solid rgba(255, 255, 255, 0.2)',
                                        color: '#e6edf3',
                                        padding: '0.6rem 1.1rem',
                                        borderRadius: '0.5rem',
                                        cursor: (previewLoading || downloadingPdf) ? 'wait' : 'pointer',
                                        fontSize: '0.85rem',
                                        fontWeight: '500'
                                    }}
                                >
                                    {previewLoading ? 'Loading Preview...' : 'Preview Template'}
                                </button>
                                <span style={{ fontSize: '0.75rem', color: '#7d8590' }}>
                                    Selected: <strong>{RESUME_TEMPLATES.find(t => t.id === selectedTemplate)?.name}</strong>
                                </span>
                            </div>

                            <div style={{ display: 'flex', gap: '0.6rem' }}>
                                <button
                                    type="button"
                                    onClick={handleCloseModal}
                                    style={{
                                        background: 'transparent',
                                        border: 'none',
                                        color: '#7d8590',
                                        padding: '0.6rem 1rem',
                                        cursor: 'pointer',
                                        fontSize: '0.85rem'
                                    }}
                                >
                                    Cancel
                                </button>
                                <button
                                    type="button"
                                    onClick={() => handleDownloadResume(selectedTemplate)}
                                    disabled={downloadingPdf || previewLoading}
                                    className="button primary-button"
                                    style={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: '0.4rem',
                                        padding: '0.6rem 1.3rem',
                                        cursor: downloadingPdf ? 'wait' : 'pointer',
                                        opacity: downloadingPdf ? 0.75 : 1
                                    }}
                                >
                                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                        <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                                        <polyline points="7 10 12 15 17 10"></polyline>
                                        <line x1="12" y1="15" x2="12" y2="3"></line>
                                    </svg>
                                    {downloadingPdf ? 'Generating 1-Page PDF...' : 'Download 1-Page PDF'}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}

export default Interview
