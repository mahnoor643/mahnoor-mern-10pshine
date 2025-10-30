import React from 'react'

const NotesCard = ({
    title,
    content,
    tags = [],
    onEdit,
    onDelete,
    onArchive,
    created,
    updated,
    isLocked,
    isArchived,
}) => {
    return (
        <div className="card note-card p-3 h-100 shadow-sm border-0">
            {/* Header */}
            <div className="note-header mb-3 d-flex justify-content-between align-items-start">
                <div className="flex-grow-1">
                    <h6 className="note-title text-truncate fw-semibold mb-2">{title}</h6>

                    {/* Tags */}
                    <div className="d-flex flex-wrap gap-1">
                        {tags.map((tag, index) => (
                            <span key={index} className="badge note-tag">
                                {tag}
                            </span>
                        ))}
                    </div>
                </div>

                {/* Icons */}
                <div className="d-flex align-items-center gap-2 ms-2">
                    {isLocked && <i className="bi bi-lock small text-secondary"></i>}

                    {/* Icons */}
                    {/* 🗃️ Archive Icon — only visible if NOT archived */}
                    {!isArchived && (
                        <i
                            className="bi bi-archive text-secondary cursor-pointer small"
                            onClick={onArchive}
                            title="Archive Note"
                            role="button"
                        ></i>
                    )}

                    <i
                        className="bi bi-pencil text-warning cursor-pointer small"
                        onClick={onEdit}
                        title="Edit Note"
                        role="button"
                    ></i>
                    <i
                        className="bi bi-trash text-danger cursor-pointer small"
                        onClick={onDelete}
                        title="Delete Note"
                        role="button"
                    ></i>
                </div>

            </div>

            {/* Content Preview */}
            <div className="note-preview mb-3">{content}</div>

            {/* Footer */}
            <div className="note-footer small text-muted mt-auto">
                <div>Created: {created}</div>
                <div>Updated: {updated}</div>
            </div>
        </div>
    );
};


export default NotesCard