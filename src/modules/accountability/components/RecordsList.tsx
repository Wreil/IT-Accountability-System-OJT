import { useMemo, useState } from "react";
import { AccountabilityRecord } from "../types/accountability";
import { BorrowingReceiptData } from "../types/borrowingReceipt";

interface RecordsListProps {
  records: AccountabilityRecord[];
  borrowingReceiptByRecordId: Record<string, BorrowingReceiptData>;
  onEdit: (record: AccountabilityRecord) => void;
  onDelete: (record: AccountabilityRecord) => Promise<void>;
  onPrint: (record: AccountabilityRecord) => void;
  onView: (record: AccountabilityRecord) => void;
  onBorrowing: (record: AccountabilityRecord) => void;
  printActionType?: "accountability" | "borrowing" | null;
}

type SortKey = keyof AccountabilityRecord;

const AccountabilityIcon = () => (
  <svg viewBox="0 0 24 24" role="img" aria-hidden="true">
    <path d="M7 3h8l4 4v14H7z" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round" />
    <path d="M15 3v4h4" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round" />
    <path d="m10 16 4.5-4.5 1.5 1.5L11.5 17.5H10z" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round" />
  </svg>
);

const BorrowingIcon = () => (
  <svg viewBox="0 0 24 24" role="img" aria-hidden="true">
    <path d="M7 4h8l4 4v11a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2Z" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round" />
    <path d="M15 4v4h4" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round" />
    <path d="M9 12h6" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
    <path d="M9 15h6" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
    <path d="M9 9h3" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
  </svg>
);

