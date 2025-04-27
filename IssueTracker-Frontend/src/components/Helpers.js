export const ALL_STATUSES = ['Open', 'In Progress', 'Blocked', 'Closed'];
export const STATUS_DISPLAY_NAMES = {
    'Open': 'Отворен',
    'In Progress': 'В процес',
    'Blocked': 'Блокиран',
    'Closed': 'Затворен'
};

export const ALL_PRIORITIES = ['Low', 'Medium', 'High'];
export const PRIORITY_DISPLAY_NAMES = {
    'Low': 'Нисък',
    'Medium': 'Среден',
    'High': 'Висок'
};

export function formatDate(date) {
    if (!date) return 'N/A';
    const d = (date instanceof Date) ? date : new Date(date);
    if (isNaN(d.getTime())) return 'Invalid Date';
    return d.toLocaleString('bg-BG', {
        year: 'numeric', month: 'long', day: 'numeric',
        hour: '2-digit', minute: '2-digit'
    });
}

export function formatDateToInput(date) {
    if (!date || !(date instanceof Date) || isNaN(date.getTime())) {
        return '';
    }
    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const day = date.getDate().toString().padStart(2, '0');
    return `${year}-${month}-${day}`;
}

export function parseDateFromInput(dateString) {
    if (!dateString) {
        return null;
    }
    const parts = dateString.split('-');
    if (parts.length === 3) {
        const year = parseInt(parts[0], 10);
        const month = parseInt(parts[1], 10) - 1; // Month is 0-indexed
        const day = parseInt(parts[2], 10);
        if (!isNaN(year) && !isNaN(month) && !isNaN(day)) {
            const date = new Date(Date.UTC(year, month, day));
            
            if (!isNaN(date.getTime()) &&
                date.getUTCFullYear() === year &&
                date.getUTCMonth() === month &&
                date.getUTCDate() === day) {
                return date;
            }
        }
    }
    console.warn("Invalid date string received:", dateString);
    return null; 
}




export const StatusBadge = ({ status }) => {
    const statusText = STATUS_DISPLAY_NAMES[status] || status;
    const className = status?.replace(/\s+/g, '') || 'unknown';
    return <span className={`status-badge ${className}`}>{statusText}</span>;
};

export const PriorityIndicator = ({ priority }) => {
    const priorityText = PRIORITY_DISPLAY_NAMES[priority] || priority;
    const className = priority?.toLowerCase() || 'unknown'; // low, medium, high
    let dots;
    switch (className) {
        case 'low': dots = <><span className="priority-dot filled low"></span><span className="priority-dot"></span><span className="priority-dot"></span></>; break;
        case 'medium': dots = <><span className="priority-dot filled medium"></span><span className="priority-dot filled medium"></span><span className="priority-dot"></span></>; break;
        case 'high': dots = <><span className="priority-dot filled high"></span><span className="priority-dot filled high"></span><span className="priority-dot filled high"></span></>; break;
        default: dots = <><span className="priority-dot"></span><span className="priority-dot"></span><span className="priority-dot"></span></>;
    }
    return (
        <span className="priority-indicator">
            {dots}
            <span className="priority-text">{priorityText}</span>
        </span>
    );
};

export const TagsDisplay = ({ tags }) => {
    if (!tags || tags.length === 0) {
        return <span className="text-muted">Няма тагове</span>;
    }
    return (
        <div className="ticket-tags-container">
            {tags.map((tag, index) => (
                <span key={index} className="ticket-tag">{tag}</span>
            ))}
        </div>
    );
};

export const CommentsDisplay = ({ comments }) => {
    if (!comments || comments.length === 0) {
        return <span className="text-muted">Няма коментари</span>;
    }
    return (
        <div className="comments-list">
            {comments.map((comment, index) => (
                <div key={comment.id || index} className="comment-item">
                    <strong className="comment-author">{comment.author?.FullName || 'Анонимен (Mock)'}:</strong>
                    <p className="comment-text">{comment.text}</p>
                    <small className="comment-date text-muted">{formatDate(comment.createdAt)}</small>
                </div>
            ))}
        </div>
    );
};

export const AttachmentsDisplay = ({ attachments }) => {
    if (!attachments || attachments.length === 0) {
        return <span className="text-muted">Няма прикачени файлове</span>;
    }
    return (
        <ul className="attachments-list">
            {attachments.map((attachment, index) => (
                <li key={index} className="attachment-item">
                    {/* In a real app, this would be a link ;)*/}
                    <span>{attachment}</span>
                </li>
            ))}
        </ul>
    );
};
