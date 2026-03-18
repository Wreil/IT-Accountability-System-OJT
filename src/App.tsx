import { useEffect, useMemo, useRef, useState } from "react";
import { useReactToPrint } from "react-to-print";
import { EmployeeForm } from "./modules/accountability/components/EmployeeForm";
import { BorrowingReceiptForm } from "./modules/accountability/components/BorrowingReceiptForm";
import { BorrowingReceiptPrintable } from "./modules/accountability/components/BorrowingReceiptPrintable";
import { PrintableForm } from "./modules/accountability/components/PrintableForm";
import { RecordsList } from "./modules/accountability/components/RecordsList";
import { useAccountabilityRecords } from "./modules/accountability/hooks/useAccountabilityRecords";
import { AccountabilityRecord } from "./modules/accountability/types/accountability";
import {
  BorrowingReceiptData,
  emptyBorrowingReceiptData
} from "./modules/accountability/types/borrowingReceipt";
import { ITAssetChart } from "./modules/asset-inventory/components/ITAssetChart";
import { ITAssetInventory } from "./modules/asset-inventory/components/ITAssetInventory";
import { ITAssetInventoryPrintable } from "./modules/asset-inventory/components/ITAssetInventoryPrintable";
import { DisposalForm } from "./modules/disposal/components/DisposalForm";
import { DisposalRecords } from "./modules/disposal/components/DisposalRecords";
import { DisposalRecord } from "./modules/disposal/types/disposal";
import { IPadInventory } from "./modules/ipad-inventory/components/IPadInventory";
import { IPadInventoryPrintable } from "./modules/ipad-inventory/components/IPadInventoryPrintable";
import { LandingPage } from "./modules/navigation/components/LandingPage";
import { SelectionPage } from "./modules/navigation/components/SelectionPage";
import { ReturnedAssetsChart } from "./modules/returned-assets/components/ReturnedAssetsChart";
import { ReturnedAssetsPrintable } from "./modules/returned-assets/components/ReturnedAssetsPrintable";
import { ReturnedAssetsRecords } from "./modules/returned-assets/components/ReturnedAssetsRecords";
import { SoftwareInventoryChart } from "./modules/software-inventory/components/SoftwareInventoryChart";
import { SoftwareInventoryForm } from "./modules/software-inventory/components/SoftwareInventoryForm";
import { SoftwareInventoryPrintable } from "./modules/software-inventory/components/SoftwareInventoryPrintable";
import { SoftwareInventoryRecords } from "./modules/software-inventory/components/SoftwareInventoryRecords";
import { useSoftwareInventoryRecords } from "./modules/software-inventory/hooks/useSoftwareInventoryRecords";
import { SoftwareInventoryRecord } from "./modules/software-inventory/types/softwareInventory";
import { downloadSoftwareForm } from "./modules/software-inventory/utils/downloadSoftwareForm";
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