export const RecordsList = ({
  records,
  borrowingReceiptByRecordId,
  onEdit,
  onDelete,
  onPrint,
  onView,
  onBorrowing,
  printActionType
}: RecordsListProps) => {
  const [search, setSearch] = useState("");
  const [department, setDepartment] = useState("");
  const [project, setProject] = useState("");
  const [sortKey, setSortKey] = useState<SortKey>("updatedAt");
  const [ascending, setAscending] = useState(false);
  const [selectedRecord, setSelectedRecord] = useState<AccountabilityRecord | null>(null);
  const [showBorrowingTable, setShowBorrowingTable] = useState(false);

  const options = useMemo(() => {
    const getUnique = (key: keyof AccountabilityRecord) =>
      Array.from(new Set(records.map((item) => String(item[key] ?? "")).filter(Boolean))).sort((a, b) =>
        a.localeCompare(b)
      );

    return {
      departments: getUnique("department"),
      projects: getUnique("project")
    };
  }, [records]);

  const filtered = useMemo(() => {
    const lowered = search.toLowerCase();

    const base = records.filter((item) => {
      const searchable = [
        item.empId,
        item.firstName,
        item.middleName,
        item.lastName,
        item.department,
        item.project,
        item.hostname,
        item.serialNumber
      ]
        .join(" ")
        .toLowerCase();

      const bySearch = !lowered || searchable.includes(lowered);
      const byDepartment = !department || item.department === department;
      const byProject = !project || item.project === project;

      return bySearch && byDepartment && byProject;
    });

    return [...base].sort((a, b) => {
      const left = String(a[sortKey] ?? "").toLowerCase();
      const right = String(b[sortKey] ?? "").toLowerCase();
      const compared = left.localeCompare(right);
      return ascending ? compared : -compared;
    });
  }, [records, search, department, project, sortKey, ascending]);

  const toggleSort = (key: SortKey) => {
    if (sortKey === key) {
      setAscending((prev) => !prev);
      return;
    }
    setSortKey(key);
    setAscending(true);
  };

  const activeRecord = selectedRecord ?? filtered[0] ?? null;

  const borrowingRows = useMemo(() => {
    return records
      .map((record) => {
        if (!record.id) return null;
        const borrowing = borrowingReceiptByRecordId[record.id];
        if (!borrowing) return null;

        return {
          record,
          borrowing
        };
      })
      .filter(Boolean) as Array<{ record: AccountabilityRecord; borrowing: BorrowingReceiptData }>;
  }, [records, borrowingReceiptByRecordId]);

  return (
    <section className="panel records-with-sidebar">
      <div className="sidebar-actions">
        <button
          type="button"
          className="sidebar-btn accountability"
          onClick={() => {
            if (activeRecord) {
              onView(activeRecord);
            }
          }}
          title={activeRecord ? "Accountability Form" : "No records available"}
          aria-label="Open Accountability Form"
          disabled={!activeRecord}
        >
          <span className="icon">
            <AccountabilityIcon />
          </span>
        </button>
        <button
          type="button"
          className="sidebar-btn borrowing"
          onClick={() => {
            if (activeRecord) {
              onBorrowing(activeRecord);
            }
          }}
          title={activeRecord ? "Borrowing Receipt" : "No records available"}
          aria-label="Open Borrowing Receipt"
          disabled={!activeRecord}
        >
          <span className="icon">
            <BorrowingIcon />
          </span>
        </button>
      </div>
      <div className="records-main">
        <h2>{showBorrowingTable ? "Borrowing Receipt Records" : "Records"}</h2>
        {showBorrowingTable && (
          <div style={{ marginTop: "0", marginBottom: "0.75rem" }}>
            <button
              type="button"
              className="ghost"
              onClick={() => setShowBorrowingTable(false)}
            >
              Back to Accountability Records
            </button>
          </div>
        )}
        <div className="filters">
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search by employee, project, hostname..."
        />

        <select value={department} onChange={(e) => setDepartment(e.target.value)}>
          <option value="">All Departments</option>
          {options.departments.map((option) => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </select>

        <select value={project} onChange={(e) => setProject(e.target.value)}>
          <option value="">All Projects</option>
          {options.projects.map((option) => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </select>
      </div>

      {printActionType && (
        <div className={`action-type-sidebar action-${printActionType}`}>
          <strong>Mode:</strong> {printActionType === "accountability" ? "Accountability Form" : "Borrowing Receipt"}
        </div>
      )}

      {!showBorrowingTable ? (
        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th><button type="button" onClick={() => toggleSort("empId")}>Emp ID</button></th>
                <th><button type="button" onClick={() => toggleSort("lastName")}>Name</button></th>
                <th><button type="button" onClick={() => toggleSort("department")}>Department</button></th>
                <th><button type="button" onClick={() => toggleSort("project")}>Project</button></th>
                <th>Attachments</th>
                <th><button type="button" onClick={() => toggleSort("updatedAt")}>Updated</button></th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((record) => (
                <tr key={record.id} className={selectedRecord?.id === record.id ? "selected" : ""} onClick={() => setSelectedRecord(record)}>
                  <td>{record.empId}</td>
                  <td>{[record.firstName, record.middleName, record.lastName].filter(Boolean).join(" ")}</td>
                  <td>{record.department}</td>
                  <td>{record.project}</td>
                  <td>{record.attachments?.length ?? 0}</td>
                  <td>{record.updatedAt ? new Date(record.updatedAt).toLocaleString() : "-"}</td>
                  <td className="row-actions">
                    <button type="button" onClick={(e) => { e.stopPropagation(); onView(record); }} title="View accountability form">View</button>
                    <button type="button" onClick={(e) => { e.stopPropagation(); onEdit(record); }} title="Edit accountability record">Edit</button>
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedRecord(record);
                        setShowBorrowingTable(true);
                      }}
                      title="Show borrowing receipt record"
                    >
                      Borrowing
                    </button>
                    <button type="button" className="ghost" onClick={(e) => { e.stopPropagation(); void onDelete(record); }}>Delete</button>
                    <button type="button" className="print" onClick={(e) => { e.stopPropagation(); onPrint(record); }} title="Print accountability form">Print</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Borrowing No.</th>
                <th>Emp ID</th>
                <th>Name</th>
                <th>Date Borrowed</th>
                <th>Expected Return</th>
                <th>Purpose</th>
                <th>Contact</th>
                <th>Requested By</th>
                <th>Approved By</th>
                <th>Released By</th>
                <th>Release Date/Time</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {borrowingRows.length === 0 ? (
                <tr>
                  <td colSpan={12}>No borrowing receipt records found yet. Fill and save a Borrowing Receipt first.</td>
                </tr>
              ) : (
                borrowingRows
                  .filter(({ record }) => !selectedRecord?.id || record.id === selectedRecord.id)
                  .map(({ record, borrowing }) => (
                    <tr key={`borrowing-${record.id}`}>
                      <td>{borrowing.borrowingNo || "-"}</td>
                      <td>{record.empId || "-"}</td>
                      <td>{[record.firstName, record.middleName, record.lastName].filter(Boolean).join(" ") || "-"}</td>
                      <td>{borrowing.dateBorrowed || "-"}</td>
                      <td>{borrowing.expectedReturnDate || "-"}</td>
                      <td>{borrowing.purpose || "-"}</td>
                      <td>{borrowing.contact || record.email || "-"}</td>
                      <td>{borrowing.requestedBy || "-"}</td>
                      <td>{borrowing.approvedBy || "-"}</td>
                      <td>{borrowing.releasedBy || "-"}</td>
                      <td>{borrowing.releaseDateTime || "-"}</td>
                      <td className="row-actions">
                        <button type="button" onClick={() => onBorrowing(record)} title="Open borrowing receipt tab">Open</button>
                      </td>
                    </tr>
                  ))
              )}
            </tbody>
          </table>
        </div>
      )}
      </div>
    </section>
  );
};
