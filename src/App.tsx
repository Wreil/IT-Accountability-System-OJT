import { useEffect, useRef, useState } from "react";
import { useReactToPrint } from "react-to-print";
import { EmployeeForm } from "./modules/accountability/components/EmployeeForm";
import { PrintableForm } from "./modules/accountability/components/PrintableForm";
import { RecordsList } from "./modules/accountability/components/RecordsList";
import { useAccountabilityRecords } from "./modules/accountability/hooks/useAccountabilityRecords";
import { AccountabilityRecord } from "./modules/accountability/types/accountability";
import { ITAssetChart } from "./modules/asset-inventory/components/ITAssetChart";
import { ITAssetInventory } from "./modules/asset-inventory/components/ITAssetInventory";
import { LandingPage } from "./modules/navigation/components/LandingPage";
import { SelectionPage } from "./modules/navigation/components/SelectionPage";
import { HeaderBar } from "./shared/components/HeaderBar";

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

type ActiveView = "form" | "inventory" | "chart" | "records" | "printable";
type ModuleKey =
  | "it-accountability-form"
  | "it-asset-inventory"
  | "it-software-inventory"
  | "ipad-inventory"
  | "disposal"
  | "returned-assets";

function App() {
  const [showLanding, setShowLanding] = useState(true);
  const [selectedModule, setSelectedModule] = useState<ModuleKey | null>(null);
  const { records, loading, useLocalMode, createRecord, updateRecord, removeRecord, reload } =
    useAccountabilityRecords();
  const [editingRecord, setEditingRecord] = useState<AccountabilityRecord | null>(null);
  const [selectedRecord, setSelectedRecord] = useState<AccountabilityRecord | null>(null);
  const [activeView, setActiveView] = useState<ActiveView>("records");
  const [pendingPrint, setPendingPrint] = useState(false);

  const printRef = useRef<HTMLDivElement>(null);

  const handlePrint = useReactToPrint({
    content: () => printRef.current,
    documentTitle: selectedRecord
      ? `IT-Accountability-${selectedRecord.empId}-${selectedRecord.lastName}`
      : "IT-Accountability"
  });

  const handleSubmit = async (record: AccountabilityRecord) => {
    const cleaned = trimRecord(record);
    if (editingRecord?.id) {
      await updateRecord(editingRecord.id, cleaned);
      setEditingRecord(null);
      setSelectedRecord((prev) => {
        if (!prev || prev.id !== editingRecord.id) return prev;
        return { ...cleaned, id: prev.id };
      });
      setSelectedModule("it-accountability-form");
      setActiveView("records");
      return;
    }
    await createRecord(cleaned);
    setSelectedModule("it-accountability-form");
    setActiveView("records");
  };

  const handleDelete = async (record: AccountabilityRecord) => {
    if (!record.id) return;
    const confirmed = window.confirm(`Delete record for ${record.empId} - ${record.lastName}?`);
    if (!confirmed) return;
    await removeRecord(record.id);
    if (selectedRecord?.id === record.id) setSelectedRecord(null);
    if (editingRecord?.id === record.id) setEditingRecord(null);
  };

  const handlePrintRecord = (record: AccountabilityRecord) => {
    setSelectedRecord(record);
    setActiveView("printable");
    setPendingPrint(true);
  };

  useEffect(() => {
    if (!pendingPrint || activeView !== "printable" || !selectedRecord) {
      return;
    }

    const timer = window.setTimeout(() => {
      void handlePrint();
      setPendingPrint(false);
    }, 0);

    return () => window.clearTimeout(timer);
  }, [pendingPrint, activeView, selectedRecord, handlePrint]);

  const handleViewRecord = (record: AccountabilityRecord) => {
    setSelectedRecord(record);
    setActiveView("printable");
  };

  const handleEditRecord = (record: AccountabilityRecord) => {
    setEditingRecord(record);
    setActiveView("form");
  };

  const handleModuleSelect = (moduleKey: string) => {
    const typed = moduleKey as ModuleKey;
    setSelectedModule(typed);
    if (typed === "it-accountability-form") {
      setActiveView("form");
      return;
    }
    if (typed === "it-asset-inventory") {
      setActiveView("inventory");
      return;
    }
    window.alert("This module will be available soon.");
    setSelectedModule(null);
  };

  if (showLanding) {
    return (
      <LandingPage
        onEnter={() => {
          setShowLanding(false);
        }}
      />
    );
  }

  if (!selectedModule) {
    return <SelectionPage onSelect={handleModuleSelect} />;
  }

  const isAccountabilityModule = selectedModule === "it-accountability-form";
  const isAssetInventoryModule = selectedModule === "it-asset-inventory";

  const headerTitle = isAssetInventoryModule ? "IT Asset Inventory" : "IT Accountability Form";

  return (
    <div className="app-shell">
      <HeaderBar localMode={useLocalMode} title={headerTitle} />
      <div className="layout">
        <aside className="sidebar">
          <nav className="sidebar-nav">
            {isAccountabilityModule && (
              <>
                <button
                  type="button"
                  className={`nav-btn${activeView === "form" ? " nav-btn--active" : ""}`}
                  onClick={() => setActiveView("form")}
                >
                  <span className="nav-icon">✦</span>
                  Create Record
                </button>
                <button
                  type="button"
                  className={`nav-btn${activeView === "records" ? " nav-btn--active" : ""}`}
                  onClick={() => setActiveView("records")}
                >
                  <span className="nav-icon">☰</span>
                  Records
                </button>
                <button
                  type="button"
                  className={`nav-btn${activeView === "printable" ? " nav-btn--active" : ""}`}
                  onClick={() => setActiveView("printable")}
                >
                  <span className="nav-icon">⎙</span>
                  Printable Form
                </button>
              </>
            )}

            {isAssetInventoryModule && (
              <>
                <button
                  type="button"
                  className={`nav-btn${activeView === "inventory" ? " nav-btn--active" : ""}`}
                  onClick={() => setActiveView("inventory")}
                >
                  <span className="nav-icon">▦</span>
                  Asset
                </button>
                <button
                  type="button"
                  className={`nav-btn${activeView === "chart" ? " nav-btn--active" : ""}`}
                  onClick={() => setActiveView("chart")}
                >
                  <span className="nav-icon">◔</span>
                  Chart
                </button>
              </>
            )}
          </nav>

          <div className="sidebar-bottom">
            <button
              type="button"
              className="nav-btn nav-btn-danger"
              onClick={() => {
                setSelectedModule(null);
              }}
            >
              <span className="nav-icon">↩</span>
              Back
            </button>
          </div>
        </aside>

        <main className="main-content">
          {isAccountabilityModule && activeView === "form" && (
            <EmployeeForm
              editingRecord={editingRecord}
              onSubmit={handleSubmit}
              onCancelEdit={() => { setEditingRecord(null); setActiveView("records"); }}
            />
          )}

          {isAssetInventoryModule && activeView === "inventory" && (
            <ITAssetInventory
              records={records}
              loading={loading}
              onRefresh={reload}
            />
          )}

          {isAssetInventoryModule && activeView === "chart" && (
            <ITAssetChart records={records} />
          )}

          {isAccountabilityModule && activeView === "records" && (
            <RecordsList
              records={records}
              onEdit={handleEditRecord}
              onDelete={handleDelete}
              onPrint={handlePrintRecord}
              onView={handleViewRecord}
            />
          )}

          {isAccountabilityModule && activeView === "printable" && (
            <PrintableForm record={selectedRecord} ref={printRef} />
          )}
        </main>
      </div>
    </div>
  );
}

export default App;
