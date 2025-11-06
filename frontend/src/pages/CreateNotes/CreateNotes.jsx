import React, { useState } from 'react'
import Sidebar from '../Dashboard/Sidebar'
import Navbar from '../Dashboard/Navbar'
import AdvancedNoteEditor from './RichNoteEditor'
import "../CreateNotes/CreateNotes.css"

const CreateNotes = () => {
   
    return (
        <>
            <Navbar />
            <div className="container-fluid">
                <div className="row">
                    <Sidebar />

                    <main className="col-lg-10 col-12 p-4 d-flex flex-column" style={{ minHeight: "calc(100vh - 75px)" }}>
                        
                        <div className="bg-white rounded-4 shadow-sm p-4 flex-grow-1">
                            <AdvancedNoteEditor mode="create"/>
                        </div>
                    </main>

                </div>
            </div>
        </>
    )
}

export default CreateNotes