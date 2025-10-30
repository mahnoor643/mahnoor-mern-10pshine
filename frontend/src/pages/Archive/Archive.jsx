import React from 'react'
import Sidebar from '../Dashboard/Sidebar'
import Navbar from '../Dashboard/Navbar'
import NotesCard from '../Notes/NotesCard'

const Archive = () => {
  return (
     <>
            <Navbar />
            <div className="container-fluid">
                <div className="row">
                    
                <Sidebar/>

                    <main className="col-lg-10 col-12 p-4"  style={{ minHeight: "calc(100vh - 75px)" }}>
                         <div className="row g-4">

                            <div className="col-lg-4 col-md-6 col-12">
                                <NotesCard
                                    title="Weekly Report"
                                    content="This week we focused on improving the dashboard UI and enhancing API performance. The new caching mechanism reduced load time by 45%. We also added better error handling for user feedback..."
                                    tags={["Work", "Update"]}
                                    created="Oct 25, 2025, 10:00 AM"
                                    updated="Oct 27, 2025, 05:15 PM"
                                    isLocked={false}
                                    isArchived={false}
                                    onArchive={() => console.log("Archived!")}
                                    onEdit={() => console.log("Edit clicked")}
                                    onDelete={() => console.log("Deleted!")}
                                />


                            </div>
                            {/* <div className="col-lg-4 col-md-6 col-12">
                                <SecretNoteCard title="My first secret note..." />
                            </div>

                            <div className="col-lg-4 col-md-6 col-12">
                                <SecretNoteCard title="My first secret note..." />
                            </div>

                            <div className="col-lg-4 col-md-6 col-12">
                                <SecretNoteCard title="My first secret note..." />
                            </div> */}

                        </div>
                    </main>
                </div>
            </div>
        </>
  )
}

export default Archive