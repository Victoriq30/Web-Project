import React, { useState, useEffect } from 'react';
import {
    ALL_STATUSES, STATUS_DISPLAY_NAMES, ALL_PRIORITIES, PRIORITY_DISPLAY_NAMES,
    formatDate, StatusBadge, PriorityIndicator, TagsDisplay,
    formatDateToInput, parseDateFromInput, CommentsDisplay, AttachmentsDisplay
} from './Helpers';
import './TicketDetails.css';

// Sample data 
const initialTicketData = {
    id: '6622484e1234567890abcdef',
    title: 'Грешка при качване на профилна снимка',
    description: 'Когато потребител се опита да качи профилна снимка по-голяма от 2MB, получава неясна грешка "Error 500", вместо съобщение за максимален размер.',
    status: 'Open', 
    priority: 'Medium', 
    assigneeId: '662247a0fedcba9876543210',
    assigneeName: 'Иван Петров',
    projectId: '662246d9abcdef0123456789',
    createdById: '662247a0fedcba9876543210',
    createdByName: 'Борислава Станчева',
    createdAt: new Date(2025, 3, 4, 10, 30, 0), 
    updatedAt: new Date(2025, 3, 5, 9, 0, 0),
    dueDate: new Date(2025, 4, 15), 
    comments: [
        { id: 'c1', author: { FullName: 'Петър Стоянов' }, text: 'Това е критично за новите потребители.', createdAt: new Date(2025, 3, 4, 11, 0, 0), UpdatedAt: new Date(2025, 3, 4, 11, 0, 0) },
        { id: 'c2', author: { FullName: 'Иван Петров' }, text: 'Съгласен, ще го погледна днес.', createdAt: new Date(2025, 3, 5, 8, 45, 0), UpdatedAt: new Date(2025, 3, 5, 8, 45, 0) }
    ],
    meta: {
        tags: ['профил', 'снимка', 'UI', 'валидация'],
        attachments: ['screenshot-error.png', 'user-spec.pdf']
    }
};

const MAX_TAGS = 10;
const MAX_ATTACHMENTS = 5;

// Helper to generate mock file extensions
const mockFileExtensions = ['pdf', 'png', 'jpg', 'docx', 'txt'];
function getRandomExtension() {
    return mockFileExtensions[Math.floor(Math.random() * mockFileExtensions.length)];
}

