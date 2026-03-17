interface HeaderBarProps {
  localMode: boolean;
}

export const HeaderBar = ({ localMode }: HeaderBarProps) => {
  return (
    <header className="header-bar">
      <div className="header-copy">
        <p className="eyebrow">Welcome back, IT Team</p>
        <h1>IT Accountability Dashboard</h1>
        <p className="subtitle">Track device handover, approvals, and printable forms in one place.</p>
      </div>
      <div className="header-actions">
        <span className={`status-pill ${localMode ? "warning" : "ok"}`}>
          {localMode ? "Local Mode" : "Firestore Live"}
        </span>
        <button type="button" className="icon-button" aria-label="Search">
          S
        </button>
        <button type="button" className="icon-button" aria-label="Notifications">
          N
        </button>
        <div className="avatar-badge">
          <span className="avatar-dot">IA</span>
          <p>IT Admin</p>
        </div>
      </div>
    </header>
  );
};
