import { useMemo, useRef, useState } from "react";
import { useReactToPrint } from "react-to-print";
import { EmployeeForm } from "./components/EmployeeForm";
import { HeaderBar } from "./components/HeaderBar";
import { PrintableForm } from "./components/PrintableForm";
import { RecordsList } from "./components/RecordsList";
import { useAccountabilityRecords } from "./hooks/useAccountabilityRecords";
import { AccountabilityRecord } from "./types/accountability";

const trimRecord = (record: AccountabilityRecord): AccountabilityRecord => {
  const next = { ...record };
  Object.keys(next).forEach((key) => {
    const typedKey = key as keyof AccountabilityRecord;
    if (typeof next[typedKey] === "string") {
      next[typedKey] = String(next[typedKey]).trim() as never;
    }
  });
  return next;
};

function App() {
  const { records, loading, error, useLocalMode, createRecord, updateRecord, removeRecord } =
    useAccountabilityRecords();
  const [editingRecord, setEditingRecord] = useState<AccountabilityRecord | null>(null);
  const [selectedRecord, setSelectedRecord] = useState<AccountabilityRecord | null>(null);

  const printRef = useRef<HTMLDivElement>(null);

  const handlePrint = useReactToPrint({
    content: () => printRef.current,
    documentTitle: selectedRecord
      ? `IT-Accountability-${selectedRecord.empId}-${selectedRecord.lastName}`
      : "IT-Accountability"
  });

  const recordsCountText = useMemo(() => `${records.length} record(s)`, [records.length]);
  const monitoredAssets = useMemo(
    () => records.filter((item) => item.monitorSerialNumber.trim().length > 0).length,
    [records]
  );
  const pendingAcknowledgement = useMemo(
    () =>
      records.filter(
        (item) => !item.phr.trim() || !item.amld.trim() || !item.it.trim() || !item.cato.trim()
      ).length,
    [records]
  );

  const handleSubmit = async (record: AccountabilityRecord) => {
    const cleaned = trimRecord(record);
    if (editingRecord?.id) {
      await updateRecord(editingRecord.id, cleaned);
      setEditingRecord(null);
      setSelectedRecord((prev) => {
        if (!prev || prev.id !== editingRecord.id) {
          return prev;
        }
        return { ...cleaned, id: prev.id };
      });
      return;
    }

    await createRecord(cleaned);
  };

  const handleDelete = async (record: AccountabilityRecord) => {
    if (!record.id) return;
    const confirmed = window.confirm(`Delete record for ${record.empId} - ${record.lastName}?`);
    if (!confirmed) return;
    await removeRecord(record.id);
    if (selectedRecord?.id === record.id) {
      setSelectedRecord(null);
    }
    if (editingRecord?.id === record.id) {
      setEditingRecord(null);
    }
  };

  const handlePrintRecord = (record: AccountabilityRecord) => {
    setSelectedRecord(record);
    setTimeout(() => {
      void handlePrint();
    }, 0);
  };

  return (
    <div className="app-shell">
      <HeaderBar localMode={useLocalMode} />
      <main className="layout">
        <aside className="sidebar-column">
          <div className="sidebar-brand-row sidebar-divider">
            <span className="sidebar-logo-icon">◷</span>
            <p className="sidebar-brand">eAttend</p>
          </div>

          <div className="sidebar-profile sidebar-divider">
            <span className="sidebar-avatar">◉</span>
            <div>
              <p className="sidebar-name">Justine Meg Evangelista</p>
              <p className="sidebar-role">EMPLOYEE</p>
            </div>
          </div>

          <nav className="sidebar-menu">
            <button type="button" className="nav-item nav-item-active">
              <span className="nav-icon">◴</span>
              <span>Dashboard</span>
            </button>
            <button type="button" className="nav-item">
              <span className="nav-icon">◫</span>
              <span>Attendance</span>
            </button>
            <button type="button" className="nav-item">
              <span className="nav-icon">◧</span>
              <span>Leave Requests</span>
            </button>
            <button type="button" className="nav-item">
              <span className="nav-icon">◎</span>
              <span>Profile</span>
            </button>
          </nav>

          <div className="sidebar-footer-panel sidebar-divider-top">
            <button type="button" className="logout-button">
              <span className="logout-icon">↪</span>
              <span>Logout</span>
            </button>
          </div>
        </aside>
        <section className="content-grid">
          <div className="right-column">
            <section className="panel metrics-grid">
              <article className="metric-card">
                <p>Total Records</p>
                <strong>{recordsCountText}</strong>
              </article>
              <article className="metric-card">
                <p>Assets With Monitor</p>
                <strong>{monitoredAssets}</strong>
              </article>
              <article className="metric-card">
                <p>Pending Sign-off</p>
                <strong>{pendingAcknowledgement}</strong>
              </article>
              <article className="metric-card">
                <p>Mode</p>
                <strong>{useLocalMode ? "Local" : "Firestore"}</strong>
              </article>
              {loading && <p>Loading records...</p>}
              {error && <p className="warning-text">{error}</p>}
            </section>
          </div>

          <div className="left-column">
            <EmployeeForm
              editingRecord={editingRecord}
              onSubmit={handleSubmit}
              onCancelEdit={() => setEditingRecord(null)}
            />
          </div>

          <div className="right-column">
            <RecordsList
              records={records}
              onEdit={(record) => setEditingRecord(record)}
              onDelete={handleDelete}
              onPrint={handlePrintRecord}
              onView={(record) => setSelectedRecord(record)}
            />
          </div>

          <div className="right-column">
            <PrintableForm record={selectedRecord} ref={printRef} />
          </div>
        </section>
      </main>
    </div>
  );
}

export default App;