type ActiveView = "form" | "inventory" | "chart" | "records" | "printable" | "borrowing-form" | "borrowing-printable";
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
  const [borrowingReceiptByRecordId, setBorrowingReceiptByRecordId] = useState<Record<string, BorrowingReceiptData>>({});
  const [activeView, setActiveView] = useState<ActiveView>("records");
  const [pendingPrint, setPendingPrint] = useState(false);
  const [pendingBorrowingPrint, setPendingBorrowingPrint] = useState(false);
  const [printActionType, setPrintActionType] = useState<"accountability" | "borrowing" | null>(null);
  const [pendingAssetPrint, setPendingAssetPrint] = useState(false);
  const {
    records: softwareRecords,
    loading: softwareLoading,
    createRecord: createSoftwareRecord,
    updateRecord: updateSoftwareRecord,
    removeRecord: removeSoftwareRecord
  } = useSoftwareInventoryRecords();
  const [editingSoftwareRecord, setEditingSoftwareRecord] =
    useState<SoftwareInventoryRecord | null>(null);
  const [selectedSoftwareRecord, setSelectedSoftwareRecord] =
    useState<SoftwareInventoryRecord | null>(null);
  const [pendingSoftwarePrint, setPendingSoftwarePrint] = useState(false);
  const [pendingIpadPrint, setPendingIpadPrint] = useState(false);
  const [pendingReturnedAssetsPrint, setPendingReturnedAssetsPrint] = useState(false);
  const [disposalRecords, setDisposalRecords] = useState<DisposalRecord[]>([]);
  const [editingDisposalRecord, setEditingDisposalRecord] = useState<DisposalRecord | null>(null);

  const ipadRecords = useMemo(
    () => records.filter((item) => item.deviceType.trim().toLowerCase() === "ipad"),
    [records]
  );

  const returnedAssetsRecords = useMemo(
    () => records.filter((item) => Boolean(item.returnedDate?.trim())),
    [records]
  );

  const printRef = useRef<HTMLDivElement>(null);
  const borrowingPrintRef = useRef<HTMLDivElement>(null);
  const assetPrintRef = useRef<HTMLDivElement>(null);
  const softwarePrintRef = useRef<HTMLDivElement>(null);
  const ipadPrintRef = useRef<HTMLDivElement>(null);
  const returnedAssetsPrintRef = useRef<HTMLDivElement>(null);

  const handlePrint = useReactToPrint({
    content: () => printRef.current,
    documentTitle: selectedRecord
      ? `IT-Accountability-${selectedRecord.empId}-${selectedRecord.lastName}`
      : "IT-Accountability"
  });

  const handleBorrowingPrint = useReactToPrint({
    content: () => borrowingPrintRef.current,
    documentTitle: selectedRecord
      ? `IT-Borrowing-Receipt-${selectedRecord.empId}-${selectedRecord.lastName}`
      : "IT-Borrowing-Receipt"
  });

  const handleSoftwarePrint = useReactToPrint({
    content: () => softwarePrintRef.current,
    documentTitle: selectedSoftwareRecord
      ? `IT-Software-Inventory-${selectedSoftwareRecord.softwareName}`
      : "IT-Software-Inventory"
  });

  const handleAssetPrint = useReactToPrint({
    content: () => assetPrintRef.current,
    documentTitle: "IT-Asset-Inventory"
  });

  const handleIpadPrint = useReactToPrint({
    content: () => ipadPrintRef.current,
    documentTitle: "IPAD-Inventory"
  });

  const handleReturnedAssetsPrint = useReactToPrint({
    content: () => returnedAssetsPrintRef.current,
    documentTitle: "Returned-Assets-Availability"
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

  const handleSoftwareSubmit = async (record: SoftwareInventoryRecord) => {
    const cleaned: SoftwareInventoryRecord = { ...record };
    Object.keys(cleaned).forEach((key) => {
      const typedKey = key as keyof SoftwareInventoryRecord;
      if (typeof cleaned[typedKey] === "string") {
        cleaned[typedKey] = String(cleaned[typedKey]).trim() as never;
      }
    });

    if (editingSoftwareRecord?.id) {
      await updateSoftwareRecord(editingSoftwareRecord.id, cleaned);
      setEditingSoftwareRecord(null);
      setSelectedSoftwareRecord((prev) => {
        if (!prev || prev.id !== editingSoftwareRecord.id) return prev;
        return { ...cleaned, id: prev.id };
      });
      setSelectedModule("it-software-inventory");
      setActiveView("records");
      return;
    }

    await createSoftwareRecord(cleaned);
    setSelectedModule("it-software-inventory");
    setActiveView("records");
  };

  const handleSoftwareDelete = async (record: SoftwareInventoryRecord) => {
    if (!record.id) return;
    const confirmed = window.confirm(
      `Delete software form for ${record.softwareName} - ${record.assignedTo}?`
    );
    if (!confirmed) return;
    await removeSoftwareRecord(record.id);
    if (selectedSoftwareRecord?.id === record.id) setSelectedSoftwareRecord(null);
    if (editingSoftwareRecord?.id === record.id) setEditingSoftwareRecord(null);
  };

  const handlePrintRecord = (record: AccountabilityRecord) => {
    setSelectedRecord(record);
    setActiveView("printable");
    setPrintActionType("accountability");
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

  useEffect(() => {
    if (!pendingBorrowingPrint || activeView !== "borrowing-printable" || !selectedRecord) {
      return;
    }

    const timer = window.setTimeout(() => {
      void handleBorrowingPrint();
      setPendingBorrowingPrint(false);
    }, 0);

    return () => window.clearTimeout(timer);
  }, [pendingBorrowingPrint, activeView, selectedRecord, handleBorrowingPrint]);

  useEffect(() => {
    if (
      !pendingAssetPrint ||
      activeView !== "printable" ||
      selectedModule !== "it-asset-inventory"
    ) {
      return;
    }

    const timer = window.setTimeout(() => {
      void handleAssetPrint();
      setPendingAssetPrint(false);
    }, 0);

    return () => window.clearTimeout(timer);
  }, [pendingAssetPrint, activeView, selectedModule, handleAssetPrint]);

  useEffect(() => {
    if (
      !pendingIpadPrint ||
      activeView !== "printable" ||
      selectedModule !== "ipad-inventory"
    ) {
      return;
    }

    const timer = window.setTimeout(() => {
      void handleIpadPrint();
      setPendingIpadPrint(false);
    }, 0);

    return () => window.clearTimeout(timer);
  }, [pendingIpadPrint, activeView, selectedModule, handleIpadPrint]);

  useEffect(() => {
    if (
      !pendingReturnedAssetsPrint ||
      activeView !== "printable" ||
      selectedModule !== "returned-assets"
    ) {
      return;
    }

    const timer = window.setTimeout(() => {
      void handleReturnedAssetsPrint();
      setPendingReturnedAssetsPrint(false);
    }, 0);

    return () => window.clearTimeout(timer);
  }, [pendingReturnedAssetsPrint, activeView, selectedModule, handleReturnedAssetsPrint]);

  useEffect(() => {
    if (!pendingSoftwarePrint || activeView !== "printable" || !selectedSoftwareRecord) {
      return;
    }

    const timer = window.setTimeout(() => {
      void handleSoftwarePrint();
      setPendingSoftwarePrint(false);
    }, 0);

    return () => window.clearTimeout(timer);
  }, [pendingSoftwarePrint, activeView, selectedSoftwareRecord, handleSoftwarePrint]);

  const handleViewRecord = (record: AccountabilityRecord) => {
    setSelectedRecord(record);
    setActiveView("printable");
  };

  const handleEditRecord = (record: AccountabilityRecord) => {
    setEditingRecord(record);
    setActiveView("form");
  };

  const handleBorrowingRecord = (record: AccountabilityRecord) => {
    setSelectedRecord(record);
    const hasSavedBorrowing = Boolean(record.id && borrowingReceiptByRecordId[record.id]);
    setActiveView(hasSavedBorrowing ? "borrowing-printable" : "borrowing-form");
  };

  const handleSaveBorrowingForm = (recordId: string, data: BorrowingReceiptData) => {
    setBorrowingReceiptByRecordId((prev) => ({
      ...prev,
      [recordId]: data
    }));

    setActiveView("borrowing-printable");
    setPrintActionType("borrowing");
    setPendingBorrowingPrint(true);
  };

  const handleViewSoftwareRecord = (record: SoftwareInventoryRecord) => {
    setSelectedSoftwareRecord(record);
    setActiveView("printable");
  };

  const handleEditSoftwareRecord = (record: SoftwareInventoryRecord) => {
    setEditingSoftwareRecord(record);
    setActiveView("form");
  };

  const handlePrintSoftwareRecord = (record: SoftwareInventoryRecord) => {
    setSelectedSoftwareRecord(record);
    setActiveView("printable");
    setPendingSoftwarePrint(true);
  };

  const handleDownloadSoftwareRecord = (record: SoftwareInventoryRecord) => {
    downloadSoftwareForm(record);
  };

  const handleDisposalSubmit = (record: DisposalRecord) => {
    if (editingDisposalRecord?.id) {
      setDisposalRecords((prev) =>
        prev.map((item) => (item.id === editingDisposalRecord.id ? { ...record, id: item.id } : item))
      );
      setEditingDisposalRecord(null);
      setActiveView("records");
      return;
    }

    setDisposalRecords((prev) => [{ ...record, id: crypto.randomUUID() }, ...prev]);
    setActiveView("records");
  };

  const handleDisposalDelete = (record: DisposalRecord) => {
    const confirmed = window.confirm(`Delete disposal record ${record.disposalNo || record.id}?`);
    if (!confirmed) return;
    setDisposalRecords((prev) => prev.filter((item) => item.id !== record.id));
    if (editingDisposalRecord?.id === record.id) {
      setEditingDisposalRecord(null);
    }
  };

  const handleDisposalEdit = (record: DisposalRecord) => {
    setEditingDisposalRecord(record);
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
    if (typed === "it-software-inventory") {
      setActiveView("form");
      return;
    }
    if (typed === "ipad-inventory") {
      setActiveView("inventory");
      return;
    }
    if (typed === "disposal") {
      setActiveView("form");
      return;
    }
    if (typed === "returned-assets") {
      setActiveView("records");
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
  const isSoftwareInventoryModule = selectedModule === "it-software-inventory";
  const isIpadInventoryModule = selectedModule === "ipad-inventory";
  const isDisposalModule = selectedModule === "disposal";
  const isReturnedAssetsModule = selectedModule === "returned-assets";
  const moduleThemeClass = selectedModule ? `theme-${selectedModule}` : "";

  const headerTitle = isAssetInventoryModule
    ? "IT Asset Inventory"
    : isSoftwareInventoryModule
      ? "IT Software Inventory"
      : isIpadInventoryModule
        ? "IPAD Inventory"
        : isDisposalModule
          ? "Disposal"
          : isReturnedAssetsModule
            ? "Returned Assets"
      : "IT Accountability Form";

  return (
    <div className={`app-shell ${moduleThemeClass}`}>
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
                <button
                  type="button"
                  className={`nav-btn${activeView === "borrowing-form" || activeView === "borrowing-printable" ? " nav-btn--active" : ""}`}
                  onClick={() => {
                    const targetRecord = selectedRecord ?? records[0] ?? null;
                    if (!targetRecord) {
                      setActiveView("borrowing-form");
                      return;
                    }

                    setSelectedRecord(targetRecord);
                    const hasSavedBorrowing = Boolean(
                      targetRecord.id && borrowingReceiptByRecordId[targetRecord.id]
                    );
                    setActiveView(hasSavedBorrowing ? "borrowing-printable" : "borrowing-form");
                  }}
                >
                  <span className="nav-icon" aria-hidden="true">
                    <svg viewBox="0 0 24 24" fill="none">
                      <path d="M7 4h8l4 4v11a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2Z" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round" />
                      <path d="M15 4v4h4" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round" />
                      <path d="M9 12h6" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
                      <path d="M9 15h6" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
                      <path d="M9 9h3" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
                    </svg>
                  </span>
                  Borrowing Receipt
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
                <button
                  type="button"
                  className={`nav-btn${activeView === "printable" ? " nav-btn--active" : ""}`}
                  onClick={() => {
                    setActiveView("printable");
                    setPendingAssetPrint(true);
                  }}
                >
                  <span className="nav-icon">⎙</span>
                  Printable Form
                </button>
              </>
            )}

            {isSoftwareInventoryModule && (
              <>
                <button
                  type="button"
                  className={`nav-btn${activeView === "form" ? " nav-btn--active" : ""}`}
                  onClick={() => setActiveView("form")}
                >
                  <span className="nav-icon">✦</span>
                  New Software Form
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
                  className={`nav-btn${activeView === "chart" ? " nav-btn--active" : ""}`}
                  onClick={() => setActiveView("chart")}
                >
                  <span className="nav-icon">◔</span>
                  Chart
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

            {isIpadInventoryModule && (
              <>
                <button
                  type="button"
                  className={`nav-btn${activeView === "inventory" ? " nav-btn--active" : ""}`}
                  onClick={() => setActiveView("inventory")}
                >
                  <span className="nav-icon">▦</span>
                  IPAD Records
                </button>
                <button
                  type="button"
                  className={`nav-btn${activeView === "printable" ? " nav-btn--active" : ""}`}
                  onClick={() => {
                    setActiveView("printable");
                    setPendingIpadPrint(true);
                  }}
                >
                  <span className="nav-icon">⎙</span>
                  Printable Form
                </button>
              </>
            )}

            {isDisposalModule && (
              <>
                <button
                  type="button"
                  className={`nav-btn${activeView === "form" ? " nav-btn--active" : ""}`}
                  onClick={() => {
                    setEditingDisposalRecord(null);
                    setActiveView("form");
                  }}
                >
                  <span className="nav-icon">✦</span>
                  New Disposal Form
                </button>
                <button
                  type="button"
                  className={`nav-btn${activeView === "records" ? " nav-btn--active" : ""}`}
                  onClick={() => setActiveView("records")}
                >
                  <span className="nav-icon">☰</span>
                  Disposal Records
                </button>
              </>
            )}

            {isReturnedAssetsModule && (
              <>
                <button
                  type="button"
                  className={`nav-btn${activeView === "records" ? " nav-btn--active" : ""}`}
                  onClick={() => setActiveView("records")}
                >
                  <span className="nav-icon">☰</span>
                  Returned Assets
                </button>
                <button
                  type="button"
                  className={`nav-btn${activeView === "chart" ? " nav-btn--active" : ""}`}
                  onClick={() => setActiveView("chart")}
                >
                  <span className="nav-icon">◔</span>
                  Chart
                </button>
                <button
                  type="button"
                  className={`nav-btn${activeView === "printable" ? " nav-btn--active" : ""}`}
                  onClick={() => {
                    setActiveView("printable");
                    setPendingReturnedAssetsPrint(true);
                  }}
                >
                  <span className="nav-icon">⎙</span>
                  Printable Form
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

          {isAssetInventoryModule && activeView === "printable" && (
            <ITAssetInventoryPrintable records={records} ref={assetPrintRef} />
          )}

          {isIpadInventoryModule && activeView === "inventory" && (
            <IPadInventory records={ipadRecords} />
          )}

          {isIpadInventoryModule && activeView === "printable" && (
            <IPadInventoryPrintable records={ipadRecords} ref={ipadPrintRef} />
          )}

          {isSoftwareInventoryModule && activeView === "form" && (
            <SoftwareInventoryForm
              editingRecord={editingSoftwareRecord}
              onSubmit={handleSoftwareSubmit}
              onCancelEdit={() => {
                setEditingSoftwareRecord(null);
                setActiveView("records");
              }}
            />
          )}

          {isAccountabilityModule && activeView === "records" && (
            <RecordsList
              records={records}
              borrowingReceiptByRecordId={borrowingReceiptByRecordId}
              onEdit={handleEditRecord}
              onDelete={handleDelete}
              onPrint={handlePrintRecord}
              onView={handleViewRecord}
              onBorrowing={handleBorrowingRecord}
              printActionType={printActionType}
            />
          )}

          {isAccountabilityModule && activeView === "borrowing-form" && (
            <BorrowingReceiptForm
              record={selectedRecord}
              initialData={selectedRecord?.id ? borrowingReceiptByRecordId[selectedRecord.id] ?? null : null}
              onSave={handleSaveBorrowingForm}
            />
          )}

          {isSoftwareInventoryModule && activeView === "records" && (
            <SoftwareInventoryRecords
              records={softwareRecords}
              loading={softwareLoading}
              onEdit={handleEditSoftwareRecord}
              onDelete={handleSoftwareDelete}
              onView={handleViewSoftwareRecord}
              onPrint={handlePrintSoftwareRecord}
              onDownload={handleDownloadSoftwareRecord}
            />
          )}

          {isSoftwareInventoryModule && activeView === "chart" && (
            <SoftwareInventoryChart records={softwareRecords} />
          )}

          {isAccountabilityModule && activeView === "printable" && (
            <PrintableForm record={selectedRecord} ref={printRef} />
          )}

          {isAccountabilityModule && activeView === "borrowing-printable" && (
            <BorrowingReceiptPrintable
              record={selectedRecord}
              data={selectedRecord?.id ? borrowingReceiptByRecordId[selectedRecord.id] ?? emptyBorrowingReceiptData() : emptyBorrowingReceiptData()}
              ref={borrowingPrintRef}
            />
          )}

          {isSoftwareInventoryModule && activeView === "printable" && (
            <SoftwareInventoryPrintable
              record={selectedSoftwareRecord}
              ref={softwarePrintRef}
            />
          )}

          {isDisposalModule && activeView === "form" && (
            <DisposalForm
              editingRecord={editingDisposalRecord}
              onSubmit={handleDisposalSubmit}
              onCancelEdit={() => {
                setEditingDisposalRecord(null);
                setActiveView("records");
              }}
            />
          )}

          {isDisposalModule && activeView === "records" && (
            <DisposalRecords
              records={disposalRecords}
              onEdit={handleDisposalEdit}
              onDelete={handleDisposalDelete}
            />
          )}

          {isReturnedAssetsModule && activeView === "records" && (
            <ReturnedAssetsRecords records={returnedAssetsRecords} />
          )}

          {isReturnedAssetsModule && activeView === "chart" && (
            <ReturnedAssetsChart records={returnedAssetsRecords} />
          )}

          {isReturnedAssetsModule && activeView === "printable" && (
            <ReturnedAssetsPrintable records={returnedAssetsRecords} ref={returnedAssetsPrintRef} />
          )}
        </main>
      </div>
    </div>
  );
}

export default App;
