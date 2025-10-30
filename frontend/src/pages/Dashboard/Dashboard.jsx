import React from 'react'
import "../Dashboard/Dashboard.css"
import Navbar from './Navbar'
import Sidebar from './Sidebar'

const Dashboard = () => {
    return (
        <>
            <Navbar />
            <div className="container-fluid">
                <div className="row" >

                    <Sidebar />

                    <main className="col-lg-10 col-12 p-4" style={{ minHeight: "calc(100vh - 75px)" }}>
                        <div className="container-fluid bg-light p-5 rounded shadow-sm">
                            {/* 🏠 Dashboard Header */}
                            <div className="d-flex flex-wrap justify-content-between align-items-center mb-4">
                                <div>
                                    <h1 className="fw-bold mb-0 text-green">Welcome to Noteverse</h1>
                                    <p className="text-muted mb-0">
                                        Your personal space to create, lock, and organize notes.
                                    </p>
                                </div>
                                <button className="btn green-btn w-25 d-flex align-items-center gap-2 mt-3 mt-sm-0">
                                    <i className="bi bi-plus-lg"></i> Create New Note
                                </button>
                            </div>

                            {/* 📊 Stats Section */}
                            <div className="row g-3 mb-5">
                                <div className="col-md-4 col-sm-6">
                                    <div className="card bg-card shadow-sm border-0 text-center p-4 h-100">
                                        <i className="bi bi-journal-text fs-2 text-primary mb-2"></i>
                                        <h6 className="fw-semibold mb-0">Total Notes</h6>
                                        <p className="text-muted small mb-0">128 Notes</p>
                                    </div>
                                </div>
                                <div className="col-md-4 col-sm-6">
                                    <div className="card bg-card shadow-sm border-0 text-center p-4 h-100">
                                        <i className="bi bi-lock-fill fs-2 text-danger mb-2"></i>
                                        <h6 className="fw-semibold mb-0">Locked Notes</h6>
                                        <p className="text-muted small mb-0">32 Secured</p>
                                    </div>
                                </div>
                                <div className="col-md-4 col-sm-6">
                                    <div className="card bg-card shadow-sm border-0 text-center p-4 h-100">
                                        <i className="bi bi-archive-fill fs-2 text-secondary mb-2"></i>
                                        <h6 className="fw-semibold mb-0">Archived Notes</h6>
                                        <p className="text-muted small mb-0">15 Archived</p>
                                    </div>
                                </div>
                            </div>

                            {/* 📝 Recent Notes Section */}
                            <div className="d-flex justify-content-between align-items-center mb-3">
                                <h5 className="fw-semibold mb-0">Recent Notes</h5>
                                <a
                                    href="#"
                                    className="text-decoration-none small text-green fw-semibold"
                                >
                                    View All <i className="bi bi-arrow-right"></i>
                                </a>
                            </div>

                            <div className="row g-3">
                                <div className="col-md-4 col-sm-6">
                                    <div className="card bg-card border-0 shadow-sm p-3 h-100">
                                        <h6 className="fw-semibold text-truncate mb-1">Meeting Notes</h6>
                                        <p className="text-muted small mb-2 text-truncate">
                                            Discussed quarterly roadmap and product updates...
                                        </p>
                                        <div className="d-flex justify-content-between align-items-center small text-muted">
                                            <span>
                                                <i className="bi bi-clock"></i> Oct 25, 2025
                                            </span>
                                            <span className="badge bg-light text-dark border">Work</span>
                                        </div>
                                    </div>
                                </div>

                                <div className="col-md-4 col-sm-6">
                                    <div className="card bg-card border-0 shadow-sm p-3 h-100">
                                        <h6 className="fw-semibold text-truncate mb-1">Personal Goals</h6>
                                        <p className="text-muted small mb-2 text-truncate">
                                            Set daily writing and reading goals for November...
                                        </p>
                                        <div className="d-flex justify-content-between align-items-center small text-muted">
                                            <span>
                                                <i className="bi bi-clock"></i> Oct 20, 2025
                                            </span>
                                            <span className="badge bg-light text-dark border">Personal</span>
                                        </div>
                                    </div>
                                </div>

                                <div className="col-md-4 col-sm-6">
                                    <div className="card bg-card border-0 shadow-sm p-3 h-100">
                                        <h6 className="fw-semibold text-truncate mb-1">Project Ideas</h6>
                                        <p className="text-muted small mb-2 text-truncate">
                                            AI-powered note organizer concept for Noteverse...
                                        </p>
                                        <div className="d-flex justify-content-between align-items-center small text-muted">
                                            <span>
                                                <i className="bi bi-clock"></i> Oct 18, 2025
                                            </span>
                                            <span className="badge bg-light text-dark border">Ideas</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                    </main>
                </div>
            </div>
        </>
    )
}

export default Dashboard