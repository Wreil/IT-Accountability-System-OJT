interface HeaderBarProps {
  localMode: boolean;
  title?: string;
}

export const HeaderBar = ({ localMode, title = "IT Accountability Form" }: HeaderBarProps) => {
  return (
    <header className="header-bar">
      <div className="header-logo">
        <span className="header-logo-icon" aria-hidden="true">
          <svg viewBox="0 0 24 24" width="18" height="18" fill="none">
            <rect x="3" y="4" width="18" height="11" rx="2.5" stroke="currentColor" strokeWidth="1.8" />
            <path d="M8 20h8" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
            <path d="M10.5 10.5 12 9l1.5 1.5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
            <path d="M12 9v4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
          </svg>
        </span>
        <div className="header-copy">
          <p className="eyebrow">IT Department</p>
          <h1>{title}</h1>
        </div>
      </div>
      <div className="header-actions">
        <span className={`status-pill ${localMode ? "warning" : "ok"}`}>
          {localMode ? "Local Mode" : "Live Mode"}
        </span>
        <div className="avatar-badge">
          <span className="avatar-dot" aria-hidden="true">
            <svg viewBox="0 0 24 24" width="13" height="13" fill="none">
              <circle cx="9" cy="8" r="3" stroke="currentColor" strokeWidth="1.8" />
              <path d="M4.5 17c.4-2.2 2.2-3.6 4.5-3.6s4.1 1.4 4.5 3.6" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
              <circle cx="16.8" cy="9" r="2.2" stroke="currentColor" strokeWidth="1.6" />
              <path d="M14.8 16.2c.3-1.6 1.5-2.6 3.1-2.6" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
            </svg>
          </span>
          <p>Admin</p>
        </div>
      </div>
    </header>
  );
};