function TicketDetails() {
    const [ticketData, setTicketData] = useState(initialTicketData);
    const [isEditing, setIsEditing] = useState(false);
    const [editedData, setEditedData] = useState({});
    const [errors, setErrors] = useState({});
    const [newCommentText, setNewCommentText] = useState('');
   

    useEffect(() => {
        if (isEditing) {
            setEditedData({
                ...ticketData,
                assigneeName: ticketData.assigneeName || '',
                dueDateString: formatDateToInput(ticketData.dueDate),
                tagsString: ticketData.meta?.tags?.join(', ') || '',
                attachmentsArray: ticketData.meta?.attachments || [] 
            });
            setErrors({});
            setNewCommentText('');
         
        }
    }, [isEditing, ticketData]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setEditedData(prev => ({ ...prev, [name]: value }));

        if (errors[name]) {
            setErrors(prev => ({ ...prev, [name]: null }));
        }
        if (name === 'tagsString' && errors.tags) setErrors(prev => ({ ...prev, tags: null }));
        if (name === 'dueDateString' && errors.dueDate) setErrors(prev => ({ ...prev, dueDate: null }));
        if (errors.attachments) {
             setErrors(prev => ({ ...prev, attachments: null }));
        }
    };

    const handleNewCommentChange = (e) => {
        setNewCommentText(e.target.value);
        if (errors.newComment) {
             setErrors(prev => ({ ...prev, newComment: null }));
        }
    };


    const handleAddAttachment = () => {
        const currentAttachments = editedData.attachmentsArray || [];

        if (currentAttachments.length >= MAX_ATTACHMENTS) {
            setErrors(prev => ({ ...prev, attachments: `Не може да добавяте повече от ${MAX_ATTACHMENTS} файла.` }));
            return;
        }

        // Generate a mock file name
        const mockFileName = `mock-file-${currentAttachments.length + 1}.${getRandomExtension()}`;

        setEditedData(prev => ({
            ...prev,
            attachmentsArray: [...currentAttachments, mockFileName]
        }));
        setErrors(prev => ({ ...prev, attachments: null }));
    };

    const handleRemoveAttachment = (nameToRemove) => {
        setEditedData(prev => ({
            ...prev,
            attachmentsArray: (prev.attachmentsArray || []).filter(name => name !== nameToRemove)
        }));
         const currentCount = (editedData.attachmentsArray || []).length -1; // count after removal
         if (errors.attachments && currentCount < MAX_ATTACHMENTS) {
            setErrors(prev => ({ ...prev, attachments: null }));
        }
    };


    const validate = () => {
        let newErrors = {};
        // Required fields validation
        if (!editedData.title?.trim()) newErrors.title = 'Заглавието е задължително.';
        if (!editedData.description?.trim()) newErrors.description = 'Описанието е задължително.';
        if (!editedData.status) newErrors.status = 'Статусът е задължителен.';
        if (!editedData.priority) newErrors.priority = 'Приоритетът е задължителен.';
        if (!editedData.assigneeName?.trim()) newErrors.assigneeName = 'Името на изпълнителя е задължително.';

        // Date validation
        const parsedDueDate = parseDateFromInput(editedData.dueDateString);
        const createdAtDate = ticketData.createdAt;
        if (editedData.dueDateString && !parsedDueDate) {
            newErrors.dueDate = 'Невалиден формат на дата (трябва да е ГГГГ-ММ-ДД).';
        } else if (parsedDueDate && createdAtDate instanceof Date && !isNaN(createdAtDate.getTime())) {
            const dueDateOnly = new Date(parsedDueDate.getFullYear(), parsedDueDate.getMonth(), parsedDueDate.getDate());
            const createdAtOnly = new Date(createdAtDate.getFullYear(), createdAtDate.getMonth(), createdAtDate.getDate());
            if (dueDateOnly < createdAtOnly) {
                const formattedCreationDate = createdAtOnly.toLocaleDateString('bg-BG');
                newErrors.dueDate = `Крайната дата не може да е преди датата на създаване (${formattedCreationDate}).`;
            }
        } else if (parsedDueDate && !(createdAtDate instanceof Date && !isNaN(createdAtDate.getTime()))) {
             console.error("Cannot validate due date against creation date because createdAt is invalid:", createdAtDate);
        }

        // Tags validation
        const tagsArray = editedData.tagsString ? editedData.tagsString.split(',').map(t => t.trim()).filter(t => t) : [];
        if (tagsArray.length > MAX_TAGS) newErrors.tags = `Максималният брой тагове е ${MAX_TAGS}.`;

        // Attachments validation - Checks the array length
        const attachmentsArray = editedData.attachmentsArray || [];
        if (attachmentsArray.length > MAX_ATTACHMENTS) {
             newErrors.attachments = `Максималният брой прикачени файлове е ${MAX_ATTACHMENTS}. Текущо: ${attachmentsArray.length}.`;
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    // Event Handlers for buttons
    const handleEdit = () => setIsEditing(true);
    const handleCancel = () => setIsEditing(false);

    // Save handler
    const handleSave = () => {
        if (validate()) {
            const finalTags = editedData.tagsString ? editedData.tagsString.split(',').map(t => t.trim()).filter(t => t) : [];
            const finalAttachments = editedData.attachmentsArray || [];
            const finalDueDate = parseDateFromInput(editedData.dueDateString);

            const newComments = [...ticketData.comments];
            if (newCommentText.trim()) {
                const newComment = {
                    id: 'mock-id-' + Date.now(),
                    author: { FullName: 'Текущ Потребител (Mock)' },
                    text: newCommentText.trim(),
                    createdAt: new Date(),
                    UpdatedAt: new Date()
                };
                newComments.push(newComment);
            }

            const updatedTicket = {
                ...ticketData,
                title: editedData.title.trim(),
                description: editedData.description.trim(),
                status: editedData.status,
                priority: editedData.priority,
                assigneeName: editedData.assigneeName.trim(),
                dueDate: finalDueDate,
                updatedAt: new Date(),
                comments: newComments,
                meta: {
                    ...ticketData.meta,
                    tags: finalTags,
                    attachments: finalAttachments
                }
            };

            console.log("Saving updated ticket data:", updatedTicket);
            setTicketData(updatedTicket);
            setIsEditing(false);
        } else {
            console.log("Validation failed:", errors);
        }
    };

    const currentEditAttachments = editedData.attachmentsArray || [];

    return (
        <div className="container ticket-page">
            {/* --- Header --- */}
            <div className="ticket-header">
                <span className="ticket-id">ID: {ticketData.id}</span>
                <div className="ticket-actions">
                    {isEditing ? (
                        <>
                            <button className="btn btn-success" onClick={handleSave}>✔ Запази</button>
                            <button className="btn btn-secondary" onClick={handleCancel}>✖ Откажи</button>
                        </>
                    ) : (
                        <button className="btn btn-primary" onClick={handleEdit}>✎ Редактирай</button>
                    )}
                </div>
            </div>

            {/* --- Body --- */}
            <div className="ticket-body">
                {/* --- Main Content Area --- */}
                <div className="ticket-main-content">
                    {/* Title */}
                    <div className="detail-group">
                        <label className="detail-label" htmlFor="ticket-title">Заглавие</label>
                        {isEditing ? (
                            <>
                                <input
                                    type="text" id="ticket-title" name="title"
                                    className={`form-input ${errors.title ? 'is-invalid' : ''}`}
                                    value={editedData.title || ''}
                                    onChange={handleInputChange}
                                />
                                {errors.title && <div className="validation-error">{errors.title}</div>}
                            </>
                        ) : (
                            <h2 className="detail-value ticket-title-display">{ticketData.title}</h2>
                        )}
                    </div>

                    {/* Description */}
                    <div className="detail-group">
                        <label className="detail-label" htmlFor="ticket-description">Описание</label>
                        {isEditing ? (
                            <>
                                <textarea
                                    id="ticket-description" name="description" rows="5"
                                    className={`form-textarea ${errors.description ? 'is-invalid' : ''}`}
                                    value={editedData.description || ''}
                                    onChange={handleInputChange}
                                />
                                {errors.description && <div className="validation-error">{errors.description}</div>}
                            </>
                        ) : (
                            <div className="detail-value description-display">{ticketData.description}</div>
                        )}
                    </div>

                    {/* Comments Section */}
                    <div className="detail-group">
                         <label className="detail-label" htmlFor="ticket-comments">Коментари</label>
                         <CommentsDisplay comments={ticketData.comments} />
                         {isEditing && (
                             <div className="add-comment-section">
                                 <label className="detail-label" htmlFor="new-comment">Добави нов коментар</label>
                                 <textarea
                                     id="new-comment" name="newComment" rows="3"
                                     className={`form-textarea ${errors.newComment ? 'is-invalid' : ''}`}
                                     placeholder="Напишете вашия коментар..."
                                     value={newCommentText}
                                     onChange={handleNewCommentChange}
                                 />
                                 {errors.newComment && <div className="validation-error">{errors.newComment}</div>}
                             </div>
                         )}
                    </div>

                    {/* --- Attachments Section--- */}
                    <div className="detail-group">
                        <label className="detail-label" htmlFor="ticket-attachments">Прикачени файлове</label>
                        {isEditing ? (
                            <div className="attachments-edit-section">
                                {/* List of current attachments with remove buttons */}
                                <ul className="attachments-edit-list">
                                    {currentEditAttachments.map((name, index) => (
                                        <li key={`${name}-${index}`} className="attachment-edit-item">
                                            <span>{name}</span>
                                            <button
                                                type="button"
                                                className="btn-remove-attachment"
                                                onClick={() => handleRemoveAttachment(name)}
                                                title="Премахни файла"
                                            >
                                                &times;
                                            </button>
                                        </li>
                                    ))}
                                    {currentEditAttachments.length === 0 && (
                                        <li className="text-muted">Няма прикачени файлове.</li>
                                    )}
                                </ul>

                                {/* Button to add a mock attachment */}
                                <button
                                    type="button"
                                    className="btn btn-secondary btn-add-attachment"
                                    onClick={handleAddAttachment}
                                    // Disable button if max attachments reached
                                    disabled={currentEditAttachments.length >= MAX_ATTACHMENTS}
                                >
                                    📎 Прикачи файл (Mock)
                                </button>

                                {/* Show validation error for attachments (max count) */}
                                {errors.attachments && <div className="validation-error">{errors.attachments}</div>}
                            </div>
                        ) : (
                            <AttachmentsDisplay attachments={ticketData.meta?.attachments} />
                        )}
                    </div>
                    {/* --- End of Attachments Section --- */}

                </div> {/* End of ticket-main-content */}

                {/* --- Sidebar Area --- */}
                <div className="ticket-sidebar">
                    {/* Status */}
                    <div className="detail-group">
                        <label className="detail-label" htmlFor="ticket-status">Статус</label>
                        {isEditing ? (
                            <>
                                <select
                                    id="ticket-status" name="status"
                                    className={`form-select ${errors.status ? 'is-invalid' : ''}`}
                                    value={editedData.status || ''} onChange={handleInputChange}
                                >
                                    <option value="" disabled>- Избери -</option>
                                    {ALL_STATUSES.map(statusValue => (
                                        <option key={statusValue} value={statusValue}>
                                            {STATUS_DISPLAY_NAMES[statusValue] || statusValue}
                                        </option>
                                    ))}
                                </select>
                                {errors.status && <div className="validation-error">{errors.status}</div>}
                            </>
                        ) : (
                            <StatusBadge status={ticketData.status} />
                        )}
                    </div>

                    {/* Priority */}
                    <div className="detail-group">
                        <label className="detail-label" htmlFor="ticket-priority">Приоритет</label>
                        {isEditing ? (
                            <>
                                <select
                                    id="ticket-priority" name="priority"
                                    className={`form-select ${errors.priority ? 'is-invalid' : ''}`}
                                    value={editedData.priority || ''} onChange={handleInputChange}
                                >
                                    <option value="" disabled>- Избери -</option>
                                    {ALL_PRIORITIES.map(priorityValue => (
                                        <option key={priorityValue} value={priorityValue}>
                                            {PRIORITY_DISPLAY_NAMES[priorityValue] || priorityValue}
                                        </option>
                                    ))}
                                </select>
                                {errors.priority && <div className="validation-error">{errors.priority}</div>}
                            </>
                        ) : (
                            <PriorityIndicator priority={ticketData.priority} />
                        )}
                    </div>

                    {/* Assignee */}
                    <div className="detail-group">
                        <label className="detail-label" htmlFor="ticket-assignee">Изпълнител</label>
                        {isEditing ? (
                            <>
                                <input
                                    type="text" id="ticket-assignee" name="assigneeName"
                                    className={`form-input ${errors.assigneeName ? 'is-invalid' : ''}`}
                                    placeholder="Име на изпълнител"
                                    value={editedData.assigneeName || ''}
                                    onChange={handleInputChange}
                                />
                                {errors.assigneeName && <div className="validation-error">{errors.assigneeName}</div>}
                            </>
                        ) : (
                            <span className="detail-value">
                                {ticketData.assigneeName || 'Невъзложен'}
                            </span>
                        )}
                    </div>

                    {/* Due Date */}
                    <div className="detail-group">
                        <label className="detail-label" htmlFor="ticket-dueDate">Крайна дата</label>
                        {isEditing ? (
                            <>
                                <input
                                    type="date" id="ticket-dueDate" name="dueDateString"
                                    className={`form-input ${errors.dueDate ? 'is-invalid' : ''}`}
                                    value={editedData.dueDateString || ''}
                                    onChange={handleInputChange}
                                />
                                {errors.dueDate && <div className="validation-error">{errors.dueDate}</div>}
                            </>
                        ) : (
                            <span className="detail-value">{ticketData.dueDate ? formatDate(ticketData.dueDate) : 'Няма'}</span>
                        )}
                    </div>

                    {/* Tags */}
                    <div className="detail-group">
                        <label className="detail-label" htmlFor="ticket-tags">Тагове</label>
                        {isEditing ? (
                            <>
                                <input
                                    type="text" id="ticket-tags" name="tagsString"
                                    className={`form-input ${errors.tags ? 'is-invalid' : ''}`}
                                    placeholder="Тагове, разделени със запетая"
                                    value={editedData.tagsString || ''}
                                    onChange={handleInputChange}
                                />
                                {errors.tags && <div className="validation-error">{errors.tags}</div>}
                            </>
                        ) : (
                            <TagsDisplay tags={ticketData.meta?.tags} />
                        )}
                    </div>

                    {/* Read-only details */}
                    <div className="detail-group readonly-details">
                        <h4 className="detail-label">Допълнителна информация</h4>
                        <p><strong>Project ID:</strong> <span className="text-muted">{ticketData.projectId}</span></p>
                        <p><strong>Създаден от:</strong> <span className="text-muted">{ticketData.createdByName || ticketData.createdById || 'N/A'}</span></p>
                        <p><strong>Създаден на:</strong> <span className="text-muted">{formatDate(ticketData.createdAt)}</span></p>
                        <p><strong>Последна промяна:</strong> <span className="text-muted">{formatDate(ticketData.updatedAt)}</span></p>
                    </div>
                </div> {}
            </div> {}
        </div> 
    );
}

export default TicketDetails;