const STATUS_CONFIG = {
  pending:  { label: 'Pending',  cls: 'badge-warning' },
  accepted: { label: 'Accepted', cls: 'badge-info' },
  solved:   { label: 'Solved',   cls: 'badge-success' },
  rejected: { label: 'Rejected', cls: 'badge-error' },
};

const ComplaintCard = ({ complaint, actions }) => {
  const { label, cls } = STATUS_CONFIG[complaint.status] || STATUS_CONFIG.pending;
  const dateStr = new Date(complaint.createdAt).toLocaleDateString('en-GB', {
    day: '2-digit', month: 'short', year: 'numeric'
  });

  return (
    <div className="complaint-card">
      {/* Header */}
      <div className="complaint-card-header">
        <div className="complaint-meta">
          <span className={`status-badge ${cls}`}>{label}</span>
          <span className="authority-tag">→ {complaint.currentAuthority}</span>
        </div>
        <span className="complaint-date">{dateStr}</span>
      </div>

      {/* Student info (shown on authority view) */}
      {complaint.student && typeof complaint.student === 'object' && (
        <div className="student-info">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" width="14" height="14">
            <path fillRule="evenodd" d="M7.5 6a4.5 4.5 0 119 0 4.5 4.5 0 01-9 0zM3.751 20.105a8.25 8.25 0 0116.498 0 .75.75 0 01-.437.695A18.683 18.683 0 0112 22.5c-2.786 0-5.433-.608-7.812-1.7a.75.75 0 01-.437-.695z" clipRule="evenodd" />
          </svg>
          <strong>{complaint.student.name}</strong>
          <span className="dot">·</span>
          <span>{complaint.student.roll}</span>
          <span className="dot">·</span>
          <span>{complaint.student.department}</span>
          <span className="dot">·</span>
          <span>{complaint.student.session}</span>
        </div>
      )}

      {/* Description */}
      <p className="complaint-desc">{complaint.description}</p>

      {/* History Trail */}
      {complaint.history && complaint.history.length > 0 && (
        <div className="history-trail">
          <p className="history-title">Trail</p>
          <div className="timeline">
            {complaint.history.map((h, i) => (
              <div key={i} className="timeline-item">
                <div className="timeline-dot"></div>
                <div className="timeline-content">
                  <span className="timeline-action">{h.action}</span>
                  <span className="timeline-by">by {h.actionByAuthority}</span>
                  {h.comment && <span className="timeline-comment">— {h.comment}</span>}
                  <span className="timeline-ts">{new Date(h.timestamp).toLocaleString('en-GB')}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Action Buttons */}
      {actions && <div className="complaint-actions">{actions}</div>}
    </div>
  );
};

export default ComplaintCard;
