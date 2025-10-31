import React, { useState } from 'react'
import Sidebar from '../Dashboard/Sidebar'
import Navbar from '../Dashboard/Navbar'
import "../Locked/Locked.css"
import SecretNoteCard from './SecretNoteCard'
import UnlockModal from './UnlockModal'

const Locked = () => {
    const [showUnlock, setShowUnlock] = useState(false);

    const handleUnlock = (enteredPassword) => {
        if (enteredPassword === "12345") {
            alert("✅ Unlocked successfully!");
            setShowUnlock(false);
        } else {
            alert("❌ Incorrect password!");
        }
    };
    return (
        <>
            <Navbar />
            <div className="container-fluid">
                <div className="row">

                    <Sidebar />

                    <main className="col-lg-10 col-12 p-4" style={{ minHeight: "calc(100vh - 75px)" }}>
                        <div className="row g-4">

                            <div className="col-lg-4 col-md-6 col-12">
                                <SecretNoteCard title="My first secret note..." />
                            </div>
                            <div className="col-lg-4 col-md-6 col-12">
                                <SecretNoteCard title="My first secret note..." />
                            </div>

                            <div className="col-lg-4 col-md-6 col-12">
                                <SecretNoteCard title="My first secret note..." />
                            </div>

                            <div className="col-lg-4 col-md-6 col-12">
                                <SecretNoteCard title="My first secret note..." />
                            </div>

                        </div>

                    </main>
                </div>
            </div>

            {/* 🔐 Password Modal */}
            <UnlockModal
                show={showUnlock}
                onClose={() => setShowUnlock(false)}
                onUnlock={handleUnlock}
            />
        </>
    )
}

export default Locked